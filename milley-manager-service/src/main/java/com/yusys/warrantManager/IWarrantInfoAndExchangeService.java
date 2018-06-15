package com.yusys.warrantManager;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface IWarrantInfoAndExchangeService {
	//查询所有权证
	public Map<String, Object> queryAllWarrant(HttpServletRequest req, String userId);
	//查询权证类型
	public List<Map<String, String>> queryAllWarrantCategroy(HttpServletRequest req, String userId);
	//权证价值信息
	public Map<String, Object> queryWarrantWorth(HttpServletRequest req, String userId);
	//权证出入库信息
	public Map<String, Object> queryWarrantHistory(HttpServletRequest req, String userId);
	//权证变更信息
	public Map<String, Object> queryWarrantChange(HttpServletRequest req, String userId);
	//变更标签
	public Map<String, String> updateWarrantTagId(HttpServletRequest req, String userId);
	//存放区域变更
	public Map<String, String> updateWarrantArea(HttpServletRequest req, String userId);
	//根据合同查权证
	public Map<String, Object> queryWarrantByContract(HttpServletRequest req, String userId);

}
