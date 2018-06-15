package com.yusys.warrantManager;

import java.io.IOException;
import java.io.PrintWriter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.warrantManager.IWarrantWarningService;
import com.yusys.web.BaseController;

/**
 * 控制跳转
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/WarrantWarning")
public class WarrantWarningController extends BaseController {
	@Resource
	private IWarrantWarningService  warrantWarningService;
	
	public void writeUTFJson(HttpServletResponse res,String json){
		PrintWriter writer=null;
		try {
			res.setCharacterEncoding("UTF-8"); 
			writer=res.getWriter();
			writer.write(json);
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			if (writer!=null) {
				writer.flush();
			}
		}
	}
	//查询预警
	@RequestMapping("/queryAllWarning")
	public void queryAllPlan(HttpServletRequest req,HttpServletResponse res) {
		writeUTFJson(res,JsonUtils.beanToJson(warrantWarningService.queryAllWarning(req)));
	}
	//增加或修改预警
	@RequestMapping("/newWarning")
	public void newPlan(HttpServletRequest req,HttpServletResponse res) {
		writeUTFJson(res,JsonUtils.beanToJson(warrantWarningService.newWarning(req,getUserId(req), getOrgId(req))).toLowerCase());
	}
	//删除预警
	@RequestMapping("/delWarning")
	public void deletePlan(HttpServletRequest req,HttpServletResponse res) {
		writeUTFJson(res,JsonUtils.beanToJson(warrantWarningService.delWarning(req,getUserId(req))).toLowerCase());
	}
	//查询维保异常清单
	@RequestMapping("/queryAllWarningDayException")
	public void queryAllWarningDayException(HttpServletRequest req,HttpServletResponse res) {
		writeUTFJson(res,JsonUtils.beanToJson(warrantWarningService.queryAllWarningDayException(req)));
	}
	
	
}
