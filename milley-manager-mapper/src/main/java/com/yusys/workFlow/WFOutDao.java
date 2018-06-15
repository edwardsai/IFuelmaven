package com.yusys.workFlow;

import java.util.Map;

public interface WFOutDao {
	//查询人员离场业务数据
	public Map<String, String> queryWFOutBizData(String id);
	//根据id修改人员离场申请表对应信息审批状态
	public void updateOutAppStaById(Map<String,String> map);
	//根据id修改对应人员信息的当前审批人 
	public void updateEmpAppPersonById(Map<String,String> map);
	//根据人员编号修改人员基本信息表对应信息状态
	public void updateEmpStaByNum(Map<String,String> map);
}
