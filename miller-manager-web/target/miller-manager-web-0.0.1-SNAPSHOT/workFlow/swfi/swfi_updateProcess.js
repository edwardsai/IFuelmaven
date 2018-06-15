//页面返回按钮
$("#goBackToSwfiList").click(function(){
	newOpenTab("processconfig","流程配置","workFlow/swfi/swfi_queryList.html",function(){});
});
//页面保存按钮
$("#updateSProcess").click(function(){
	//必填项校验
	if(!vlidate($("#updateSwfi_from"),999999)){
		  return ;
	  }
	//获取表单数据
	var inputs = $("input[name^='Swfi.']");
	var selects = $("select[name^='Swfi.']");
	var textareas = $("textarea[name^='Swfi.']");
	var params = {};
	for(var i=0;i<inputs.length;i++){
		if($(inputs[i]).attr("name").substr(5)=="wf_state"){
			params[$(inputs[i]).attr("name").substr(5)] = $("input[name='Swfi.wf_state']:checked").val();
		}else{
			params[$(inputs[i]).attr("name").substr(5)] = $(inputs[i]).val();
		}	 
	}
	for(var i=0;i<selects.length;i++){
		params[$(selects[i]).attr("name").substr(5)] = $(selects[i]).val(); 
	}		
	for(var i=0;i<textareas.length;i++){
		params[$(textareas[i]).attr("name").substr(5)] = $.trim($(textareas[i]).val()); 
	}
	//发送数据到后台保存到数据库
	baseAjax("SWfi/updateOneProcessInfo.asp",params, function(data) {
    	if (data != undefined&&data!=null&&data.result=="true") {
			alert("修改成功");
			newOpenTab("processconfig","流程配置","workFlow/swfi/swfi_queryList.html",function(){});
		}else{
			alert("修改失败");
		}
	});
});
//初始化必填项
initVlidate($("#updateSwfi_from"));