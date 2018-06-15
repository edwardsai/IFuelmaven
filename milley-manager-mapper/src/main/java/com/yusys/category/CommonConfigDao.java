package com.yusys.category;

import java.util.List;
import java.util.Map;

import com.yusys.category.CommonConfig;

public interface CommonConfigDao {

	/**
	 * 查询所有公共字段
	 * @param map
	 * @return
	 */
	public List<Map<String, Object>> queryAllCommonField(Map<String, Object> map);
	/**
	 * 新增公共字段
	 * @param map
	 */
	public void addField(Map<String, String> map);
	/**
	 * 查询一条字段信息
	 * @param detail_id
	 * @return
	 */
	public CommonConfig queryOneFieldInfo(String col_id);
	/**
	 * 查询一条字段信息(通过标签名称查询)
	 * @param detail_id
	 * @return
	 */
	public List<Map<String, Object>> queryOneFieldByTag_id(Map<String, String> pmap2);
	/**
	 * 修改一个字段信息
	 * @param map
	 */
	public void updateField(Map<String, String> map);
	/**
	 * 删除一条字段信息
	 * @param map
	 */
	public void deleteField(Map<String, String> map);
	
	
	/**
	 * 查询类别对应的所有公共字段
	 * @param map
	 * @return
	 */
	public List<Map<String, Object>> queryAllPrivateField(Map<String, Object> map);
}
