package com.yusys.warrantManager;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.warrantManager.IWarrantStorageService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/WarrantStorage")
public class WarrantStorageController extends BaseController{
	@Resource 
	private IWarrantStorageService warrantStorageService;
	
	//查询待入库清单
	@RequestMapping("/queryListWarrantStorage")
	public void queryListWarrantStorage(HttpServletRequest req,HttpServletResponse res) {
		writeUTFJson(res,JsonUtils.beanToJson(warrantStorageService.queryListWarrantStorage(req)));
	}
	//新增入库
	@RequestMapping("/saveWarrantStorage")
	public void saveWarrantStorage(HttpServletRequest req,HttpServletResponse res) {
		writeUTFJson(res,JsonUtils.beanToJson(warrantStorageService.saveWarrantStorage(req,getUserId(req))));
	}
	//信息不符合打回
	@RequestMapping("/beatWarrantStorage")
	public void beatWarrantStorage(HttpServletRequest req,HttpServletResponse res) {
		writeUTFJson(res,JsonUtils.beanToJson(warrantStorageService.beatWarrantStorage(req)));
	}
	//查询楼层信息和区域信息的下拉数据
	@RequestMapping("/findCabinetsMapSelectInfo")
	public void findWorkPlaceSelectInfo(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanListToJson(warrantStorageService.findCabinetsMapSelectInfo(req,getUserId(req))));
	}
}
