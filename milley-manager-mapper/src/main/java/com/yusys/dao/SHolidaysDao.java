package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface SHolidaysDao {
	//查询所有节假日标记
	public List<Map<String, String>> queryHolidays(Map<String, String> map);
	//创建节假日标记
	public void insertHoliday(Map<String, String> map);
	//删除节假日标记
	public void deleteHoliday(Map<String, String> map);
}
