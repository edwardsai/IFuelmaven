package com.yusys.workFlow;

import groovy.lang.Binding;
import groovy.lang.GroovyShell;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.workFlow.WorkFlowAppDao;

/**
 * 流程业务操作的父类
 * @author Administrator
 *
 */
public abstract class WFAppBizBaseService {
	
	@Resource
	private WorkFlowAppDao workFlowAppDao;
	
	/**
	 * 检查下一个个审批节点
	 *
	 */
	public Map<String, Object> checkNextAppNode(String wf_id,String instanceId,String type,String bizId){
		String[] bizIds=bizId.split(",");
		if ("start".equals(type)) {//发起时的检查 
			return starWFCheckNode(wf_id,bizIds);
		}else if ("process".equals(type)) {//审批中的检查 
			return appWFCheckNode(bizId,instanceId);
		}
		return new HashMap<String, Object>();
	}
	
	/**
	 * 发起时检查下一流程节点
	 * @param wf_id
	 * @param bizIds
	 * @return
	 */
	private Map<String, Object> starWFCheckNode(String wf_id,String[]bizIds){
		Map<String, Object> sMap=new HashMap<String, Object>();
		for (int i = 0; i < bizIds.length; i++) {
			if(!"".equals(bizIds[i].trim())){
				List<Map<String, String>> bizState=workFlowAppDao.checkBizIdState(bizIds[i]);
				if (bizState!=null&&bizState.size()>0) {
					sMap.put("result", "false");
					sMap.put("msg", "数据["+bizIds[i]+"]已经发起流程!");
					return sMap;
				}
			}
		}
		
		for (int i = 0; i < bizIds.length; i++) {
			if(!"".equals(bizIds[i].trim())){
				Map<String, String> wfAppBizData=getWFAppBizData(bizIds[i]);
				List<Map<String, String>> matrixs=workFlowAppDao.queryWFMatrixByWFId(wf_id);
				if (matrixs!=null&&matrixs.size()>0) {
					String m_id=getMatrixId(matrixs,wfAppBizData);
					List<Map<String, String>> process=workFlowAppDao.queryWFProcessByMId(m_id);
					String p_id=getProcessId(process,wfAppBizData);
					List<Map<String, String>> nodes=workFlowAppDao.queryWFProcessNodesInfo(p_id);
					List<Map<String, String>> nodeAppPersons=getNodeAppPerson(bizIds[i],nodes.get(0).get("N_ID"));		
					if (nodeAppPersons.size()>1&&("02".equals(nodes.get(0).get("N_V_TYPE"))
							||"00".equals(nodes.get(0).get("N_TYPE")))) {//当取值类型为范围值,并且审批人为多个，或者单人审批 返回的审批人为多个
						sMap.put("rows", addRoleNameToListMap(nodeAppPersons,"role_id"));//
						sMap.put("ntype", nodes.get(0).get("N_TYPE"));
						return sMap;
					}
				}
			}
		}
		return sMap;
	}
	
	/**
	 * 审批时检查下一节点
	 * @param instanceid
	 * @return
	 */
	private Map<String, Object> appWFCheckNode(String bizId,String instanceid) {
		Map<String, Object> smap=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("instance_id", instanceid);
		List<Map<String, String>> noAppNodesInfo=workFlowAppDao.queryNoAppNodesInfo(pmap);
		if (noAppNodesInfo.size()<=0) {
			return smap;
		}
		Map<String, String> node=noAppNodesInfo.get(0);
		if(null==bizId||"null".equals(bizId.trim())){
			bizId=workFlowAppDao.findOptIdByInstance(instanceid);
		}
		List<Map<String, String>> nodeAppPersons=getNodeAppPerson(bizId,node.get("N_ID"));
		List<Map<String, String>> persons=workFlowAppDao.queryAppingPersonInfo(instanceid);
		//为当前审批节点的最后一位审批人时
		if (persons.size()==1&&nodeAppPersons.size()>1&&("02".equals(node.get("N_V_TYPE"))
				||"00".equals(node.get("N_TYPE")))) {//当取值类型为范围值,并且审批人为多个，或者单人审批 返回的审批人为多个
			smap.put("rows", addRoleNameToListMap(nodeAppPersons,"role_id"));
			smap.put("ntype", node.get("N_TYPE"));
			return smap;
		}
		return smap;
	}
	/**
	 * 将角色名称 放入到List<Map>中
	 * @param lmap
	 * @return
	 */
	private List<Map<String, String>> addRoleNameToListMap(List<Map<String, String>> lmap,String key){
		if (key==null) {
			key="role_id";
		}
		for (int i = 0; i < lmap.size(); i++) {
			if (lmap.get(i).get(key)==null||"".equals(lmap.get(i).get(key)==null)) {
				continue;
			}
			String role_name=workFlowAppDao.findWFAppRoleName(lmap.get(i).get(key));
			lmap.get(i).put("role_name", role_name);
		}
		return lmap;
	}
	
