/*jadclipse*/// Decompiled by Jad v1.5.8e2. Copyright 2001 Pavel Kouznetsov.

package com.yusys.Utils;

import com.yusys.common.cache.redis.RedisCache;
import com.yusys.service.SLogService.ISLogService;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service("logUtil")
@Transactional
public class LogUtil {

	@Resource
	private ISLogService logService;
	@Resource
	private RedisCache redisCache;
	
	public LogUtil() {
	}

	@SuppressWarnings("unchecked")
	public void insertLogInfo(HttpServletRequest req, String user_no,
			String memo, String result, String menu_no, String type,
			String business_id) {
		boolean flag = true;
		String logConfig = (String) redisCache.get("LOG", null);
		if (logConfig != null && logConfig.trim().length() != 0) {
			Map<String,String> logConfigMap = JsonUtils.jsonToMap(logConfig);
			if ("login".equals(type)) {
				if ("01".equals(logConfigMap.get("loginlog_state")))
					flag = false;
			} else if ("opt".equals(type)) {
				if ("01".equals(logConfigMap.get("optlog_state")))
					flag = false;
			} else if ("error".equals(type)
					&& "01".equals(logConfigMap.get("errorlog_state")))
				flag = false;
		}
		if (flag) {
			Map<String,String> pmap = new HashMap<String,String>();
			pmap.put("user_no", user_no);
			pmap.put("memo", memo);
			pmap.put("state", result);
			pmap.put("menu_no", menu_no);
			pmap.put("type", type);
			pmap.put("opt_url", req.getRequestURI().substring(1));
			pmap.put("business_id", business_id);
			logService.insertNewLog(req, pmap);
		}
	}

	
}
