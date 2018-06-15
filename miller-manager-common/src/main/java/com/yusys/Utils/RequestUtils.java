package com.yusys.Utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public class RequestUtils {
	public static final String chartCode="GBK";
	public static final String check_code="checkCode_yx_101";
	/**
	 * 请求对象request转成map 
	 * @param req
	 * @param must   必填列表
	 * @param nomust 非必填列表
	 * @return
	 */
	public static Map<String, String> requestToMap(HttpServletRequest req,String[] must,String []nomust){
		Map<String, String> map=new HashMap<String, String>();
		String p=null;
		if (must!=null) {
			for (int i = 0; i < must.length; i++) {
				p=getParamValue(req,must[i]);
				if (p!=null&&p.trim().length()>0) {
					map.put(must[i], p);
				}else{//必填项出现 未填
					return null;
				}
			}
		}
		if (nomust!=null) {
			for (int i = 0; i < nomust.length; i++) {
				p=getParamValue(req,nomust[i]);
				if (p!=null&&p.trim().length()>0) {
					map.put(nomust[i], p);
				}else{
					map.put(nomust[i], "");
				}
			}
		}
		return map;
	}
	/**
	 * 获取参数值
	 * @param req
	 * @param paramName
	 * @return
	 */
	public static String getParamValue(HttpServletRequest req,String paramName){
		//增加传值过滤，防止sql注入
		///////////////////
		return req.getParameter(paramName);
	}
	
	/**
	 * 分页方法
	 * @param req 页面传入数据
	 * @param list 查询结果集
	 * @return
	 */
	public static List<Map<String,String>> pagination(HttpServletRequest req,List<Map<String,String>> list){
		int currentPage = req.getParameter("offset") == null ? 1 : Integer.parseInt(req.getParameter("offset"));
		int showCount = req.getParameter("limit") == null ? 10 : Integer.parseInt(req.getParameter("limit"));
		int end=currentPage+showCount;
		if(end>=list.size()){
			end=list.size();
		}
		List<Map<String,String>> pagList=list.subList(currentPage, end);
		
		return pagList;
	}
}