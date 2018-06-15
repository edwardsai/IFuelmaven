package com.yusys.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.CommonStaticConfig;
import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.LogUtil;
import com.yusys.Utils.ResponseUtils;
import com.yusys.common.SUser;
import com.yusys.common.cache.redis.IMyCache;
import com.yusys.common.cache.redis.RedisCache;
import com.yusys.service.SConfigService.ISConfigService;
import com.yusys.service.SPermissionService.ISPermissionService;
import com.yusys.service.SUserService.ISUserService;

/**
 * 控制用户跳转
 * 
 * @author Administrator
 * 
 */
@Controller
@RequestMapping("/")
public class MainController {
	private static final Logger logger = Logger.getLogger(MainController.class);
	@Resource
	private ISUserService suserService;

	@Resource
	private ISPermissionService permissionService;
	@Resource
	private RedisCache redisCache;
	@Resource
	private LogUtil logUtil;
	@Resource
	private ISConfigService confService;
	
	/**
	 * 登入 设置cookie
	 * 
	 * @param req
	 * @param res
	 */
	@RequestMapping("login")
	public void login(HttpServletRequest req, HttpServletResponse res) {
		Map<String, Object> vmap = new HashMap<String, Object>();
		vmap = suserService.userLogin(req, "");
		if ("true".equals(vmap.get("result"))) {
			setSessionData(req,vmap.get("userinfo"));
		}
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(vmap));
	}
	/**
	 * 设置session数据
	 * @param req
	 * @param object
	 */
	private void setSessionData(HttpServletRequest req,Object object){
		HttpSession session=req.getSession();
		int maxSessionActive = confService.queryMaxSessionActive();
		session.setMaxInactiveInterval(maxSessionActive);//0或-1无限期
		session.setAttribute("userinfo", object);
		SUser su = (SUser)object;
		//登陆后将session放到redis中
		redisCache.set(su.getUser_no(), su.getUser_no(), maxSessionActive);
		logUtil.insertLogInfo(req,su.getUser_no(), CommonStaticConfig.LOGIN, CommonStaticConfig.RESULT_SUCC, "",CommonStaticConfig.LOG_TYPE_LOGIN,"");
	}
	/*@RequestMapping("login")
	public void login(HttpServletRequest req, HttpServletResponse res) {
		Map<String, Object> vmap = new HashMap<String, Object>();
		//登陆人数
		ServletContext context=req.getSession().getServletContext();
		Integer count=(Integer)context.getAttribute("count");
		//System.out.println(count);
		if(count==null){   
			count= 1 ;   
		}else{
			int co = count.intValue( );
			count= new Integer(co+1);
		}
		//System.out.println("current users :"+count);   
		Integer user_now = confService.queryUserNow();
		
		if(count<=user_now){
			 vmap = suserService.userLogin(req, "");
			if ("true".equals(vmap.get("result"))) {
				//req.getSession().setAttribute("login_name", vmap.get("loginname"));
				req.getSession().setAttribute("userinfo", vmap.get("userinfo"));
				context.setAttribute("count", count);
			}
		}else{
			vmap.put("result","usermax");
		}
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(vmap));
	}*/

	/**
	 * 登出清除cookie
	 * 
	 * @param req
	 * @param res
	 */
	/*@RequestMapping("logout")
	public void logout(HttpServletRequest req, HttpServletResponse res) {
		if (req.getSession(false) != null) {
			req.getSession().removeAttribute("userinfo");
			//退出 减人数
			ServletContext context=req.getSession().getServletContext();   
			Integer count=(Integer)context.getAttribute("count");   
			int co=count==null?1:count.intValue();   
			count=new Integer(co-1);
			context.setAttribute("count", count);   
			System.out.println("当前用户人数:"+count);
		}
		ResponseUtils.jsonMessage(res, "{\"result\":\"true\"}");
	}*/
	/**
	 * 登出清除cookie
	 * 
	 * @param req
	 * @param res
	 */
	@RequestMapping("logout")
	public void logout(HttpServletRequest req, HttpServletResponse res) {
		if (req.getSession(false) != null) {
			removeSessionData(req);
			//退出 减人数
			/*ServletContext context=req.getSession().getServletContext();
			Integer count=(Integer)context.getAttribute("count");   
			int co=count==null?1:count.intValue();   
			count=new Integer(co-1);
			context.setAttribute("count", count);   */
		}
		ResponseUtils.jsonMessage(res, "{\"result\":\"true\"}");
	}

	@RequestMapping("main")
	public void toMain(HttpServletRequest req, HttpServletResponse res) {
		if (isLogined(req)) {// 已经登录过了，跳转页面
				try {
					req.getRequestDispatcher("WEB-INF/pages/main.jsp").forward(req, res);
				} catch (ServletException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}
			return;
		}
		res.setCharacterEncoding("UTF-8");
		res.setContentType("text/html;charset=UTF-8");
		PrintWriter printWriter = null;
		try {
			try {
				req.getRequestDispatcher("WEB-INF/pages/timeout.jsp").forward(req, res);
			} catch (ServletException e) {
				e.printStackTrace();
			}
			/*printWriter = res.getWriter();
			printWriter.print(" 您还未登录...<a href='login.html'>点击进入登陆</a>");*/
		} catch (IOException e) {
			e.printStackTrace();
			logger.error(e);
		} finally {
			if (null != printWriter) {
				printWriter.close();
			}
		}
	}
	
	/**
	 * 用户菜单
	 * @param req
	 * @param res
	 */
	@RequestMapping("user/usermenu")
	public void getUserMenu(HttpServletRequest req, HttpServletResponse res) {
		if (isLogined(req)) {
			SUser user=(SUser)req.getSession(false).getAttribute("userinfo");
			ResponseUtils.jsonMessage(res, permissionService.queryUserPermiss(req, IMyCache.perm_menu,user.getUser_no()));
		}
	}

	/**
	 * 用户操作
	 * @param req
	 * @param res
	 */
	@RequestMapping("user/usermenuopt")
	public void getUserMenuOpt(HttpServletRequest req, HttpServletResponse res) {
		if (isLogined(req)) {
			SUser user=(SUser)req.getSession(false).getAttribute("userinfo");
			ResponseUtils.jsonMessage(res, permissionService.queryUserPermiss(req, IMyCache.perm_opt,user.getUser_no()));
		}
	}
	/**
	 * 用户菜单属性
	 * @param req
	 * @param res
	 */
	@RequestMapping("user/usermenuproperty")
	public void getUserMenuProperty(HttpServletRequest req, HttpServletResponse res) {
		if (isLogined(req)) {
			SUser user=(SUser)req.getSession(false).getAttribute("userinfo");
			ResponseUtils.jsonMessage(res, permissionService.queryUserPermiss(req, "PERM_PROPERTY",user.getUser_no()));
		}
	}
	/**
	 * 是否已经登录
	 * @param req
	 * @return
	 */
	private boolean isLogined(HttpServletRequest req){
		if (req.getSession(false) != null&&req.getSession(false).getAttribute("userinfo")!=null) {
			return true;
		}
		return false;
	}
	/**
	 * 移除session数据
	 * @param req
	 */
	private void removeSessionData(HttpServletRequest req){
		HttpSession session=req.getSession();
		ServletContext application=	session.getServletContext();
		Integer loginCount = (Integer) application.getAttribute("loginCount");
		if(loginCount!=null){
			loginCount--;
			application.setAttribute("loginCount", loginCount);
		}
		session.removeAttribute("userinfo");
	}
}
