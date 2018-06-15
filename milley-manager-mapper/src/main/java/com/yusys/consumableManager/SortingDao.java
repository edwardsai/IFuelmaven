package com.yusys.consumableManager;

import java.util.List;
import java.util.Map;


public interface SortingDao {
	//查询所有
	public List<Map<String, String>> queryAllSorting(String param);
	//根据类型编号，查询一条类别
	public Sorting findOneSortingInfo(String param);
	//添加类别配置
	public void addSortingConfig(Map<String, String> map);
	//修改类别配置
	public void updateSortingConfig(Map<String, String> map);
	//修改子类别的父级类别编号
	public void updateChildConfigSupNo(Map<String, String> map);
	//修改子类别的类别级别
	public void updateChildConfigLevel(Map<String, String> map);
	//清空父节点
	public void clearConfigSupNoInfo(String haveId);
	//删除类别配置
	public void delSortingConfig(Map<String, Object> map);
	//删除一条字段信息
	public void deleteField(Map<String, String> pmap);
	//添加物品信息
	public void addField(Map<String, String> pmap);
	//修改物品信息
	public void updateField(Map<String, String> pmap);
	//查询一条物品信息
	public Sorting queryOneFieldInfo(String col_id);
	//查询类别对应的物品信息
	public List<Map<String, Object>> queryAllPrivateField(Map<String, Object> pmap);
	//查询是否存在相同的物品编号
	public List<Map<String, String>> queryGoodsID(Map<String, String> map);
	//添加图片附加
	public void uploadImg(Map<String, String> map);
	//通过物品编号查询
	public Sorting findOneGoodById(String id);
	//删除图片附件
	public void deleteImage(Map<String, String> map);
	//修改
	public void uploadImgage(Map<String, String> map);
	
	public void editField(Map<String, String> pmap);
	
	public List<Map<String, String>> queryBygoodsId(Map<String, String> pmap);
}
