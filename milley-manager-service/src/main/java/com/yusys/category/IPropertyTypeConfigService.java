package com.yusys.category;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.yusys.category.PropertyTypeConfig;

public interface IPropertyTypeConfigService {

	/**
	 * 查询所有
	 * @param req
	 * @param userid
	 * @return
	 */
	public List<Map<String, String>> queryAllCategroy(HttpServletRequest req,String userId);
	/**
	 * 添加类别配置
	 * @param req
	 * @return
	 */
	public Map<String, Object> addProTypeConfig(HttpServletRequest req, String userId, String orgId);
	/**
	 * 根据类型编号，查询一条类别
	 * @param req
	 * @return
	 */
	public PropertyTypeConfig findOneConfigInfo(HttpServletRequest req);
	/**
	 * 修改类别配置
	 * @param req
	 * @return
	 */
	public Map<String, Object> updateProTypeConfig(HttpServletRequest req, String userId);
	/**
	 * 删除类别配置
	 * @param req
	 * @return
	 */
	public Map<String, Object> delProTypeConfig(HttpServletRequest req,String userId);
	/**
	 * 查询所有资产类型
	 * @param req
	 * @param userid
	 * @return
	 */
	public List<Map<String, String>> queryAllAssetCategroy(HttpServletRequest req,String userId);
}
