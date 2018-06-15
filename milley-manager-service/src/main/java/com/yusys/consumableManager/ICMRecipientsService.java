package com.yusys.consumableManager;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface ICMRecipientsService {
	//查询耗材领用信息
	public Map<String,Object> queryAllRecipients(HttpServletRequest req,String userId, String org_no);
	//保存耗材领用信息
	public Map<String, String> addOrUpdateCMRecipients(HttpServletRequest req,String userId);
	//提交耗材领用信息
	public Map<String, String> submitCMRecipients(HttpServletRequest req,String userId);
	//根据id查询耗材领用信息
	public List<Map<String,Object>> queryRecipientsInfoById(HttpServletRequest req);
	//查询类别对应的物品信息
	public Map<String, Object> queryAllStorageField(HttpServletRequest req);
	//删除耗材领用信息
	public Map<String, Object> deletecmRecipients(HttpServletRequest req,String userId);
	//确认耗材领用信息
	public Map<String, Object> surecmRecipients(HttpServletRequest req,String userId);
}
