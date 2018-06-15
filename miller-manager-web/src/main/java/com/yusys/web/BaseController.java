package com.yusys.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.yusys.common.SUser;

public abstract class BaseController {
	
	/**
	 * 防止乱码方法
	 * @param res
	 * @param json
	 */
	public void writeUTFJson(HttpServletResponse res,String json){
		PrintWriter writer=null;
		try {
			res.setCharacterEncoding("UTF-8"); 
			res.setContentType("text/html;charset=utf-8");
			writer=res.getWriter();
			writer.write(json);
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			if (writer!=null) {
				writer.flush();
			}
		}
	}
	
	/**
	 * 获取用户信息
	 * @param req
	 * @return
	 */
	public SUser getUser(HttpServletRequest req){
		SUser user=(SUser)req.getSession(false).getAttribute("userinfo");
		return user;
	}
	/**
	 * 获取用户id
	 * @param req
	 * @return
	 */
	public String getUserId(HttpServletRequest req){
		SUser user=getUser(req);
		if (user==null) {
			return "";
		}
		return user.getUser_no();
	}
	
	/**
	 * 获取机构id
	 * @param req
	 * @return
	 * */
	public String getOrgId(HttpServletRequest req){
		SUser user=getUser(req);
		if(user==null){
			return "";
		}
		return user.getOrg_no();
	}
	
	/**
	 * 获取机构名称name
	 * @param req
	 * @return
	 * */
	public String getOrgName(HttpServletRequest req){
		SUser user=getUser(req);
		if(user==null){
			return "";
		}
		return user.getOrg_no_name();
	}
}
