package com.yusys.workFlow;

import java.util.List;
import java.util.Map;

public interface WFBgrChkMgrSubmitChkDao {
	
	//根据节点ID找到规则表达式
	public String queryRulerExpByNodeId(String bizId);
	//查询计划业务数据
	public Map<String, String> queryWFBgrChkPlanBizData(String id);
	//根据id修改计划对应信息审批状态
	public void updateBgrChkPlanSttById(Map<String,String> map);
	//查询所有用户编号
	public String[] queryAllUserNo(Map<String,Object> map);
	//查询所有用户
	public List<Map<String, String>> queryAllUser(Map<String,Object> map);
	//通过流程实例id获取审批过程信息
	public List<Map<String,Object>> queryAppIdByInstId(Map<String,Object> map);
	//根据id修改对应信息的当前审批人 
	public void updateBgrReportChkPersonById(Map<String,String> map);

}
