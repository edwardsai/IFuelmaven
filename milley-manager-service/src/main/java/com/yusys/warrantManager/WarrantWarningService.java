package com.yusys.warrantManager;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.CommonStaticConfig;
import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.LogUtil;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.warrantManager.WarrantWarningDao;
@Service("warrantWarningService")
@Transactional
public class WarrantWarningService implements IWarrantWarningService{
	@Resource
	private WarrantWarningDao earlyWarningDao;
	@Resource
	private TaskDBUtil seq;
	@Resource
	private LogUtil logUtil;
	@Override
	public Map<String, Object> queryAllWarning(HttpServletRequest req) {
		Map<String, Object> chkPlanListMap=new HashMap<String, Object>();
		try {
			Map<String, Object> pmap = new HashMap<String, Object>();
			String WARR_CATEGORY = RequestUtils.getParamValue(req,"WARR_CATEGORY");
			if(WARR_CATEGORY!=null){
				pmap.put("WARR_CATEGORY", WARR_CATEGORY);
			}
			String WARR_TYPE=req.getParameter("WARR_TYPE");
			if(WARR_TYPE!=null){
				pmap.put("WARR_TYPE", WARR_TYPE);
			}//首页里面要求显示所有有异常的预警
			String AREA_TYPE_ARR = RequestUtils.getParamValue(req, "AREA_TYPE_ARR");
			if(AREA_TYPE_ARR!=null){
				String[] AREA_TYPE_ARR_ = AREA_TYPE_ARR.split(",");
				if(AREA_TYPE_ARR_.length > 0){
					pmap.put("AREA_TYPE_ARR_", AREA_TYPE_ARR_);
				}
			}
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, String>> m=earlyWarningDao.queryAllWarning(pmap);
			chkPlanListMap.put("rows", m);
			chkPlanListMap.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return chkPlanListMap;
	}
	//增加或修改预警
	@Override
	public Map<String, String> newWarning(HttpServletRequest req, String userId,
			String OrgId) {
		Map<String, String> resultMap=new HashMap<String, String>();
		Map<String, String> cmap=new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"WARR_CATEGORY","WARR_TYPE","ADVANCE_NOTICE_TIME",
					"BORROW_TIME","IS_USE"};
			//非必填的参数列表
			String[] nomust=new String[]{"WARNING_ID","DESCREB"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				resultMap.put("msg", "缺少必填项！");
				return resultMap;
			}
			
			pmap.put("CREATE_ID",userId);
			pmap.put("CREATE_TIME", DateTimeUtils.getFormatCurrentDate());
			String WARR_TYPE = req.getParameter("WARR_TYPE");
			String ID = req.getParameter("WARNING_ID");
			String WARR_CATEGORY = req.getParameter("WARR_CATEGORY");
			cmap.put("WARR_TYPE", WARR_TYPE);
			cmap.put("ID", ID);
			cmap.put("WARR_CATEGORY", WARR_CATEGORY);
			//判断该类型的预警是否已存在 
			int num = earlyWarningDao.queryWarningByType(cmap);
			if(num > 0){
				resultMap.put("result", "false");
				resultMap.put("msg", "该类型的预警已存在");
				return resultMap;
			}
			//新增
			if(ID==null||ID.equals("")){
				try{
					pmap.put("WARNING_ID",seq.getSequenceValByName("WRT_SEQ_WARRANT_WARNING"));
					earlyWarningDao.addWarning(pmap);
					//插入日志
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"权证预警编号"+pmap.get("WARNING_ID"),
							CommonStaticConfig.RESULT_SUCC, "权证预警新增",
							CommonStaticConfig.LOG_TYPE_OPT, pmap.get("WARNING_ID"));
					resultMap.put("result", "true");
					resultMap.put("msg", "新增预警成功！");
				}catch (Exception e) {
					e.printStackTrace();
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"权证预警编号"+pmap.get("WARNING_ID"),
							CommonStaticConfig.RESULT_FAIL, "权证预警新增",
							CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("WARNING_ID"));
					resultMap.put("result", "false");
					resultMap.put("msg", "新增失败！");
				}
			//修改
			}else{
				try{
					pmap.put("ID",ID);
					earlyWarningDao.updateWarning(pmap);
					//插入日志
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"权证预警编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_SUCC, "权证预警修改",
							CommonStaticConfig.LOG_TYPE_OPT, pmap.get("ID"));
					resultMap.put("result", "true");
					resultMap.put("msg", "修改成功！");
				}catch (Exception e) {
					e.printStackTrace();
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"权证预警编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_FAIL, "权证预警修改",
							CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("ID"));
					resultMap.put("result", "false");
					resultMap.put("msg", "修改失败！");
				}
			}
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
			resultMap.put("msg", "后台错误！");
			return resultMap;
		}
	}
	//删除了
	@Override
	public Map<String, String> delWarning(HttpServletRequest req,String userId) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String WARNING_ID = RequestUtils.getParamValue(req, "WARNING_ID");
		Map<String, String> pmap = new HashMap<String, String>();
		pmap.put("WARNING_ID", WARNING_ID);
		pmap.put("IS_USE","01");
		try{
			earlyWarningDao.delWarning(pmap);
			//插入日志
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.DELETE+"权证预警编号"+pmap.get("WARNING_ID"),
					CommonStaticConfig.RESULT_SUCC, "权证预警删除",
					CommonStaticConfig.LOG_TYPE_OPT, pmap.get("WARNING_ID"));
			resultMap.put("result", "true");
			resultMap.put("msg", "删除成功！");
		}catch (Exception e) {
			e.printStackTrace();
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.DELETE+"权证预警编号"+pmap.get("WARNING_ID"),
					CommonStaticConfig.RESULT_FAIL, "权证预警删除",
					CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("WARNING_ID"));
			resultMap.put("msg", "删除失败！");
		}
		return resultMap;
	}
	
	//查询全部异常清单
	@Override
	public Map<String, Object> queryAllWarningDayException(
			HttpServletRequest req) {
		Map<String, Object> chkPlanListMap=new HashMap<String, Object>();
		try {
			//必填参数列表
			String[] must=new String[]{"WARR_CLASSIFY","WARR_TYPE","KEY"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
			if (pmap==null) {
				chkPlanListMap.put("result", "false");
				chkPlanListMap.put("msg", "缺少必填项！");
				return chkPlanListMap;
			}
			if(pmap.get("KEY").equals("1")){//确认： 查询的是借用过期  or 权证到期
				pmap.put("TIME", "1");//只是给TIME 存个值 1无真实意义	
			}else{
				pmap.put("BORROW", "2");//只是给borrow 存个值 2无真实意义
			}
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, String>> m=earlyWarningDao.queryAllWarningDayException(pmap);
			chkPlanListMap.put("rows", m);
			chkPlanListMap.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return chkPlanListMap;
	}
}
