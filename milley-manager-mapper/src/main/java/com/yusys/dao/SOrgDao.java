package com.yusys.dao;

import java.util.List;
import java.util.Map;

import com.yusys.common.SOrg;

public interface SOrgDao {
	//查询树状结构
	public List<Map<String, String>> queryOrgTreeList(Map<String,String> map);
	//创建机构
	public void insertNewOrg(Map<String, String> map);
	//通过序号查询详细信息
	public SOrg findOrgByOrgNo(String org_code);
	//保存部门修改信息
	public void updateOrg(Map<String, String> map);
	//删除(修改标记位)
	public void deleteOrgInfo(Map<String, String> map);
	//根据用户编码查询出该用户的所有角色	
    public List<Map<String, String>> findAllOrgById(Map<String, String> map);
    //查询所有机构
    public List<Map<String, String>> findAllOrg(Map<String, String> map);
}
