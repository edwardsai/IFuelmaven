package com.yusys.Utils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * 
 * 字符串工具类
 * 
 * @author huangj
 *
 * @date 2016年8月12日  下午2:43:55
 */
public class StringUtil {
	
	/** UTF-8编码*/
	public final static String UTF8_ENCODING = "UTF-8";
	
	/** 采用UTF-8编码*/
	public static String decodeUrl(String url) {
		return decodeUrl(url, UTF8_ENCODING);
	}
	
	/**
	 * 对字符串进行URLDecoder解码
	 * 
	 * @param url 待解码的字符串
	 * @param tragetCode 编码
	 */
	public static String decodeUrl(String url, String tragetCode) {
		String decodeUrl = "";
		if(isNullOrBlank(url))  {
			return decodeUrl;
		}
		try {
			decodeUrl = URLDecoder.decode(url, tragetCode);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return decodeUrl;
	}

	/** 判断字符串是否为空*/
	public static boolean isBlank(String value) {
		boolean ret = false;
		if ((value != null) && (value.equals(""))) {
			ret = true;
		}
		return ret;
	}

	/** 判断字符串是否为null*/
	public static boolean isNull(String value) {
		return value == null;
	}

	public static boolean isNullOrBlank(String value) {
		return (isNull(value)) || (isBlank(value));
	}
	
	public static String ObjectToString(Object str) {
		try {
			if(null == str || "null".equals(str) || "".equals(String.valueOf(str))) {
				return "";
			}
			
			return String.valueOf(str).trim();
		} catch(Exception e) {
			return "";
		}
	}
	
	//把map里的转换成大写
	public static List changeToUpper(List paramList){
		List list=null;
		if(paramList!=null&&paramList.size()>0){
			list = new ArrayList<Map<String,String>>();
			for(int i=0;i<paramList.size();i++){
				Map newMap = new HashMap();
				Map map = (Map) paramList.get(i);
				Iterator<String> iter = map.keySet().iterator();
				while(iter.hasNext()){
					String key=iter.next();
					//System.out.println(key+" "+value);
					newMap.put(key.toUpperCase(), map.get(key));
					list.add(newMap);
				}
			}
		}
		return list;
	}
}
