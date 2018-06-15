package com.yusys.workFlow;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.workFlow.ISFactorsInfoService;

@Controller
@RequestMapping("/SFact")
	public class SFactorsInfoController {

		@Resource
		private ISFactorsInfoService  iSFactorsInfoService;
		//查询所有合同信息
		@RequestMapping("/queryAllFactorsInfo")
		public void queryallempinfo(HttpServletRequest req,HttpServletResponse res)	{
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSFactorsInfoService.queryAllFactorsInfo(req)));
		}
		//向业务要素表中插入一条信息
		@RequestMapping("/addOneFactInfo")
		public void addOneFactInfo(HttpServletRequest req,HttpServletResponse res)	{
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSFactorsInfoService.addOneFactorsInfo(req)));
		}
		//根据选择的id删除要素表中该信息 
		@RequestMapping("/deleteOneFactorsInfo")
		public void deleteOneFactorsInfo(HttpServletRequest req,HttpServletResponse res)	{
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSFactorsInfoService.deleteOneFactorsInfo(req)));
		}
		//修改一条业务要素表信息
		@RequestMapping("/updateOneFactorsInfo")
		public void updateOneFactorsInfo(HttpServletRequest req,HttpServletResponse res)	{
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSFactorsInfoService.updateOneFactorsInfos(req)));
		}
	}


