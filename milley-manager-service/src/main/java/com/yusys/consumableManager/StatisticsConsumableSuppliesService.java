package com.yusys.consumableManager;

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
import com.yusys.consumableManager.StatisticsConsumableSuppliesDao;
import com.yusys.consumableManager.StatisticsConsumableSupplies;

@Service("StatisticsService")
@Transactional
public class StatisticsConsumableSuppliesService implements
		IStatisticsConsumableSuppliesService {
	@Resource
	private StatisticsConsumableSuppliesDao statisticsConsumableDao;
	@Resource
	private TaskDBUtil seq;
	@Resource
	private LogUtil logUtil;
	
	//查询所有的耗材预警统计
	public Map<String, Object> queryAllStatistics(HttpServletRequest req) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		try {
			Map<String, String> pmap = new HashMap<String, String>();
			String category_id = req.getParameter("category_id");
			if(category_id!=null&&category_id!=""){
				pmap.put("category_id",category_id);
			}
			String status = RequestUtils.getParamValue(req, "status");
			if(status!=null&&status!=""){
				pmap.put("status",status);
			}
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, String>> m=statisticsConsumableDao.queryAllStatistics(pmap);
			resultMap.put("rows", m);
			resultMap.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultMap;
	}

	//增加或修改耗材预警统计
	public Map<String, String> newStatistics(HttpServletRequest req,
			String userId, String orgId) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"STATUS","CATEGORY_ID", "ROOM_ID","MAX_NUM","MIN_NUM"};
			//非必填的参数列表
			String[] nomust=new String[]{"ID","MARKS"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				resultMap.put("msg", "缺少必填项！");
				return resultMap;
			}
			pmap.put("CREATE_NO",userId);
			pmap.put("CREATE_ORG", orgId);
			pmap.put("CREATE_DATE", DateTimeUtils.getFormatCurrentDate());
			String id=req.getParameter("ID");
			//新增	
			if(id==null||id.equals("")){
				//判断该类型的预警是否已存在 
				List<Map<String, String>> m= statisticsConsumableDao.queryStatisticsByParams(pmap);
				if(m.size()>0){
					resultMap.put("result", "false");
					resultMap.put("msg", "该仓库下此类型的预警已存在");
					return resultMap;
				}
				try{
					pmap.put("FLAG","00");//未删除
					pmap.put("ID",seq.getSequenceValByName("CG_SEQ_WARN_CONFIG"));
					statisticsConsumableDao.addStatistics(pmap);
					//插入日志
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"耗材预警统计编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_SUCC, "耗材预警统计新增",
							CommonStaticConfig.LOG_TYPE_OPT, pmap.get("ID"));
					resultMap.put("result", "true");
					resultMap.put("msg", "新增耗材预警成功！");
				}catch (Exception e) {
					e.printStackTrace();
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"耗材预警统计编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_FAIL, "耗材预警统计新增",
							CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("ID"));
					resultMap.put("result", "false");
					resultMap.put("msg", "新增失败！");
				}
			//修改
			}else{
				try{
					String category_id = req.getParameter("CATEGORY_ID");
					String room_id = req.getParameter("ROOM_ID");
					StatisticsConsumableSupplies s = statisticsConsumableDao.queryRnoAndCnoByID(id);
					if(!category_id.equals(s.getCategory_id())||!room_id.equals(s.getRoom_id())){
						//判断该类型的预警是否已存在
						List<Map<String, String>> m= statisticsConsumableDao.queryStatisticsByParams(pmap);
						if(m.size()>0){
							resultMap.put("result", "false");
							resultMap.put("msg", "该仓库下此类型的预警已存在");
							return resultMap;
						}
					}
					pmap.put("ID",id);
					statisticsConsumableDao.updateStatistics(pmap);
					//插入日志
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"耗材预警统计编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_SUCC, "耗材预警统计修改",
							CommonStaticConfig.LOG_TYPE_OPT, pmap.get("ID"));
					resultMap.put("result", "true");
					resultMap.put("msg", "修改成功！");
					resultMap.put("result", "true");
					resultMap.put("msg", "修改成功！");
				}catch (Exception e) {
					e.printStackTrace();
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"耗材预警统计编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_FAIL, "耗材预警统计修改",
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

	//删除耗材预警统计
	public Map<String, String> delStatistics(HttpServletRequest req,String userId) {
		Map<String, String> pmap = new HashMap<String, String>();
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			String id = RequestUtils.getParamValue(req, "id");
			pmap.put("id", id);
			pmap.put("flag","01");
			statisticsConsumableDao.delStatistics(pmap);
			//插入日志
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.DELETE+"耗材预警统计编号"+pmap.get("id"),
					CommonStaticConfig.RESULT_SUCC, "耗材预警统计删除",
					CommonStaticConfig.LOG_TYPE_OPT, pmap.get("id"));
			resultMap.put("result", "true");
			resultMap.put("msg", "删除成功！");
		}catch (Exception e) {
			e.printStackTrace();
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.DELETE+"耗材预警统计编号"+pmap.get("id"),
					CommonStaticConfig.RESULT_FAIL, "耗材预警统计删除",
					CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("id"));
			resultMap.put("msg", "删除失败！");
		}
		return resultMap;
	}
}
