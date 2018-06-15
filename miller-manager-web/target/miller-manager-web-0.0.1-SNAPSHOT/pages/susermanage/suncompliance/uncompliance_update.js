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
function initUpdateuncompliance(){
	//保存不合格配置
	$("#update_uncompliance").click(function(){
		if(!vlidate($("#up_uncompliance"),"",true)){
			return ;
		}
		var inputs = $("input[name^='HG.']");
		var texts = $("textarea[name^='HG.']");
		var select = $("select[name^='HG.']");
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
			params[obj.attr("name").substr(3)] = obj.val();		}
		baseAjax("SUncompliance/UncomplianceUpdate.asp",params, function(data) {
			if (data != undefined&& data.isExist=="true") {
				alert("----该规则配置存在----");
			}
				else {
					if(data.result=="true"&&data.isExist=="false"){
					alert("----修改成功----");
				newOpenTab("unqualified_manage","返回列表","pages/susermanage/suncompliance/uncompliance_queryList.html");
			}else{
				alert("----修改失败----");
			}
		}
		});
	});
	//重置按钮
	$("#reset_upcompliance").click(function() {
		$("#Gmin_years").val("");
		$("#Gmax_years").val("");
		$("#Gsup_name").val("");
		initSelect($("#Gemp_post"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"E_DIC_EMP_POST"});
		initSelect($("#Guse_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"EST_USE_GRADE"});
		initSelect($("#Gqualification"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"E_DIC_QUALIFICATION"});
		initSelect($("#Gflag"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"E_FLAG"});
	});
	//返回跳转
	$("#back_upcompliance").click(function(){
		newOpenTab("unqualified_manage","返回列表","pages/susermanage/suncompliance/uncompliance_queryList.html");
	});
	//供应商模态框跳转
	$("#Gsup_name").click(function(){
		openSupplierPop("updateuncompliance",{parent_company:$("#Gsup_name")});
	});	
}
//下拉框方法
function initupuncomplianceType(emp_post,use_grade,qualification,flag){
	//初始化数据
	initSelect($("#Gemp_post"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"E_DIC_EMP_POST"},emp_post);
	initSelect($("#Guse_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"EST_USE_GRADE"},use_grade);
	initSelect($("#Gqualification"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"E_DIC_QUALIFICATION"},qualification);
	initSelect($("#Gflag"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"E_FLAG"},flag);
}

initupuncomplianceType();