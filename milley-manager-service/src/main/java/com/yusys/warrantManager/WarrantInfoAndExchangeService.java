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
import com.yusys.warrantManager.WarrantInfoAndExchangeDao;
@Service("warrantInfoAndExchangeService")
@Transactional
public class WarrantInfoAndExchangeService implements
		IWarrantInfoAndExchangeService {
	@Resource
	private WarrantInfoAndExchangeDao wDao;
	@Resource
	private TaskDBUtil tUtil;
	@Resource
	private LogUtil logUtil;
	/**
	 * 查询所有权证
	 */
	@Override
	public Map<String, Object> queryAllWarrant(HttpServletRequest req,
			String userId) {
		Map<String, Object> resuMap=new HashMap<String, Object>();
		try {
			Map<String, String> pmap = new HashMap<String, String>();
			String warrant_no=req.getParameter("warrant_no");
			if(warrant_no!=null&&!warrant_no.equals("")){
				warrant_no=URLDecoder.decode(warrant_no,"UTF-8");
				pmap.put("warrant_no",warrant_no);
			}
			String tag_id=req.getParameter("tag_id");
			if(tag_id!=null&&!tag_id.equals("")){
				tag_id=URLDecoder.decode(tag_id,"UTF-8");
				pmap.put("tag_id", tag_id);
			}
			String warrant_state=req.getParameter("warrant_state");
			if(warrant_state!=null&&!warrant_state.equals("")){
				pmap.put("warrant_state",warrant_state);
			}
			String warr_classify_o=req.getParameter("warr_classify_o");
			if(warr_classify_o!=null&&!warr_classify_o.equals("")){
				warr_classify_o=URLDecoder.decode(warr_classify_o,"UTF-8");
				pmap.put("warr_classify_o", "%"+warr_classify_o+"%");
			}
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, String>> m=null;
			m=wDao.queryAllWarrant(pmap);
			resuMap.put("rows", m);
			resuMap.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resuMap;
	}
	/**
	 * 查询权证类型
	 */
	@Override
	public List<Map<String, String>> queryAllWarrantCategroy(
			HttpServletRequest req, String userId) {
		try {
			Map<String, String> pmap = new HashMap<String, String>();
			String pre_category_id=req.getParameter("pre_category_id");
			if(pre_category_id!=null&&!pre_category_id.equals("")){
				pmap.put("pre_category_id",pre_category_id);
			}
			List<Map<String, String>> m=wDao.queryAllWarrantCategroy(pmap);
			List<Map<String, String>> mw=wDao.queryFatherWarrantCategroy(pmap);
			m.addAll(mw);
			return m;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 权证价值信息
	 */
	@Override
	public Map<String, Object> queryWarrantWorth(HttpServletRequest req,
			String userId) {
		Map<String, Object> resuMap=new HashMap<String, Object>();
		try {
			Map<String, String> pmap = new HashMap<String, String>();
			String serno=req.getParameter("SERNO");
			if(serno!=null&&!serno.equals("")){
				pmap.put("serno",serno);
			}
			List<Map<String, String>> m=wDao.queryWarrantWorth(pmap);
			resuMap.put("rows", m);
			resuMap.put("result", true);
			return resuMap;
		} catch (Exception e) {
			e.printStackTrace();
			resuMap.put("result", false);
			resuMap.put("msg", "未知错误!");
		}
			return resuMap;
	}
	/**
	 * 权证出入库信息
	 */
	@Override
	public Map<String, Object> queryWarrantHistory(HttpServletRequest req,
			String userId) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		String serno = RequestUtils.getParamValue(req, "serno");
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("serno", serno);
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		List<Map<String, Object>> list = null;
		try {
			list = wDao.queryWarrantHistory(pmap);
			resultMap.put("rows", list);
			resultMap.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultMap;
	}
	/**
	 * 权证变更信息
	 */
	@Override
	public Map<String, Object> queryWarrantChange(HttpServletRequest req,
			String userId) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		String serno = RequestUtils.getParamValue(req, "serno");
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("serno", serno);
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		List<Map<String, Object>> list = null;
		try {
			list = wDao.queryWarrantChange(pmap);
			resultMap.put("rows", list);
			resultMap.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultMap;
	}
	/**
	 * 变更标签
	 */
	@Override
	public Map<String, String> updateWarrantTagId(HttpServletRequest req,
			String userId) {
		Map<String, String> resulMap=new HashMap<String, String>();
		Map<String, String> pmap = new HashMap<String, String>();
		Map<String, String> bmap = new HashMap<String, String>();
		String newTagId=req.getParameter("newTagId");
		if(newTagId!=null&&!newTagId.equals("")){
			pmap.put("newTagId",newTagId);
			bmap.put("now_value", newTagId);
		}
		String warrant_no=req.getParameter("warrant_no");
		if (warrant_no!=null&&!warrant_no.equals("")) {
			pmap.put("warrant_no", warrant_no);
		}
		String tagId=req.getParameter("tag_id");
		if(tagId!=null&&!tagId.equals("")){
			bmap.put("original_value",tagId);
		}
		String serno=req.getParameter("serno");
		if(serno!=null&&!serno.equals("")){
			bmap.put("serno",serno);
		}
		try {
			wDao.updateWarrantTagId(pmap);
			bmap.put("exchange_user", userId);
			bmap.put("exchange_date", DateTimeUtils.getFormatCurrentDate());
			bmap.put("exchange_type", "00");
			bmap.put("id", tUtil.getSequenceValByName("WRT_SEQ_WARRANT_HISTORYID"));
			wDao.updateWarrExchange(bmap);
			resulMap.put("result", "true");
			logUtil.insertLogInfo(req, userId,CommonStaticConfig.UPDATE + "权证标签变更：" + pmap.get("newTagId"),
					CommonStaticConfig.RESULT_SUCC,"权证标签变更",
					CommonStaticConfig.LOG_TYPE_OPT, warrant_no);
		} catch (Exception e) {
			e.printStackTrace();
			resulMap.put("result", "false");
			logUtil.insertLogInfo(req, userId,CommonStaticConfig.UPDATE + "权证标签变更：" + pmap.get("newTagId"),
					CommonStaticConfig.RESULT_SUCC,"权证标签变更",
					CommonStaticConfig.LOG_TYPE_OPT, warrant_no);
		}
		return resulMap;
	}
	@Override
	public Map<String, String> updateWarrantArea(HttpServletRequest req,
			String userId) {
		Map<String, String> resulMap=new HashMap<String, String>();
		Map<String, String> pmap = new HashMap<String, String>();
		Map<String, String> bmap = new HashMap<String, String>();
		String serno=req.getParameter("SERNO");
		//变更后
		String storageplacename=req.getParameter("STORAGEPLACENAME");
		String floorname=req.getParameter("FLOORNAME");
		String machineroomname= req.getParameter("MACHINEROOMNAME");
		String cabinetnum= req.getParameter("CABINETNUM");
		String layer=req.getParameter("LAYER");
		String now_value=storageplacename+"->"+floorname+"->"+machineroomname+"->"+cabinetnum+"->"+"第"+layer+"柜位";
		bmap.put("now_value", now_value);
		//变更前
		String oldstorageplacename=req.getParameter("OLDSTORAGEPLACENAME");
		String oldfloorname=req.getParameter("OLDFLOORNAME");
		String oldmachineroomname= req.getParameter("OLDMACHINEROOMNAME");
		String oldcabinetnum=req.getParameter("OLDCABINETNUM");
		String oldlayer=req.getParameter("OLDLAYER");
		String original_value=oldstorageplacename+"->"+oldfloorname+"->"+oldmachineroomname+"->"+oldcabinetnum+"->"+"第"+oldlayer+"柜位";
		bmap.put("original_value", original_value);
		String warrant_no=req.getParameter("WARRANT_NO");
		if(warrant_no!=null&&!warrant_no.equals("")){
			pmap.put("warrant_no",warrant_no);
		}
		try {
			String floor=req.getParameter("FLOOR");
			if (floor!=null&&!floor.equals("")) {
				pmap.put("floor", floor);
			}
			String machine_room=req.getParameter("MACHINE_ROOM");
			if (machine_room!=null&&!machine_room.equals("")) {
				pmap.put("machine_room", machine_room);
			}
			String area=req.getParameter("AREA");
			if (area!=null&&!area.equals("")) {
				pmap.put("area", area);
			}
			String cabinetnum2=req.getParameter("CAB_NUM");
			pmap.put("cabinetnum", cabinetnum2);
			pmap.put("layer", layer);
			wDao.updateWarrantArea(pmap);
			bmap.put("serno", serno);
			bmap.put("exchange_date", DateTimeUtils.getFormatCurrentDate());
			bmap.put("exchange_type", "01");
			bmap.put("exchange_user", userId);
			bmap.put("id", tUtil.getSequenceValByName("WRT_SEQ_WARRANT_HISTORYID"));
			wDao.updateWarrExchange(bmap);
			logUtil.insertLogInfo(req, userId,CommonStaticConfig.UPDATE + "权证存放区域变更：" + pmap.get("newTagId"),
					CommonStaticConfig.RESULT_SUCC,"权证存放区域变更",
					CommonStaticConfig.LOG_TYPE_OPT, warrant_no);
			String[] floorNum = layer.split(",");
			String floorNums = "";
			for(String f : floorNum){
				floorNums += (floorNums==""?"":",")+ "'" + f + "'";
			}
			Map<String, String> ud = new HashMap<String, String>();
			ud.put("assetNum", warrant_no);
			ud.put("cabinetNum",cabinetnum2);
			ud.put("floorNum", floorNums);
			wDao.updateTodeleteOwn(ud);
			logUtil.insertLogInfo(req, userId,CommonStaticConfig.DELETE + "文件柜：" + ud.get("cabinetNum"),
					CommonStaticConfig.RESULT_SUCC,"清除以前的文件柜信息",
					CommonStaticConfig.LOG_TYPE_OPT, warrant_no);
			wDao.updateCabinetFloor(ud);
			logUtil.insertLogInfo(req, userId,CommonStaticConfig.UPDATE + "文件柜：" + ud.get("cabinetNum"),
					CommonStaticConfig.RESULT_SUCC,"更新文件柜",
					CommonStaticConfig.LOG_TYPE_OPT, warrant_no);
			//更新机柜使用率
			if(layer!=null&&!"".equals(layer)){
				Map<String, String> cabinetUse = wDao.queryCabinetUse(cabinetnum2);
				float num= Float.parseFloat(cabinetUse.get("USE_NUM"))/Float.parseFloat(cabinetUse.get("TOTAL_CONTENT"))*100; 
				DecimalFormat df = new DecimalFormat("0");//格式化小数   
				String s = df.format(num);
				cabinetUse.put("cab_use_ratio", String.valueOf(s)+"%");
				wDao.updateCabinetUse(cabinetUse);
				logUtil.insertLogInfo(req, userId,CommonStaticConfig.UPDATE + "文件柜使用率：" + cabinetUse.get("cab_use_ratio"),
						CommonStaticConfig.RESULT_SUCC,"更新文件柜使用率",
						CommonStaticConfig.LOG_TYPE_OPT, cabinetnum);
			}
			resulMap.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			resulMap.put("result", "false");
		}
		return resulMap;
	}
	/**
	 * 根据合同查权证
	 */
	@Override
	public Map<String, Object> queryWarrantByContract(HttpServletRequest req,
			String userId) {
		Map<String, Object> resuMap=new HashMap<String, Object>();
		try {
			Map<String, String> pmap = new HashMap<String, String>();
			String contract_no=req.getParameter("contract_no");
			if(contract_no!=null&&!contract_no.equals("")){
				pmap.put("contract_no", contract_no);
			}
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, String>> m=null;
			m=wDao.queryWarrantByContract(pmap);
			resuMap.put("rows", m);
			resuMap.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resuMap;
	}
}
