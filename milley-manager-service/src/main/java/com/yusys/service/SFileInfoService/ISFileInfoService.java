package com.yusys.service.SFileInfoService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface ISFileInfoService {
	/**
	 * 上传附件
	 * @param request
	 * @param userid
	 * @return
	 */
	public Map<String, String> fileUpload(HttpServletRequest request,String userid);
	
	/**
	 * 查询附件信息
	 * @param request
	 * @param userid
	 * @return
	 */
	public Map<String, Object> findFileInfo(HttpServletRequest request,String userid);
	
	/**
	 * 附件下载
	 * @param request
	 * @param response
	 * @param userid
	 */
	public boolean fileDownLoad(HttpServletRequest request,HttpServletResponse response,String userid);
	/**
	 * 附件预览
	 * @param request
	 * @param response
	 * @param userid
	 */
	public boolean filePreFileView(HttpServletRequest request,HttpServletResponse response,String userid);
	
	/**
	 * 附件删除
	 * @param request
	 * @param response
	 * @param userid
	 */
	public boolean delFileInfo(HttpServletRequest request,String userid);
	
	
	public boolean doFileDownLoad(HttpServletRequest request,HttpServletResponse response,String userid);
}