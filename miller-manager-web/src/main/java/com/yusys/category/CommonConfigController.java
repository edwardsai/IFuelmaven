package com.yusys.category;

import javax.annotation.Resource;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/propertyFieldConfig")
public class CommonConfigController extends BaseController {

	@Resource
	private ICommonConfigService commonConfigServiceImpl;
	
	//查询所有公共字段
	@RequestMapping("/queryAllCommonField")
	public void queryAllCommonField(HttpServletRequest req,HttpServletResponse res)	{		
		String str = JsonUtils.beanToJson(commonConfigServiceImpl.queryAllCommonField(req));
		ResponseUtils.jsonMessage(res,str);		
	}
	//新增或修改公共字段信息
	@RequestMapping("/addOrUpdateField")
	public void addOrUpdateField(HttpServletRequest req,HttpServletResponse res)	{		
		String str = JsonUtils.beanToJson(commonConfigServiceImpl.addOrUpdateField(req,getUserId(req)));
		ResponseUtils.jsonMessage(res,str);		
	}
	//查询一条字段信息
	@RequestMapping("/queryOneFieldInfo")
	public void queryOneFieldInfo(HttpServletRequest req,HttpServletResponse res)	{		
		String str = JsonUtils.beanToJson(commonConfigServiceImpl.queryOneFieldInfo(req));
		ResponseUtils.jsonMessage(res,str);		
	}
	//删除一条字段信息
	@RequestMapping("/deleteField")
	public void deleteField(HttpServletRequest req,HttpServletResponse res)	{		
		String str = JsonUtils.beanToJson(commonConfigServiceImpl.deleteField(req,getUserId(req)));
		ResponseUtils.jsonMessage(res,str);		
	}
	
	
	//查询类别对应的所有公共字段
	@RequestMapping("/queryAllPrivateField")
	public void queryAllPrivateField(HttpServletRequest req,HttpServletResponse res)	{		
		String str = JsonUtils.beanToJson(commonConfigServiceImpl.queryAllPrivateField(req));
		ResponseUtils.jsonMessage(res,str);		
	}
	
}
