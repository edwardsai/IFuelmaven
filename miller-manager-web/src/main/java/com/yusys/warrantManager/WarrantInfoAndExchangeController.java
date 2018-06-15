package com.yusys.warrantManager;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.warrantManager.IWarrantInfoAndExchangeService;
import com.yusys.web.BaseController;
@Controller
@RequestMapping("/warrantInfoAndExchange")
public class WarrantInfoAndExchangeController extends BaseController{
	@Resource
	private IWarrantInfoAndExchangeService warrantInfoAndExchangeService;
	/**
	 * 查询所有权证
	 * @param req
	 * @param res
	 */
	@RequestMapping("/queryAllWarrant")
	public void queryAllWarrant(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(warrantInfoAndExchangeService.queryAllWarrant(req,getUserId(req))));
	}
	/**
	 * 根据合同查权证
	 * @param req
	 * @param res
	 */
	@RequestMapping("/queryWarrantByContract")
	public void queryWarrantByContract(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(warrantInfoAndExchangeService.queryWarrantByContract(req,getUserId(req))));
	}
	/**
	 * 查询权证类型
	 * @param req
	 * @param res
	 */
	@RequestMapping("/queryAllWarrantCategroy")
	public void queryAllWarrantCategroy(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanListToJson(warrantInfoAndExchangeService.queryAllWarrantCategroy(req,getUserId(req))));
	}
	/**
	 * 权证价值信息
	 * @param req
	 * @param res
	 */
	@RequestMapping("/queryWarrantWorth")
	public void queryWarrantWorth(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(warrantInfoAndExchangeService.queryWarrantWorth(req,getUserId(req))));
	}
	/**
	 * 权证出入库信息
	 * @param req
	 * @param res
	 */
	@RequestMapping("/queryWarrantHistory")
	public void queryWarrantHistory(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(warrantInfoAndExchangeService.queryWarrantHistory(req,getUserId(req))));
	}
	/**
	 * 权证变更信息
	 * @param req
	 * @param res
	 */
	@RequestMapping("/queryWarrantChange")
	public void queryWarrantChange(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(warrantInfoAndExchangeService.queryWarrantChange(req,getUserId(req))));
	}
	/**
	 * 变更标签
	 * @param req
	 * @param res
	 */
	@RequestMapping("/updateWarrantTagId")
	public void updateWarrantTagId(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(warrantInfoAndExchangeService.updateWarrantTagId(req,getUserId(req))));
	}
	/**
	 * 存放区域变更
	 * @param req
	 * @param res
	 */
	@RequestMapping("/updateWarrantArea")
	public void updateWarrantArea(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(warrantInfoAndExchangeService.updateWarrantArea(req,getUserId(req))));
	}
}
