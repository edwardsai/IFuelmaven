package com.yusys.workFlow;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.workFlow.WorkFlowNodeDao;
import com.yusys.workFlow.SWorkFlowInfoDao;

@Service("iSWorkFlowNodeService")
public class SWorkFlowNodeService implements ISWorkFlowNodeService{
	@Resource
	private SWorkFlowInfoDao sWorkFlowInfoDao;
	@Resource
	private WorkFlowNodeDao workFlowNodeDao;
	@Resource
	private TaskDBUtil taskDBUtil;
	
	//新增保存
	@Override
	public Map<String, String> addNodeInfo(HttpServletRequest req) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"wf_id","n_name","is_start","n_type","is_auto","n_v_type","r_exp","r_name","order_id","n_state"};
			//非必填的参数列表
			String[] nomust=new String[]{"memo"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			String n_id= taskDBUtil.getSequenceValByName("WF_SEQ_WF_NOTE");
			//生成规则id
			String r_id= taskDBUtil.getSequenceValByName("WF_SEQ_WF_RULE");
			pmap.put("r_id", r_id);//规则ID	
			pmap.put("n_id", n_id);//节点ID	
			pmap.put("opt_person", "admin");//创建人			
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//创建时间
			//向节点表插入信息
			workFlowNodeDao.addNodeInfo(pmap);
			//向规则表插入信息
			sWorkFlowInfoDao.addOneRuleInfo(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//修改保存
	@Override
	public Map<String, String> updateNodeInfo(HttpServletRequest req) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"r_id","n_id","wf_id","n_name","is_start","n_type","is_auto","n_v_type","r_exp","r_name","order_id","n_state"};
			//非必填的参数列表
			String[] nomust=new String[]{"memo"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("opt_person", "admin");//创建人			
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//创建时间
			//修改规则表数据
			sWorkFlowInfoDao.updateOneRuleInfo(pmap);
			//修改节点表数据
			workFlowNodeDao.updateNodeInfo(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	
	//删除节点
	@Override
	public Map<String, String> deleteNodeInfo(HttpServletRequest req) {
		Map<String, String> resultMap=new HashMap<String, String>();
		Map<String, String> pmap=new HashMap<String, String>();
		String n_id = RequestUtils.getParamValue(req, "n_id");
		pmap.put("n_id", n_id);
		pmap.put("n_state", "01");
		/*//根据id获取节点信息
		List<Map<String,Object>> list = workFlowNodeDao.queryOneNodeInfo(pmap);
		//根据节点id删除对应的规则表信息
		if(list.size()>0){
			for(Map<String,Object> map:list){
				pmap.put("r_id", (String)map.get("R_ID"));
				sWorkFlowInfoDao.deleteOneRuleInfo(pmap);
			}
		}
		//删除节点表信息
		workFlowNodeDao.deleteNodeInfo(pmap);*/
		//点击删除按钮修改节点状态为停用
		try {
			workFlowNodeDao.updateNodeStateById(pmap);
			resultMap.put("result", "true");
		} catch (Exception e) {
			resultMap.put("result", "false");
			e.printStackTrace();
		}
		
		return resultMap;
	}
	//查询流程ID下的节点
	@Override
	public Map<String, Object> queryAllNode4WF(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		//从前台获取请求参数
		String wf_id = RequestUtils.getParamValue(req, "wf_id");
		String limit = RequestUtils.getParamValue(req,"limit");
		String offset = RequestUtils.getParamValue(req,"offset");
		pmap.put("wf_id",wf_id);
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		//调用dao查询数据,返回所有的流程信息
		List<Map<String, Object>> list=workFlowNodeDao.queryAllNode4WF(pmap);
		retmap.put("rows", list);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}

	//根据条件查找一个节点信息
	@Override
	public Map<String, String> queryOneNodeInfo(HttpServletRequest req) {
		Map<String, String> resultMap=new HashMap<String, String>();
		Map<String, String> pmap=new HashMap<String, String>();
		String wf_id = RequestUtils.getParamValue(req, "wf_id");
		String order_id = RequestUtils.getParamValue(req, "order_id");
		String flag = RequestUtils.getParamValue(req, "flag");
		pmap.put("wf_id", wf_id);
		pmap.put("order_id", order_id);
		List<Map<String, Object>> nodeList = workFlowNodeDao.queryOneNodeInfo(pmap);
		//新增保存的校验
		if("add".equals(flag)&&nodeList.size()>0){
			resultMap.put("result", "true");
		//修改保存的校验	
		}else if("update".equals(flag)&&nodeList.size()>1){
			resultMap.put("result", "true");
		}else{
			resultMap.put("result", "false");
		}
		
		return resultMap;
	}
	//根据ID查找一个节点信息
	@Override
	public Map<String, Object> queryOneNodeById(HttpServletRequest req) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String n_id = RequestUtils.getParamValue(req, "n_id");
		pmap.put("n_id", n_id);
		List<Map<String, Object>> nodeList = workFlowNodeDao.queryOneNodeInfo(pmap);
		if(nodeList.size()>0){
			resultMap = (Map<String, Object>)nodeList.get(0);
		}else{
			resultMap.put("result", "false");
		}
		
		return resultMap;
	}

}
