package com.yusys.consumableManager;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;

import com.yusys.consumableManager.Sorting;

public interface ISortingService {
	//查询所有
	public List<Map<String, String>> queryAllSorting(HttpServletRequest req,String userId);
	//根据类型编号，查询类别
	public Sorting findOneSortingInfo(HttpServletRequest req);
	//添加类别
	public Map<String, Object> addSortingConfig(HttpServletRequest req,String userId, String orgId);
	//修改类别
	public Map<String, Object> updateSortingConfig(HttpServletRequest req,String userId);
	//删除类别
	public Map<String, Object> delSortingConfig(HttpServletRequest req,String userId);
	//删除一条物品信息
	public Map<String, Object> deleteField(HttpServletRequest req,String userId);
	//新增或者修改物品信息
	public Map<String, Object> addOrUpdateField(HttpServletRequest req,String userId);
	//查询一条物品信息
	public Sorting queryOneFieldInfo(HttpServletRequest req);
	//查询类别对应的物品信息
	public Map<String, Object> queryAllPrivateField(HttpServletRequest req);
	//添加图片附件
	public Map<String, String> uploadImg(HttpServletRequest req, String userId,
			String path_id, MultipartFile file);
	//图片预览
	public void findImg(HttpServletResponse res, String path_id,
			String userId, String fid);
	//删除图片附件
	public Map<String, String> deleteImage(HttpServletRequest req, String userId);
}
