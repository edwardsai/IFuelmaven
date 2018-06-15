package com.yusys.warrantManager;

import java.util.List;
import java.util.Map;

public interface WarrantOutDao {
	//查询待出库信息
	List<Map<String, String>> queryListWarrantOut(Map<String, String> pmap);
	//更新库存表
	public void updateWarrantOut(Map<String, String> pmap);
	//新增一条记录
	public void saveWarrantOutRecord(Map<String, String> pmap);
	//更新中间表标识
	public void updateWarrantFlag(Map<String, String> pmap);
	//查询流水号
	List<Map<String, String>> queryListSerno(Map<String, String> pmap);
	//打回
	public void beatWarrantOut(Map<String, String> pmap);

}
