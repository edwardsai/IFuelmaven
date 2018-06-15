package com.yusys.service.SOrgService;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.yusys.common.SOrg;

public interface ISOrgService{
	//查询树形结构列表
	public List<Map<String, String>> queryOrgTreeList(HttpServletRequest req,String userid);
	//添加部门
	public Map<String, String> insertNewOrg(HttpServletRequest req,String actorno);
	//通过序号查找部门详细信息
	public SOrg findOrgByOrgNo(HttpServletRequest req,String actorno);
	//保存部门修改信息
	public Map<String, String> updatePayDate(HttpServletRequest req,String actorno);
	//删除(修改标记位)
	public Map<String, String> delete(HttpServletRequest req,String actorno);
	//根据用户编码查询出该用户的所有机构 
	public Map<String, Object>  findAllOrgById(HttpServletRequest req,String userid);
}
