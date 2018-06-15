package com.yusys.warrantHomePage2;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.warrantHomePage2.IWarrantHomePageService;

/**
 * 控制首页按钮
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/WarrantHomePage")
public class WarrantHomePageController {
	@Resource
	private IWarrantHomePageService warrantHomePageService;

	/**
	 * 统计资产数量
	 */
	@RequestMapping("/queryAssetCount")
	public void queryAssetCount(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	warrantHomePageService.queryAssetCount(req)));
	}
	/**
	 * 查询资产最近n个月使用情况
	 */
	@RequestMapping("/queryAssetUseCondition")
	public void queryAssetUseCondition(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	warrantHomePageService.queryAssetUseCondition(req)));
	}
	/**
	 * 统计近一年前几名总资产占比
	 */
	@RequestMapping("/queryAssetProportion")
	public void queryAssetProportion(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	warrantHomePageService.queryAssetProportion(req)));
	}
	/**
	 * 查询待办
	 */
	@RequestMapping("/queryNeedToDeal")
	public void queryNeedToDeal(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	warrantHomePageService.queryNeedToDeal(req)));
	}
	
	
	

}
