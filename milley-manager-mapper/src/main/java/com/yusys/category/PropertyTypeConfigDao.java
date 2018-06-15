package com.yusys.category;

import java.util.List;
import java.util.Map;

import com.yusys.category.PropertyTypeConfig;

public interface PropertyTypeConfigDao {

	/**
	 * 查询所有
	 * @param param
	 * @return
	 */
	public List<Map<String, String>> queryAllCategroy(String param);
	/**
	 * 根据类型编号，查询一条类别
	 * @param param
	 * @return
	 */
	public PropertyTypeConfig findOneConfigInfo(String param);
	/**
	 * 添加类别配置
	 * @param map
	 */
	public void addProTypeConfig(Map<String, String> map);
	/**
	 * 修改类别配置
	 * @param map
	 */
	public void updateProTypeConfig(Map<String, String> map);
	/**
	 * 修改子类别的父级类别编号
	 * @param map
	 */
	public void updateChildConfigSupNo(Map<String, String> map);
	/**
	 * 修改子类别的类别级别
	 * @param map
	 */
	public void updateChildConfigLevel(Map<String, String> map);
	/**
	 * 清空父节点
	 * @param haveId
	 */
	public void clearConfigSupNoInfo(String haveId);
	/**
	 * 删除类别配置
	 * @param map
	 */
	public void delProTypeConfig(Map<String, Object> map);
	/**
	 * 删除类别对应的字段信息
	 * @param map
	 */
	public void delFieldInTypeConfig(Map<String, Object> map);
	/**
	 * 查询所有资产类型
	 * @param param
	 * @return
	 */
	public List<Map<String, String>> queryAllAssetCategroy(String param);
}
