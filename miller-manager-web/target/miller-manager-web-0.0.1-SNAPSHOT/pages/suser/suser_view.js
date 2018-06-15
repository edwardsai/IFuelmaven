function initviewUserInfo(data){
	 //初始化基本信息
	if(data.user_belong!="02"){
		$("#theUserInfo").hide();	
	}
	for ( var k in data) { 
		$("span[name='SV." + k + "']").html(data[k]);
	}
	//返回按钮
	$("#view_backToUserList").click(function(){
		newOpenTab("suser_queryList","返回列表","pages/suser/suser_queryList.html");
	});
}
