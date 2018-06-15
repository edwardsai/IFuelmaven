package com.yusys.consumableManager;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.consumableManager.ICMRecipientsService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/CMRecipients")
public class CMRecipientsController extends BaseController{
	@Resource
	private ICMRecipientsService icmrecipientsService;
	//查询耗材领用信息
	@RequestMapping("/queryAllRecipients")
	public void queryAllRecipients(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(icmrecipientsService.queryAllRecipients(req,getUserId(req), getOrgId(req))));
	}
	//保存耗材领用信息
	@RequestMapping("/addOrUpdateCMRecipients")
	public void addOrUpdateCMRecipients(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(icmrecipientsService.addOrUpdateCMRecipients(req,getUserId(req))));
	}
	//提交耗材领用信息
	@RequestMapping("/submitCMRecipients")
	public void submitCMRecipients(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(icmrecipientsService.submitCMRecipients(req,getUserId(req))));
	}
	//根据id查询耗材领用信息
	@RequestMapping("/queryRecipientsInfoById")
	@ResponseBody
	public List<Map<String,Object>> queryRecipientsInfoById(HttpServletRequest req){
		return icmrecipientsService.queryRecipientsInfoById(req);
	}
	//查询类别对应的物品信息
	@RequestMapping("/queryAllStorageField")
	public void queryAllStorageField(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(icmrecipientsService.queryAllStorageField(req)));
	}
	//删除耗材领用信息
	@RequestMapping("/deletecmRecipients")
	public void deletecmRecipients(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(icmrecipientsService.deletecmRecipients(req,getUserId(req))));
	}
	//确认耗材领用信息
	@RequestMapping("/surecmRecipients")
	public void surecmRecipients(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(icmrecipientsService.surecmRecipients(req,getUserId(req))));
	}
}
