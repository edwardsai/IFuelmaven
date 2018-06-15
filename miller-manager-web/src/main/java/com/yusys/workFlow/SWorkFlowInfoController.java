package com.yusys.workFlow;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.workFlow.ISWorkFlowInfoService;

@Controller
@RequestMapping("/SWfi")
	public class SWorkFlowInfoController {

		@Resource
		private ISWorkFlowInfoService  iSWorkFlowInfoService;
		//查询所有合同信息
		@RequestMapping("/queryAllProcessInfo")
		public void queryallempinfo(HttpServletRequest req,HttpServletResponse res)	{
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.queryAllProcessInfo(req)));
		}
		//查询所有合同信息
		@RequestMapping("/addOneProcessInfo")
		public void addOneProcessInfo(HttpServletRequest req,HttpServletResponse res)	{
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.addOneProcessInfo(req)));
		}
		//根据选择的id删除流程表中该信息
		@RequestMapping("/deleteOneProcessInfo")
		public void deleteOneProcessInfo(HttpServletRequest req,HttpServletResponse res){
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.deleteOneProcessInfo(req)));
		}
		//根据选择的id修改流程表中该信息
		@RequestMapping("/updateOneProcessInfo")
		public void updateOneProcessInfo(HttpServletRequest req,HttpServletResponse res){
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.updateOneProcessInfo(req)));
		}
		//通过流程id查询流程矩阵表中所有信息
		@RequestMapping("/queryAllMatrixById")
		public void queryAllMatrixById(HttpServletRequest req,HttpServletResponse res){
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.queryAllMatrixById(req)));
		}
		//通过流程id查询节点表中对应信息
		@RequestMapping("/queryAllNode4WF")
		public void queryAllNode4WF(HttpServletRequest req,HttpServletResponse res){
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.queryAllNode4WF(req)));
		}
		//向规则表和矩阵表插入数据
		@RequestMapping("/addOneMatrixInfo")
		public void addOneMatrixInfo(HttpServletRequest req,HttpServletResponse res){
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.addInfo4RuleAndMatix(req)));
		}
		//根据id删除矩阵表信息和规则表信息
		@RequestMapping("/deleteOneMatInfo")
		public void deleteInfo4RuleAndMatix(HttpServletRequest req,HttpServletResponse res){
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.deleteInfo4RuleAndMatix(req)));
		}
		//根据id更新矩阵表信息和规则表信息
		@RequestMapping("/updateOneMatrixInfo")
		public void updateInfo4RuleAndMatix(HttpServletRequest req,HttpServletResponse res){
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.updateInfo4RuleAndMatix(req)));
		}
		//根据id查找矩阵下的审批路由信息
		@RequestMapping("/queryMatixProcessByMId")
		public void queryMatixRoteById(HttpServletRequest req,HttpServletResponse res){
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.queryMatixProcessByMId(req)));
		}
		//保存矩阵的审批规则信息
		@RequestMapping("/addApproveRuleInfo")
		public void addApproveRuleInfo(HttpServletRequest req,HttpServletResponse res){
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.addApproveRuleInfo(req,"")));
		}
		//根据规则ID删除矩阵下所有路由节点和审批规则
		@RequestMapping("/deleteMatrixRoteById")
		public void deleteMatrixRoteById(HttpServletRequest req,HttpServletResponse res){
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.deleteMatrixRoteById(req)));
		}
		
		//查询矩阵节点信息
		@RequestMapping("/queryMNodeInfos")
		public void queryMNodeInfos(HttpServletRequest req,HttpServletResponse res){
			ResponseUtils.jsonMessage(res,JsonUtils.listToJson(	iSWorkFlowInfoService.queryMatrixNodeInfos(req)));
		}
		
		//删除审批流配置信息 
		@RequestMapping("/deleteWFProcess")
		public void deleteWFProcess(HttpServletRequest req,HttpServletResponse res){
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.deleteWFProcess(req)));
		}
		//增加流程规则
		@RequestMapping("/addWFRule")
		public void addWFRule(HttpServletRequest req,HttpServletResponse res){
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(	iSWorkFlowInfoService.addWFRule(req, "admin")));
		}
	}


