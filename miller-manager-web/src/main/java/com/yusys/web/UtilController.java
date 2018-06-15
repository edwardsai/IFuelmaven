package com.yusys.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.Utils.TaskDBUtil;

@Controller
@RequestMapping("/Util")
public class UtilController extends BaseController{
	
	@Resource
	private TaskDBUtil seq;
	
	public void writeUTFJson(HttpServletResponse res,String json){
		ResponseUtils.jsonMessage(res, json);
	}
	@RequestMapping("/getSerialNumberSeq")
	public void queryAreaTreeList(HttpServletRequest req,HttpServletResponse res){
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			String seqcode=req.getParameter("seq");
			resultMap.put("seqCode",seq.getSequenceValByName(seqcode));
			resultMap.put("result","true");
				
		}catch(Exception e){
			resultMap.put("result","false");
			e.printStackTrace();
		}
		writeUTFJson(res,JsonUtils.beanToJson(resultMap));
	}

}
