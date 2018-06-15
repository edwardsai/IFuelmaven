package com.yusys.category;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.yusys.Utils.CommonStaticConfig;
import com.yusys.Utils.LogUtil;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.category.CommonConfigDao;
import com.yusys.category.CommonConfig;
import com.yusys.category.PropertyTypeConfigService;

@Service("commonConfigServiceImpl")
public class CommonConfigService implements ICommonConfigService {

	private static final Logger logger = Logger.getLogger(PropertyTypeConfigService.class);
//	@Resource
//	private CommonConfigDao commonConfigDao;
	@Resource
	private TaskDBUtil taskDBUtil;
	@Resource
	private LogUtil logUtil;

	//查询所有字段
	public Map<String, Object> queryAllCommonField(HttpServletRequest req) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		String tag_id = RequestUtils.getParamValue(req, "tag_id");
		String tag_name = RequestUtils.getParamValue(req, "tag_name");
		String tag_name1 = null;
		//转码
		if(!"".equals(tag_name) && tag_name != null) {
			try {
				tag_name1 = URLDecoder.decode(tag_name, "UTF-8");
			} catch(UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		if(tag_name1 != null && !"".equals(tag_name1)) {
			pmap.put("tag_name", "%"+tag_name1+"%");
		}
		if(tag_id != null && !"".equals(tag_id)) {
			pmap.put("tag_id", "%"+tag_id+"%");
		}
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		List<Map<String, Object>> list = null;
		try {
//			list = commonConfigDao.queryAllCommonField(pmap);
			list = new ArrayList<Map<String, Object>>();
			resultMap.put("rows", list);
			resultMap.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
		}
		return resultMap;
	}

	//新增或修改字段信息
	public Map<String, Object> addOrUpdateField(HttpServletRequest req, String userId) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		String col_id = RequestUtils.getParamValue(req, "col_id");
		//必填参数列表
		String[] must=new String[]{"tag_id", "tag_name", "col_required", "tag_type",
				"max_length", "order_id","is_common"};
		//非必填的参数列表
		String[] nomust=new String[]{"dic_code", "default_value", "init_template", "category_id"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		if(col_id == "") {	//新增
			String id = taskDBUtil.getSequenceValByName("CAT_SEQ_FIELD_CONFIG");
			logger.info(id);
			pmap.put("col_id", id);
			Map<String, String> pmap2=new HashMap<String, String>();//查询改类的标签ID的map
			pmap2.put("category_id", pmap.get("category_id"));
			pmap2.put("tag_id", pmap.get("tag_id"));
//			List<Map<String, Object>> map1= commonConfigDao.queryOneFieldByTag_id(pmap2);
			List<Map<String, Object>> map1= new ArrayList<Map<String, Object>>();
			int size =map1.size();
			if(size>0){//私有ID重复
				resultMap.put("result", false);
			}else{
				try {
//					commonConfigDao.addField(pmap);
					resultMap.put("result", true);
					//插入日志
					logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"字段",
							CommonStaticConfig.RESULT_SUCC, "资产公共字段配置", CommonStaticConfig.LOG_TYPE_OPT, "");
				} catch(Exception e) {
				e.printStackTrace();
				logger.error(e);
				//插入日志
				logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"字段",
						CommonStaticConfig.RESULT_FAIL, "资产公共字段配置", CommonStaticConfig.LOG_TYPE_ERROR, "");
				}
			}
		} else {	//修改
			pmap.put("col_id", col_id);
			try {
//				commonConfigDao.updateField(pmap);
				//插入日志
				logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"字段"+pmap.get("col_id"),
						CommonStaticConfig.RESULT_SUCC, "资产公共字段配置", CommonStaticConfig.LOG_TYPE_OPT, pmap.get("col_id"));
				resultMap.put("result", true);
			} catch(Exception e) {
				e.printStackTrace();
				logger.error(e);
				//插入日志
				logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"字段"+pmap.get("col_id"),
						CommonStaticConfig.RESULT_FAIL, "资产公共字段配置", CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("col_id"));
			}
		}
		return resultMap;
	}

	//查询一条字段信息
	public CommonConfig queryOneFieldInfo(HttpServletRequest req) {
		String col_id = RequestUtils.getParamValue(req, "col_id");
		try{
//			return commonConfigDao.queryOneFieldInfo(col_id);
			return null;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e);
		}
		return null;
	}

	//删除一条字段信息
	public Map<String, Object> deleteField(HttpServletRequest req, String userId) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, String> pmap = new HashMap<String, String>();
		String col_id = RequestUtils.getParamValue(req, "col_id");
		pmap.put("col_id", col_id);
		try {
//			commonConfigDao.deleteField(pmap);
			resultMap.put("result", true);
			//插入日志
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.DELETE+"字段"+pmap.get("col_id"),
					CommonStaticConfig.RESULT_SUCC, "资产公共字段配置", CommonStaticConfig.LOG_TYPE_OPT, pmap.get("col_id"));
		} catch(Exception e) {
			e.printStackTrace();
			logger.error(e);
			//插入日志
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.DELETE+"字段"+pmap.get("col_id"),
					CommonStaticConfig.RESULT_FAIL, "资产公共字段配置", CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("col_id"));
		}
		return resultMap;
	}

	//查询类别对应的所有公共字段
	public Map<String, Object> queryAllPrivateField(HttpServletRequest req) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		String category_id = RequestUtils.getParamValue(req, "category_id");
		logger.info(category_id);
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("category_id", category_id);
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		List<Map<String, Object>> list = null;
		try {
//			list = commonConfigDao.queryAllPrivateField(pmap);
			list = new ArrayList<Map<String, Object>>();
			resultMap.put("rows", list);
			resultMap.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
		}
		return resultMap;
	}
}
