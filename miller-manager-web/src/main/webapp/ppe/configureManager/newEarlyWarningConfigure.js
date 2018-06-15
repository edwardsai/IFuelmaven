function initNewEarlyWarningConfigureEvent(params){
	if(params){//初始化信息
		initNewEarlyWarningConfigureInfo(params);
		$("#headTle_newEarlyWarningConfigure").html("修改预警信息");
	}else{
		$("#headTle_newEarlyWarningConfigure").html("新增预警信息");
	}
	//保存按钮
	$('#save_newEarlyWarningConfigure').unbind();
	$('#save_newEarlyWarningConfigure').bind('click', function(e) {
		if(!vlidate($("#infoDiv_newEarlyWarningConfigure"))){
			return;
		}
		 nconfirm("是否保存？",function(){
			var params = {"MARKS":$("textarea[name^='NEWCFG.']").val()};
			var inputs = $("input[name^='NEWCFG.']");
			for (var i = 0; i < inputs.length; i++) {
				var obj = $(inputs[i]);
				params[obj.attr("name").substr(7)] = obj.val();
			}
			if($("#is_use_state_newEarlyWarningConfigure").is(":checked")){
				params["IS_USE"]="1";
			}else{
				params["IS_USE"]="2";
			}
			baseAjax("EarlyWarning/newWarning.asp", params, function(data) {
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						newOpenTab("earlyWarningConfigureList","预警列表","ppe/configureManager/earlyWarningConfigureList.html",function(){});
					}
				}else{
					alert("未知错误！");
				}
			},true);
		 });
	});
	//重置按钮
	$('#reset_newEarlyWarningConfigure').unbind();
	$('#reset_newEarlyWarningConfigure').bind('click', function(e) {
		if(params){//初始化信息
			initNewEarlyWarningConfigureInfo(params);
		}else{
			$("input[name^='NEWCFG.']").val("");
			$("textarea[name^='NEWCFG.']").val("");
		}
	});
	//返回
	$('#back_newEarlyWarningConfigure').unbind();
	$('#back_newEarlyWarningConfigure').bind('click', function(e) {
		newOpenTab("earlyWarningConfigureList","预警列表","ppe/configureManager/earlyWarningConfigureList.html",function(){});
	});
	//点击资产类别
	$("input[name='NEWCFG.ASSET_TYPE_NAME']").unbind("click");
	$("input[name='NEWCFG.ASSET_TYPE_NAME']").click(function(){
		openSelectTreeDiv($(this),"proConfigSelectTreeInField_newEarlyWarn","propertyTypeConfig/queryAllAssetCategroy.asp",{width:$(this).width()+"px","margin-left": "0px"},function(node){
			$("input[name='NEWCFG.ASSET_TYPE_NAME']").val(node.name);
			$("input[name='NEWCFG.ASSET_TYPE']").val(node.id);
			return true;
		});
	});
}
/**
 * 初始化信息
 * @param params 信息数据
 */
function initNewEarlyWarningConfigureInfo(params){
	for(var k in params){
		if(k=="MARKS"){
			$("textarea[name='NEWCFG." + k + "']").val(params[k]);
		}else{
			$("input[name='NEWCFG." + k + "']").val(params[k]);
		}
		if(params["IS_USE"]=="1"){
			if(!$("#is_use_state_newEarlyWarningConfigure").is(":checked")){
				$("#is_use_state_newEarlyWarningConfigure").click();
			}
		}else{
			if($("#is_use_state_newEarlyWarningConfigure").is(":checked")){
				$("#is_use_state_newEarlyWarningConfigure").click();
			}
		}
	}
}
initVlidate($("#infoDiv_newEarlyWarningConfigure"));
setTimeout(function(){switch_btn_event()}, 5);