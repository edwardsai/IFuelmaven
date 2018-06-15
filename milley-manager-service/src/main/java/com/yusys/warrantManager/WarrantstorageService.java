package com.yusys.warrantManager;

import java.net.URLDecoder;
import java.text.DecimalFormat;
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
import com.yusys.warrantManager.WarrantStorageDao;

@Service("warrantStorageService")
@Transactional
public class WarrantstorageService implements IWarrantStorageService {
	@Resource
	private WarrantStorageDao warrantStorageDao;
	@Resource
	private WarrantOutDao warrantOutDao;
	@Resource
	private TaskDBUtil seq;
	@Resource
	private LogUtil logUtil;
	
	//查询待入库清单
	public Map<String, Object> queryListWarrantStorage(HttpServletRequest req) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		Map<String, String> pmap = new HashMap<String, String>();
		try {
			String WARRANT_NO=req.getParameter("WARRANT_NO");
			if(WARRANT_NO!=null&&!WARRANT_NO.equals("")){
				pmap.put("WARRANT_NO", "%"+WARRANT_NO+"%");
			}
			String PROPERTY_OWNER=req.getParameter("PROPERTY_OWNER");
			if(PROPERTY_OWNER!=null&&!PROPERTY_OWNER.equals("")){
				pmap.put("PROPERTY_OWNER", "%"+URLDecoder.decode(PROPERTY_OWNER,"UTF-8")+"%");
			}
			String BATCH_ID=req.getParameter("BATCH_ID");
			if(BATCH_ID!=null&&!BATCH_ID.equals("")){
				pmap.put("BATCH_ID", "%"+BATCH_ID+"%");
			}
			String GUARANTEE_ID=req.getParameter("GUARANTEE_ID");
			if(GUARANTEE_ID!=null&&!GUARANTEE_ID.equals("")){
				pmap.put("GUARANTEE_ID", "%"+GUARANTEE_ID+"%");
			}
			String GUARANTEE_NAME=req.getParameter("GUARANTEE_NAME");
			if(GUARANTEE_NAME!=null&&!GUARANTEE_NAME.equals("")){
				pmap.put("GUARANTEE_NAME", "%"+URLDecoder.decode(GUARANTEE_NAME,"UTF-8")+"%");
			}
			String ENTER_FLAG=req.getParameter("ENTER_FLAG");
			if(ENTER_FLAG!=null&&!ENTER_FLAG.equals("")){
				pmap.put("ENTER_FLAG", URLDecoder.decode(ENTER_FLAG,"UTF-8"));
			}
			/*
			String CONTRACT_NO=req.getParameter("CONTRACT_NO");
			if(CONTRACT_NO!=null&&!CONTRACT_NO.equals("")){
				pmap.put("CONTRACT_NO", "%"+CONTRACT_NO+"%");
			}
			*/
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, String>> m=warrantStorageDao.queryListWarrantStorage(pmap);
			resultMap.put("rows", m);
			resultMap.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultMap;
	}

