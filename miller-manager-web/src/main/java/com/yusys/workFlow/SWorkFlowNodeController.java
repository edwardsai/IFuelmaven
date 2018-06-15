package com.yusys.workFlow;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.workFlow.ISWorkFlowNodeService;

@Controller
@RequestMapping("/WFNode")
public class SWorkFlowNodeController {
	@Resource
	private ISWorkFlowNodeService  iSWorkFlowNodeService;
	//查询流程下所有节点
	@RequestMapping("/queryAllNode4WF")
	public void queryAllNode4WF(HttpServletRequest req,HttpServletResponse res)	{
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowNodeService.queryAllNode4WF(req)));
	}
	//插入一个节点
	@RequestMapping("/addNodeInfo")
	public void addNodeInfo(HttpServletRequest req,HttpServletResponse res)	{
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowNodeService.addNodeInfo(req)));
	}
	//更新节点
	@RequestMapping("/updateNodeInfo")
	public void updateNodeInfo(HttpServletRequest req,HttpServletResponse res)	{
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowNodeService.updateNodeInfo(req)));
	}
	//根据选择的id删除该节点
	@RequestMapping("/deleteNodeInfo")
	public void deleteNodeInfo(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowNodeService.deleteNodeInfo(req)));
	}
	//根据条件查找节点
	@RequestMapping("/queryOneNodeInfo")
	public void queryOneNodeInfo(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowNodeService.queryOneNodeInfo(req)));
	}
	//根据ID查找节点
	@RequestMapping("/queryOneNodeById")
	public void queryOneNodeById(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowNodeService.queryOneNodeById(req)));
	}
}
