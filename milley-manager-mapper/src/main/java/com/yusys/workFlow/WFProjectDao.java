package com.yusys.workFlow;

import java.util.List;
import java.util.Map;

public interface WFProjectDao {
	    //查询项目业务数据
		public Map<String, String> queryWFProjectData(String id);
		//根据id修改项目计划对应信息审批状态
		public void updateProjectById(Map<String,String> map);
		//通过流程实例id获取审批过程信息
		public List<Map<String,Object>> queryAppIdByInstId(Map<String,Object> map);
		//根据id修改项目应信息的当前审批人 
		public void updateProPersonById(Map<String,String> map);
}
