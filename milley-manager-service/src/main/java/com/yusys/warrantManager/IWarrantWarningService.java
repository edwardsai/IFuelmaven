package com.yusys.warrantManager;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
public interface IWarrantWarningService {
	//查询所有的预警
	public Map<String, Object> queryAllWarning(HttpServletRequest req);
	//增加或修改预警
	public Map<String, String> newWarning(HttpServletRequest req, String userId, String OrgId);
	//删除预警
	public Map<String, String> delWarning(HttpServletRequest req, String userId);
	//查询维保异常清单
	public Map<String, Object> queryAllWarningDayException(HttpServletRequest req);
}
