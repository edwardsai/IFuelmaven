package com.yusys.interfaces;


import java.util.Map;


import com.yusys.interfaces.CommonInterfaceCompenent;
import com.yusys.interfaces.tranCode10001.IWechartRegistService;
import com.yusys.interfaces.tranCode10001.WechartRegistService;

import net.sf.json.JSONObject;

/**
 *
 *此接口用于微信端注册，绑定用户的微信号 
 * */

public class Interface_TranCode_10001 implements CommonInterfaceCompenent{
	
	private static IWechartRegistService wechartRegistService;
	private static final Interface_TranCode_10001 instance= new Interface_TranCode_10001();
	private Interface_TranCode_10001(){
	}
	
	public JSONObject bussinessService(JSONObject jsonObject) {
		wechartRegistService=(IWechartRegistService) WechartRegistService.getInstance().getService("wechartRegistService");
		Map<String, Object> map = wechartRegistService.wechartRegist(jsonObject);
		JSONObject obj = JSONObject.fromObject(map);
		return obj;
	}
	
	public static Interface_TranCode_10001 getInstance(){
		return instance;
	}
	
}
