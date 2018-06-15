package com.yusys.category;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.category.IPropertyTypeConfigService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/propertyTypeConfig")
public class PropertyTypeConfigController extends BaseController {

	@Resource
	private IPropertyTypeConfigService iPropertyTypeConfigService;
	
	//查询所有
	@RequestMapping("/queryAllCategroy")
	public void queryAllCategroy(HttpServletRequest req,HttpServletResponse res)	{
		String str = JsonUtils.beanListToJson(iPropertyTypeConfigService.queryAllCategroy(req,getUserId(req)));
		ResponseUtils.jsonMessage(res, str.toLowerCase());		
	}
	//查询所有资产类型
	@RequestMapping("/queryAllAssetCategroy")
	public void queryAllAssetCategroy(HttpServletRequest req,HttpServletResponse res)	{
		String str = JsonUtils.beanListToJson(iPropertyTypeConfigService.queryAllAssetCategroy(req,getUserId(req)));
		ResponseUtils.jsonMessage(res, str.toLowerCase());		
	}
	//添加类别配置
	@RequestMapping("/addProTypeConfig")
	public void addProTypeConfig(HttpServletRequest req,HttpServletResponse res)	{
		String str = JsonUtils.beanToJson(iPropertyTypeConfigService.addProTypeConfig(req,getUserId(req),getOrgId(req)));
		ResponseUtils.jsonMessage(res, str);		
	}
	//根据类型编号，查询一条类别
	@RequestMapping("/findOneConfigInfo")
	public void findOneConfigInfo(HttpServletRequest req,HttpServletResponse res)	{
		String str = JsonUtils.beanToJson(iPropertyTypeConfigService.findOneConfigInfo(req));
		ResponseUtils.jsonMessage(res, str);		
	}
	//修改类别配置
	@RequestMapping("/updateProTypeConfig")
	public void updateProTypeConfig(HttpServletRequest req,HttpServletResponse res)	{
		String str = JsonUtils.beanToJson(iPropertyTypeConfigService.updateProTypeConfig(req,getUserId(req)));
		ResponseUtils.jsonMessage(res, str);		
	}
	//修改类别配置
	@RequestMapping("/delProTypeConfig")
	public void delProTypeConfig(HttpServletRequest req,HttpServletResponse res)	{
		String str = JsonUtils.beanToJson(iPropertyTypeConfigService.delProTypeConfig(req,getUserId(req)));
		ResponseUtils.jsonMessage(res, str);		
	}
	
}
