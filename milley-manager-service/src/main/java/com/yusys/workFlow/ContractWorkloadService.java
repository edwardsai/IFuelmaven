package com.yusys.workFlow;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.workFlow.WFBgrChkMgrSubmitChkDao;
import com.yusys.workFlow.WFContractDao;

@Service(value="WF204")
@Transactional
public class ContractWorkloadService extends WFAppBizBaseService {
	/*@Resource
	private WFProjectDao wfProjectDao;*/
	@Resource
	private WFBgrChkMgrSubmitChkDao bgrChkMgrSubmitChkDao;
	
	@Resource
	private WFContractDao wfContractDao;
	/**
	 * 获取节点审批人 
	 */
	@Override
	public List<Map<String, String>> getNodeAppPerson(String bizId,String nid) {
		List<Map<String, String>> lmap=new ArrayList<Map<String,String>>();
		String rulerExp=bgrChkMgrSubmitChkDao.queryRulerExpByNodeId(nid);//根据节点找到规则表达式
		String roleGroup="";
		//循环取出角色编号
		while(rulerExp.indexOf("==")!=-1){//只支持规则表达式中的||和"=="
			int num = rulerExp.indexOf("==");
			int r;
			if(rulerExp.indexOf("||")!=-1){
				 r=rulerExp.indexOf("||",num);
			}else{
				r=rulerExp.length();
			}
			String textVal = rulerExp.substring(num+2,r);//获取角色编号
			if(textVal.startsWith("\"")){
				textVal=textVal.substring(1,textVal.length()-1);
			}
			if(rulerExp.indexOf("||")!=-1){//有||时,截取后面字符串再进行获取角色编号操作
				rulerExp=rulerExp.substring(r+2);
			}else{
				rulerExp=rulerExp.substring(num+2);//没||时,截取掉"=="跳出循环
			}
			roleGroup=roleGroup+textVal+",";
		}
		roleGroup=roleGroup.substring(0,roleGroup.length()-1);
		Map<String, Object> roleNoMap=new HashMap<String, Object>();
		roleNoMap.put("roleNo", roleGroup.split(","));
		String[] userNo = bgrChkMgrSubmitChkDao.queryAllUserNo(roleNoMap);//获取人员编号
		Map<String, Object> userNoMap=new HashMap<String, Object>();
		userNoMap.put("userNo", userNo);
		List<Map<String, String>> umap = bgrChkMgrSubmitChkDao.queryAllUser(userNoMap);//获取人员信息
		for(int i=0;i<umap.size();i++){
			Map<String, String> m=new HashMap<String, String>();
			m.put("userid", umap.get(i).get("USER_NO"));
			m.put("uname", umap.get(i).get("USER_NAME"));
			m.put("role_id", "1");//审批角色ID
			lmap.add(m);
		}
		return lmap;
	}
	/**
	 * 根据业务ID获取业务数据(用来支持规则表达式)
	 */
	@Override
	public Map<String, String> getWFAppBizData(String bizId) {
		return wfContractDao.queryWFContractData(bizId);
	}
	/**
	 * 当流程走完时 执行的一个操作
	 */
	@Override
	public void wfSuccess(String instanceId, String bizId) {
		//流程走完时审批状态改为通过状态
		Map<String, String> map=new HashMap<String, String>();
		map.put("examination_status", "997");//完成审核状态
		map.put("id", bizId);
		try {
			//更新审批状态
			wfContractDao.updateContractById(map);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/**
	 * 流程被打回时
	 */
	//流程被打回时，审批状态改为打回状态
	@Override
	public void wfReject(String instanceId, String bizId) {
		//流程被打回时，审批状态改为打回状态
		Map<String, String> map=new HashMap<String, String>();
		map.put("examination_status", "992");//打回状态
		map.put("id", bizId);
		try {
			//更新审批状态
			wfContractDao.updateContractById(map);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/**
	 * 流程批准
	 */
	@Override
	public void wfPass(String instanceId, String bizId) {
		Map<String, String> map=new HashMap<String, String>();
		Map<String, Object> wfmap=new HashMap<String, Object>();
		Object app_person="";
		//通过流程实例id获取流程审批人id
		wfmap.put("instance_id", instanceId);
		List<Map<String, Object>> list = wfContractDao.queryAppIdByInstId(wfmap);
		if(list.size()>0){
			for(Map<String, Object> map1:list){
				app_person = map1.get("APP_PERSON");
				map.put("id",bizId);
				map.put("curr_user_no", app_person.toString());
				System.out.println(map.get("curr_user_no"));
				//设置当前审批人
				wfContractDao.updateCurrPersonById(map);
				return;
			}
		}
	}
	
	//获取第一个审批人
	@Override
	public Map<String, String> insertNextAppPerson(String wf_id, String bizId,String ps) {
		String[] psArr=ps.split(",");
		String[] bizIdArr=bizId.split(",");//批量审批时才会有多个值
		Map<String, String> map=new HashMap<String, String>();
		try {
			for(int j=0;j<bizIdArr.length;j++){
				if(bizIdArr[j]!=null&&!"".equals(bizIdArr)){
					for(int i=0;i<psArr.length;i++){
						if(psArr[i]!=null&&!"".equals(psArr[i])){
							map.put("curr_user_no", psArr[i]);
							map.put("id", bizIdArr[j]);
							wfContractDao.updateCurrPersonById(map);
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
}
