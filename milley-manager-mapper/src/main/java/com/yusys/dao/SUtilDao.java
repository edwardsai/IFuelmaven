package com.yusys.dao;

import java.util.List;
import java.util.Map;


public interface SUtilDao {
	/**
	 * 根据参数获取序列
	 * @param name
	 * @return
	 */
	public String findSenqunceByName(Map<String, String> map);
	
	/**
	 * 根据多个id查询用户集合
	 * @param list
	 * @return
	 */
	public List<Map<String, String>> queryUsersByIds(List<String> list);
	
}
