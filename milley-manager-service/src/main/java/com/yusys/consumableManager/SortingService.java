package com.yusys.consumableManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.CommonStaticConfig;
import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.LogUtil;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.Utils.UploadImage;
import com.yusys.consumableManager.SortingDao;
import com.yusys.consumableManager.Sorting;
@Service("iSortingService")
@Transactional
public class SortingService extends UploadImage implements ISortingService {
	
	private static final Logger logger=Logger.getLogger(ISortingService.class);
	@Resource
	private SortingDao sortingDao;
	@Resource
	private TaskDBUtil taskDBUtil;
	@Resource
	private LogUtil logUtil;
	/**
	 * 查询所有
	 */
	@Override
	public List<Map<String, String>> queryAllSorting(HttpServletRequest req,
			String userId) {
		try {
			return sortingDao.queryAllSorting("aa");
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
		}
		return null;
	}
	/**
	 * 根据类型编号，查询一条类别
	 */
	@Override
	public Sorting findOneSortingInfo(HttpServletRequest req) {
		String category_id = RequestUtils.getParamValue(req, "category_id");
		try {
			return sortingDao.findOneSortingInfo(category_id);
		} catch(Exception e) {
			e.printStackTrace();
			logger.error(e);
		}
		return null;
	}
	/**
	 * 添加类别配置
	 */
	@Override
	public Map<String, Object> addSortingConfig(HttpServletRequest req,
			String userId, String orgId) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		String []must=new String[]{"category_id","category_name","menu_level","order_id"};
		String []nomust=new String[]{"pre_category_id","description"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		try {
			//必填参数列表
			//必填参数列表
			if (pmap==null) {
				resultMap.put("result", false);
				resultMap.put("msg", "缺少必填项!");
				return resultMap;
			}
			pmap.put("category_id", pmap.get("category_id").toLowerCase());
			if(sortingDao.findOneSortingInfo(pmap.get("category_id"))!=null){
				resultMap.put("result", false);
				resultMap.put("msg", "科目编号重复");
				return resultMap;
			}
			
			pmap.put("create_id", userId);//创建人			
			pmap.put("create_org", orgId);//创建机构			
			pmap.put("create_date", DateTimeUtils.getFormatCurrentDate());//创建时间
			pmap.put("flag", "00");//删除标志 00未删除 01已删除
			
			//添加类别id
			//String id = taskDBUtil.getSequenceValByName("CAT_SEQ_CATEGORY_CONFIG");
			//pmap.put("c_id",id);
			sortingDao.addSortingConfig(pmap);
			//插入日志
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"耗材类别编号"+pmap.get("category_id"),
					CommonStaticConfig.RESULT_SUCC, "耗材类别新增",
					CommonStaticConfig.LOG_TYPE_OPT, pmap.get("category_id"));
			resultMap.put("result", true);
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"耗材类别编号"+pmap.get("category_id"),
					CommonStaticConfig.RESULT_FAIL, "耗材类别新增",
					CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("category_id"));
			logger.error(e);
		}
		resultMap.put("result", false);
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}
	/**
	 * 修改类别配置
	 */
	@Override
	public Map<String, Object> updateSortingConfig(HttpServletRequest req,String userId) {
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
		if(!pmap.get("category_id").equals(pmap.get("old_category_id")) && sortingDao.findOneSortingInfo(pmap.get("category_id"))!=null){
			resultMap.put("result", false);
			resultMap.put("msg", "科目编号重复");
			return resultMap;
		}
		try {
			int gap = 0;
			if(pmap.get("pre_category_id")!=null && pmap.get("pre_category_id")!=""){
				Sorting supMenu = sortingDao.findOneSortingInfo(pmap.get("pre_category_id"));
				int supLevel=Integer.parseInt(supMenu.getMenu_level());
				int currLevel=Integer.parseInt(pmap.get("menu_level"));
				if(!pmap.get("menu_level").equals((supLevel+1)+"")){
					pmap.put("menu_level",(supLevel+1)+"");//重新设置级别 (当前级别=父的级别+1)
					gap=currLevel-supLevel+1;//科目修改前后的级别差
					pmap.put("gap", gap+"");
				}
			}
			sortingDao.updateSortingConfig(pmap);
			if(!pmap.get("category_id").equals(pmap.get("old_category_id"))){
				sortingDao.updateChildConfigSupNo(pmap);
				//empEstimateConfigDao.updateMenuButtonMenuNo(pmap);
				//empEstimateConfigDao.updateMenuPropertyMenuNo(pmap);
			}
			
			if(gap!=0){
				sortingDao.updateChildConfigLevel(pmap);
			}
			
			if(pmap.get("haveId") != null && !"".equals(pmap.get("haveId"))){
				sortingDao.clearConfigSupNoInfo(pmap.get("haveId"));
			}
			//插入日志
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"耗材类别编号"+pmap.get("category_id"),
					CommonStaticConfig.RESULT_SUCC, "耗材类别修改",
					CommonStaticConfig.LOG_TYPE_OPT, pmap.get("category_id"));
			resultMap.put("result", true);
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"耗材类别编号"+pmap.get("category_id"),
					CommonStaticConfig.RESULT_FAIL, "耗材类别修改",
					CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("category_id"));
		}
		resultMap.put("result", false);
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}
	/**
	 * 删除类别配置
	 */
	@Override
	public Map<String, Object> delSortingConfig(HttpServletRequest req,String userId) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		String category_id = RequestUtils.getParamValue(req, "category_ids");
		if (category_id == null || "".equals(category_id.trim())) {
			resultMap.put("result", false);
			return resultMap;
		}
		Map<String, Object> pmap=new HashMap<String, Object>();
		pmap.put("category_ids", category_id.split(","));
		//logger.info(pmap.get("category_ids"));
		try {
			sortingDao.delSortingConfig(pmap);
			//插入日志
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.DELETE+"耗材类别编号"+category_id,
					CommonStaticConfig.RESULT_SUCC, "耗材类别删除",
					CommonStaticConfig.LOG_TYPE_OPT, category_id);
			resultMap.put("result", true);
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.DELETE+"耗材类别编号"+category_id,
					CommonStaticConfig.RESULT_FAIL, "耗材类别删除",
					CommonStaticConfig.LOG_TYPE_ERROR, category_id);
			logger.error(e);
		}
		resultMap.put("result", false);
		return resultMap;
	}
	//删除物品信息
	@Override
	public Map<String, Object> deleteField(HttpServletRequest req,String userId) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, String> pmap = new HashMap<String, String>();
		String goods_id = RequestUtils.getParamValue(req, "goods_id");
		pmap.put("goods_id", goods_id);
		try {
			sortingDao.deleteField(pmap);
			//插入日志
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.DELETE+"物品编号"+pmap.get("goods_id"),
					CommonStaticConfig.RESULT_SUCC, "物品删除",
					CommonStaticConfig.LOG_TYPE_OPT, pmap.get("goods_id"));
			resultMap.put("result", true);
		} catch(Exception e) {
			e.printStackTrace();
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.DELETE+"物品编号"+pmap.get("goods_id"),
					CommonStaticConfig.RESULT_FAIL, "物品删除",
					CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("goods_id"));
			logger.error(e);
		}
		return resultMap;
	}
	//新增或修改物品信息
	@Override
	public Map<String, Object> addOrUpdateField(HttpServletRequest req,String userId) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		String col_id = RequestUtils.getParamValue(req, "col_id");
		//必填参数列表
		String[] must=new String[]{"goods_id", "goods_name", "brand", "standard",
				"quantity", "status"};
		//非必填的参数列表
		String[] nomust=new String[]{"descr", "category_id","filed_id"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		if(col_id == "") {	//新增
			List<Map<String,String>> m = sortingDao.queryGoodsID(pmap);
			if(m.size()>0){
				resultMap.put("result", false);
				resultMap.put("msg", "物品编号重复，新增失败！");
				return resultMap;
			}
			String id = taskDBUtil.getSequenceValByName("CG_SEQ_GOODS_CONFIG");
			logger.info(id);
			pmap.put("col_id", id);
			pmap.put("flag", "00");
			try {
				List<Map<String,String>> m2 = sortingDao.queryBygoodsId(pmap);
				if(m2.size()>0){
					sortingDao.editField(pmap);
				}else{
					sortingDao.addField(pmap);
				}
				logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"物品编号"+pmap.get("col_id"),
						CommonStaticConfig.RESULT_SUCC, "物品新增",
						CommonStaticConfig.LOG_TYPE_OPT, pmap.get("col_id"));
				resultMap.put("result", true);
			} catch(Exception e) {
				e.printStackTrace();
				logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"物品编号"+pmap.get("col_id"),
						CommonStaticConfig.RESULT_FAIL, "物品新增",
						CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("col_id"));
				logger.error(e);
			}
		} else {	//修改
			pmap.put("col_id", col_id);
			try {
				sortingDao.updateField(pmap);
				//插入日志
				logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"物品编号"+pmap.get("col_id"),
						CommonStaticConfig.RESULT_SUCC, "物品修改",
						CommonStaticConfig.LOG_TYPE_OPT, pmap.get("col_id"));
				resultMap.put("result", true);
			} catch(Exception e) {
				e.printStackTrace();
				logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"物品编号"+pmap.get("col_id"),
						CommonStaticConfig.RESULT_FAIL, "物品修改",
						CommonStaticConfig.LOG_TYPE_ERROR, pmap.get("col_id"));
				logger.error(e);
			}
		}
		return resultMap;
	}
	/**
	 * 查询一条物品信息
	 */
	@Override
	public Sorting queryOneFieldInfo(HttpServletRequest req) {
		String col_id = RequestUtils.getParamValue(req, "col_id");
		try{
			return sortingDao.queryOneFieldInfo(col_id);
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e);
		}
		return null;
	}
	//查询类别对应的物品信息
	@Override
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
			list = sortingDao.queryAllPrivateField(pmap);
			resultMap.put("rows", list);
			resultMap.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
		}
		return resultMap;
	}
	@Override
	public Map<String, String> uploadImg(HttpServletRequest req, String userId,
			String path_id, MultipartFile file) {
		Map<String,String> map=uploadImage(file, userId, path_id, null);
		String goods_id=RequestUtils.getParamValue(req, "goods_id");
		Sorting s=sortingDao.findOneGoodById(goods_id);
		if (s==null) {
				
				if (map!=null&&map.get("file_id")!=null) {
					map.put("goods_id", goods_id);
					
					map.put("create_user", userId);
					map.put("create_date", DateTimeUtils.getFormatCurrentTime());
					sortingDao.uploadImg(map);
				}
		}else {
			if (map!=null&&map.get("file_id")!=null) {
				map.put("goods_id", goods_id);
				map.put("create_user", userId);
				map.put("create_date", DateTimeUtils.getFormatCurrentTime());
				sortingDao.uploadImgage(map);
			}
		}
	
		
		//String col_id = RequestUtils.getParamValue(req, "col_id");
		
		map.remove("create_user");
		map.remove("create_date");
		return map;
	}
	@Override
	public void findImg(HttpServletResponse res, String path_id, String userId,
			String fid) {
		try {
			fileViewToPage(res,path_id,fid);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@Override
	public Map<String, String> deleteImage(HttpServletRequest req, String userId) {
		String goods_id=RequestUtils.getParamValue(req, "goods_id");
		Map<String,String>map=new HashMap<String, String>();
		Sorting s=sortingDao.findOneGoodById(goods_id);
		if (removeImage(RequestUtils.getParamValue(req, "path_id"), s.getPic(), null)) {
			map.put("goods_id", goods_id);
			map.put("create_user", userId);
			map.put("create_date", DateTimeUtils.getFormatCurrentTime());
			map.put("file_id","");
			sortingDao.deleteImage(map);
		}
		map.clear();
		map.put("result","true");
		return map;
	}

}
