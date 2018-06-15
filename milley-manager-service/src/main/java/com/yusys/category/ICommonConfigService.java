package com.yusys.category;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.yusys.category.CommonConfig;

public interface ICommonConfigService {

	/**
	 * 查询所有公共字段
	 * @param req
	 * @return
	 */
	public Map<String, Object> queryAllCommonField(HttpServletRequest req);
	/**
	 * 新增或修改字段信息
	 * @param req
	 * @return
	 */
	public Map<String, Object> addOrUpdateField(HttpServletRequest req, String userId);
	/**
	 * 查询一条字段信息
	 * @param req
	 * @return
	 */
	public CommonConfig queryOneFieldInfo(HttpServletRequest req);
	/**
	 * 删除一条字段信息
	 * @param req
	 * @return
	 */
	public Map<String, Object> deleteField(HttpServletRequest req, String userId);
	
	
	/**
	 * 查询类别对应的所有公共字段
	 * @param req
	 * @return
	 */
	public Map<String, Object> queryAllPrivateField(HttpServletRequest req);
}
