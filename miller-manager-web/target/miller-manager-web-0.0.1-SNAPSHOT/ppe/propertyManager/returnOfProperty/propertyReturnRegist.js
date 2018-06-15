//资产信息
function initgetReturnInfo(data){
	for(var k in data){
		  $("span[name='PRR." + k + "']").html(data[k]);
	}
}
//初始化按钮
function initAssetReturnBtns(){
	//获取当前申请人，机构和时间
	$("#PRPreturn_user").val($("#main_user_name").attr("user_no"));
	$("#PRPreturn_user_name").val($("#main_user_name").attr("user_name"));
	$("#PRPreturn_user_org").val($("#main_user_name").attr("org_no"));
	$("#PRPreturn_user_org_name").val($("#main_user_name").attr("org_name"));
	$("#PRPreturn_date").val(returnTodayData());
	//保存按钮
	$("#save_assetReturnInfo").click(function(){
	   if(!vlidate($("#updateAssetGetReturn"),"",true)){
			 return;
		 }
		var params = {};
		params["return_user"] = $("#PRPreturn_user").val(); 
		params["return_user_org"] = $("#PRPreturn_user_org").val(); 
		params["use_status"] = $("#PRPuse_status").val(); 
		params["return_date"] = $("#PRPreturn_date").val(); 
		params["return_remark"] = $("#PRPreturn_remark").val(); 
		params["asset_num"] = $("span[name='PRR.ASSET_NUM']").html();
		params["apply_id"] = $("span[name='PRR.APPLY_ID']").html();
        baseAjax("AssetReturn/updateReturnInfo.asp", params, function(data) {
       	if (data != undefined && data != null&&data.result=="true" ) {
       		alert("----保存成功----");
       		    newOpenTab("propertyreturnlist","返回列表","ppe/propertyManager/returnOfProperty/propertyReturnList.html");
			}else{
				alert("----保存失败----");
			}
		});
	});
	//返回按钮
	$("#back_assetReturnList").click(function(){
		newOpenTab("propertyreturnlist","返回列表","ppe/propertyManager/returnOfProperty/propertyReturnList.html");
	 });
}

autoInitSelect($("#updateAssetGetReturn"));
initVlidate($("#updateAssetGetReturn"));
initAssetReturnBtns();
