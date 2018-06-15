package com.yusys.consumableManager;

import javax.annotation.Resource;
import javax.mail.Multipart;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.consumableManager.ISortingService;
import com.yusys.web.BaseController;


@Controller
@RequestMapping("/sorting")
public class SortingController extends BaseController{
	
	@Resource
	private ISortingService iSortingService;
	
	//查询所有
	@RequestMapping("/queryAllSorting")
	public void queryAllSorting(HttpServletRequest req,HttpServletResponse res){
		String str=JsonUtils.beanListToJson(iSortingService.queryAllSorting(req, getUserId(req)));
		ResponseUtils.jsonMessage(res, str.toLowerCase());
	}
	//根据类型标号，查询一条类别
	@RequestMapping("/findOneSortingInfo")
	public void findOneSortingInfo(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(iSortingService.findOneSortingInfo(req)));
	}
	//添加类别配置
	@RequestMapping("/addSortingConfig")
	public void addSortingConfig(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(iSortingService.addSortingConfig(req,getUserId(req),getOrgId(req))));
	}
	//修改类别配置
	@RequestMapping("/updateSortingConfig")
	public void updateSortingConfig(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(iSortingService.updateSortingConfig(req,getUserId(req))));
	}
	//删除类别配置
	@RequestMapping("/delSortingConfig")
	public void delSortingConfig(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(iSortingService.delSortingConfig(req,getUserId(req))));
	}
	//删除一条物品信息
	@RequestMapping("/deleteField")
	public void deleteField(HttpServletRequest req,HttpServletResponse res)	{		
		String str = JsonUtils.beanToJson(iSortingService.deleteField(req,getUserId(req)));
		ResponseUtils.jsonMessage(res,str);		
	}
	@RequestMapping("/queryAllPrivateField")
	public void queryAllPrivateField(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(iSortingService.queryAllPrivateField(req)));
	}
	//新增或修改物品信息
	@RequestMapping("/addOrUpdateField")
	public void addOrUpdateField(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(iSortingService.addOrUpdateField(req,getUserId(req))));
	}
	//查询一条物品信息
	@RequestMapping("/queryOneFieldInfo")
	public void queryOneFieldInfo(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(iSortingService.queryOneFieldInfo(req)));
	}
	//添加图片附件
	@RequestMapping("/uploadImg")
	public void uploadImg(HttpServletRequest req,HttpServletResponse res,MultipartFile file){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(iSortingService.uploadImg(req,getUserId(req),RequestUtils.getParamValue(req, "path_id"),file)));
	}
	//删除图片附件
	@RequestMapping("/deleteImage")
	public void deleteImg(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(iSortingService.deleteImage(req,getUserId(req))));
	}
	//图片预览
	@RequestMapping("/findImg")
	public void findImg(HttpServletRequest req,HttpServletResponse res){
		try {
			iSortingService.findImg(res,RequestUtils.getParamValue(req, "path_id"),getUserId(req),RequestUtils.getParamValue(req, "fid"));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
