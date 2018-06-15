package com.yusys.workFlow;

import java.util.List;
import java.util.Map;

public interface WFEmpEvaDao {
	    //查询人员业务数据
		public Map<String, String> queryWFEmpData(String id);
		//根据id修改人员对应信息审批状态
		public void updateEmpById(Map<String,String> map);
		//通过流程实例id获取审批过程信息
		public List<Map<String,Object>> queryAppIdByInstId(Map<String,Object> map);
		//根据id修改人员对应信息的当前审批人 
		public void updateEmpPersonById(Map<String,String> map);
}
