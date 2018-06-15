package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SRoleService.ISRoleService;
@Controller
@RequestMapping("/SRole")
public class SRoleController extends BaseController{
	@Resource
	private ISRoleService iSRoleService;
	//乱码转换方法
	public void writeUTFJson(HttpServletResponse res,String json){
		ResponseUtils.jsonMessage(res, json);
	}
	
	
	@RequestMapping("/findSRoleAll")
	//查询全部
	public void findAll(HttpServletRequest req,HttpServletResponse resp){		
		try {
			writeUTFJson(resp,JsonUtils.beanToJson(iSRoleService.findSRoleInfoAll(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	@RequestMapping("/saveSRole")
	//新增
	public void saveSRole(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(iSRoleService.saveSRole(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	@RequestMapping("/deleteSRole")
	//删除一条记录
	public void deleteSRoleByNo(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(iSRoleService.deleteSRole(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	@RequestMapping("/findSRoleById")
	//查询一条数据
	public void findSRoleByNo(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanToJson(iSRoleService.findSRoleById(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	@RequestMapping("/updateSRole")
	//修改一条数据
	public void updateSRole(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(iSRoleService.updateSRole(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/sRoleMenuDis")
	//角色菜单配置
	public void sRoleMenuDis(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(iSRoleService.SRoleMenuDis(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/sRoleOperDis")
	//角色操作配置
	public void sRoleOperDis(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(iSRoleService.sRoleOperDis(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/sRoleDataAuth")
	//角色数据权限
	public void sRoleDataAuth(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(iSRoleService.sRoleDataAuth(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/sRoleFieldAuth")
	//角色字段权限
	public void sRoleFieldAuth(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(iSRoleService.sRoleFieldAuth(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/findUserRole")
	//角色字段权限
	public void findUserRole(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(iSRoleService.queryUserRole(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/findUserNoRole")
	//角色字段权限
	public void findUserNoRole(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(iSRoleService.queryUserNoRole(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}	
	@RequestMapping("/addUserRole")
	//角色字段权限
	public void addUserRole(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanToJson(iSRoleService.addUserRole(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/treeMenuChecked")	
	public void treeMenuChecked(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(iSRoleService.treeMenuChecked(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/**
	 *  操作列表选中
	 */
	@RequestMapping("/OperateChecked")	
	public void oprDisChecked(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(iSRoleService.oprDisChecked(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	//数据权限选中
	@RequestMapping("/DataAuthChecked")	
	public void dataAuthChecked(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(iSRoleService.dataAuthChecked(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	//字段权限被选中
	@RequestMapping("/fileAuthChecked")	
	public void fileAuthChecked(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(iSRoleService.filedAuthChecked(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	//根据用户编码查询出该用户的所有角色
	@RequestMapping("/findAllRoleById")
	public void findAllSDic(HttpServletRequest req,HttpServletResponse res)	{
		writeUTFJson(res,JsonUtils.beanToJson(iSRoleService.findAllRoleById(req,getUserId(req))));
	}	
}
