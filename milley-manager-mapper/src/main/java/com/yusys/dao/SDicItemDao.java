package com.yusys.dao;

import java.util.List;
import java.util.Map;


public interface SDicItemDao {
	//新增字典项
	public void save(Map<String, String> map);
	//删除字典项
	public void delete(Map<String, String> map);
	//修改类别
	public void update(Map<String, String> map);
	//根据字典编码查询字典项
	public List<Map<String, String>> findById(Map<String, String> map);
	//查询所有字典项
	public List<Map<String, String>> findAll(Map<String, String> map);
	

}
