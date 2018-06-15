
function initwarrantOutEdit(params){
	$("#warrantOut_save").hide();
	//赋值
	for ( var k in params) { 
		 $("span[name='WO." + k + "']").html(params[k]);
	}
	if(params.STORAGE_TYPE=="03"||params.STORAGE_TYPE=="04"){
		$("#Date").hide();
	}
	//信息不符合打回
	$("#warrantOut_return").click(function(){
		var myModal = $("#myModal_warrantOut");
		initVlidate(myModal);
		myModal.modal('show');
	});
	//模态框打回按钮
	$("#warrantOut_beat").click(function(){
		if(!vlidate($("#myModal_warrantOut"),99999)){
			 return;
		 }
		params['RETURN_REASON'] = $("#W_RETURN_REASON").val();
		baseAjax("WarrantOut/beatWarrantOut.asp",params, function(data) {
			if (data != undefined && data != null) {
				if(data.result=="true"){
					$("#myModal_warrantOut").modal('hide');
					alert("打回成功！");
					newOpenTab("warrantOut_beat","返回","ppe/warrantManager/warrantOut/warrantOut_queryList.html");
				}
			}else{
				alert("未知错误！");
			}
		},true);
	});
	//信息确认
	$("#warrantOut_confirm").click(function(){
		$("#WarrantOutTable").show();//出库登记信息显示
		initVlidate($("#WarrantOutTable"));
		$("#warrantOut_confirm").hide();
		$("#warrantOut_save").show();
	});
	//出库按钮
	$("#warrantOut_save").click(function(){
	   if(!vlidate($("#WarrantOutTable"),"",true)){
			 return;
		 }
	    params["EXCHANGE_USER"]=$("input[name^='WT.EXCHANGE_USER']").val();
        baseAjax("WarrantOut/editWarrantOut.asp", params, function(data) {
       	if (data != undefined && data != null&&data.result=="true" ) {
       		alert("----出库成功----");
       			newOpenTab("warrantOut_save","返回","ppe/warrantManager/warrantOut/warrantOut_queryList.html");
			}else{
				alert("----保存失败----");
			}
		});
	});
	//返回按钮
	$("#warrantOut_back").click(function(){
		newOpenTab("warrantOut_back","返回","ppe/warrantManager/warrantOut/warrantOut_queryList.html");
	 });
}


