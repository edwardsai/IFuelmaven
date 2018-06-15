package com.yusys.workFlow;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.web.BaseController;
import com.yusys.workFlow.WFAppBizBaseService;
import com.yusys.workFlow.WorkFlowAppDao;

@Controller
@RequestMapping("/WFApp")
	public class SWorkFlowAppController extends BaseController {
		@Resource
		private WorkFlowAppDao workFlowAppDao;
		/**
		 * 根据流程ID获取流程的操作的实例
		 * @param wf_id
		 * @return
		 */
		private WFAppBizBaseService getBizBaseService(String wf_id){
			return (WFAppBizBaseService)TaskDBUtil.getWebContext().getBean("WF"+wf_id);
		}
		
		//发起审批
		@RequestMapping("/startWFApp")
		public void queryallempinfo(HttpServletRequest req,HttpServletResponse res)	{
			String wf_id=RequestUtils.getParamValue(req, "wf_id");
			String bizId=RequestUtils.getParamValue(req, "bizId");
			String ps=RequestUtils.getParamValue(req, "ps");
			WFAppBizBaseService wfService=getBizBaseService(wf_id);
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(wfService.startWFApp(wf_id, bizId,","+ps+",",getUserId(req))));
		}
		//检查即将审批的流程节点信息
		@RequestMapping("/checkNodeInfo")
		public void checkNodeInfo(HttpServletRequest req,HttpServletResponse res)	{
			String wf_id=RequestUtils.getParamValue(req, "wf_id");
			String bizId=RequestUtils.getParamValue(req, "bizId");
			String type=RequestUtils.getParamValue(req, "type");
			String instanceid=null;
			if (wf_id==null) {
				instanceid=workFlowAppDao.queryInstanceIdByBizId(bizId);
				wf_id=workFlowAppDao.getWorkFlowIdByInstance(instanceid);
			}
			WFAppBizBaseService wfService=getBizBaseService(wf_id);
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(wfService.checkNextAppNode(wf_id, instanceid, type, bizId)));
		}
		//查询审批数据
		@RequestMapping("/queryWFAppRecord")
		public void queryWFAppRecord(HttpServletRequest req,HttpServletResponse res) {
			String instanceid=RequestUtils.getParamValue(req, "instanceid");
			String bizId=RequestUtils.getParamValue(req, "bizId");
			if ((instanceid==null||"null".equals(instanceid))
					&&(bizId!=null&&!"null".equals(bizId))) {//根据业务数据ID获取 业务数据最新的实例
				instanceid=workFlowAppDao.queryInstanceIdByBizId(bizId);
			}
			String wf_id = workFlowAppDao.getWorkFlowIdByInstance(instanceid);
			WFAppBizBaseService wfService=getBizBaseService(wf_id);
			ResponseUtils.jsonMessage(res,JsonUtils.beanListToJson(wfService.queryWFAppRecord(instanceid)));
		}
		//审批
		@RequestMapping("/appWorkFlow")
		public void appWorkFlow(HttpServletRequest req,HttpServletResponse res) {
			String app_state=RequestUtils.getParamValue(req, "app_state");
			String app_content=RequestUtils.getParamValue(req, "app_content");
			String app_person=getUserId(req);
			String bizId=RequestUtils.getParamValue(req, "bizId");
			String ps=RequestUtils.getParamValue(req, "ps");
			StringBuilder sb=new StringBuilder();
			if (bizId!=null) {
				String []bizIds=bizId.split(",");
				for (int i = 0; i < bizIds.length; i++) {
					if (!"".equals(bizIds[i].trim())) {
						String instanceId=workFlowAppDao.queryInstanceIdByBizId(bizIds[i]);
						String wf_id = workFlowAppDao.getWorkFlowIdByInstance(instanceId);
						WFAppBizBaseService wfService=getBizBaseService(wf_id);
						String result=wfService.appWorkFlow(instanceId,app_state, app_content, bizIds[i], app_person,","+ps+",");
						if (result!=null) {
							sb.append(result+" ");
						}
					}
				}
			}
			Map<String, String> smap=new HashMap<String, String>();
			smap.put("result", sb.toString());
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(smap));
		}
		//打开审批详细页面
		@RequestMapping("/openWFAppDetailPage")
		public void openWFAppDetailPage(HttpServletRequest req,HttpServletResponse res) {
			req.setAttribute("title", RequestUtils.getParamValue(req, "title"));
			req.setAttribute("title_list", RequestUtils.getParamValue(req, "title_list"));
			req.setAttribute("tabnum", RequestUtils.getParamValue(req, "tabnum"));
			req.setAttribute("backurl", RequestUtils.getParamValue(req, "backurl"));
			req.setAttribute("url", RequestUtils.getParamValue(req, "url"));
			req.setAttribute("bizId", RequestUtils.getParamValue(req, "bizId"));
			req.setAttribute("instanceid", RequestUtils.getParamValue(req, "instanceid"));
			req.setAttribute("height", RequestUtils.getParamValue(req, "height"));
			req.setAttribute("userId", getUserId(req));
			toJsp(req,res,"../workFlow/workflowCommons.jsp");
		}
		//发起审批
		@RequestMapping("/findWFHistoryAppRecord")
		public void findWFHistoryAppRecord(HttpServletRequest req,HttpServletResponse res)	{
			String opt_id=RequestUtils.getParamValue(req, "bizId");
			String instanceId=workFlowAppDao.queryInstanceIdByBizId(opt_id);
			String wf_id = workFlowAppDao.getWorkFlowIdByInstance(instanceId);
			WFAppBizBaseService wfService=getBizBaseService(wf_id);
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(wfService.findWFHistoryAppRecord(opt_id)));
		}
		public void toJsp(HttpServletRequest req, HttpServletResponse res,String url){
			try {
				req.getRequestDispatcher(url).forward(req, res);
			} catch (ServletException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		//插入第一个节点审批人到数据库表
		@RequestMapping("/insertNextAppPerson")
		public void insertNextAppPerson(HttpServletRequest req,HttpServletResponse res)	{
			String bizId=RequestUtils.getParamValue(req, "bizId");
			String wf_id=RequestUtils.getParamValue(req, "wf_id");
			WFAppBizBaseService wfService=getBizBaseService(wf_id);
			String ps=RequestUtils.getParamValue(req, "ps");
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(wfService.insertNextAppPerson(wf_id, bizId,","+ps+",")));
		}
		
}