	/**
	 * 发起流程
	 * @param wf_id 流程ID
	 * @param bizId 业务ID
	 */
	public Map<String, String> startWFApp(String wf_id,String bizId,String ps,String userid){
		Map<String, String> sMap=new HashMap<String, String>();
		String[] bizIds=bizId.split(",");
		/**
		 * 检测流程发起情况
		 */
		for (int i = 0; i < bizIds.length; i++) {
			if(!"".equals(bizIds[i].trim())){
				List<Map<String, String>> bizState=workFlowAppDao.checkBizIdState(bizIds[i]);
				if (bizState!=null&&bizState.size()>0) {
					sMap.put("result", "false");
					sMap.put("msg", "数据["+bizIds[i]+"]已经发起流程!");
					return sMap;
				}
			}
		}
		/**
		 * 发起流程
		 */
		for (int i = 0; i < bizIds.length; i++) {
			if(!"".equals(bizIds[i].trim())){
				Map<String, String> wfAppBizData=getWFAppBizData(bizIds[i]);
				List<Map<String, String>> matrixs=workFlowAppDao.queryWFMatrixByWFId(wf_id);
				if (matrixs!=null&&matrixs.size()>0) {
					String m_id=getMatrixId(matrixs,wfAppBizData);
					List<Map<String, String>> process=workFlowAppDao.queryWFProcessByMId(m_id);
					String p_id=getProcessId(process,wfAppBizData);
					String instanceid=TaskDBUtil.getUUID();
					addWFInstance(wf_id,instanceid,p_id,bizIds[i],userid);
					addOneAppRecord(userid,instanceid);
					addWFAppProcessData(bizIds[i],instanceid,ps);//增加审批数据到审批过程表
				}
			}
		}
		sMap.put("result", "true");
		return sMap;
	}
	
	/**
	 * 插入选中的当前审批人到对应数据表中
	 * @param bizId 业务数据的ID(发起流程的数据ID)
	 * @param ps	选择节点人时被选中的节点id,选择多个时id之间逗号隔开
	 * @param 流程id
	 */
	public abstract Map<String,String> insertNextAppPerson(String wf_id,String bizId,String ps);
	
	private void addOneAppRecord(String app_person,String instanceId){
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("id", TaskDBUtil.getUUID());
		pmap.put("n_id", "s1211p");
		pmap.put("app_person", app_person);
		pmap.put("app_state", "00");
		pmap.put("app_content", "");
		pmap.put("instance_id", instanceId);
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		pmap.put("n_name", "发起人");
		workFlowAppDao.addWFAppRecord(pmap);
	}
	/**
	 * 流程发起时 增加审批数据到审批过程表
	 * @param instanceid 
	 * @param ps 流程发起或者审批时选择的人员
	 */
	private void addWFAppProcessData(String bizId,String instanceid,String ps){
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("instance_id", instanceid);
		List<Map<String, String>> noAppNodesInfo=workFlowAppDao.queryNoAppNodesInfo(pmap);
		if (bizId==null||"null".equals(bizId.trim())) {
			bizId=workFlowAppDao.findOptIdByInstance(instanceid);
		}
		List<Map<String, String>> nodeAppPersons=getNodeAppPerson(bizId,noAppNodesInfo.get(0).get("N_ID"));		
		if (nodeAppPersons.size()>0&&"02".equals(noAppNodesInfo.get(0).get("N_V_TYPE"))) {//当取值类型为范围值,并且
			
		}
		insertDataToAppProcess(instanceid,noAppNodesInfo.get(0).get("N_ID"),noAppNodesInfo.get(0).get("N_NAME"),nodeAppPersons,ps);
	}
	
