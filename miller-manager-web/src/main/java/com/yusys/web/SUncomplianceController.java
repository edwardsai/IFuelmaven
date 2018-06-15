package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SUncomplianceService.ISUncomplianceService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/SUncompliance")
public class SUncomplianceController extends BaseController{
	@Resource
	private ISUncomplianceService suncomplianceService;
	
	//查询不合格配置
	@RequestMapping("/queryalluncompliance")
	public void queryalluncompliance(HttpServletRequest req,HttpServletResponse res)	{
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	suncomplianceService.queryAllUncompliance(req,getUserId(req))));		
	}
	//新增不合格配置
	@RequestMapping("/UncomplianceAdd")
	public void UncomplianceAdd(HttpServletRequest req,HttpServletResponse res)	{
		String str=JsonUtils.beanToJson(suncomplianceService.UncomplianceAdd(req,getUserId(req),getOrgId(req)));
		System.out.println(str);
		ResponseUtils.jsonMessage(res,str);		
	}
	//删除不合格配置
	@RequestMapping("/UncomplianceDelete")
	public void UncomplianceDelete(HttpServletRequest req,HttpServletResponse res)	{
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	suncomplianceService.UncomplianceDelete(req,getUserId(req))));		
	}
	//修改不合格配置
	@RequestMapping("/UncomplianceUpdate")
	public void UncomplianceUpdate(HttpServletRequest req,HttpServletResponse res)	{
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	suncomplianceService.UncomplianceUpdate(req,getUserId(req))));		
	}
	//查询一个不合格配置
	@RequestMapping("/queryoneUncompliance")
	public void queryoneUncompliance(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(suncomplianceService.queryoneUncompliance(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	//乱码转换方法
	public void writeUTFJson(HttpServletResponse res,String json){
		ResponseUtils.jsonMessage(res, json);
	}
}
