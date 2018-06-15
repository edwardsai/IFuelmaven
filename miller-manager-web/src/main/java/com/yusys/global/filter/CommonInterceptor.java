package com.yusys.global.filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.yusys.Utils.ResponseUtils;
import com.yusys.common.SUser;

public class CommonInterceptor extends HandlerInterceptorAdapter {

	private static final Logger logger = Logger
			.getLogger(CommonInterceptor.class);

	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		SUser suser = (SUser) request.getSession().getAttribute("userinfo");
		if (suser == null) {
			ResponseUtils.jsonMessage(response, "{\"logintimeout\":true}");
			return false;
		}
		logger.info("用户登录名及请求地址uri:" + suser.getLogin_name() + ">>>"
				+ request.getRequestURI());
		return true;
	}

	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {

	}

	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {

	}

}