	/**
	 * 获取 节点审批人
	 * @param bizId 业务数据的ID(发起流程的数据ID)
	 * @param nid	节点ID
	 * @return [{uname,userid}];
	 */
	public abstract List<Map<String, String>> getNodeAppPerson(String bizId,String nid);
	/**
	 * 获取流程的 业务数据 
	 * @param bizId 业务ID
	 * @return
	 */
	public abstract Map<String, String> getWFAppBizData(String bizId);
	
	/**
	 * 查询 流程审批 记录 
	 * @param instanceId 流程实例ID
	 * @return
	 */
	public List<Map<String, String>> queryWFAppRecord(String instance_id){
		List<Map<String, String>> slist=new ArrayList<Map<String,String>>();
		//查询已经审批过了的审批信息
		List<Map<String, String>> processed=workFlowAppDao.queryAppedProcessInfo(instance_id);
		slist.addAll(addRoleNameToListMap(processed,"ROLE_ID"));
		//查询审批中的审批信息
		List<Map<String, String>> persons=workFlowAppDao.queryAppingPersonInfo(instance_id);
		slist.addAll(addRoleNameToListMap(persons,"ROLE_ID"));
		
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("instance_id", instance_id);
		String bizId=workFlowAppDao.findOptIdByInstance(instance_id);
		//查询未审批的节点
		List<Map<String, String>> noProcess=workFlowAppDao.queryNoAppNodesInfo(pmap);
		for (int i = 0; i < noProcess.size(); i++) {
			List<Map<String, String>> ulist=getNodeAppPerson(bizId,noProcess.get(i).get("N_ID"));
			for (int j = 0; j < ulist.size(); j++) {
				Map<String, String> map=new HashMap<String, String>();
				map.put("N_ID", noProcess.get(i).get("N_ID"));
				map.put("N_NAME", noProcess.get(i).get("N_NAME"));
				if (ulist.get(j).containsKey("role_id")) {
					map.put("role_name", workFlowAppDao.findWFAppRoleName(ulist.get(j).get("role_id")));
				}
				map.put("APP_PERSON",  ulist.get(j).get("userid"));
				map.put("PERSON_NAME",  ulist.get(j).get("uname"));
				slist.add(map);
			}
		}
		return slist;
	}
	/**
	 * 获取当前审批节点信息
	 * @param instanceid
	 * @param app_person
	 * @return
	 */
	public Map<String, String> getCurrentAppNodeInfo(String instanceid,String app_person){
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("instance_id", instanceid);
		pmap.put("app_person", app_person);
		return workFlowAppDao.queryWFNodeInfoByProcess(pmap);
	}
	/**
	 * 审批流程
	 * @return
	 */
	public String appWorkFlow(String instanceid,String app_state,String app_content,String bizId,String app_person,String ps){
		Map<String, String> nodeInfo=getCurrentAppNodeInfo(instanceid,app_person);
		boolean isMoreCommon=false;//是否为多人并行
		if("02".equals(nodeInfo.get("N_TYPE"))){
			isMoreCommon=true;
		}
		if ("00".equals(app_state)) {//同意 
			return wfAppPass(isMoreCommon,instanceid,bizId,app_content,app_person,ps);
		}else if ("01".equals(app_state)) {//拒绝
			return wfAppReject(instanceid,bizId,app_content,app_person);
		}else if ("02".equals(app_state)) {//拿回
			
		}else{
			try {
				throw new Exception("报错");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return null;
	}
	
	/**
	 * 批准
	 * @param instanceId
	 * @param nId 审批节点
	 */
	private String wfAppPass(boolean ismoreCommon,String instanceid,String bizId,String app_content,String app_person,String ps){
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("instance_id", instanceid);
		pmap.put("app_person", app_person);
		Map<String, String> smap=workFlowAppDao.checkWFAppPerm(pmap);
		if (smap==null||smap.size()==0) {
			return "您没有审批数据["+bizId+"]的权限";
		}
		pmap.put("app_state", "00");
		pmap.put("app_content", app_content==null?"":app_content);
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		workFlowAppDao.addWFAppRecordByProcess(pmap);
		if (null==bizId||"null".equals(bizId.trim())) {
			bizId=workFlowAppDao.findOptIdByInstance(instanceid);
		}
		if (ismoreCommon) {//如果 单人审批或者是多人并行审批 只删除当前审批人的审批过程数据
			workFlowAppDao.deleteWFAppProcessRecord(pmap);
		}else{//如果是多人竞争 清空该流程节点的审批过程数据
			pmap.remove("app_person");//先移除 审批人
			workFlowAppDao.deleteWFAppProcessRecord(pmap);
			pmap.put("app_person", app_person);
		}
		List<Map<String, String>> noProcess=workFlowAppDao.queryNoAppNodesInfo(pmap);
		List<Map<String, String>> persons=workFlowAppDao.queryAppingPersonInfo(instanceid);
		if (noProcess==null||noProcess.size()==0) {//流程完成 
			//if (persons.size()==1&&(noProcess==null||noProcess.size()==0)) {//流程完成 
			pmap.put("state", "01");
			workFlowAppDao.updateWFInstanceState(pmap);
			wfSuccess(instanceid,bizId);
		}else if(!(noProcess==null||noProcess.size()==0)){//插入 新的节点数据到 审批过程表
			List<Map<String, String>> nodeAppPersons=getNodeAppPerson(bizId,noProcess.get(0).get("N_ID"));
			insertDataToAppProcess(instanceid,noProcess.get(0).get("N_ID"),noProcess.get(0).get("N_NAME"),nodeAppPersons,ps);
			wfPass(instanceid,bizId);
		}
		return "";
	}
	
	/**
	 * 拒绝
	 */
	private String wfAppReject(String instanceid,String bizId,String app_content,String app_person){
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("instance_id", instanceid);
		pmap.put("app_person", app_person);
		Map<String, String> smap=workFlowAppDao.checkWFAppPerm(pmap);
		if (smap==null||smap.size()==0) {
			return "您没有审批数据["+bizId+"]的权限";
		}
		pmap.put("app_state", "01");
		pmap.put("app_content", app_content==null?"":app_content);
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		workFlowAppDao.addWFAppRecordByProcess(pmap);
		pmap.remove("app_person");
		workFlowAppDao.deleteWFAppProcessRecord(pmap);//清空该流程的审批过程数据
		
		pmap.put("state", "01");
		workFlowAppDao.updateWFInstanceState(pmap);//修改流程实例的状态
		wfReject(instanceid,bizId);
		return "";
	}
	/**
	 * 插入新的数据到审批过程表
	 * @param instanceid
	 * @param ps
	 */
	private void insertDataToAppProcess(String instanceid,String nid,String n_name,List<Map<String, String>> nodeAppPerson,String ps){
		Map<String, String> map=new HashMap<String, String>();
		if (nodeAppPerson!=null&&nodeAppPerson.size()>0) {
			for (int i = 0; i < nodeAppPerson.size(); i++) {
				String userid=nodeAppPerson.get(i).get("userid");
				String role_id=nodeAppPerson.get(i).get("role_id");
				role_id=(role_id==null?"":role_id);
				if (ps!=null&&ps.indexOf(","+userid+",")!=-1) {
					map.put("id", TaskDBUtil.getUUID());
					map.put("n_id", nid);
					map.put("n_name", n_name);
					map.put("role_id", role_id);
					map.put("app_person", nodeAppPerson.get(i).get("userid"));
					map.put("instance_id", instanceid);
					workFlowAppDao.addWFAppProcessRecord(map);
				}else if(ps==null){
					map.put("id", TaskDBUtil.getUUID());
					map.put("n_id", nid);
					map.put("n_name", n_name);
					map.put("role_id", role_id);
					map.put("app_person", nodeAppPerson.get(i).get("userid"));
					map.put("instance_id", instanceid);
					workFlowAppDao.addWFAppProcessRecord(map);
				}
			}
		}else{//节点审批人取数失败
			map.put("id", TaskDBUtil.getUUID());
			map.put("n_id", nid);
			map.put("n_name", n_name);
			map.put("role_id", "");
			map.put("app_person", "0");
			map.put("instance_id", instanceid);
			workFlowAppDao.addWFAppProcessRecord(map);
		}
	}
	/**
	 * 查询流程历史审批记录
	 * @param opt_id
	 * @return
	 */
	public Map<String, Object> findWFHistoryAppRecord(String opt_id){
		Map<String, Object> smap=new HashMap<String, Object>();
		try {
			List<Map<String, String>> lmap=workFlowAppDao.findWFHistroyAppRecord(opt_id);
			smap.put("total", lmap.size());
			smap.put("rows", lmap);
			return smap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new HashMap<String,Object>();
	}
	/**
	 * 成功
	 * @param instanceId
	 * @param appNId
	 */
	public abstract void wfSuccess(String instanceId,String bizId);
	
	/**
	 * 流程被拒绝
	 * @param instanceId
	 * @param appNId
	 */
	public abstract void wfReject(String instanceId,String bizId);
	/**
	 * 流程被批准
	 * @param instanceId
	 * @param appNId
	 */
	public abstract void wfPass(String instanceId,String bizId);
	
	/**
	 * 增加流程实例
	 * @return
	 */
	private void addWFInstance(String wf_id,String instanceid,String p_id,String bizId,String userid){
		Map<String, String> smap=new HashMap<String, String>();
		smap.put("instance_id", instanceid);
		smap.put("state", "00");
		smap.put("wf_id", wf_id);
		smap.put("p_id", p_id);
		smap.put("opt_id", bizId);
		smap.put("opt_person", userid);
		smap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		workFlowAppDao.addWFInstance(smap);
	}
	
	/**
	 * 获取矩阵ID
	 * @param matrixs
	 * @param wfAppBizData
	 * @return
	 */
	private String getMatrixId(List<Map<String, String>> matrixs,Map<String, String> wfAppBizData){
		if (matrixs.size()==1) {//如果流程下只有 一个矩阵 则走该矩阵
			return matrixs.get(0).get("M_ID");
		}
		for (int i = 0; i <matrixs.size(); i++) {
			Binding bind = new Binding();
			GroovyShell shell = new GroovyShell(bind);
			String r_exp=compileExp(matrixs.get(i).get("R_EXP"), wfAppBizData);
			Object obj = shell.evaluate("str ="+r_exp);
			if ("true".equals(obj+"")) {
				return matrixs.get(i).get("M_ID");
			}
		}
		return null;
	}
	
	/**
	 * 获取矩阵下的 流程ID
	 * @param process
	 * @param wfAppBizData
	 * @return
	 */
	private String getProcessId(List<Map<String, String>> process,Map<String, String> wfAppBizData){
		if (process.size()==1) {//如果矩阵下只有一个审批流程 则走该审批流程
			return process.get(0).get("P_ID");
		}
		for (int i = 0; i <process.size(); i++) {
			Binding bind = new Binding();
			GroovyShell shell = new GroovyShell(bind);
			String r_exp=compileExp(process.get(i).get("R_EXP"), wfAppBizData);
			Object obj = shell.evaluate("str ="+r_exp);
			if ("true".equals(obj+"")) {
				return process.get(i).get("P_ID");
			}
		}
		return null;
	}
	/**
	 * 将表达式转换成 执行语句 
	 * @param r_exp
	 * @param map
	 * @return
	 */
	private String compileExp(String r_exp,Map<String, String> map){
		r_exp=r_exp.replace(" ", "");
		r_exp=r_exp.replace("\n", "");
		byte[]r_exps=r_exp.getBytes();
		List<String> names=new ArrayList<String>();
		List<Integer> lbs=new ArrayList<Integer>();
		boolean isgetName=false;
		for (int i = 0; i < r_exps.length; i++) {
			if (r_exps[i]==36) {
				if (!isgetName) {
					isgetName=true;
					continue;
				}else{
					isgetName=false;
					byte []bs=new byte[lbs.size()];
					for (int j = 0; j < lbs.size(); j++) {
						bs[j]=Byte.parseByte(lbs.get(j)+"");
					}
					lbs.clear();
					names.add(new String(bs));
				}
			}
			if (isgetName) {
				lbs.add((int) r_exps[i]);
			}
		}
		
		for (int i = 0; i < names.size(); i++) {
			String v=map.get(names.get(i).toUpperCase());
			if (!isChangeToInt(v)&&!isChangeToDouble(v)) {
				r_exp=r_exp.replace("$"+names.get(i)+"$", "'"+v+"'");
			}else{
				r_exp=r_exp.replace("$"+names.get(i)+"$", v);
			}
		}
		return r_exp;
	}
	/**
	 * 字符串能否转成Int
	 * @param s
	 * @return
	 */
	private boolean isChangeToInt(String s){
		try {
			Integer.parseInt(s);
			return true;
		} catch (Exception e) {
		}
		return false;
	}
	/**
	 * 字符串能否转成 double
	 * @param s
	 * @return
	 */
	private boolean isChangeToDouble(String s){
		try {
			Double.parseDouble(s);
			return true;
		} catch (Exception e) {
		}
		return false;
	}
}