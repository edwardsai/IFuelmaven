package com.yusys.workFlow;

import java.util.List;
import java.util.Map;

public interface FactorsInfoDao {
	//查询业务要素表所有信息
	public List<Map<String,Object>> queryAllFactorsInfo(Map<String,Object> map);
	//向业务要素表中插入一条信息
	public void addOneFactorsInfo(Map<String,String> map);
	//向业务要素表中删除一条信息
	public void deleteOneFactorsInfo(Map<String,String> map);
	//修改一条业务要素表信息
	public void updateOneFactorsInfo(Map<String,String> map);
}
