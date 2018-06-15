//页面返回按钮
$("#UgoBackSbscfigList").click(function(){
	newOpenTab("businessconfig","业务要素配置","workFlow/sbscfig/sbscfig_queryList.html",function(){});
});
//页面保存按钮
$("#UsaveElement").click(function(){
	//必填项校验
	if(vlidate($("#updateSbscfig_from"))){
		//获取表单数据
		var inputs = $("input[name^='UF.']");
		var selects = $("select[name^='UF.']");
		var textareas = $("textarea[name^='UF.']");
		var params = {};
		for(var i=0;i<inputs.length;i++){
			if($(inputs[i]).attr("name").substr(3)=="rule_type"){
				params[$(inputs[i]).attr("name").substr(3)] = $("input[name='UF.rule_type']:checked").val();
			}else{
				params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val();
			}	 
		}
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(3)] = $(selects[i]).val(); 
		}		
		for(var i=0;i<textareas.length;i++){
			params[$(textareas[i]).attr("name").substr(3)] = $.trim($(textareas[i]).val()); 
		}
		console.info(params);
		//发送数据到后台保存到数据库
		baseAjax("SFact/updateOneFactorsInfo.asp",params, function(data) {
        	if (data != undefined&&data!=null&&data.result=="true") {
				alert("修改成功");
				newOpenTab("businessconfig","业务要素配置","workFlow/sbscfig/sbscfig_queryList.html",function(){});
			}else{
				alert("修改失败");
			}
		});
	}
});
//初始化必填项
initVlidate($("#updateSbscfig_from"));