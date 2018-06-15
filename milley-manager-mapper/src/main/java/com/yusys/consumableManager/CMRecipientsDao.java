package com.yusys.consumableManager;

import java.util.List;
import java.util.Map;

public interface CMRecipientsDao {
	//查询耗材领用信息
	public List<Map<String,Object>> queryAllRecipients(Map<String,Object> map);
	//新增领用信息
	public void addRecipientsInfo(Map<String, String> map);
	//修改领用信息
	public void updateRecipientsInfo(Map<String, String> map);
	//新增领用详情表信息
	public void addRecipientsDetailInfo(Map<String, String> map);
	//删除领用详情表信息
	public void deleteRecipientsDetailInfo(Map<String, String> map);
	//删除耗材领用信息
	public void deletecmRecipients(Map<String, String> map);
	//根据id查询耗材领用信息
	public List<Map<String, Object>> queryRecipientsInfoById(Map<String, Object> map);
	//查询类别对应的物品信息
	public List<Map<String, Object>> queryAllStorageField(Map<String, Object> pmap);
	//根据id查询领用详情表信息
	public List<Map<String, String>> queryRecipientsDetailById(Map<String, Object> map);
	//修改物品的剩余数量
	public void updateGoods_Number(Map<String, String> map);
	//根据id查询物品的剩余数量
	public Map<String, Object> queryGoods_NumberById(Map<String, String> map);
	//修改出库状态
	public void updateOut_Status(Map<String, String> map);
}
