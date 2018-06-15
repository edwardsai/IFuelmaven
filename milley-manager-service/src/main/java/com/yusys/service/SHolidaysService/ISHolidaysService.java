package com.yusys.service.SHolidaysService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface ISHolidaysService{
	//查询所有假日标记
	public Map<String, Object> queryHolidays(HttpServletRequest req,String actorno);
	//创建一条工作日或假日
	public Map<String, String> insertHoliday(HttpServletRequest req,String actorno);
	//删除节假日标记
	public Map<String, String> deleteHoliday(HttpServletRequest req,String actorno);
	
}
