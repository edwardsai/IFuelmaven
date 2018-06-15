package com.yusys.workFlow;

import java.util.List;
import java.util.Map;

public interface WorkFlowNodeDao {
	//查询流程下所有节点
	public List<Map<String,Object>> queryAllNode4WF(Map<String,Object> map);
	//根据条件查询对应的节点信息
	public List<Map<String,Object>> queryOneNodeInfo(Map<String,String> map);
	//插入一个节点
	public void addNodeInfo(Map<String,String> map);
	//更新一个节点信息
	public void updateNodeInfo(Map<String,String> map);
	//根据选择的id删除该节点
	public void deleteNodeInfo(Map<String,String> map);
	//根据选择的id修改该节点状态为停用
	public void updateNodeStateById(Map<String,String> map);
}
