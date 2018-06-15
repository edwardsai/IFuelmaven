package com.yusys.warrantManager;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.warrantManager.IWarrantOutService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/WarrantOut")
public class WarrantOutController  extends BaseController{
	@Resource 
	private  IWarrantOutService warrantOutService;
	//查询所有权证出库信息
	@RequestMapping("/queryListWarrantOut")
	public void queryListWarrantOut(HttpServletRequest req,HttpServletResponse res) {
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(warrantOutService.queryListWarrantOut(req)));
	}
	//保存权证信息
	@RequestMapping("/editWarrantOut")
	public void editWarrantOut(HttpServletRequest req,HttpServletResponse res) {
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(warrantOutService.editWarrantOut(req,getUserId(req))));
	}
	//打回
	@RequestMapping("/beatWarrantOut")
	public void beatWarrantOut(HttpServletRequest req,HttpServletResponse res) {
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(warrantOutService.beatWarrantOut(req,getUserId(req))));
	}
}
