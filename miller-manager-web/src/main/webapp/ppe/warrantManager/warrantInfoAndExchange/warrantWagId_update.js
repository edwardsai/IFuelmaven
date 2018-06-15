function initnewUpdateWarrantWagIdEvent(params){
	var currTab = getCurrentPageObj();//当前页
	//赋值
	for(var k in params){
		currTab.find("input[name='warr."+k+"']").val(params[k]);
	}
	initVlidate($("#warrant_info"));
	//制作新标签
	currTab.find("#make_newWarrantTag").click(function(){
		var org =$("#main_user_name").attr("org_no");
		currTab.find("#newTagId").val(returnSerialNumber2("BQ",org, "WRT_SEQ_WARRANT_TAGID"));
	});
	//返回
	currTab.find("#back_warrantList").click(function(){
		newOpenTab("backWarrantList", "返回", "ppe/warrantManager/warrantInfoAndExchange/warrantInfoAndExchange_queryList.html");
	});
	//变更标签
	currTab.find("#save_warrantTag").click(function(){
		//验证
		if (!vlidate(currTab.find("#table_warrantInfo"),"", true)) {
			return;
		}
		var param={};
		param["newTagId"]=currTab.find("#newTagId").val();
		param["warrant_no"]=params.WARRANT_NO;
		param["tag_id"]=params.TAG_ID;
		param["serno"]=params.SERNO;
		baseAjax("warrantInfoAndExchange/updateWarrantTagId.asp", param, function(data){
			if (data!=undefined && data!=null) {
				if(data.result=="true"){
					alert("修改成功");
					newOpenTab("backWarrantBefore", "返回", "ppe/warrantManager/warrantInfoAndExchange/warrantInfoAndExchange_queryList.html");
				}
			}else {
				alert("修改失败");
		}
	});	
	});
}