package com.yusys.category;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.yusys.Utils.CommonStaticConfig;
import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.LogUtil;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.category.PropertyTypeConfigDao;
import com.yusys.category.PropertyTypeConfig;

@Service("iPropertyTypeConfigService")
public class PropertyTypeConfigService implements IPropertyTypeConfigService {

	private static final Logger logger = Logger.getLogger(PropertyTypeConfigService.class);
	@Resource
	private PropertyTypeConfigDao propertyTypeConfigDao;
	@Resource
	private TaskDBUtil taskDBUtil;
	@Resource
	private LogUtil logUtil;
	/**
	 * 查询所有
	 */
	public List<Map<String, String>> queryAllCategroy(HttpServletRequest req, String userId) {
		try {
			return propertyTypeConfigDao.queryAllCategroy("aa");
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
		}
		return null;
	}
	
	//根据类型编号，查询一条类别
	public PropertyTypeConfig findOneConfigInfo(HttpServletRequest req) {
		String category_id = RequestUtils.getParamValue(req, "category_id");
		try {
			return propertyTypeConfigDao.findOneConfigInfo(category_id);
		} catch(Exception e) {
			e.printStackTrace();
			logger.error(e);
		}
		return null;
	}
	
	//添加类别配置
	public Map<String, Object> addProTypeConfig(HttpServletRequest req, String userId, String orgId) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		try {
			//必填参数列表
			String []must=new String[]{"category_id","category_name","menu_level","order_id"};
			//必填参数列表
			String []nomust=new String[]{"pre_category_id","description"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", false);
				resultMap.put("msg", "缺少必填项!");
				return resultMap;
			}
			pmap.put("category_id", pmap.get("category_id").toLowerCase());
			if(propertyTypeConfigDao.findOneConfigInfo(pmap.get("category_id"))!=null){
				resultMap.put("result", false);
				resultMap.put("msg", "类型编号重复");
				return resultMap;
			}
			
			pmap.put("create_id", userId);//创建人			
			pmap.put("create_org", orgId);//创建机构			
			pmap.put("create_date", DateTimeUtils.getFormatCurrentDate());//创建时间
			pmap.put("flag", "00");//删除标志 00未删除 01已删除
			
			//添加类别id
			String id = taskDBUtil.getSequenceValByName("CAT_SEQ_CATEGORY_CONFIG");
			pmap.put("c_id",id);
			propertyTypeConfigDao.addProTypeConfig(pmap);
			resultMap.put("result", true);
			logUtil.insertLogInfo(req, userId,CommonStaticConfig.ADD + "类别配置",
					CommonStaticConfig.RESULT_SUCC,"类别配置",
					CommonStaticConfig.LOG_TYPE_OPT, "");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
			logUtil.insertLogInfo(req, userId,CommonStaticConfig.ADD + "类别配置",
					CommonStaticConfig.RESULT_FAIL,"类别配置",
					CommonStaticConfig.LOG_TYPE_ERROR, "");
			logger.error(e);
		}
		resultMap.put("result", false);
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}

	//修改类别配置
	public Map<String, Object> updateProTypeConfig(HttpServletRequest req, String userId) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		String []must=new String[]{"old_category_id","category_id","category_name","menu_level","order_id"};
		String []nomust=new String[]{"pre_category_id","haveId","description"};
		
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		if (pmap==null) {
			resultMap.put("result", false);
			resultMap.put("msg", "缺少必填项!");
			return resultMap;
		}
		pmap.put("category_id", pmap.get("category_id").toLowerCase());
		if(!pmap.get("category_id").equals(pmap.get("old_category_id")) && propertyTypeConfigDao.findOneConfigInfo(pmap.get("category_id"))!=null){
			resultMap.put("result", false);
			resultMap.put("msg", "类型编号重复");
			return resultMap;
		}
		try {
			int gap = 0;
			if(pmap.get("pre_category_id")!=null && pmap.get("pre_category_id")!=""){
				PropertyTypeConfig supMenu = propertyTypeConfigDao.findOneConfigInfo(pmap.get("pre_category_id"));
				int supLevel=Integer.parseInt(supMenu.getMenu_level());
				int currLevel=Integer.parseInt(pmap.get("menu_level"));
				if(!pmap.get("menu_level").equals((supLevel+1)+"")){
					pmap.put("menu_level",(supLevel+1)+"");//重新设置级别 (当前级别=父的级别+1)
					gap=currLevel-supLevel+1;//科目修改前后的级别差
					pmap.put("gap", gap+"");
				}
			}
			propertyTypeConfigDao.updateProTypeConfig(pmap);
			if(!pmap.get("category_id").equals(pmap.get("old_category_id"))){
				propertyTypeConfigDao.updateChildConfigSupNo(pmap);
				//empEstimateConfigDao.updateMenuButtonMenuNo(pmap);
				//empEstimateConfigDao.updateMenuPropertyMenuNo(pmap);
			}
			
			if(gap!=0){
				propertyTypeConfigDao.updateChildConfigLevel(pmap);
			}
			
			if(pmap.get("haveId") != null && !"".equals(pmap.get("haveId"))){
				propertyTypeConfigDao.clearConfigSupNoInfo(pmap.get("haveId"));
			}
			resultMap.put("result", true);
			logUtil.insertLogInfo(req, userId,CommonStaticConfig.UPDATE + "类别配置",
					CommonStaticConfig.RESULT_SUCC,"类别配置",
					CommonStaticConfig.LOG_TYPE_OPT, pmap.get("category_id"));
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", false);
		resultMap.put("msg", "未知错误!");
		logUtil.insertLogInfo(req, userId,CommonStaticConfig.UPDATE + "类别配置",
				CommonStaticConfig.RESULT_FAIL,"类别配置",
				CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("category_id"));
		return resultMap;
	}

	//删除类别配置
	public Map<String, Object> delProTypeConfig(HttpServletRequest req,String userId) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		String category_id = RequestUtils.getParamValue(req, "category_ids");
		if (category_id == null || "".equals(category_id.trim())) {
			resultMap.put("result", false);
			return resultMap;
		}
		Map<String, Object> pmap=new HashMap<String, Object>();
		pmap.put("category_ids", category_id.split(","));
		logger.info(pmap.get("category_ids"));
		try {
			propertyTypeConfigDao.delProTypeConfig(pmap);
			propertyTypeConfigDao.delFieldInTypeConfig(pmap);
			resultMap.put("result", true);
			logUtil.insertLogInfo(req, userId,CommonStaticConfig.DELETE + "类别配置",
					CommonStaticConfig.RESULT_SUCC,"类别配置",
					CommonStaticConfig.LOG_TYPE_OPT, "");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			logUtil.insertLogInfo(req, userId,CommonStaticConfig.DELETE + "类别配置",
					CommonStaticConfig.RESULT_FAIL,"类别配置",
					CommonStaticConfig.LOG_TYPE_ERROR, "");
		}
		resultMap.put("result", false);
		return resultMap;
	}

	/**
	 * 查询所有资产类型
	 */
	public List<Map<String, String>> queryAllAssetCategroy(HttpServletRequest req, String userId) {
		try {
			return propertyTypeConfigDao.queryAllAssetCategroy("aa");
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
		}
		return null;
	}


}
