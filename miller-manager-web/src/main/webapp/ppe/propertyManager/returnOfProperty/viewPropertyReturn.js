//资产信息
function initviewtReturnInfo(data,is_return){
	if(is_return=="未归还"){
		$("#theReturnInfo").hide();	
	}
	for(var k in data){
		  $("span[name='VVPR." + k + "']").html(data[k]);
	}
	//返回按钮
	$("#view_back_assetReturnList").click(function(){
		newOpenTab("propertyreturnlist","返回列表","ppe/propertyManager/returnOfProperty/propertyReturnList.html");
	});
}