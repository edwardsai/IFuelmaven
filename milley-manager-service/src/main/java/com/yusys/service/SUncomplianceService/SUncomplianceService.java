package com.yusys.service.SUncomplianceService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.common.SUncompliance;
import com.yusys.dao.SUncomplianceDao;

@Service("suncomplianceService")
public class SUncomplianceService implements ISUncomplianceService{
	
	@Resource
	private SUncomplianceDao SUncomplianceDao;
	@Resource
	private TaskDBUtil taskDBUtil;
	/**
	 * 查询不合格配置
	 */
	public Map<String, Object> queryAllUncompliance(HttpServletRequest req,
			String userid) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
	
		String use_grade= RequestUtils.getParamValue(req, "use_grade");
		String qualification= RequestUtils.getParamValue(req, "qualification");
		String emp_post= RequestUtils.getParamValue(req, "emp_post");
		if(use_grade!=null && !"".equals(use_grade)){
			pmap.put("use_grade","%"+use_grade+"%");
		}
		if(qualification!=null && !"".equals(qualification)){
			pmap.put("qualification","%"+qualification+"%");			
		}
		if(emp_post!=null && !"".equals(emp_post)){
			pmap.put("emp_post","%"+emp_post+"%");			
		}
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		List<Map<String, Object>> m=SUncomplianceDao.queryAllUncompliance(pmap);
		retmap.put("rows", m);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}
	/**
	 * 新增不合格配置
	 */
	public Map<String, String> UncomplianceAdd(HttpServletRequest req,
			String userid,String orgId) {
		Map<String, String> resultMap=new HashMap<String, String>();
		//必填的参数列表
		String[] must=new String[]{"max_years","qualification","use_grade","flag","emp_post"};
		//非必填的参数列表
		String[] nomust=new String[]{"min_years"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
				if (pmap==null) {
					resultMap.put("result", "false");
					return resultMap;
				}
				SUncompliance sUncompliance=SUncomplianceDao.queryoneUncomplianceBySL(pmap);
				if(sUncompliance==null){
				String ids= taskDBUtil.getSequenceValByName("S_SEQ_NON_COMPLIANCE_CONFIG");
				pmap.put("id", ids);
				pmap.put("create_user", userid);
				pmap.put("create_org", orgId);
				pmap.put("create_date", DateTimeUtils.getFormatCurrentDate());
				pmap.put("last_update_user", userid);
				pmap.put("last_update_date", DateTimeUtils.getFormatCurrentDate());
				SUncomplianceDao.UncomplianceAdd(pmap);			
				resultMap.put("result", "true");
				resultMap.put("isExist", "false");				
				}
				else
					{
					resultMap.put("isExist", "true");
					}
				return resultMap;
       }
	/**
	 * 删除不合格配置
	 */
	public Map<String, String> UncomplianceDelete(HttpServletRequest req,
			String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String id=RequestUtils.getParamValue(req, "id");
		if (id==null||"".equals(id.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("id", id);
		SUncomplianceDao.UncomplianceDelete(pmap);
		resultMap.put("result", "true");
		return resultMap;
	}
	/**
	 * 修改不合格配置
	 */
	public Map<String, String> UncomplianceUpdate(HttpServletRequest req,
			String userid) {
		String id = RequestUtils.getParamValue(req, "id");
		Map<String, String> resultMap=new HashMap<String, String>();
		//必填的参数列表
		String[] must=new String[]{"max_years","qualification","use_grade","flag","emp_post"};
		//非必填的参数列表
		String[] nomust=new String[]{"min_years"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		if (pmap==null) {
			resultMap.put("result", "false");
			return resultMap;
		}
		pmap.put("id", id);
		SUncompliance sUncompliance=SUncomplianceDao.queryoneUncomplianceBySL(pmap);
		if(sUncompliance==null){
		pmap.put("last_update_user",userid);
		pmap.put("last_update_date", DateTimeUtils.getFormatCurrentDate());
		SUncomplianceDao.UncomplianceUpdate(pmap);
		resultMap.put("result", "true");
		resultMap.put("isExist", "false");				
		}else{
			if(pmap.get("id").equals(sUncompliance.getId())){
				pmap.put("last_update_user",userid);
				pmap.put("last_update_date", DateTimeUtils.getFormatCurrentDate());
				SUncomplianceDao.UncomplianceUpdate(pmap);
				resultMap.put("result", "true");
				resultMap.put("isExist", "false");	
			}else{
				resultMap.put("isExist", "true");
			}
		}
		return resultMap;
		
	}
	/**
	 * 查询一个不合格配置
	 */
	public SUncompliance queryoneUncompliance(HttpServletRequest req,
			String userid){
		String id = RequestUtils.getParamValue(req, "id");
		try{
			return SUncomplianceDao.queryoneUncompliance(id);
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
}
