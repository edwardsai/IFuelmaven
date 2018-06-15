//通用ajax方法
function baseAjax(url, param, callback, async) {
	$.ajax({
		type : "post",
		url : url,
		async : async == undefined ? true : false,
				data : param,
				dataType : "json",
				success : function(msg) {
					callback(msg);
				},
				error : function() {
					callback();
				}
	});
}
//按钮方法
function initAdduncompliance(){
	//保存不合格配置
	$("#insert_uncompliance").click(function(){
		if(!vlidate($("#add_uncompliance"))){
			return ;
		}
		var inputs = $("input[name^='PK.']");
		var texts = $("textarea[name^='PK.']");
		var select = $("select[name^='PK.']");
		var params = {};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(3)] = obj.val();
		}
		for (var i = 0; i < texts.length; i++) {
			var obj = $(texts[i]);
			params[obj.attr("name").substr(3)] = obj.val();
		}
		for(var i = 0; i < select.length; i++){
			var obj = $(select[i]);
			params[obj.attr("name").substr(3)] = obj.val();
		}
		baseAjax("SUncompliance/UncomplianceAdd.asp",params, function(data) {
			if (data != undefined&& data.isExist=="true") {
				alert("----该规则配置存在----");			
			}else {
				if(data.result=="true"&&data.isExist=="false"){
					alert("----保存成功----");
				newOpenTab("unqualified_manage","返回列表","pages/susermanage/suncompliance/uncompliance_queryList.html");
				}
			else{
				alert("----保存失败----");
			}
			}
		});
	});
	//重置按钮
	$("#reset_uncompliance").click(function() {
		$("#Kmin_years").val("");
		$("#Kmax_years").val("");
		$("#Ksup_name").val("");
		inituncomplianceType();
	});
	//返回跳转
	$("#back_uncompliance").click(function(){
		newOpenTab("unqualified_manage","返回列表","pages/susermanage/suncompliance/uncompliance_queryList.html");
	});
}

//下拉框方法
function inituncomplianceType(){
	//初始化数据
	initSelect($("#Kemp_post"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"E_DIC_EMP_POST"});
	initSelect($("#Kuse_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"EST_USE_GRADE"});
	initSelect($("#Kqualification"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"E_DIC_QUALIFICATION"});
	initSelect($("#Kflag"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"E_FLAG"});
}

initAdduncompliance();
inituncomplianceType();