package com.yusys.workFlow;

import java.util.List;
import java.util.Map;

public interface WFContractDao {
	    //查询项目业务数据
		public Map<String, String> queryWFContractData(String id);
		//根据id修改项目计划对应信息审批状态
		public void updateContractById(Map<String,String> map);
		//通过流程实例id获取审批过程信息
		public List<Map<String,Object>> queryAppIdByInstId(Map<String,Object> map);
		//根据id修改项目应信息的当前审批人 
		public void updateCurrPersonById(Map<String,String> map);
}
