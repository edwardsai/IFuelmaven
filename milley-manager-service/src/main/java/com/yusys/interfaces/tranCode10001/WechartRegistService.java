package com.yusys.interfaces.tranCode10001;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.JsonUtils;
import com.yusys.dao.SUserDao;
import com.yusys.common.SUser;
import com.yusys.interfaces.CommonBeanFactory;

@Service("wechartRegistService")
@Transactional
public class WechartRegistService extends CommonBeanFactory implements IWechartRegistService,BeanFactoryAware{

	@Resource
	private SUserDao sUserdao;
	
	private static WechartRegistService wechartRegistService=null;
	public WechartRegistService(){
		System.out.println("初始化了WechartRegistService#################");
	}
	@Override
	public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
		WechartRegistService.beanFactory = beanFactory; 
		
	}
	
	public static WechartRegistService getInstance() {  
        if (wechartRegistService == null) {  
        	wechartRegistService = (WechartRegistService) beanFactory.getBean("wechartRegistService");  
        }  
        return wechartRegistService;  
    }
	
	
	@Override
	public Map<String, Object> wechartRegist(JSONObject obj) {
		Map<String, String> pmap=new HashMap<String, String>();
		Map<String, String> map =new HashMap<String, String>();
		Map<String, Object> resultMap=new HashMap<String, Object>();
		try{
			String user_no = obj.get("USER_NO").toString().trim();
			String user_name = obj.get("USER_NAME").toString().trim();
			String password = obj.get("PASSWORD").toString().trim();
			if(user_no.equals("") || user_no.equals("null")){
				resultMap.put("RESULT", FAILURE);
				resultMap.put("MESSAGE", "用户编号必填!");
				return resultMap;
			}
			if(user_name.equals("") || user_name.equals("null")){
				resultMap.put("RESULT", FAILURE);
				resultMap.put("MESSAGE", "用户名必填!");
				return resultMap;
			}
			if(password.equals("") || password.equals("null")){
				resultMap.put("RESULT", FAILURE);
				resultMap.put("MESSAGE", "密码必填!");
				return resultMap;
			}
			pmap.put("user_no", user_no);
			pmap.put("user_name", user_name);
			pmap.put("password", JsonUtils.MD5Encryption(password));
			SUser user=sUserdao.findByParam(pmap);
			//判断用户和密码是否正确
			if(user==null){
				resultMap.put("RESULT", FAILURE);
				resultMap.put("MESSAGE", "用户编号、用户名或者密码错误!");
				return resultMap;
			}else{
				String wechart_no = (String) obj.get("WECHART_NO");
				//pmap.clear();
				map.put("wechart_no", wechart_no);
				SUser user2=sUserdao.findByParam(map);
				//判断微信号是否已经存在，存在则已经绑定微信号
				wechart_no = user.getWechart_no();
				//判断微信号是否已经被使用
				if(user2!=null){
					resultMap.put("RESULT", FAILURE);
					resultMap.put("MESSAGE", "该微信号已经注册!");
					return resultMap;
				}else if(null!=wechart_no&&!"".equals(wechart_no)){
					resultMap.put("RESULT", FAILURE);
					resultMap.put("MESSAGE", "该用户已经进行微信注册!");
					return resultMap;
				}else{
					//绑定微信号和用户
					pmap.put("wechart_no", (String) obj.get("WECHART_NO"));
					sUserdao.updateWechartNo(pmap);
				}
			}
			resultMap.put("RESULT", SUCCESS);
			resultMap.put("MESSAGE", "注册成功！");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
			resultMap.put("RESULT", FAILURE);
			resultMap.put("MESSAGE", "未知错误!");
			return resultMap;
	}

	
}
