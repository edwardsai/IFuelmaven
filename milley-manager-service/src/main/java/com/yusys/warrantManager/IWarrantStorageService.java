package com.yusys.warrantManager;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface IWarrantStorageService {
	//查询待入库清单
	public Map<String, Object> queryListWarrantStorage(HttpServletRequest req);
	//新增入库
	public Map<String, String> saveWarrantStorage(HttpServletRequest req, String userId);
	//信息不符合打回
	public Map<String, String> beatWarrantStorage(HttpServletRequest req);
	// 查询 工作区域的下拉信息
	public List<Map<String, String>>findCabinetsMapSelectInfo(HttpServletRequest req,String userid);
}
