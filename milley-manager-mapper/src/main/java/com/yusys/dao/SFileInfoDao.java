package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface SFileInfoDao {
	/**
	 * 获取文件路径配置信息
	 * @param pathId
	 * @return
	 */
	public Map<String, String> getFilePathById(String pathId);
	/**
	 * 新增附件信息
	 * @param map
	 */
	public void addFileInfo(Map<String, String> map);
	/**
	 * 查询附件
	 * @param map
	 * @return
	 */
	public List<Map<String, String>> findFileInfo(Map<String, String> map);
	/**
	 * 删除文件记录
	 * @param id
	 */
	public void delFildInfo(String id);
	/**
	 * 删除文件信息
	 * @param file_id
	 */
	public void delFildInfoByFileId(String file_id);
	/**
	 * 查询附件信息
	 * @param file_id
	 * @return
	 */
	public List<Map<String, String>> getFileInfoByFId(String file_id);
	/**
	 * 查询附件信息
	 * @param file_id
	 * @return
	 */
	public Map<String, String> getFileInfoById(String id);
	/**
	 * 设置文件预览
	 * @param id
	 */
	public void setFileIsView(String id);
	
	public void setContentManagerDocId(Map<String, String> map);
}
