package com.yusys.workFlow;

import java.util.List;
import java.util.Map;

public interface WFEntryDao {
	//查询人员进场业务数据
	public Map<String, String> queryWFEntryBizData(String id);
	//根据id修改人员入场申请表对应信息审批状态
	public void updateEntranceAppStaById(Map<String,String> map);
	//根据人员编号修改人员基本信息表对应信息状态
	public void updateEmpStaByNum(Map<String,String> map);
	//根据id修改对应人员信息的当前审批人 
	public void updateEmpAppPersonById(Map<String,String> map);
	//通过流程实例id获取审批过程信息
	public List<Map<String,Object>> queryAppIdByInstId(Map<String,Object> map);
	//通过ID查询人员信息
	public Map<String, String> queryEmpinfobyid(Map<String, String> map);
}
