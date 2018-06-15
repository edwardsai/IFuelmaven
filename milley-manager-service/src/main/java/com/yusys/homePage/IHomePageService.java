package com.yusys.homePage;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface IHomePageService{
	//统计资产数量
	public Map<String, Object> queryAssetCount(HttpServletRequest req);
	//查询资产最近n个月使用情况
	public Map<String, Object> queryAssetUseCondition(HttpServletRequest req);
	//统计近一年前几名总资产占比
	public Map<String, Object> queryAssetProportion(HttpServletRequest req);
	//查询待办
	public Map<String, Object> queryNeedToDeal(HttpServletRequest req);
	
	
}
