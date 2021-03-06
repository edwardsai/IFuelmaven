package com.yusys.service.SRoleService;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.common.SRole;
import com.yusys.dao.SRoleDao;

/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 15-11-3
 * Time: 下午4:22
 * To change this template use File | Settings | File Templates.
 */
@Service("iSRoleService")
@Transactional
public class SRoleService implements  ISRoleService {

    @Resource
    private SRoleDao sRoleDao;

    @Override
    public List<SRole> querySRoleListByActorNo(HttpServletRequest req,
			String userid) {
    	String actorno=RequestUtils.getParamValue(req, "actorno");
        return sRoleDao.querySRoleListByActorNo(actorno);
    }
	@Override
	//查询单条
	public SRole findSRoleById(HttpServletRequest req,String userid) {
		SRole sRole=new SRole();
		String roleno=req.getParameter("role_no");
		sRole=sRoleDao.findSRoleById(roleno);
		return sRole;		
	}
	@Override
	//保存
	public Map<String, String> saveSRole(HttpServletRequest req,String userid) {
		Map<String, String> resultMap =new HashMap<String, String>();
		try{			
			String[] must=new String[]{"role_no","role_name","flag","order_no"};
			String[] noMust=new String[]{"memo"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, noMust);
			if(pmap==null){
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("create_no", "admin");//创建人			
			pmap.put("create_time", DateTimeUtils.getFormatCurrentTime());//创建时间
			pmap.put("safe_level", "1");//安全级别
			sRoleDao.saveSRole(pmap);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;		
	}
	@Override
	//修改
	public Map<String, String> updateSRole(HttpServletRequest req,String userid) {
		Map<String, String> resultMap =new HashMap<String, String>();
		try{
			String[] must=new String[]{"role_no","role_name","flag","order_no"};
			String[] noMust=new String[]{"memo"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, noMust);
			if(pmap==null){
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("update_no", "admin");//创建人			
			pmap.put("update_time", DateTimeUtils.getFormatCurrentTime());//创建时间
			//pmap.put("safe_level", "1");//安全级别
			sRoleDao.updateSRole(pmap);			
			resultMap.put("result", "true");
			return resultMap;
		}catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	@Override
	//删除
	public Map<String, String> deleteSRole(HttpServletRequest req,String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String role_no=RequestUtils.getParamValue(req, "role_no");
		if (role_no==null||"".equals(role_no.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("role_no", role_no);
		pmap.put("update_no","admind");
		pmap.put("update_time", DateTimeUtils.getFormatCurrentTime());
		try{
			sRoleDao.deleteSRole(pmap);				
			resultMap.put("result", "true");			
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	@Override
	//查询全部
	public Map<String,Object> findSRoleInfoAll(HttpServletRequest req,String userid) {	
		Map<String, Object> map=new HashMap<String,Object>();
		String role_no=RequestUtils.getParamValue(req, "role_no");
		String role_name=RequestUtils.getParamValue(req, "role_name");
		try {
			role_name=URLDecoder.decode(role_name,"UTF-8");
		} catch (Exception e) {			
			e.printStackTrace();
		}		
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("role_no", "%"+role_no+"%");
		pmap.put("role_name", "%"+role_name+"%");
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		List<Map<String,String>> list=sRoleDao.findSRoleInfoAll(pmap);
		//List<Map<String,String>> pagination = RequestUtils.pagination(req, m);
		map.put("rows", list);
		map.put("total", pmap.get("total"));
		return map;
	}
	//角色菜单配置
	@Override
	public Map<String, String> SRoleMenuDis(HttpServletRequest req, String userid) {
		Map<String,String> resultMap=new HashMap<String, String>();		
		String sroleInfo=RequestUtils.getParamValue(req, "sroleInfo");		
		String memunos=RequestUtils.getParamValue(req, "memunos");
		int index=sroleInfo.indexOf("-");
		String role_no=sroleInfo.substring(index+1);
		String[] menu_nos=memunos.split(",");
		if (role_no==null||"".equals(role_no.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}
		if (menu_nos.length==0) {
			resultMap.put("result", "false");
			return resultMap;
		}
		Map<String,String> pmap=new HashMap<String, String>();
		try{
			//List<Map<String,String>> list=sRoleDao.queryTreeMenu(role_no);
			//if(list.size()>0){
			//}
			sRoleDao.deleteMenuDis(role_no);
			if(menu_nos.length==1&&menu_nos[0].equals("")){
				System.out.println(menu_nos[0]);
				resultMap.put("result", "true");
				return resultMap;
			}else{
				for(int i=0;i<menu_nos.length;i++){			
					pmap.put("role_no", role_no);			
					pmap.put("state", "00");
					pmap.put("menu_no",menu_nos[i]);
					pmap.put("opt_no",userid);
					pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
					sRoleDao.sRoleMenuDis(pmap);
					pmap.clear();
				}				
			}
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		return resultMap;
	}
	//角色操作配置
	@Override
	public Map<String, String> sRoleOperDis(HttpServletRequest req,
			String userid) {
		Map<String,String> resultMap=new HashMap<String, String>();		
		String sroleInfo=RequestUtils.getParamValue(req, "sroleInfo");
		String[] info=sroleInfo.split("-");
		String role_no=info[info.length-1];
		String menu_no=RequestUtils.getParamValue(req, "menu_no");		
		String action_nos=RequestUtils.getParamValue(req, "action_no");	
		String[] action=action_nos.split(",");		
		if (role_no==null||"".equals(role_no.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}
		if (menu_no==null||"".equals(menu_no.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}		
		Map<String,String> pmap=new HashMap<String, String>();
		try{
			//查询该角色的该菜单是否已被配置
			Map<String,String> map=new HashMap<String, String>();
			map.put("role_no", role_no);
			map.put("menu_no", menu_no);
			//List<Map<String,String>> list=sRoleDao.queryOperDis(map);
			//删除已经存在的配置
			//if(list.size()>0){
			//}
			sRoleDao.deletOprDis(map);
			if (action_nos.length()>=0) {
				//resultMap.put("result", "false");
				//return resultMap;
				for(int i=1;i<action.length;i++){
					pmap.put("role_no", role_no);
					pmap.put("menu_no", menu_no);
					pmap.put("action_no", action[i]);
					pmap.put("state","00");
					pmap.put("opt_no",userid);
					pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
					sRoleDao.sRoleOperDis(pmap);
					pmap.clear();
				}						
			}
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	@Override
	//保存角色数据权限
	public Map<String, String> sRoleDataAuth(HttpServletRequest req,
			String userid) {
		Map<String,String> resultMap=new HashMap<String, String>();		
		String sroleInfo=RequestUtils.getParamValue(req, "sroleInfo");
		String[] info=sroleInfo.split("-");
		String role_no=info[info.length-1];
		String menu_no=RequestUtils.getParamValue(req, "menu_no");		
		String data_no=RequestUtils.getParamValue(req, "data_no");	
		if (role_no==null||"".equals(role_no.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}
		if (menu_no==null||"".equals(menu_no.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}
		if(data_no.length()<=0){
			resultMap.put("result", "false");
			return resultMap;
		}
		Map<String,String> pmap=new HashMap<String, String>();
		try{
			Map<String,String> map=new HashMap<String, String>();
			map.put("role_no", role_no);
			map.put("menu_no", menu_no);
			//List<Map<String,String>> list=sRoleDao.queryDataAuth(map);
			//删除已经存在的配置
			//if(list.size()>0){
			sRoleDao.deletDataAuth(map);
			//}			
			pmap.put("role_no", role_no);
			pmap.put("menu_no", menu_no);
			pmap.put("data_no", data_no);
			pmap.put("state","00");
			pmap.put("opt_no",userid);
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());		
			sRoleDao.sRoleDataAuth(pmap);							
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//保存角色字段权限
	@Override
	public Map<String, String> sRoleFieldAuth(HttpServletRequest req,
			String userid) {
		Map<String,String> resultMap=new HashMap<String, String>();		
		String sroleInfo=RequestUtils.getParamValue(req, "sroleInfo");
		String[] info=sroleInfo.split("-");
		String role_no=info[info.length-1];
		String menu_no=RequestUtils.getParamValue(req, "menu_no");	
		String property_nos=RequestUtils.getParamValue(req,"property_no");
		String[] property_no=property_nos.split(",");
		if (role_no==null||"".equals(role_no.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}
		if (menu_no==null||"".equals(menu_no.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}		
		Map<String,String> pmap=new HashMap<String, String>();
		try{
			Map<String,String> map=new HashMap<String, String>();
			map.put("role_no", role_no);
			map.put("menu_no", menu_no);
			//List<Map<String,String>> list=sRoleDao.queryFiledAuth(map);
			//删除已经存在的配置
			//if(list.size()>0){
			//}
			sRoleDao.deleteFiledAuth(map);
			if(property_nos.length()>=0){
				//resultMap.put("result", "false");
				//return resultMap;
				for(int i=1;i<property_no.length;i++){				
					pmap.put("role_no", role_no);
					pmap.put("menu_no", menu_no);
					pmap.put("property_no", property_no[i]);
					pmap.put("state","00");
					pmap.put("safe_level","00");
					pmap.put("opt_no",userid);
					pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());		
					sRoleDao.sRoleFieldAuth(pmap);
					pmap.clear();
				}
			}
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	
	@Override	
	public List<SRole> queryUserRole(HttpServletRequest req, String userid) {
		String[]must={"actorno","org_code"};
		Map<String, String>pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			return new ArrayList<SRole>();
		}else{
			return sRoleDao.queryUserRole(pmap);
		}
	}
	
	@Override
	public List<SRole> queryUserNoRole(HttpServletRequest req, String userid) {
		String[]must={"actorno","org_code"};
		Map<String, String>pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			return new ArrayList<SRole>();
		}else{
			return sRoleDao.queryUserNoRole(pmap);
		}
	}
	
	@Override
	public  Map<String, String> addUserRole(HttpServletRequest req, String userid) {
		String[]must={"user_no","org_code"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		Map<String, String> resultMap=new HashMap<String, String>();
		pmap.put("state", "00");
		pmap.put("opt_no", userid);
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		String rolenos=req.getParameter("role_nos");
		if (rolenos==null) {
			rolenos="";
		}
		String []role_nos=rolenos.split(",");
		sRoleDao.rmUserRole(pmap);
		for (int i = 0; i < role_nos.length; i++) {
			if(null!=role_nos[i]&&!"".equals(role_nos[i].trim())){
				pmap.put("role_no", role_nos[i]);
				sRoleDao.addUserRole(pmap);
			}
		}
		resultMap.put("result", "true");
		return resultMap;
	}
	@Override
	public  Map<String, String> rmUserRole(HttpServletRequest req, String userid) {
		return null;
	}
	@Override
	/**
	 * 菜单树初始化选中
	 */
	public List<Map<String,String>> treeMenuChecked(HttpServletRequest req) {
		String roleno=req.getParameter("role_no");
		String[] rolenos=roleno.split("-");
		String role_no=rolenos[rolenos.length-1];
		List<Map<String,String>> list=new ArrayList<Map<String,String>>();
		list=sRoleDao.queryTreeMenu(role_no);		
		return list;
	}
	@Override
	/**
	 * 角色操作列表复选框选中
	 */
	public List<Map<String, String>> oprDisChecked(HttpServletRequest req) {
		String menu_no=req.getParameter("menu_no");
		String rolenos=req.getParameter("role_no");
		String[] role=rolenos.split("-");
		String role_no=role[role.length-1];
		Map<String,String> map=new HashMap<String, String>();
		map.put("role_no", role_no);
		map.put("menu_no", menu_no);
		List<Map<String,String>> list=new ArrayList<Map<String,String>>();
		list=sRoleDao.queryOperDis(map);		
		return list;		
	}
	@Override
	/**
	 * 角色数据权限复选框选中
	 */
	public List<Map<String, String>> dataAuthChecked(HttpServletRequest req) {
		String menu_no=req.getParameter("menu_no");
		String rolenos=req.getParameter("role_no");
		String[] role=rolenos.split("-");
		String role_no=role[role.length-1];
		Map<String,String> map=new HashMap<String, String>();
		map.put("role_no", role_no);
		map.put("menu_no", menu_no);
		List<Map<String,String>> list=new ArrayList<Map<String,String>>();
		list=sRoleDao.queryDataAuth(map);		
		return list;
	}
	@Override
	/**
	 * 角色字段权限被选中
	 */
	public List<Map<String, String>> filedAuthChecked(HttpServletRequest req) {
		String menu_no=req.getParameter("menu_no");
		String rolenos=req.getParameter("role_no");
		String[] role=rolenos.split("-");
		String role_no=role[role.length-1];
		Map<String,String> map=new HashMap<String, String>();
		map.put("role_no", role_no);
		map.put("menu_no", menu_no);
		List<Map<String,String>> list=new ArrayList<Map<String,String>>();
		list=sRoleDao.queryFiledAuth(map);		
		return list;
	}
	
	//根据用户编码查询出该用户的所有角色	和多条件查询所有角色
	@Override
	public Map<String, Object> findAllRoleById(HttpServletRequest req,String userid) {
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			List<Map<String, String>> list  =null;
			Map<String, String> pmap = new HashMap<String, String>();
			
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);			
			if(req.getParameter("user_no")!=null){
				pmap.put("user_no", req.getParameter("user_no"));
				list =  sRoleDao.findAllRoleById(pmap);
			}else{
				String PopRoleName = req.getParameter("PopRoleName");
				if(PopRoleName!=null&&!("undefined".equals(PopRoleName))){
					PopRoleName=URLDecoder.decode(PopRoleName,"UTF-8");
					pmap.put("role_name",  "%"+PopRoleName+"%");
				}
				String PopRoleNo = req.getParameter("PopRoleNo");				
				if(PopRoleNo!=null&&!("undefined".equals(PopRoleNo))){
					pmap.put("role_no", req.getParameter("PopRoleNo"));
				}
				String PopRoleState = req.getParameter("PopRoleState");				
				if(PopRoleState!=null&&!("undefined".equals(PopRoleState))){
					pmap.put("state", req.getParameter("PopRoleState"));
				}
				list =  sRoleDao.findAllRole(pmap);
			}
			map.put("rows", list);
			map.put("total", pmap.get("total"));		
		}catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
}