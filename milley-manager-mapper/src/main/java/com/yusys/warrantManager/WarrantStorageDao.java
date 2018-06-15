package com.yusys.warrantManager;

import java.util.List;
import java.util.Map;

public interface WarrantStorageDao {
	//查询待入库清单
	public List<Map<String, String>> queryListWarrantStorage(Map<String, String> map);
	//更新中间表入库标识
	public void updateMiddleTable(Map<String, String> map);
	//新增库存
	public void saveWarrantStorage(Map<String, String> map);
	//更新库存
	public void updateWarrantStorage(Map<String, String> map);
	//新增入库记录 
	public void saveWarrantRecord(Map<String, String> map);
	//新增权证价值
	public void saveWarrantValue(Map<String, String> map);
	//注销一条权证信息
	public void updateWarrantStatus(Map<String, String> pmap);
	//查询库存表里是否有此物品的信息
	public List<Map<String, String>> queryTagId(Map<String, String> pmap);
	public List<Map<String, String>> querywarrant(Map<String, String> pmap);
	//更新仓库信息
	public void updateTodeleteOwn(Map<String, String> ud);
	public void updateCabinetFloor(Map<String, String> ud);
	public Map<String, String> queryCabinetUse(String string);
	public void updateCabinetUse(Map<String, String> cabinetUse);
	//查询楼层信息和区域信息的下拉数据
	public List<Map<String, String>> findCabinetsMapSelectInfo(
			Map<String, String> pmap);
}
