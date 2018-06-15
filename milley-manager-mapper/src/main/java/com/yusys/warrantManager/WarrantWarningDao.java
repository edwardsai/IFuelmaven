package com.yusys.warrantManager;

import java.util.List;
import java.util.Map;

public interface WarrantWarningDao {
	//查询所有预警
	public List<Map<String, String>> queryAllWarning(Map<String, Object> pmap);
	//增加预警
	public void addWarning(Map<String, String> map);
	//修改预警
	public void updateWarning(Map<String, String> map);
	//删除预警
	public void delWarning(Map<String, String> map);
	//查询维保异常清单
	public List<Map<String, String>> queryAllWarningDayException(Map<String, String> pmap);
	//查询是否已存在同种预警类型
	public int queryWarningByType(Map<String, String> map);
	
	
}
