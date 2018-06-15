package com.yusys.warrantHomePage2;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Service;

import com.yusys.Utils.RequestUtils;
import com.yusys.warrantHomePage2.WarrantHomePageDao;
@Service("warrantHomePageService")
public class WarrantHomePageService implements IWarrantHomePageService {
	@Resource
    private WarrantHomePageDao warrantHomePageDao;
	/**
	 * 统计资产数量
	 */
	@Override
	public Map<String, Object> queryAssetCount(HttpServletRequest req) {
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			String user_no = RequestUtils.getParamValue(req, "user_no");
			List<Map<String, String>> countData = warrantHomePageDao.queryAssetStateCount();
			map.put("countData", countData);
			map.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			map.put("result", "false");
			
			return map;
		}
		return map;
	}
	
	//查询资产最近n个月使用情况
	@Override
	public Map<String, Object> queryAssetUseCondition(HttpServletRequest req) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		List<Map<String,Object>> countList = new ArrayList<Map<String,Object>>();
		try {
			String monthNumber = RequestUtils.getParamValue(req, "monthNumber");
			SimpleDateFormat matter=new SimpleDateFormat("yyyy-MM");
		      for(int i = 0; i < Integer.parseInt(monthNumber); i++){
		    	  Calendar calendar = Calendar.getInstance();
		    	  calendar.add(Calendar.MONTH,-i);
		    	  //将calendar装换为Date类型
		    	  Date date = calendar.getTime();
		    	  String currMonth = matter.format(date);//获取过去monthNumber个月日期
		    	  int outCont = warrantHomePageDao.queryUseAssetNumByMonth(currMonth);//统计某个月权证出库的数量
		    	  int inCont = warrantHomePageDao.queryInAssetNumByMonth(currMonth);//统计某个月资产权证入库的数量
		    	  Map<String,Object> map = new HashMap<String, Object>();
		    	  map.put("month", currMonth);
		    	  map.put("outCont", outCont);
		    	  map.put("inCont", inCont);
		    	  countList.add(map);
		      }
			resultMap.put("countList", countList);
			resultMap.put("result", true);
		} catch (Exception e) {
			resultMap.put("result", false);
			e.printStackTrace();
		}
		return resultMap;
	}
	
	//统计近一年前几名总资产占比
	@Override
	public Map<String, Object> queryAssetProportion(HttpServletRequest req) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		List<Map<String,Object>> countList = new ArrayList<Map<String,Object>>();
		try {
			String typeNum = RequestUtils.getParamValue(req, "typeNum");
			List<Map<String,String>> topAssetTypeList = warrantHomePageDao.queryTopAssetInfo(typeNum);//查询前几名的资产信息
			int num = Integer.parseInt(typeNum);
			if(topAssetTypeList.size() < num){//入库资产类型数量少于需要查询的前几名数量
				resultMap.put("result", false);
				resultMap.put("msg", "入库资产类型数量少于" + num +";无法查询资产占比饼状图");
				return resultMap;
			}
			
			List<String> typeList = new ArrayList<String>();
			String typeJsonStr = "{";
			
			for(int i = 0; i < topAssetTypeList.size(); i++){
				typeList.add(topAssetTypeList.get(i).get("WARR_TYPE"));//获取前几名的类型编号
				typeJsonStr += "\"" + topAssetTypeList.get(i).get("WARR_TYPE") + "\":\"" +
								topAssetTypeList.get(i).get("WARR_TYPE_NAME")+ "\",";	
			}
			
			typeJsonStr = typeJsonStr.substring(0, typeJsonStr.length() - 1) + "}";
			JSONObject json = JSONObject.fromObject(typeJsonStr);//前几名类别json对象returan
			SimpleDateFormat matter=new SimpleDateFormat("yyyy-MM");
			 for(int i = 0; i < 12; i++){
		    	  Calendar calendar = Calendar.getInstance();
		    	  Calendar calendar2 = Calendar.getInstance();
		    	  calendar.add(Calendar.MONTH,-i);//i=0时，表示当前月
		    	  calendar2.add(Calendar.MONTH,1-i);//i=0时，表示下个月
		    	  //将calendar装换为Date类型
		    	  Date date = calendar.getTime();
		    	  Date date2 = calendar2.getTime();
		    	  
		    	  String currMonth = matter.format(date)+"-01";//获取当前月日期
		    	  String nextMonthFirstDay = matter.format(date2)+"-01";//获取下个月1号
		    	  //1.date:小于下个月的1号就是这个月的所有.2.typelist:前面几名的类型
		    	  Map<String,Object> pmap = new HashMap<String,Object>();
		    	  pmap.put("date", nextMonthFirstDay);
		    	  pmap.put("typeList", typeList);
		    	  
		    	  List<Map<String,String>> topAssetNum = warrantHomePageDao.queryTopAssetNumByDate(pmap);//统计前几名的资产数量
		    	  int otherAssetNum = warrantHomePageDao.queryOtherAssetNumByDate(pmap);//统计除了前几名其他资产的数量
		    	  //returan
		    	  Map<String,Object> map = new HashMap<String, Object>();
		    	  map.put("month", currMonth);//当前月
		    	  map.put("topAssetNum", topAssetNum);
		    	  map.put("otherAssetNum", otherAssetNum);
		    	  countList.add(map);
		      }
			resultMap.put("countList", countList);
			resultMap.put("typeJsonStr", json);
			resultMap.put("result", true);
		} catch (Exception e) {
			resultMap.put("result", false);
			resultMap.put("msg", "初始化类别占比饼状图失败");
			e.printStackTrace();
		}
		return resultMap;
	}
	
	//查询待办
	@Override
	public Map<String, Object> queryNeedToDeal(HttpServletRequest req) {
		Map<String, Object> resultMap=new HashMap<String, Object>();//存储返回结果数据
		Map<String, Object> map=new HashMap<String, Object>();//存储请求参数
		map.put("approve_status", "02");
		try {
			//权证的待办提醒查询
			int WarrantIn = warrantHomePageDao.queryWarrantInNum("02");//审批中
			resultMap.put("WarrantIn", WarrantIn);//入库待处理数
			int WarrantOut = warrantHomePageDao.queryWarrantOutNum("01");//未分配
			resultMap.put("WarrantOut", WarrantOut);//资产领用登记数
			int draftSchemeNum = warrantHomePageDao.queryDraftSchemeNum("01");
			resultMap.put("draftSchemeNum", draftSchemeNum);//盘点管理-待制定方案
			
			//资产的待办提醒查询
			int applyNum = warrantHomePageDao.queryAssetApplyNum("02");//审批中
			resultMap.put("applyNum", applyNum);//资产申请数
			int resignNum = warrantHomePageDao.queryAssetResignNum("01");//未分配
			resultMap.put("resignNum", resignNum);//资产领用登记数
			List<Map<String, String>> TranNum = warrantHomePageDao.queryAssetTranNum("02");
			resultMap.put("TranNum", TranNum);//资产转移数
			int asignNum = warrantHomePageDao.queryAssetAsignNum("01");//未分配
			resultMap.put("asignNum", asignNum);//资产调拨分配数
			resultMap.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}

}
