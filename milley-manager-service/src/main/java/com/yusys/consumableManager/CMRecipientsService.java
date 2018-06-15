package com.yusys.consumableManager;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.yusys.Utils.CommonStaticConfig;
import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.LogUtil;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.consumableManager.ICMRecipientsService;
import com.yusys.consumableManager.CMRecipientsDao;

@Service("icmrecipientsService")
public class CMRecipientsService implements ICMRecipientsService{
	@Resource
	private CMRecipientsDao cmrecipientsDao;
	@Resource
	private TaskDBUtil taskDBUtil;
	@Resource
	private LogUtil logUtil;
	@Override
	public Map<String, Object> queryAllRecipients(HttpServletRequest req,
			String userId, String org_no) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		String out_id = RequestUtils.getParamValue(req, "out_id");
		String out_status = RequestUtils.getParamValue(req, "out_status");
		String room = RequestUtils.getParamValue(req, "room");
		String start_time = RequestUtils.getParamValue(req, "start_time");
		String end_time = RequestUtils.getParamValue(req, "end_time");
		try {
			if(out_id!=null && !"".equals(out_id)){
				pmap.put("out_id","%"+out_id+"%");			
			}
			if(out_status!=null && !"".equals(out_status)){
				pmap.put("out_status",out_status);			
			}
			if(room!=null && !"".equals(room)){
				pmap.put("room",room);			
			}
			if(start_time!=null && !"".equals(start_time)){
				pmap.put("start_time",start_time);			
			}
			if(end_time!=null && !"".equals(end_time)){
				pmap.put("end_time",end_time);			
			}
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, Object>> m=cmrecipientsDao.queryAllRecipients(pmap);
			retmap.put("rows", m);
			retmap.put("total", pmap.get("total"));
			return retmap;
		} catch (Exception e) {			
			e.printStackTrace();
			return retmap;
		}
	}
	//保存耗材领用信息
	@Override
	public Map<String, String> addOrUpdateCMRecipients(HttpServletRequest req,String userId) {
		Map<String,String> resultMap = new HashMap<String,String>();
		Map<String,String> new_recordMap = new HashMap<String, String>();
		Map<String,String> cmap = new HashMap<String, String>();
		String new_records = RequestUtils.getParamValue(req,"new_records");
		String id = RequestUtils.getParamValue(req,"ID");
		String out_id = RequestUtils.getParamValue(req,"OUT_ID");
		//必填参数列表
		String[] must=new String[]{"OUT_ID","GETUSER_ORG",
				"GETUSER_NO","CREATE_USER","CREATE_DATE",
				"ROOM","CREATE_ORG"};
		//非必填的参数列表
		String[] nomust=new String[]{"DESCR"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		if (pmap==null) {
			resultMap.put("result", "false");
			return resultMap;
		}
		String obj = "";
		//把json格式字符串转成数组
		Object[] orecords = JsonUtils.jsonToObjectArray(new_records);
		try{
			//新增
			if(id==null||id.equals("")){
				try{
					pmap.put("ID",taskDBUtil.getSequenceValByName("CM_SEQ_GOOD_RECIPIENT"));
					pmap.put("OUT_STATUS","01");
					pmap.put("OUT_DATE","");
					cmrecipientsDao.addRecipientsInfo(pmap);
					//插入日志
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"耗材计划领用编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_SUCC, "耗材计划领用新增",
							CommonStaticConfig.LOG_TYPE_OPT, pmap.get("ID"));
					resultMap.put("result", "true");
				}catch (Exception e) {
					e.printStackTrace();
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"耗材计划领用编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_FAIL, "耗材计划领用新增",
							CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("ID"));
					resultMap.put("result", "false");
				}
			//修改
			}else{
				try{
					pmap.put("ID",id);
					pmap.put("OUT_STATUS","01");
					pmap.put("OUT_DATE","");
					cmrecipientsDao.updateRecipientsInfo(pmap);
					//插入日志
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"耗材计划领用编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_SUCC, "耗材计划领用修改",
							CommonStaticConfig.LOG_TYPE_OPT, pmap.get("ID"));
					resultMap.put("result", "true");
				}catch (Exception e) {
					e.printStackTrace();
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"耗材计划领用编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_FAIL, "耗材计划领用修改",
							CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("ID"));
					resultMap.put("result", "false");
				}
			}
			cmap.put("out_id", out_id);
			cmrecipientsDao.deleteRecipientsDetailInfo(cmap);
			for(int i=0;i<orecords.length;i++){
				obj = orecords[i].toString();
				//把json字符串转成map
				new_recordMap = JsonUtils.jsonToMap(obj);
				new_recordMap.put("OUT_ID",out_id);
				cmrecipientsDao.addRecipientsDetailInfo(new_recordMap);
			}
	    } catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
			resultMap.put("msg", "后台错误！");
	 }
		return resultMap;
	}
	//提交耗材领用信息
	@Override
	public Map<String, String> submitCMRecipients(HttpServletRequest req,String userId) {
		Map<String,String> resultMap = new HashMap<String,String>();
		Map<String,String> new_recordMap = new HashMap<String, String>();
		Map<String,String> cmap = new HashMap<String, String>();
		String new_records = RequestUtils.getParamValue(req,"new_records");
		String id = RequestUtils.getParamValue(req,"ID");
		String out_id = RequestUtils.getParamValue(req,"OUT_ID");
		String room = RequestUtils.getParamValue(req,"ROOM");
		//必填参数列表
		String[] must=new String[]{"OUT_ID","GETUSER_ORG",
				"GETUSER_NO","CREATE_USER","CREATE_DATE",
				"ROOM","CREATE_ORG"};
		//非必填的参数列表
		String[] nomust=new String[]{"DESCR"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		if (pmap==null) {
			resultMap.put("result", "false");
			return resultMap;
		}
		String obj = "";
		//把json格式字符串转成数组
		Object[] orecords = JsonUtils.jsonToObjectArray(new_records);
		try{
			//新增
			if(id==null||id.equals("")){
				try{
					pmap.put("ID",taskDBUtil.getSequenceValByName("CM_SEQ_GOOD_RECIPIENT"));
					pmap.put("OUT_STATUS","02");
					pmap.put("OUT_DATE",DateTimeUtils.getFormatCurrentDate());
					cmrecipientsDao.addRecipientsInfo(pmap);
					//插入日志
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"耗材领用编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_SUCC, "耗材领用新增",
							CommonStaticConfig.LOG_TYPE_OPT, pmap.get("ID"));
					resultMap.put("result", "true");
				}catch (Exception e) {
					e.printStackTrace();
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"耗材领用编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_FAIL, "耗材领用新增",
							CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("ID"));
					resultMap.put("result", "false");
				}
			//修改
			}else{
				try{
					pmap.put("ID",id);
					pmap.put("OUT_STATUS","02");
					pmap.put("OUT_DATE",DateTimeUtils.getFormatCurrentDate());
					cmrecipientsDao.updateRecipientsInfo(pmap);
					//插入日志
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"耗材领用编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_SUCC, "耗材领用修改",
							CommonStaticConfig.LOG_TYPE_OPT, pmap.get("ID"));
					resultMap.put("result", "true");
				}catch (Exception e) {
					e.printStackTrace();
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"耗材领用编号"+pmap.get("ID"),
							CommonStaticConfig.RESULT_FAIL, "耗材领用修改",
							CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("ID"));
					resultMap.put("result", "false");
				}
			}
			cmap.put("out_id", out_id);
			cmrecipientsDao.deleteRecipientsDetailInfo(cmap);
			for(int i=0;i<orecords.length;i++){
				obj = orecords[i].toString();
				//把json字符串转成map
				new_recordMap = JsonUtils.jsonToMap(obj);
				new_recordMap.put("OUT_ID",out_id);
				cmrecipientsDao.addRecipientsDetailInfo(new_recordMap);
				new_recordMap.put("ROOM",room);
				cmrecipientsDao.updateGoods_Number(new_recordMap);
			}
	    } catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
			resultMap.put("msg", "后台错误！");
	 }
		return resultMap;
	}
	//根据id查询耗材领用信息
	@Override
	public List<Map<String, Object>> queryRecipientsInfoById(
			HttpServletRequest req) {
		Map<String, Object> bmap=new HashMap<String, Object>();
		String out_id = RequestUtils.getParamValue(req,"out_id");
		String room=RequestUtils.getParamValue(req, "room");
		bmap.put("out_id",out_id);
		bmap.put("room", room);
		List<Map<String, Object>> Num = cmrecipientsDao.queryRecipientsInfoById(bmap);
		return Num;
	}
	//查询类别对应的物品信息
	@Override
	public Map<String, Object> queryAllStorageField(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		String category_id = RequestUtils.getParamValue(req, "category_id");
		String room_id = RequestUtils.getParamValue(req, "room_id");
		try {
			if(category_id!=null && !"".equals(category_id)){
				pmap.put("category_id",category_id);			
			}
			if(room_id!=null && !"".equals(room_id)){
				pmap.put("room_id",room_id);			
			}
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, Object>> m=cmrecipientsDao.queryAllStorageField(pmap);
			retmap.put("rows", m);
			retmap.put("total", pmap.get("total"));
			return retmap;
		} catch (Exception e) {			
			e.printStackTrace();
			return retmap;
		}
	}
	//删除耗材领用信息
	@Override
	public Map<String, Object> deletecmRecipients(HttpServletRequest req,String userId) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, String> pmap = new HashMap<String, String>();
		String out_id = RequestUtils.getParamValue(req, "out_id");
		pmap.put("out_id", out_id);
		try {
			cmrecipientsDao.deleteRecipientsDetailInfo(pmap);
			cmrecipientsDao.deletecmRecipients(pmap);
			//插入日志
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.DELETE+"耗材计划领用编号"+pmap.get("out_id"),
					CommonStaticConfig.RESULT_SUCC, "耗材计划领用删除",
					CommonStaticConfig.LOG_TYPE_OPT, pmap.get("out_id"));
			resultMap.put("result", "true");
		} catch(Exception e) {
			e.printStackTrace();
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.DELETE+"耗材计划领用编号"+pmap.get("out_id"),
					CommonStaticConfig.RESULT_FAIL, "耗材计划领用删除",
					CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("out_id"));
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	//确认耗材领用信息
	@Override
	public Map<String, Object> surecmRecipients(HttpServletRequest req,String userId) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, Object> pmap = new HashMap<String, Object>();
		Map<String, String> cmap = new HashMap<String, String>();
		Map<String, String> bmap = new HashMap<String, String>();
		String out_id = RequestUtils.getParamValue(req, "out_id");
		String room = RequestUtils.getParamValue(req, "room");
		pmap.put("out_id", out_id);
		try {
			List<Map<String, String>> cmRecipientsInfo = cmrecipientsDao.queryRecipientsDetailById(pmap);
			for(int i=0;i<cmRecipientsInfo.size();i++){
				bmap = cmRecipientsInfo.get(i);
				bmap.put("ROOM", room);
				Map<String, Object> goodsInfo = cmrecipientsDao.queryGoods_NumberById(bmap);
				int a = Integer.parseInt(bmap.get("GOODS_NUMBER"));
				int b = Integer.parseInt((String)goodsInfo.get("GOODS_NUM"));
				if(a>b){
					resultMap.put("result", "false");
					resultMap.put("msg", "物品数量不足，请重新选择领用数量");
					return resultMap;
				}
				cmrecipientsDao.updateGoods_Number(bmap);
			}
			cmap.put("out_status","02");
			cmap.put("out_date",DateTimeUtils.getFormatCurrentDate());
			cmap.put("out_id", out_id);
			cmrecipientsDao.updateOut_Status(cmap);
			//插入日志
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"耗材出库编号"+out_id,
					CommonStaticConfig.RESULT_SUCC, "耗材出库新增",
					CommonStaticConfig.LOG_TYPE_OPT, out_id);
			resultMap.put("result", "true");
			resultMap.put("msg", "确认成功");
		} catch(Exception e) {
			e.printStackTrace();
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"耗材出库编号"+out_id,
					CommonStaticConfig.RESULT_FAIL, "耗材出库新增",
					CommonStaticConfig.LOG_TYPE_ERROR, out_id);
			resultMap.put("result", "false");
			resultMap.put("msg", "确认失败");
		}
		return resultMap;
	}
	
}
