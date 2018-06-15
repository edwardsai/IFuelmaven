package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SOrgService.ISOrgService;

@Controller
@RequestMapping("/SOrg")
public class SOrgController extends BaseController{
	@Resource
	private ISOrgService orgService;
	
	public void writeUTFJson(HttpServletResponse res,String json){
		ResponseUtils.jsonMessage(res, json);
	}
	//查列表
	@RequestMapping("/queryorgtreelist")
	public void queryOrgTreeList(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanListToJson(orgService.queryOrgTreeList(req,getUserId(req))).toLowerCase());
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	//创建机构
	@RequestMapping("/createsorg")
	public void createSOrg(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(orgService.insertNewOrg(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//查询详情
	@RequestMapping("/findonesorg")
	public void findonesorg(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(orgService.findOrgByOrgNo(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//修改
	@RequestMapping("/updatesorg")
	public void updatePayDate(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(orgService.updatePayDate(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//删除
	@RequestMapping("/deletesorg")
	public void delete(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(orgService.delete(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//根据用户编码查询出该用户的所有管理机构
	@RequestMapping("/findAllOrgById")
	public void findAllOrgById(HttpServletRequest req,HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(orgService.findAllOrgById(req,getUserId(req))));
	}	
}
