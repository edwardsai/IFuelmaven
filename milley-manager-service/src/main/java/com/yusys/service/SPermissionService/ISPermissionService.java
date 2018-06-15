package com.yusys.service.SPermissionService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.cache.annotation.Cacheable;

public interface ISPermissionService {
	/**
	 * 增加用户权限
	 * @param map
	 */
	public Map<String, String> addUserPermiss(HttpServletRequest req,String userid)throws Exception;
	/**
	 * 查询用户权限
	 * @param map
	 */
	/*@Cacheable(key ="#userid+#type",value ="sysCache")*/
	public String queryUserPermiss(HttpServletRequest req,String type,String userid);
	
}
