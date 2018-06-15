package com.yusys.service.SUserService;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.common.SUser;
import com.yusys.dao.SConfigDao;
import com.yusys.dao.SUserDao;

@Service("suserService")
@Transactional
public class SUserService implements ISUserService {
	@Resource
	private SUserDao sUserdao;
	@Resource
	private SConfigDao sConfigdao;
	/**
	 * 登陆名及密码验证
	 */
	@Override
	public Map<String, Object> userLogin(HttpServletRequest req,String actorno) {
		String check_code=(String)req.getSession().getAttribute(RequestUtils.check_code);
		req.getSession().removeAttribute(RequestUtils.check_code);
		String []must={"loginname","password","check_code"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		Map<String, Object> resultMap=new HashMap<String, Object>();
		HttpSession session=req.getSession();
		ServletContext application=	session.getServletContext();
		try{
			Integer loginCount = (Integer) application.getAttribute("loginCount");
			if(null==loginCount||loginCount<1){
				loginCount=1;
			}else{
				loginCount++;
			}
			String count = sConfigdao.queryUserNow();
			if(count==null||count.equals("")){
				count = "0";
			}
			Integer counts = Integer.parseInt(count);
			if(loginCount>counts){
				resultMap.put("result", "false");
				resultMap.put("loginname_error", "登录人数过多,请稍后重试!");
				return resultMap;
			}
			application.setAttribute("loginCount", loginCount);
			if (pmap==null) {
				resultMap.put("result", "false");
				resultMap.put("msg", "缺少必填项!");
				return resultMap;
			}
			String password=pmap.get("password");
			pmap.remove("password");
			pmap.put("password", JsonUtils.MD5Encryption(password));
			SUser user=sUserdao.findByParam(pmap);
			if(user==null){
				resultMap.put("result", "false");
				resultMap.put("msg", "用户名或者密码错误!");
				return resultMap;
			}
			if(check_code==null||!pmap.get("check_code").equals(check_code)){
				resultMap.put("result", "false");
				resultMap.put("msg", "验证码错误!");
				return resultMap;
			}
			
			//resultMap.put("userid", user.getUser_no());
			//resultMap.put("loginname", user.getLogin_name());
			resultMap.put("userinfo", user);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}
	
	/**
	 * 查询所有用户
	 * @param req
	 * @param actorno
	 * @return
	 */
	public Map<String, Object> queryAllUser(HttpServletRequest req,String actorno){
		Map<String, Object> map=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String user_no = RequestUtils.getParamValue(req, "user_no");
		String user_name = RequestUtils.getParamValue(req, "user_name");
		String login_name = RequestUtils.getParamValue(req, "login_name");
		String state = RequestUtils.getParamValue(req, "state");
		String user_belong = RequestUtils.getParamValue(req, "user_belong");
		try {
			if(user_no!=null && !"".equals(user_no)){
				pmap.put("user_no","%"+user_no+"%");			
			}
			if(user_name!=null && !"".equals(user_name)){
				user_name=URLDecoder.decode(user_name,"UTF-8");
				pmap.put("user_name","%"+user_name+"%");			
			}
			if(login_name!=null && !"".equals(login_name)){
				pmap.put("login_name","%"+login_name+"%");			
			}
			if(state!=null && !"".equals(state)){
				pmap.put("state","%"+state+"%");			
			}
			if(user_belong!=null && !"".equals(user_belong)){
				pmap.put("user_belong","%"+user_belong+"%");			
			}
			
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, String>> m=sUserdao.queryAllUser(pmap);
		//	List<Map<String,String>> pagination = RequestUtils.pagination(req, m);
			map.put("rows", m);
			map.put("total", pmap.get("total"));
			return map;
		} catch (Exception e) {			
			e.printStackTrace();
			return map;
		}
	} 
	/**
	 * 创建用户
	 */
	public Map<String, String> insertNewUser(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		String password = RequestUtils.getParamValue(req, "password");
		try{
			//必填参数列表
			String[] must=new String[]{"user_no","user_name","login_name","state","user_post","user_level","org_no_code","user_mail","user_mobile","user_belong"};
			//非必填的参数列表
			String[] nomust=new String[]{"nick_name","memo"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			String password1 = JsonUtils.MD5Encryption(password);
			pmap.put("password", password1);
			pmap.put("create_no",actorno);
			pmap.put("create_time", DateTimeUtils.getFormatCurrentTime());
			sUserdao.insertNewUser(pmap);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		return resultMap;
	}
	/**
	 * 查询用户详细信息
	 */
	public SUser queryOneUser(HttpServletRequest req,String actorno){
		String user_no = RequestUtils.getParamValue(req, "user_no");
		try{
			return sUserdao.queryOneUser(user_no);
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 修改用户信息
	 */
	public Map<String, String> updateUser(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			//必填参数列表
			String[] must=new String[]{"user_no","user_name","login_name","state","user_post","user_level","org_no_code","user_mail","user_mobile","user_belong"};
			//非必填的参数列表
			String[] nomust=new String[]{"nick_name","memo"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("update_no",actorno);
			pmap.put("update_time", DateTimeUtils.getFormatCurrentTime());
			sUserdao.updateUser(pmap);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		return resultMap;
	}
	/**
	 * 删除个人信息
	 */
	public Map<String, String> delteUser(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			String user_no=RequestUtils.getParamValue(req, "user_no");
			if (user_no==null||"".equals(user_no.trim())) {
				resultMap.put("result", "false");
				return resultMap;
			}
			Map<String, Object> pmap=new HashMap<String, Object>();
			
			pmap.put("user_no", user_no);
			pmap.put("update_no",actorno);
			pmap.put("update_time", DateTimeUtils.getFormatCurrentTime());
			try {
				sUserdao.delteUser(pmap);
				resultMap.put("result", "true");
				return resultMap;
			} catch (Exception e) {
				e.printStackTrace();
			}

		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	/**
	 * 查询角色
	 */
	public Map<String, Object> queryRoleuser(HttpServletRequest req,String actorno){
		Map<String, Object> map=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String user_no = RequestUtils.getParamValue(req, "user_no");
		pmap.put("user_no",user_no);
		
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		List<Map<String, String>> m=sUserdao.queryRoleuser(pmap);
		//List<Map<String,String>> pagination = RequestUtils.pagination(req, m);
		map.put("rows", m);
		map.put("total", pmap.get("total"));
		return map;
	} 
	/**
	 * 插入权限
	 */
	public Map<String, String> insertRoleuser(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		Map<String, String> pmap= new HashMap<String, String>();
		try{
			String user_no = RequestUtils.getParamValue(req, "user_no");
			String[] role_no = req.getParameterValues("role_no");
			for(int i = 0 ;i< role_no.length ; i++){
				if (role_no[i]==null||role_no[i]=="") {
					resultMap.put("result", "false");
					return resultMap;
				}
				pmap.put("user_no", user_no);
				pmap.put("role_no", role_no[i]);
				pmap.put("opt_no",actorno);
				pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
				sUserdao.insertNewUser(pmap);
			}
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		return resultMap;
	}

	/**
	 * @author  罗一飞
     * POP框查询所有用户
	 * @param
	 */
	@Override
	public Map<String, Object> popFindAllUser(HttpServletRequest req,String userid) {
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			Map<String, String> pmap = new HashMap<String, String>();
			
			pmap.put("user_no", req.getParameter("PopUserNo"));
			pmap.put("state", req.getParameter("PopUserState"));
			pmap.put("login_name", req.getParameter("PopUserLoginName"));
			
			String PopUserName=req.getParameter("PopUserName");
			if(PopUserName!=null){
				PopUserName = URLDecoder.decode(PopUserName,"UTF-8");
				pmap.put("user_name",  "%"+PopUserName+"%");
			}
			
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, String>> m = sUserdao.popFindAllUser(pmap);
			map.put("rows", m);
			map.put("total", pmap.get("total"));		

		} catch (Exception e) {
			
		}
		return map;
	}
	/**
	 * 查询用户密码
	 */
	public Map<String, String> findUserPass(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		String user_no = RequestUtils.getParamValue(req, "user_no");;
		String password = RequestUtils.getParamValue(req, "password");
		try{
			//页面上的旧密码
			String password1 = null;
			if(!"".equals(password)&&password!=null){
				password1 = JsonUtils.MD5Encryption(password);
			}
			//数据库中的密码
			String pass_word = sUserdao.findUserPass(user_no);
			if(pass_word.equals(password1)){
				resultMap.put("result", "true");
				return resultMap;
			}else{
				resultMap.put("result", "false");
				return resultMap;
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
		return resultMap;
	}
	
	/**
	 * 修改用户密码
	 */
	public Map<String , String > updatePass(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		String user_no = RequestUtils.getParamValue(req, "user_no");
		String password = RequestUtils.getParamValue(req, "password");
		try{
			String password1 = JsonUtils.MD5Encryption(password);
			Map<String, String> pmap = new HashMap<String, String>();
			pmap.put("user_no", user_no);
			pmap.put("password", password1);
			sUserdao.updatePass(pmap);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}
    @Override
    @Cacheable(key="'querySUserByNoCache'+#user_no", value="userCache")
    public SUser querySUserByNoCache(String user_no){
        SUser sUser= sUserdao.queryOneUser(user_no);
        return  sUser;
    }
    @CachePut(key ="#userno",value ="userCache")
    public String addUserByCache(String userno){
    	return "OK";
    }

	@Override
	public boolean checkWechartNoIsExists(String wechart_no) {
		boolean flag = false;
		Map<String, String> pmap = new HashMap<String, String>();
		pmap.put("wechart_no", wechart_no);
		SUser user=sUserdao.findByParam(pmap);
		if(null!=user){
			flag=true;
		}
		return flag;
	}
}