package com.yusys.web;

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
import com.yusys.Utils.ResponseUtils;
import com.yusys.common.SUser;
import com.yusys.dao.SUserDao;

@Controller
@RequestMapping("/report")
public class ReportController {
	@Resource
	private SUserDao userDao; 
	@RequestMapping("/userReport")
	public void userReport(HttpServletRequest req, HttpServletResponse res) {
		try {
			
			StringBuffer s=new StringBuffer();
			String url="http://"+s.append(req.getServerName()).append(":").append(req.getServerPort()).append(req.getContextPath()).toString();
			String menu_flag = req.getParameter("menu_flag");
			//根据页面菜单ID判断要找开哪个报表JSP
			String reportJspName = null;
			if("detail_report".equals(menu_flag)){
				reportJspName = "taskDetailReport.jsp";
			}else if("depart_total_report".equals(menu_flag)){
				reportJspName = "departTotalReport.jsp";
			}else if("person_total_report".equals(menu_flag)){
				reportJspName = "personTotalReport.jsp";
			}
			//获取当前用户ID
			SUser suser = (SUser) req.getSession().getAttribute("userinfo");
			SUser currUser = userDao.queryOneUser(suser.getUser_no());
			String org_no_code = currUser.getOrg_no_code();
			//报表页面
			req.setAttribute("src", url+"/"+reportJspName+"?currentUserId="+suser.getUser_no()+"&currentOrgNo="+org_no_code);
			//IFRAME布局页面
			req.getRequestDispatcher("../reportJsp/turn2report.jsp").forward(req, res);
			//req.getRequestDispatcher("/"+reportJspName+"?currentUserId="+suser.getUser_no()).forward(req, res);
		} catch (ServletException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping("/userReport2")
	public void userReport2(HttpServletRequest req, HttpServletResponse res) {
		StringBuffer s=new StringBuffer();
		String url="http://"+s.append(req.getServerName()).append(":").append(req.getServerPort()).append(req.getContextPath()).toString();
		String menu_flag = req.getParameter("menu_flag");
		//根据页面菜单ID判断要找开哪个报表JSP
		String reportJspName = null;
		if("detail_report".equals(menu_flag)){
			reportJspName = "taskDetailReport.jsp";
		}else if("depart_total_report".equals(menu_flag)){
			reportJspName = "departTotalReport.jsp";
		}else if("person_total_report".equals(menu_flag)){
			reportJspName = "personTotalReport.jsp";
		}
		//获取当前用户ID
		SUser suser = (SUser) req.getSession().getAttribute("userinfo");
		SUser currUser = userDao.queryOneUser(suser.getUser_no());
		String org_no_code = currUser.getOrg_no_code();
		//报表页面
		//req.setAttribute("src", "/yxms/"+reportJspName+"?currentUserId="+suser.getUser_no()+"&currentOrgNo="+org_no_code);
		//IFRAME布局页面
		//req.getRequestDispatcher("../reportJsp/turn2report.jsp").forward(req, res);
		
		Map<String, String> resultMap=new HashMap<String, String>();
		resultMap.put("src", "/yxms/"+reportJspName+"?currentUserId="+suser.getUser_no()+"&currentOrgNo="+org_no_code);
		resultMap.put("result", "true");
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(resultMap));
	}
}
