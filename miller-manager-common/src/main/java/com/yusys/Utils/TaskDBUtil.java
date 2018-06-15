package com.yusys.Utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import com.yusys.dao.SUtilDao;

@Service
@Transactional
public class TaskDBUtil {
	@Resource
	private SUtilDao utilDao;
	/**
	 * spring容器
	 */
	private static WebApplicationContext wac;
	/**
	 * 获取spring 的 web容器
	 * 
	 * @return
	 */
	public static synchronized WebApplicationContext getWebContext() {
		if (wac == null) {
			wac = ContextLoader.getCurrentWebApplicationContext();
		}
		return wac;
	}
	/**
	 * 获取序列的值
	 * @param seqName
	 * @return
	 */
	public  String getSequenceValByName(String seqName){
		Map<String, String> mseq=new HashMap<String, String>();
		mseq.put("name", seqName);
		return utilDao.findSenqunceByName(mseq);
	}
	/**
	 * 获取用户的名称
	 * @return
	 */
	public String getUserNames(List<String> list){
		List<Map<String, String>> lmap=getUsers(list);
		StringBuilder sb=new StringBuilder();
		if (lmap!=null&&lmap.size()>0) {
			sb.append(lmap.get(0).get("USER_NAME"));
			for (int i = 1; i < lmap.size(); i++) {
				sb.append(","+lmap.get(i).get("USER_NAME"));
			}
		}
		return sb.toString();
	}
	/**
	 * 获取用户的名称
	 * @return
	 */
	public String getUserNames(String[] ars){
		List<String> list=new ArrayList<String>();
		Collections.addAll(list, ars);
		return getUserNames(list);
	}
	/**
	 * 获取多个用户
	 * @param list
	 * @return
	 */
	public List<Map<String, String>> getUsers(List<String> list){
		return utilDao.queryUsersByIds(list);
	}
	public static String getUUID(){
		UUID uuid = UUID.randomUUID();
        return uuid.toString().replace("-", "");
	}
}
