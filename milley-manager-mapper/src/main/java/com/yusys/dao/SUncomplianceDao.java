package com.yusys.dao;

import java.util.List;
import java.util.Map;

import com.yusys.common.SUncompliance;

public interface SUncomplianceDao {
    //查询不合格配置
	public List<Map<String,Object>> queryAllUncompliance(Map<String,Object> map);
	//新增不合格配置
	public void  UncomplianceAdd(Map<String,String> map);
	//删除不合格配置
	public void  UncomplianceDelete(Map<String,String> map);
	//修改不合格配置
	public void  UncomplianceUpdate(Map<String,String> map);
	//查询一个不合格配置
	public SUncompliance queryoneUncompliance(String id);
	//根据岗位和级别查询
	public SUncompliance queryoneUncomplianceBySL(Map<String,String> map);

}
