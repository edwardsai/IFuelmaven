package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SFileInfoService.ISFileInfoService;

/**
 * 附件上传
 * 
 * @author Administrator
 * 
 */
@Controller
@RequestMapping("/sfile")
public class SFileInfoController  extends BaseController{
	
	@Resource
	private ISFileInfoService fileInfoService;
	
	public void writeUTFJson(HttpServletResponse res, String json) {
		ResponseUtils.jsonMessage(res, json);
	}

	/**
	 * 上传操作
	 */
	@RequestMapping("/uploadFile")
	public void uploadFile(HttpServletRequest req, HttpServletResponse res){
		
		writeUTFJson(res,
				JsonUtils.beanToJson(fileInfoService.fileUpload(req, getUserId(req))));
	}
	/**
	 * 查询附件信息
	 */
	@RequestMapping("/findFileInfo")
	public void findFile(HttpServletRequest req, HttpServletResponse res){
		
		writeUTFJson(res,
				JsonUtils.beanToJson(fileInfoService.findFileInfo(req, getUserId(req))));
	}
	/**
	 * 附件下载
	 * @param req
	 * @param res
	 */
	@RequestMapping("/fileDownLoad")
	public void fileDownLoad(HttpServletRequest req, HttpServletResponse res){
		if(!fileInfoService.fileDownLoad(req,res, getUserId(req))){
			writeUTFJson(res, "{result:false,message:\"没有找到该文件!\"}");
		}
	}
	/**
	 * 附件预览
	 * @param req
	 * @param res
	 */
	@RequestMapping("/filePreView")
	public void filePreView(HttpServletRequest req, HttpServletResponse res){
		if(!fileInfoService.filePreFileView(req,res, getUserId(req))){
			writeUTFJson(res, "{result:false,message:\"没有找到该文件!\"}");
		}
	}
	/**
	 * 附件下载
	 * @param req
	 * @param res
	 */
	@RequestMapping("/delFileInfo")
	public void delFileInfo(HttpServletRequest req, HttpServletResponse res){
		
		if(!fileInfoService.delFileInfo(req, getUserId(req))){
			writeUTFJson(res, "{result:false,message:\"您没有删除该文件的权利!或者改文件不存在\"}");
		}else{
			writeUTFJson(res, "{result:true,message:\"文件删除成功!\"}");
		}
	}
	
	
	/**
	 * 附件下载
	 * @param req
	 * @param res
	 */
	@RequestMapping("/doFileDownLoad")
	public void doFileDownLoad(HttpServletRequest req, HttpServletResponse res){
		if(!fileInfoService.doFileDownLoad(req,res, getUserId(req))){
			writeUTFJson(res, "{result:false,message:\"没有找到该文件!\"}");
		}
	}
}