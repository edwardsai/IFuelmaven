package com.yusys.workFlow;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.workFlow.WorkFlowNodeDao;
import com.yusys.workFlow.SWorkFlowInfoDao;
@Service("iSWorkFlowInfoService")
public class SWorkFlowInfoService implements ISWorkFlowInfoService {
	@Resource
	private WorkFlowNodeDao workFlowNodeDao;
	@Resource
	private SWorkFlowInfoDao sWorkFlowInfoDao;
	@Resource
	private TaskDBUtil taskDBUtil;
	
	//查询所有流程信息
	@Override
	public Map<String, Object> queryAllProcessInfo(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		//从前台获取请求参数
		String wf_name = RequestUtils.getParamValue(req, "wf_name");
		String wf_sys_name = RequestUtils.getParamValue(req, "wf_sys_name");
		String wf_state = RequestUtils.getParamValue(req, "wf_state");
		try {
			//中文避免乱码
			if(wf_name!=null){
				wf_name=URLDecoder.decode(wf_name,"UTF-8");
			}
			if(wf_sys_name!=null){
				wf_sys_name=URLDecoder.decode(wf_sys_name,"UTF-8");
			}
			if(wf_state!=null){
				wf_state=URLDecoder.decode(wf_state,"UTF-8");
			}
		} catch (Exception e) {			
			e.printStackTrace();
		}
		//模糊查询
		if(wf_sys_name!=null && !"".equals(wf_sys_name)){
			pmap.put("wf_sys_name","%"+wf_sys_name+"%");
		}
		if(wf_name!=null && !"".equals(wf_name)){
			pmap.put("wf_name","%"+wf_name+"%");
		}
		if(wf_state!=null && !"".equals(wf_state)){
			pmap.put("wf_state","%"+wf_state+"%");
		}
		String limit = RequestUtils.getParamValue(req,"limit");
		String offset = RequestUtils.getParamValue(req,"offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		//调用dao查询数据,返回所有的流程信息
		List<Map<String, Object>> list=sWorkFlowInfoDao.queryAllProcessInfo(pmap);
		retmap.put("rows", list);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}
	//插入一条流程信息
	@Override
	public Map<String, String> addOneProcessInfo(HttpServletRequest req) {
		//存放返回结果
		Map<String, String> resultMap=new HashMap<String, String>();
		//获取当前日期"yyyy-MM-dd"
		String today = DateTimeUtils.getFormatCurrentDate();
		//生成序列赋给主键
		String wf_id = taskDBUtil.getSequenceValByName("WF_SEQ_WF_INFO");
		try{
			//必填参数列表
			String[] must=new String[]{"wf_name","wf_state","wf_sys_name"};
			//非必填的参数列表
			String[] nomust=new String[]{"wf_memo"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			pmap.put("wf_id", wf_id);
			pmap.put("opt_time", today);//插入操作时间
			pmap.put("opt_person", "admin");//插入操作人
			sWorkFlowInfoDao.addOneProcessInfo(pmap);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	
	//点击流程列表页删除按钮，修改流程状态为停用
	@Override
	public Map<String, String> deleteOneProcessInfo(HttpServletRequest req) {
		String wf_id = RequestUtils.getParamValue(req, "wf_id");//获取流程表id
		Map<String,String> wmap = new HashMap<String,String>();
		wmap.put("wf_id", wf_id);
		wmap.put("wf_state", "01");
		try {
			sWorkFlowInfoDao.updateProcessSateById(wmap);
			wmap.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			wmap.put("result", "false");
		}
		return wmap;
	}
	/*//根据选择的id删除流程表中该信息
	@Override
	public Map<String, String> deleteOneProcessInfo(HttpServletRequest req) {
		String wf_id = RequestUtils.getParamValue(req, "wf_id");//获取流程表id
		Map<String,String> map = new HashMap<String,String>();
		Map<String,String> wmap = new HashMap<String,String>();
		Map<String,Object> wmap1 = new HashMap<String,Object>();
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();//存储矩阵表记录
		List<Map<String,Object>> list1 = new ArrayList<Map<String,Object>>();//存储审批流程表记录
		List<Map<String,Object>> list2 = new ArrayList<Map<String,Object>>();//存储节点记录
		Map<String,String> result_map = new HashMap<String,String>();
		Map<String,Object> result_map1 = new HashMap<String,Object>();
		Map<String,String> result_map2 = new HashMap<String,String>();
		Map<String,String> result_map3 = new HashMap<String,String>();
		String m_id = "";
		String r_id = "";
		wmap.put("wf_id", wf_id);
		wmap1.put("wf_id", wf_id);
		try {
			//通过流程id获取矩阵表矩阵id,从而获得规则id
			list = sWorkFlowInfoDao.queryAllMatrixById(wmap1);
			if(list.size()>0){
				for(Map<String,Object> map1:list){
					m_id=(String)map1.get("M_ID");//获取矩阵id
					r_id=(String)map1.get("R_ID");//获取矩阵表规则id
					result_map.put("m_id", m_id);
					result_map.put("r_id", r_id);
					result_map1.put("m_id", map1.get("M_ID"));
					//通过规则id删除规则表信息
					sWorkFlowInfoDao.deleteOneRuleInfo(result_map);
					//通过矩阵id获取审批流程表审批规则id
					list1 = sWorkFlowInfoDao.queryMatixRoteById(result_map1);
					if(list1.size()>0){
						for(Map<String,Object> map2:list1){
							r_id=(String)map2.get("R_ID");
							result_map2.put("r_id", r_id);
							//通过审批规则id删除规则表对应信息
							sWorkFlowInfoDao.deleteOneRuleInfo(result_map2);
							//通过矩阵id删除审批流程表信息
							sWorkFlowInfoDao.deleteProcessByMId(result_map);
						}
					}
				}
				//根据流程id删除矩阵表信息
				sWorkFlowInfoDao.deleteMatrixInfoByWfId(wmap);
			}
			//通过流程id获取节点id,从而获取规则id
			list2 = workFlowNodeDao.queryAllNode4WF(wmap1);
			if(list2.size()>0){
				for(Map<String,Object> map3:list2){
					r_id=(String)map3.get("R_ID");
					result_map3.put("r_id", r_id);
					//通过id删除规则表信息
					sWorkFlowInfoDao.deleteOneRuleInfo(result_map3);
				}
				//根据流程id删除节点表信息
				sWorkFlowInfoDao.deleteNoteInfoByWfId(wmap);
			}
			//根据id删除流程表信息
			sWorkFlowInfoDao.deleteOneProcessInfo(wmap);
			map.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			map.put("result", "false");
		}
		return map;
	}*/
	//修改一条流程记录
	@Override
	public Map<String, Object> updateOneProcessInfo(HttpServletRequest req) {
		Map<String,Object> resultMap = new HashMap<String, Object>();//
		Map<String,String> map = new HashMap<String, String>();//存储传过来的参数
		String wf_id = RequestUtils.getParamValue(req,"WF_ID");//获取请求参数
		String wf_name = RequestUtils.getParamValue(req,"WF_NAME");
		String wf_sys_name = RequestUtils.getParamValue(req,"WF_SYS_NAME");
		String wf_state = RequestUtils.getParamValue(req,"wf_state");
		String wf_memo = RequestUtils.getParamValue(req,"WF_MEMO");
		//获取当前日期"yyyy-MM-dd"
		String today = DateTimeUtils.getFormatCurrentDate();
		try {
			if(wf_memo==null||"".equals(wf_memo)){
				map.put("wf_memo", "");
			}else{
				map.put("wf_memo", wf_memo);
			}
			map.put("wf_id", wf_id);
			map.put("wf_name", wf_name);
			map.put("wf_sys_name", wf_sys_name);
			map.put("wf_state", wf_state);
			map.put("opt_person", "admin");
			map.put("opt_time", today);
			resultMap.put("result", "true");
			sWorkFlowInfoDao.updateOneProcessInfo(map);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//通过流程id查询流程矩阵表中所有信息
	@Override
	public Map<String, Object> queryAllMatrixById(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		//Map<String, String> map1=new HashMap<String, String>();
		//List<Map<String, Object>> resultList = new ArrayList<Map<String,Object>>();
		//从前台获取请求参数
		String wf_id = RequestUtils.getParamValue(req, "Mwf_id");
		pmap.put("wf_id",wf_id);
		String limit = RequestUtils.getParamValue(req,"limit");
		String offset = RequestUtils.getParamValue(req,"offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		//通过流程id,返回所有的矩阵信息
		List<Map<String, Object>> list=sWorkFlowInfoDao.queryAllMatrixById(pmap);
		/*//获取矩阵规则id，从而获取对应的规则名称
		if(list!=null&&!"".equals(list)){
			for(Map<String, Object> map:list){
				//通过id查询规则表，获取规则名称
				map1 = sWorkFlowInfoDao.queryOneRuleById(map);
				if(map1!=null&&!"".equals(map1)){
					String r_name = map1.get("R_NAME");
					map.put("R_NAME", r_name);
					resultList.add(map);
				}
			}
		}*/
		
		retmap.put("rows", list);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}
	//通过流程id查询节点表中对应信息
	@Override
	public Map<String, Object> queryAllNode4WF(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		//从前台获取请求参数
		String wf_id = RequestUtils.getParamValue(req, "Mwf_id");
		pmap.put("wf_id",wf_id);
		String limit = RequestUtils.getParamValue(req,"limit");
		String offset = RequestUtils.getParamValue(req,"offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		//通过流程id,返回所有的矩阵信息
		List<Map<String, Object>> list=workFlowNodeDao.queryAllNode4WF(pmap);
		retmap.put("rows", list);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}
	//向规则表和矩阵表插入数据
	@Override
	public Map<String, String> addInfo4RuleAndMatix(HttpServletRequest req) {
		Map<String,String> resultMap = new HashMap<String, String>();//存放返回结果标识
		Map<String,String> recordMap = new HashMap<String, String>();//
		Map<String,String> ruleMap = new HashMap<String, String>();//存储插入规则表的数据
		Map<String,String> matixMap = new HashMap<String, String>();//存储插入矩阵表的数据
		//生成规则表id
		String r_id = taskDBUtil.getSequenceValByName("WF_SEQ_WF_RULE");
		//生成矩阵表id
		String m_id = taskDBUtil.getSequenceValByName("WF_SEQ_WF_MATRIX");
		//获取请求参数
		String r_name = RequestUtils.getParamValue(req,"r_name");//规则名称
		String r_exp = RequestUtils.getParamValue(req,"r_exp");//规则表达式
		String wf_id = RequestUtils.getParamValue(req,"wf_id");//流程id
		String m_state = RequestUtils.getParamValue(req,"m_state");//流程状态
		//String n_name_str = RequestUtils.getParamValue(req,"n_name");//节点窜
		//String n_id_str = RequestUtils.getParamValue(req,"n_id");//节点窜字典编号窜
		String record = RequestUtils.getParamValue(req,"records");//节点记录
		
		try {
			/*if(n_name_str!=null){
				n_name_str=URLDecoder.decode(n_name_str,"UTF-8");
			}
			if(n_id_str!=null){
				n_id_str=URLDecoder.decode(n_id_str,"UTF-8");
			}*/
			String obj = "";
			//String m_id = "";
			String n_id = "";
			String order_id = "";
			//获取当前日期"yyyy-MM-dd"
			String today = DateTimeUtils.getFormatCurrentDate();
			//向规则表中插入数据
			ruleMap.put("r_id", r_id);
			ruleMap.put("r_name", r_name);
			ruleMap.put("r_exp", r_exp);
			ruleMap.put("opt_time", today);
			ruleMap.put("memo", "");
			ruleMap.put("opt_person", "admin");
			sWorkFlowInfoDao.addOneRuleInfo(ruleMap);
			//获取插入矩阵表的数据
			//把json格式字符串转成数组
			Object[] records = JsonUtils.jsonToObjectArray(record);
			for (int i = 0; i < records.length; i++) {
				/*//生成矩阵表id
				m_id = taskDBUtil.getSequenceValByName("WF_SEQ_WF_MATRIX");*/
				obj = records[i].toString();
				//把json字符串转成map
				recordMap = JsonUtils.jsonToMap(obj);
				n_id = recordMap.get("N_ID");
				order_id = recordMap.get("ORDER_ID");
				matixMap.put("m_id", m_id);
				matixMap.put("wf_id", wf_id);
				matixMap.put("r_id", r_id);
				//matixMap.put("m_name", n_name_str);
				matixMap.put("n_id", n_id);
				matixMap.put("order_id", order_id);
				matixMap.put("opt_person", "admin");
				matixMap.put("opt_time", today);
				matixMap.put("memo", "");
				matixMap.put("m_state", m_state);
				//matixMap.put("m_rote_v", n_id_str);
				sWorkFlowInfoDao.addOneMatrixInfo(matixMap);
			}
			resultMap.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	//根据id删除矩阵表信息和规则表信息
	@Override
	public Map<String, String> deleteInfo4RuleAndMatix(HttpServletRequest req) {
		String r_id = RequestUtils.getParamValue(req, "r_id");//规则id
		String m_id = RequestUtils.getParamValue(req, "m_id");//矩阵id
		Map<String,String> rMap = new HashMap<String, String>();//
		Map<String,String> mMap = new HashMap<String, String>();//
		Map<String,Object> mMap1 = new HashMap<String, Object>();//
		Map<String,String> resultMap = new HashMap<String, String>();//
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		try {
			rMap.put("r_id", r_id);
			mMap.put("m_id", m_id);
			mMap.put("m_state","01");
			/*mMap1.put("m_id", m_id);
			//通过矩阵id获取审批流程表审批规则id
			list = sWorkFlowInfoDao.queryMatixRoteById(mMap1);
			if(list.size()>0){
				for(Map<String,Object> map1:list){
					r_id=(String)map1.get("R_ID");
					mMap.put("r_id", r_id);
					//删除审批规则信息
					sWorkFlowInfoDao.deleteOneRuleInfo(mMap);
					//删除流程审批表信息
					sWorkFlowInfoDao.deleteProcessByMId(mMap);
				}
			}
			//删除矩阵表信息
			sWorkFlowInfoDao.deleteOneMatInfo(mMap);
			//删除规则表信息
			sWorkFlowInfoDao.deleteOneRuleInfo(rMap);*/
			sWorkFlowInfoDao.updateMatrixSateById(mMap);
			resultMap.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	//根据id更新矩阵表信息和规则表信息
	@Override
	public Map<String, String> updateInfo4RuleAndMatix(HttpServletRequest req) {
		Map<String,String> resultMap = new HashMap<String, String>();//存放返回结果标识
		Map<String,String> ruleMap = new HashMap<String, String>();//存储更新规则表的数据
		Map<String,String> matixMap = new HashMap<String, String>();//存储更新矩阵表的数据
		Map<String,String> recordMap = new HashMap<String, String>();//
		//获取请求参数
		String r_name = RequestUtils.getParamValue(req,"r_name");//规则名称
		String r_exp = RequestUtils.getParamValue(req,"r_exp");//规则表达式
		String m_state = RequestUtils.getParamValue(req,"m_state");//规则表达式
		String r_id = RequestUtils.getParamValue(req,"r_id");//规则id
		String m_id = RequestUtils.getParamValue(req,"m_id");//矩阵id
		String wf_id = RequestUtils.getParamValue(req,"wf_id");//流程id
		String record = RequestUtils.getParamValue(req,"records");//节点记录
		//把json格式字符串转成数组
		Object[] records = JsonUtils.jsonToObjectArray(record);
		String obj = "";
		String n_id = "";
		String order_id = "";
		try {
			//获取当前日期"yyyy-MM-dd"
			String today = DateTimeUtils.getFormatCurrentDate();
			//向规则表中更新数据
			ruleMap.put("r_name", r_name);
			ruleMap.put("r_exp", r_exp);
			ruleMap.put("opt_time", today);
			ruleMap.put("r_id", r_id);
			ruleMap.put("memo", "");
			sWorkFlowInfoDao.updateOneRuleInfo(ruleMap);
			ruleMap.put("m_id", m_id);
			//根据矩阵id删除矩阵表数据
			sWorkFlowInfoDao.deleteOneMatInfo(ruleMap);
			//获取更新矩阵表的数据
			for(int i=0;i<records.length;i++){
				obj = records[i].toString();
				//把json字符串转成map
				recordMap = JsonUtils.jsonToMap(obj);
				n_id = recordMap.get("N_ID");
				order_id = recordMap.get("ORDER_ID");		
				matixMap.put("n_id", n_id);
				matixMap.put("m_id", m_id);
				matixMap.put("opt_time", today);
				matixMap.put("r_id", r_id);
				matixMap.put("m_state", m_state);
				matixMap.put("wf_id", wf_id);
				matixMap.put("opt_person", "admin");
				matixMap.put("memo", "");
				matixMap.put("order_id", order_id);
				sWorkFlowInfoDao.addOneMatrixInfo(matixMap);
			}
			resultMap.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	@Override
	public Map<String, String> addApproveRuleInfo(HttpServletRequest req,String userid) {
		String []must=new String[]{"m_id","r_id","nids"};
		String []nomust=new String[]{"p_id","order_id","memo"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		Map<String, String> smap=new HashMap<String, String>();
		if (pmap==null) {
			smap.put("result", "false");
			smap.put("msg", "确少必填项!");
			return smap;
		}
		if ("".equals(pmap.get("p_id").trim())) {
			pmap.put("p_id", taskDBUtil.getSequenceValByName("WF_SEQ_WF_ROTE"));
		}else{
			sWorkFlowInfoDao.deleteMatrixRoteByPId(pmap.get("p_id"));
		}
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//插入操作时间
		pmap.put("opt_person", "admin");//插入操作人
		String [] nids=pmap.get("nids").split(",");
		for (int i = 0; i < nids.length; i++) {
			if (!"".equals(nids[i].trim())) {
				pmap.put("n_id", nids[i]);
				sWorkFlowInfoDao.addApproveRuleInfo(pmap);
			}
		}
		smap.put("result", "true");
		return smap;
	}
////根据id查找矩阵下的审批路由信息
	@Override
	public Map<String, Object> queryMatixRoteById(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String m_id = RequestUtils.getParamValue(req,"m_id");
		String wf_id = RequestUtils.getParamValue(req,"wf_id");
		pmap.put("m_id",m_id);
		pmap.put("wf_id",wf_id);
		//调用dao查询数据,返回所有的矩阵路由信息
		List<Map<String, String>> list=sWorkFlowInfoDao.queryMatixRoteByMId(pmap);
		if(list.size()>0){
			for (int i = 0; i < list.size(); i++) {
				pmap.put("p_id", (String) list.get(i).get("P_ID"));
				String ids=sWorkFlowInfoDao.queryMProcessNodeIds(pmap).toString();
				list.get(i).put("nids", ","+ids.substring(1, ids.length()-1).replace(" ", "")+",");
			}
		}
		retmap.put("rows", list);
		retmap.put("total", list.size());
		return retmap;
	}
	
	//根据规则ID删除矩阵下所有路由节点和审批规则
	@Override
	public Map<String, String> deleteMatrixRoteById(HttpServletRequest req) {
		String r_id = RequestUtils.getParamValue(req, "r_id");//规则id
		Map<String,String> rMap = new HashMap<String, String>();//
		Map<String,String> resultMap = new HashMap<String, String>();//
		try {
			rMap.put("r_id", r_id);
			sWorkFlowInfoDao.deleteOneMatInfo(rMap);
			sWorkFlowInfoDao.deleteMatrixRoteById(rMap);
			resultMap.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	@Override
	public List<Map<String, String>> queryMatrixNodeInfos(HttpServletRequest req) {
		String []must=new String[]{"m_id","wf_id"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			return new ArrayList<Map<String,String>>();
		}
		return sWorkFlowInfoDao.queryMatrixNodeInfos(pmap);
	}
	@Override
	public Map<String, String> deleteWFProcess(HttpServletRequest req) {
		String p_id=RequestUtils.getParamValue(req, "p_id");
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("p_id", p_id);
		pmap.put("state", "01");
		sWorkFlowInfoDao.updateMatrixProcessState(pmap);
		Map<String, String> smap=new HashMap<String, String>();
		smap.put("result", "true");
		return smap;
	}
	@Override
	public Map<String, Object> queryMatixProcessByMId(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String m_id = RequestUtils.getParamValue(req,"m_id");
		String wf_id = RequestUtils.getParamValue(req,"wf_id");
		pmap.put("m_id",m_id);
		pmap.put("wf_id",wf_id);

		List<Map<String, String>> list=sWorkFlowInfoDao.queryMatixRoteByMId(pmap);
		if(list.size()>0){
			for (int i = 0; i < list.size(); i++) {
				pmap.put("p_id", (String) list.get(i).get("P_ID"));
				String ids=sWorkFlowInfoDao.queryMProcessNodeIds(pmap).toString();
				list.get(i).put("nids", ","+ids.substring(1, ids.length()-1).replace(" ", "")+",");
			}
		}
		retmap.put("rows", list);
		retmap.put("total", list.size());
		return retmap;
	}
	/**
	 * 增加流程规则 
	 * @param req
	 */
	public Map<String,String>  addWFRule(HttpServletRequest req,String userid){
		Map<String,String> smap=new HashMap<String, String>();
		Map<String,String> ruleMap = new HashMap<String, String>();//存储插入规则表的数据
		String r_name=RequestUtils.getParamValue(req, "r_name");
		String r_exp=RequestUtils.getParamValue(req, "r_exp");
		if (r_name==null||r_exp==null||"".equals(r_name.trim())||"".equals(r_exp.trim())) {
			smap.put("result", "false");
		}
		//生成规则表id
		String r_id = taskDBUtil.getSequenceValByName("WF_SEQ_WF_RULE");
		//向规则表中插入数据
		ruleMap.put("r_id", r_id);
		ruleMap.put("r_name", r_name);
		ruleMap.put("r_exp", r_exp);
		ruleMap.put("opt_time", DateTimeUtils.getFormatCurrentDate());
		ruleMap.put("memo", "");
		ruleMap.put("opt_person", userid);
		sWorkFlowInfoDao.addOneRuleInfo(ruleMap);
		smap.put("r_id", r_id);
		smap.put("result", "true");
		return smap;
	}
}