	//新增入库
	public Map<String, String> saveWarrantStorage(HttpServletRequest req,
			String userId) {
		Map<String, String> resultMap = new HashMap<String, String>();
		Map<String, String> pmap = new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"CONTRACT_NO","GUARANTEE_ID", "GUARANTEE_NAME","WARRANT_NO","PROPERTY_OWNER","WARR_CLASSIFY",
					"WARR_TYPE","APPLY_USER","APPROVE_DATE","TAG_ID","OWNER_ID","ID_TYPE","ID_NUMBER","AREA","FLOOR","MACHINE_ROOM","CAB_NUM","LAYER",
					"EXCHANGE_USER","STORAGE_TYPE","TAKE_EFFECT_TIME","EXPIRE_TIME","BATCH_ID"};
			//非必填参数
			String[] nomust = new String[]{"PHOTO_ID","RETURN_REASON","OLD_WARRANT_NO"};
			pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			String storage_type = pmap.get("STORAGE_TYPE");
			if(storage_type.equals("02")){//借阅归还
				List<Map<String, String>> bmap=warrantStorageDao.queryTagId(pmap);//查询库存表里是否有此物品的信息
				Integer a=bmap.size();
				if(a.equals(0)){
					resultMap.put("result", "right");
					return resultMap;
				}
			}
			if(storage_type.equals("01")){//借出归还
				List<Map<String, String>> mmap=warrantStorageDao.querywarrant(pmap);//查询库存表里是否有此物品的信息
				Integer b=mmap.size();
				if(b.equals(0)){
					resultMap.put("result", "right");
					return resultMap;
				}
			}
			pmap.put("WARR_STATUS","01");//在库
			if(storage_type.equals("02")) {//借阅归还
				warrantStorageDao.updateWarrantStorage(pmap);
				List<Map<String, String>> map=warrantOutDao.queryListSerno(pmap);
				pmap.put("SERNO",map.get(0).get("SERNO"));//流水号
			}else{//借出归还或入库
				if(storage_type.equals("01")){//借出归还
					warrantStorageDao.updateWarrantStatus(pmap);
				}
				String code = "00000000";
				code += seq.getSequenceValByName("WRT_SEQ_WARRANT_STOCKID");
				code=code.substring(code.length()-9,code.length());
				code = "RK"+DateTimeUtils.getFormatCurrentDate2()+code;
				pmap.put("SERNO",code);//入库流水号
				warrantStorageDao.saveWarrantStorage(pmap);
				String[] floorNum = pmap.get("LAYER").split(",");
				String floorNums = "";
				for(String f : floorNum){
					floorNums += (floorNums==""?"":",")+ "'" + f + "'";
				}
				Map<String, String> ud = new HashMap<String, String>();
				ud.put("assetNum", pmap.get("WARRANT_NO"));
				ud.put("cabinetNum",pmap.get("CAB_NUM"));
				ud.put("floorNum", floorNums);
				warrantStorageDao.updateTodeleteOwn(ud);
				logUtil.insertLogInfo(req, userId,CommonStaticConfig.DELETE + "文件柜：" + ud.get("cabinetNum"),
						CommonStaticConfig.RESULT_SUCC,"清除以前的文件柜信息",
						CommonStaticConfig.LOG_TYPE_OPT, pmap.get("WARRANT_NO"));
				warrantStorageDao.updateCabinetFloor(ud);
				logUtil.insertLogInfo(req, userId,CommonStaticConfig.UPDATE + "文件柜：" + ud.get("cabinetNum"),
						CommonStaticConfig.RESULT_SUCC,"更新文件柜",
						CommonStaticConfig.LOG_TYPE_OPT, pmap.get("WARRANT_NO"));
				//更新机柜使用率
				if( pmap.get("LAYER")!=null&&!"".equals( pmap.get("LAYER"))){
					Map<String, String> cabinetUse = warrantStorageDao.queryCabinetUse(pmap.get("CAB_NUM"));
					float num= Float.parseFloat(cabinetUse.get("USE_NUM"))/Float.parseFloat(cabinetUse.get("TOTAL_CONTENT"))*100; 
					DecimalFormat df = new DecimalFormat("0");//格式化小数   
					String s = df.format(num);
					cabinetUse.put("cab_use_ratio", String.valueOf(s)+"%");
					warrantStorageDao.updateCabinetUse(cabinetUse);
					logUtil.insertLogInfo(req, userId,CommonStaticConfig.UPDATE + "文件柜使用率：" + cabinetUse.get("cab_use_ratio"),
							CommonStaticConfig.RESULT_SUCC,"更新文件柜使用率",
							CommonStaticConfig.LOG_TYPE_OPT, pmap.get("CAB_NUM"));
				}
			}
			//新增入库记录
			pmap.put("ID",seq.getSequenceValByName("WRT_SEQ_WARRANT_HISTORYID"));
			pmap.put("APPROVE_USER",userId);//审核人
			pmap.put("EXECUTE_DATE",DateTimeUtils.getFormatCurrentDate());//入库执行时间
			warrantStorageDao.saveWarrantRecord(pmap);
			//修改中间表入库状态
			pmap.put("ENTER_FLAG","01");//已处理-通过
			warrantStorageDao.updateMiddleTable(pmap);
			//插入日志
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"批次编号"+pmap.get("BATCH_ID")+"权证编号"+
			pmap.get("WARRANT_NO"),CommonStaticConfig.RESULT_SUCC, "权证入库", CommonStaticConfig.LOG_TYPE_OPT, "");
			resultMap.put("result", "true");
		}catch (Exception e) {
			e.printStackTrace();
			logUtil.insertLogInfo(req,userId, CommonStaticConfig.ADD+"批次编号"+pmap.get("BATCH_ID")+"权证编号"+
			pmap.get("WARRANT_NO"),CommonStaticConfig.RESULT_FAIL, "权证入库",CommonStaticConfig.LOG_TYPE_ERROR, "");
			resultMap.put("result", "false");
			}
		return resultMap;
	}

	//信息不符合打回
	public Map<String, String> beatWarrantStorage(HttpServletRequest req) {
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
			warrantStorageDao.updateMiddleTable(pmap);
			resultMap.put("result", "true");
		}catch(Exception e){
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	//查询楼层信息和区域信息的下拉数据
	@Override
	public List<Map<String, String>> findCabinetsMapSelectInfo(
			HttpServletRequest req, String userid) {
		String [] must=new String[]{"type"};//area 区域  floor楼层
		String [] nomust=new String[]{"store_p_id"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		return warrantStorageDao.findCabinetsMapSelectInfo(pmap);
	}
}
