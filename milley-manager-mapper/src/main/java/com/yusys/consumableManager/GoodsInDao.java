package com.yusys.consumableManager;

import java.util.List;
import java.util.Map;

import com.yusys.consumableManager.GoodsIn;
import com.yusys.consumableManager.GoodsInDetail;

public interface GoodsInDao {
	
	void addGoodsIn(GoodsIn gi);
	
	void updateGoodsIn(GoodsIn gi);
	
	List<GoodsIn> queryGoodsIn(Map<String, String> param);
	
	GoodsIn getOne(String id);
	
	void deleteGoodsIn(String id);
	
	List<Map<String, String>> queryGoodsByLocation(Map<String, String> pmap);
	//根据id查询入库详情表信息
    List<Map<String, String>> queryGoodsInDetailById(Map<String, Object> map);
    //根据id查询耗材入库信息
  	List<Map<String, Object>> queryGoodsInInfoById(Map<String, Object> map);
	//修改物品的剩余数量
	void updateGoods_Num(Map<String, String> map);
	void updateNum(GoodsInDetail gid);
	//修改入库状态
	void updateIn_Status(Map<String, String> map);

	void addGoodsInDetail(GoodsInDetail gid);
	
	void deleteGoodsInDetail(String id);

	void addGoodsInGoods(GoodsInDetail gid);

	List<Map<String, String>> queryCoodsInGoodsById(Map<String, String> bmap);

	void addGoodsToGoods(Map<String, String> bmap);

	List<Map<String, String>> queryCategoryIdById(Map<String, String> bmap);
}
