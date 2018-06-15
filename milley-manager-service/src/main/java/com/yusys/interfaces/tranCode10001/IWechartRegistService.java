package com.yusys.interfaces.tranCode10001;

import java.util.Map;

import net.sf.json.JSONObject;

public interface IWechartRegistService {
	
	/**
     * 用户微信端用户注册验证信息
     * */
    public Map<String, Object> wechartRegist(JSONObject obj);
}
