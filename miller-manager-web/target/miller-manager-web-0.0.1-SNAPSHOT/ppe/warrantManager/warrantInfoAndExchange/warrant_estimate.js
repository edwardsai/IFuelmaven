function initnewUpdateWarrantWagIdEventDl(){
	var currTab = getCurrentPageObj();//当前页
	//返回
	currTab.find("#back_warrant_estimate").click(function(){
		newOpenTab("backWarrantToList1", "返回", "ppe/warrantManager/warrantInfoAndExchange/warrantInfoAndExchange_queryList.html");
	});
}
initnewUpdateWarrantWagIdEventDl();