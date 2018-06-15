package com.yusys.service.SOrgService;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.common.SOrg;
import com.yusys.dao.SOrgDao;
@Service("orgService")
@Transactional
public class SOrgService implements ISOrgService{
	
	@Resource
	private SOrgDao sOrgDao;
	
	/**
	 * 查询树状结构列表
	 */
	@Override
	public List<Map<String, String>> queryOrgTreeList(HttpServletRequest req,String userid){
		try {
			
			String area_id = req.getParameter("area_id");
			Map<String, String> sMap=new HashMap<String, String>();
			if(area_id!=null&&area_id.trim()!=""){
				sMap.put("area_id", area_id);
			}
			return sOrgDao.queryOrgTreeList(sMap);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 创建机构
	 */
	@Override
	public Map<String, String> insertNewOrg(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			//必填参数列表机构编号,机构名称,部门经理,所属大区,业务类型,序号
			String[] must=new String[]{"org_code","org_name","org_manager_code","org_area","business_type"};
			//非必填的参数列表上级部门编号,设立日期,地址
			String[] nomust=new String[]{"suporg_code","org_address","launch_date","order_no"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				resultMap.put("msg", "缺少必填项!");
				return resultMap;
			}
			pmap.put("org_code", pmap.get("org_code").toLowerCase());
			if(sOrgDao.findOrgByOrgNo(pmap.get("org_code"))!=null){
				resultMap.put("result", "false");
				resultMap.put("msg", "机构编号重复");
				return resultMap;
			}
			pmap.put("state", "00");
			pmap.put("create_no",actorno);
			pmap.put("create_time", DateTimeUtils.getFormatCurrentTime());
			sOrgDao.insertNewOrg(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}
	/**
	 * 查询部门详细信息
	 */
	@Override
	public SOrg findOrgByOrgNo(HttpServletRequest req,String actorno){
		String org_code = RequestUtils.getParamValue(req, "org_code");
		try{
			return sOrgDao.findOrgByOrgNo(org_code);
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 修改部门详细信息
	 */
	@Override
	public Map<String, String> updatePayDate(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			String[] must=new String[]{"old_org_code","org_code","org_name","org_manager_code","org_area","business_type"};//,"order_no"
			String[] nomust=new String[]{"org_address","suporg_code","launch_date","order_no"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				resultMap.put("msg", "缺少必填项!");
				return resultMap;
			}
			pmap.put("org_code", pmap.get("org_code").toLowerCase());
			if(!pmap.get("org_code").equals(pmap.get("old_org_code")) && sOrgDao.findOrgByOrgNo(pmap.get("org_code"))!=null){
				resultMap.put("result", "false");
				resultMap.put("msg", "机构编号重复");
				return resultMap;
			}
			pmap.put("update_no",actorno);
			pmap.put("update_time", DateTimeUtils.getFormatCurrentTime());
			sOrgDao.updateOrg(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}
	/**
	 * 删除(修改标记位)
	 */
	@Override
	public Map<String, String> delete(HttpServletRequest req,String actorno){
		
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			String[] must=new String[]{"org_code"};
			String[] nomust=new String[]{};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("state","01");
			pmap.put("update_no",actorno);
			pmap.put("update_time", DateTimeUtils.getFormatCurrentTime());
			sOrgDao.deleteOrgInfo(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//根据用户ID查询所有机构,和查询所有机构
	@Override
	public Map<String, Object> findAllOrgById(HttpServletRequest req,	String userid) {
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			Map<String, String> pmap = new HashMap<String, String>();
			List<Map<String, String>> list = null;
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);			
			if(req.getParameter("user_no")!=null){
				pmap.put("user_no", req.getParameter("user_no"));
				list = sOrgDao.findAllOrgById(pmap);
			}else{
				String pop_orgName = req.getParameter("pop_orgName");
				if(pop_orgName!=null&&!("undefined".equals(pop_orgName))){
					pop_orgName=URLDecoder.decode(pop_orgName,"UTF-8");
					pmap.put("org_name",  "%"+pop_orgName+"%");
				}
				String pop_orgManager = req.getParameter("pop_orgManager");
				if(pop_orgManager!=null&&!("undefined".equals(pop_orgManager))){
					pop_orgManager=URLDecoder.decode(pop_orgManager,"UTF-8");
					pmap.put("org_manager",  "%"+pop_orgManager+"%");
				}
				String pop_orgNo = req.getParameter("pop_orgNo");				
				if(pop_orgNo!=null&&!("undefined".equals(pop_orgNo))){
					pmap.put("org_code", req.getParameter("pop_orgNo"));
				}
				String pop_orgState = req.getParameter("pop_orgState");				
				if(pop_orgState!=null&&!("undefined".equals(pop_orgState))){
					pmap.put("state", req.getParameter("pop_orgState"));
				}
				list = sOrgDao.findAllOrg(pmap);
			}
			
			map.put("rows", list);
			map.put("total", pmap.get("total"));		
		}catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
}
