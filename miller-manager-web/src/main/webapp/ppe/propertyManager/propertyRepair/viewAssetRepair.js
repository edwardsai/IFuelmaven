function initviewRepairInfo(data,repair_status){
	$("#VKfiled_idId").val(data["filed_id"]);
	baseAjax("sfile/findFileInfo.asp",{file_id:$("#VKfiled_idId").val()},function(data){
		defaultShowFileInfoRead($("#VKfiled_idId").val(),$("#VKfiled_id").parent(),data,true);
	});
	if(repair_status=="待接单"||repair_status=="待提交"){
		$("#assetRepairInfo").hide();
	}
	for(var k in data){
		  $("span[name='VK." + k + "']").html(data[k]);
	}
}

//返回按钮
$("#back_assetRepair").click(function(){
	newOpenTab("assetrepairlist","返回列表","ppe/propertyManager/propertyRepair/assetRepairList.html");
 });

