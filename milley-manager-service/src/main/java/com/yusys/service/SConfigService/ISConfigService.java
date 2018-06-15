package com.yusys.service.SConfigService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface ISConfigService {
	/**
	 * 新增一条配置信息
	 * @param req
	 * @param userid
	 * @return
	 */
    public Map<String, String> updateEmail(HttpServletRequest req,String userid);
    /**
     * 查询邮箱配置信息
     * @param req
     * @param userid
     * @return
     */
    public Map<String,String>  findEmailInfo(String userid);
	//查询阀值信息
	public Map<String, String> queryConUser(HttpServletRequest req,String actorno);
	//修改当前阀值
	public Map<String, String> updateConUser(HttpServletRequest req,String actorno);
	//查询当前设定阀值
	public Integer queryUserNow();
	//查询session超时,用于配置超时时间
	public Integer queryMaxSessionActive();
	//查询session超时
	public Map<String, String> queryConSession(HttpServletRequest req,String actorno);
	//修改session超时
	public Map<String, String> updateConSession(HttpServletRequest req,String actorno);
}
