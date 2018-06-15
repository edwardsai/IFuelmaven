package com.yusys.consumableManager;

import java.io.IOException;
import java.io.PrintWriter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.consumableManager.IStatisticsConsumableSuppliesService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/StatisticsConsumableSupplies")
public class StatisticsConsumableSuppliesController extends BaseController{
	@Resource
	private IStatisticsConsumableSuppliesService StatisticsService;
	
	//解决响应字符乱码
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
	
	    //查询耗材预警统计
		@RequestMapping("/queryAllStatistics")
		public void queryAllPlan(HttpServletRequest req,HttpServletResponse res) {
			writeUTFJson(res,JsonUtils.beanToJson(StatisticsService.queryAllStatistics(req)));
		}
		//增加或修改耗材预警统计
		@RequestMapping("/newStatistics")
		public void newPlan(HttpServletRequest req,HttpServletResponse res) {
			writeUTFJson(res,JsonUtils.beanToJson(StatisticsService.newStatistics(req,getUserId(req), getOrgId(req))).toLowerCase());
		}
		//删除耗材预警统计
		@RequestMapping("/delStatistics")
		public void deletePlan(HttpServletRequest req,HttpServletResponse res) {
			writeUTFJson(res,JsonUtils.beanToJson(StatisticsService.delStatistics(req,getUserId(req))).toLowerCase());
		}
	
}
