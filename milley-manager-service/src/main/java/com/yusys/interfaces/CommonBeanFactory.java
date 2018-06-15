package com.yusys.interfaces;

import org.springframework.beans.factory.BeanFactory;

public class CommonBeanFactory {

	public static final String SUCCESS = "E0000";
	public static final String FAILURE = "E0001";
	public static BeanFactory beanFactory = null;
	
	public BeanFactory getBeanFactory() {  
        return beanFactory;  
    }
	
	public Object getService(String serviceName) {  
        return beanFactory.getBean(serviceName);  
    }
}
