package com.yusys.consumableManager;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface IStatisticsConsumableSuppliesService {
	
	   //查询所有的耗材预警统计
		public Map<String, Object> queryAllStatistics(HttpServletRequest req);
		//增加或修改耗材预警统计
		public Map<String, String> newStatistics(HttpServletRequest req, String userId, String OrgId);
		//删除耗材预警统计
		public Map<String, String> delStatistics(HttpServletRequest req, String userId);
		
}
