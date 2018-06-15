package com.yusys.consumableManager;

import java.util.List;
import java.util.Map;

import com.yusys.consumableManager.StatisticsConsumableSupplies;

public interface StatisticsConsumableSuppliesDao {
	    //查询所有耗材预警统计
		public List<Map<String, String>> queryAllStatistics(Map<String, String> map);
		//增加耗材预警统计
		public void addStatistics(Map<String, String> map);
		//修改耗材预警统计
		public void updateStatistics(Map<String, String> map);
		//删除耗材预警统计
		public void delStatistics(Map<String, String> map);
		//查询是否已经存在预警
		public List<Map<String, String>> queryStatisticsByParams(Map<String, String> map);
		//查询仓库和类型
		public StatisticsConsumableSupplies queryRnoAndCnoByID(String ID);
}
