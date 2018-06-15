package com.yusys.warrantManager;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface IWarrantOutService {
	//查询待出库信息
	public Map<String, Object> queryListWarrantOut(HttpServletRequest req);
	//保存权证信息
	public Map<String, String> editWarrantOut(HttpServletRequest req, String userId);
	//打回
	public Map<String, String> beatWarrantOut(HttpServletRequest req, String userId);

}
