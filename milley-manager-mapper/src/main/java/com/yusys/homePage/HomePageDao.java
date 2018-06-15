package com.yusys.homePage;

import java.util.List;
import java.util.Map;

public interface HomePageDao {
	//统计资产各状态数量
	public List<Map<String, String>> queryAssetStateCount();
	//统计某个月资产领用的数量
	public int queryUseAssetNumByMonth(String type);
	//统计某个月资产入库的数量
	public int queryInAssetNumByMonth(String type);
	//查询前几名的资产信息
	public List<Map<String, String>> queryTopAssetInfo(String num);
	//统计前几名的资产数量
	public List<Map<String, String>> queryTopAssetNumByDate(Map<String, Object> map);
	//统计除了前几名其他资产的数量
	public int queryOtherAssetNumByDate(Map<String, Object> map);
	//资产申请数
	public int queryAssetApplyNum(String state);
	//资产领用登记数
	public int queryAssetResignNum(String state);
	//资产转移数
	public List<Map<String, String>> queryAssetTranNum(String state);
	//资产调拨分配数
	public int queryAssetAsignNum(String state);
	//盘点管理-待制定方案
	public int queryDraftSchemeNum(String state);
	
	
	
}
