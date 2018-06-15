var getid;
function initCompleteRepairRegister(key,data,repair_status){
	$("#CKfiled_idId").val(data["filed_id"]);
	baseAjax("sfile/findFileInfo.asp",{file_id:$("#CKfiled_idId").val()},function(data){
		defaultShowFileInfoRead($("#CKfiled_idId").val(),$("#CKfiled_id").parent(),data,true);
	});
	if(key=="finish_repair"){
		$("#Table_viewCompleteRepair").hide();
	}else {
		if(repair_status=="待接单"||repair_status=="维修中"){
			$("#title_repair").hide();	
			$("#Table_viewCompleteRepair").hide();	
		}
		$("#Table_completeRepair").hide();
		$("#save_propertyRepairList").hide();
	}
    for(var k in data){
    	$("span[name='CK." + k + "']").html(data[k]);
    }
    getid = data.id;
}
//初始化按钮
function initconpleteRepairInfo(){
	initSelect($("#TKrepair_result"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"ASS_DIC_REPAIR_RESULT"});
	//保存按钮
	$("#save_propertyRepairList").click(function(){
		 if(!vlidate($("#Table_completeRepair"),"",true)){
			 return;
		 }
		var p = {};
		p["repair_result"] = $.trim($("#TKrepair_result").val());
		p["result_remark"] = $("#TKresult_remark").val();
		p["id"] = getid;
	    baseAjax("AssetRepair/updateRepairRegister.asp", p, function(data) {
	       	if (data != undefined && data != null&&data.result=="true" ) {
	       		alert("----保存成功----");
	       		newOpenTab("repairlistmanage","返回","ppe/propertyManager/repairOrderManager/propertyRepairList.html");
				}else{
					alert("----保存失败----");
				}
			});
	});
	//返回按钮
    $("#back_propertyRepairList").click(function(){
    	newOpenTab("repairlistmanage","返回","ppe/propertyManager/repairOrderManager/propertyRepairList.html");
	});
}

initconpleteRepairInfo();
initVlidate($("#Table_completeRepair"));