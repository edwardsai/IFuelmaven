package com.yusys.warrantManager;

import java.net.URLDecoder;
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
import com.yusys.warrantManager.WarrantOutDao;

@Service("warrantOutService")
@Transactional
public class WarrantOutService implements IWarrantOutService{
	@Resource
	private WarrantOutDao warrantOutDao;
	@Resource
	private TaskDBUtil taskDBUtil;
	@Resource
	private LogUtil logUtil;
	//查询待出库信息
	@Override
	public Map<String, Object> queryListWarrantOut(HttpServletRequest req) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		Map<String, String> pmap = new HashMap<String, String>();
		try {
			String warrant_no=req.getParameter("warrant_no");
			if(warrant_no!=null&&!warrant_no.equals("")){
				pmap.put("warrant_no", "%"+warrant_no+"%");
			}
			String property_owner_name=req.getParameter("property_owner_name");
			if(property_owner_name!=null&&!property_owner_name.equals("")){
				pmap.put("property_owner_name", "%"+URLDecoder.decode(property_owner_name,"UTF-8")+"%");
			}
			String batch_id=req.getParameter("batch_id");
			if(batch_id!=null&&!batch_id.equals("")){
				pmap.put("batch_id", "%"+batch_id+"%");
			}
			String guarantee_id=req.getParameter("guarantee_id");
			if(guarantee_id!=null&&!guarantee_id.equals("")){
				pmap.put("guarantee_id", "%"+guarantee_id+"%");
			}
			String guarantee_name=req.getParameter("guarantee_name");
			if(guarantee_name!=null&&!guarantee_name.equals("")){
				pmap.put("guarantee_name", "%"+URLDecoder.decode(guarantee_name,"UTF-8")+"%");
			}
			String ENTER_FLAG=req.getParameter("ENTER_FLAG");
			if(ENTER_FLAG!=null&&!ENTER_FLAG.equals("")){
				pmap.put("ENTER_FLAG", URLDecoder.decode(ENTER_FLAG,"UTF-8"));
			}
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, String>> m=warrantOutDao.queryListWarrantOut(pmap);
			resultMap.put("rows", m);
			resultMap.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultMap;
	}
	//保存权证信息
	public Map<String, String> editWarrantOut(HttpServletRequest req, String userId) {
		Map<String, String> resultMap=new HashMap<String, String>();
		//必填参数列表
		String[] must=new String[]{"CONTRACT_NO","GUARANTEE_ID", "GUARANTEE_NAME","WARRANT_NO","PROPERTY_OWNER","WARR_CLASSIFY",
				"WARR_TYPE","APPLY_USER","APPROVE_DATE","TAG_ID","OWNER_ID","ID_TYPE","ID_NUMBER",
				"EXCHANGE_USER","STORAGE_TYPE"};
		//非必填参数
		String[] nomust = new String[]{"BATCH_ID","PHOTO_ID","RETURN_DATE","TAKE_EFFECT_TIME","EXPIRE_TIME","AREA","CAB_NUM","LAYER"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		try {
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			String storage_type = pmap.get("STORAGE_TYPE");
			if(storage_type.equals("03")) {//借出
				pmap.put("WARR_STATUS","02");//借出
			}else if(storage_type.equals("04")) {//借阅
				pmap.put("WARR_STATUS","03");//借阅
			}else if(storage_type.equals("05")) {//出库
				pmap.put("WARR_STATUS","04");//已退还
			}
			warrantOutDao.updateWarrantOut(pmap);
			//更新中间表标识
			pmap.put("ENTER_FLAG","01");//已处理-通过
			warrantOutDao.updateWarrantFlag(pmap);
			//新增入库记录
			List<Map<String, String>> map=warrantOutDao.queryListSerno(pmap);
			pmap.put("SERNO",map.get(0).get("SERNO"));//流水号
			pmap.put("ID",taskDBUtil.getSequenceValByName("WRT_SEQ_WARRANT_HISTORYID"));
			pmap.put("APPROVE_USER",userId);//审核人
			pmap.put("EXECUTE_DATE",DateTimeUtils.getFormatCurrentDate());//入库执行时间
			warrantOutDao.saveWarrantOutRecord(pmap);
			//插入日志
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.UPDATE+"批次编号"+pmap.get("BATCH_ID")+"权证编号"+
			pmap.get("WARRANT_NO"),CommonStaticConfig.RESULT_SUCC, "权证出库", CommonStaticConfig.LOG_TYPE_OPT, "");
			resultMap.put("result", "true");
		}catch (Exception e) {
			e.printStackTrace();
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"批次编号"+pmap.get("BATCH_ID")+"权证编号"+
			pmap.get("WARRANT_NO"),CommonStaticConfig.RESULT_FAIL, "权证出库",CommonStaticConfig.LOG_TYPE_ERROR, "");
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	//打回
	@Override
	public Map<String, String> beatWarrantOut(HttpServletRequest req,
			String userId) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			//必填参数
			String[] must=new String[]{"RETURN_REASON","WARRANT_NO","BATCH_ID"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("ENTER_FLAG", "02");//已处理打回
			warrantOutDao.beatWarrantOut(pmap);
			resultMap.put("result", "true");
		}catch(Exception e){
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}
}
