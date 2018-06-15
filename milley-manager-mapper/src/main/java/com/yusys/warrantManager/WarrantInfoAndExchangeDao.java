package com.yusys.warrantManager;

import java.util.List;
import java.util.Map;

public interface WarrantInfoAndExchangeDao {
	//查询所有权证
	List<Map<String, String>> queryAllWarrant(Map<String, String> pmap);
	//查询权证类型
	List<Map<String, String>> queryAllWarrantCategroy(Map<String, String> pmap);
	//根节点
	List<Map<String, String>> queryFatherWarrantCategroy(
			Map<String, String> pmap);
	//权证价值信息
	List<Map<String, String>> queryWarrantWorth(Map<String, String> pmap);
	//权证变更信息
	List<Map<String, Object>> queryWarrantChange(Map<String, Object> pmap);
	//权证出入库信息
	List<Map<String, Object>> queryWarrantHistory(Map<String, Object> pmap);
	//标签变更
	void updateWarrantTagId(Map<String, String> pmap);
	//存放区域变更
	void updateWarrantArea(Map<String, String> pmap);
	//清空以前数据
	void updateTodeleteOwn(Map<String, String> ud);
	//更新文件柜柜位信息
	void updateCabinetFloor(Map<String, String> ud);
	//查询文件柜使用率
	Map<String, String> queryCabinetUse(String cab_num);
	//更新文件柜使用率
	void updateCabinetUse(Map<String, String> cabinetUse);
	//根据合同查权证
	List<Map<String, String>> queryWarrantByContract(Map<String, String> pmap);
	//变更记录
	void updateWarrExchange(Map<String, String> bmap);
}
