package com.yusys.workFlow;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.workFlow.FactorsInfoDao;
@Service("iSFactorsInfoService")
public class SFactorsInfoService implements ISFactorsInfoService {
	@Resource
	private FactorsInfoDao factorsInfoDao;
	@Resource
	private TaskDBUtil taskDBUtil;
	@Override
	public Map<String, Object> queryAllFactorsInfo(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		//从前台获取请求参数
		String system_code = RequestUtils.getParamValue(req, "system_code");
		String b_state = RequestUtils.getParamValue(req, "b_state");
		String rule_type = RequestUtils.getParamValue(req, "rule_type");
		String factor_name = RequestUtils.getParamValue(req, "factor_name");
		try {
			//中文避免乱码
			if(b_state!=null){
				b_state=URLDecoder.decode(b_state,"UTF-8");
			}
			if(system_code!=null){
				system_code=URLDecoder.decode(system_code,"UTF-8");
			}
			if(rule_type!=null){
				rule_type=URLDecoder.decode(rule_type,"UTF-8");
			}
			if(factor_name!=null){
				factor_name=URLDecoder.decode(factor_name,"UTF-8");
			}
		} catch (Exception e) {			
			e.printStackTrace();
		}
		//模糊查询
		if(system_code!=null && !"".equals(system_code)){
			pmap.put("system_code",system_code);
		}
		if(b_state!=null && !"".equals(b_state)){
			pmap.put("b_state",b_state);
		}
		if(rule_type!=null && !"".equals(rule_type)){
			pmap.put("rule_type",rule_type);
		}
		if(factor_name!=null && !"".equals(factor_name)){
			pmap.put("factor_name","%"+factor_name+"%");
		}
		String limit = RequestUtils.getParamValue(req,"limit");
		String offset = RequestUtils.getParamValue(req,"offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		//调用dao查询数据,返回所有的流程信息
		List<Map<String, Object>> list=factorsInfoDao.queryAllFactorsInfo(pmap);
		retmap.put("rows", list);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}
	//向业务要素表中插入一条信息
	@Override
	public Map<String, String> addOneFactorsInfo(HttpServletRequest req) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"system_code","b_state","rule_type","factor_code","factor_name","factor_type"};
			//非必填的参数列表
			String[] nomust=new String[]{"memo"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			String b_id= taskDBUtil.getSequenceValByName("WF_SEQ_WF_FACTORS");
			pmap.put("b_id", b_id);//ID	
			pmap.put("opt_person", "admin");//创建人			
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//创建时间
			factorsInfoDao.addOneFactorsInfo(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//向业务要素表中删除一条信息
	@Override
	public Map<String, String> deleteOneFactorsInfo(HttpServletRequest req) {
		String b_id = RequestUtils.getParamValue(req, "b_id");//要素id
		Map<String,String> bMap = new HashMap<String, String>();//
		Map<String,String> resultMap = new HashMap<String, String>();//
		try {
			bMap.put("b_id", b_id);
			factorsInfoDao.deleteOneFactorsInfo(bMap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//修改一条业务要素表信息
	@Override
	public Map<String, String> updateOneFactorsInfos(HttpServletRequest req) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"b_id","system_code","b_state","rule_type","factor_code","factor_name","factor_type"};
			//非必填的参数列表
			String[] nomust=new String[]{"memo"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("opt_person", "admin");//创建人			
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//创建时间
			factorsInfoDao.updateOneFactorsInfo(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}

}
