package com.yusys.workFlow;

import java.util.List;
import java.util.Map;

public interface WorkFlowAppDao {
	/**
	 * 根据审批流程ID获取审批规则的节点数据
	 * @return
	 */
	public List<Map<String, String>> queryWFProcessNodesInfo(String p_id);
	/**
	 * 查询流程矩阵
	 * @param wf_id
	 * @return
	 */
	public List<Map<String, String>> queryWFMatrixByWFId(String wf_id);
	/**
	 * 
	 * @param m_id
	 * @return
	 */
	public List<Map<String, String>> queryWFProcessByMId(String m_id);
	/**
	 * 检查业务数据的状态
	 * @param opt_id
	 * @return
	 */
	public List<Map<String, String >> checkBizIdState(String opt_id);
	/**
	 * 增加流程实例
	 * @param map
	 */
	public void addWFInstance(Map<String, String> map);
	/**
	 * 已经审批过的审批信息
	 * @param instance_id
	 * @return
	 */
	public List<Map<String, String >> queryAppedProcessInfo(String instance_id);
	/**
	 * 当前审批节点中的审批人员信息 
	 * @param instance_id
	 * @return
	 */
	public List<Map<String, String >> queryAppingPersonInfo(String instance_id);
	/**
	 * 待审批的节点信息
	 * @param instance_id
	 * @return
	 */
	public List<Map<String, String >> queryNoAppNodesInfo(Map<String, String > map);
	/**
	 * 根据流程实例获取流程ID
	 * @param instance_id
	 * @return
	 */
	public String getWorkFlowIdByInstance(String instance_id);
	/**
	 * 根据业务ID查询最新的流程实例
	 * @param opt_id
	 * @return
	 */
	public String queryInstanceIdByBizId(String opt_id);
	/**
	 * 检查审批权限
	 * @param map
	 * @return
	 */
	public Map<String, String> checkWFAppPerm(Map<String, String > map);
	/**
	 * 根据审批过程数据增加流程审批记录数据
	 */
	public void addWFAppRecordByProcess(Map<String, String > map);
	/**
	 * 增加流程审批记录数据
	 */
	public void addWFAppRecord(Map<String, String > map);
	
	/**
	 * 删除流程审批过程记录
	 */
	public void deleteWFAppProcessRecord(Map<String, String > map);
	/**
	 * 修改流程实例状态
	 */
	public void updateWFInstanceState(Map<String, String > map);	
	/**
	 * 增加审批过程记录
	 * @param map
	 */
	public void addWFAppProcessRecord(Map<String, String > map);
	/**
	 * 根据审批过程数据中的 流程实例ID和审批人 获取审批节点信息
	 * @param map
	 * @return
	 */
	public Map<String, String> queryWFNodeInfoByProcess(Map<String, String > map);
	/**
	 * 查询流程历史审批记录
	 * @param opt_id
	 * @return
	 */
	public List<Map<String, String>> findWFHistroyAppRecord(String opt_id);
	
	/**
	 * 查询审批角色的名称
	 * @param role_id
	 * @return
	 */
	public String findWFAppRoleName(String role_id);
	/**
	 * 根据流程ID查询业务数据ID
	 * @param instance_id
	 * @return
	 */
	public String findOptIdByInstance(String instance_id);
}
