package com.yusys.service.SUncomplianceService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.yusys.common.SUncompliance;

public interface ISUncomplianceService {
	//查询不合格配置
	public Map<String, Object> queryAllUncompliance(HttpServletRequest req,String userid);
	//新增不合格配置
    public Map<String, String> UncomplianceAdd(HttpServletRequest req,String userid,String orgId);    
    //删除不合格配置
	public Map<String, String> UncomplianceDelete(HttpServletRequest req,String userid);
	//修改不合格配置
	public Map<String, String> UncomplianceUpdate(HttpServletRequest req,String userid);	    
	//查询一个不合格配置
	public SUncompliance queryoneUncompliance(HttpServletRequest req,String userid);

}
