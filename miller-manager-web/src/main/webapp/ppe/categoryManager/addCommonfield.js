//新增或修改公共字段
function addOrUpdateCommonField(){
	//需要字典项时显示字典项输入框
	$("tr[sel=tableColumnName_HIde]").hide();
	$("#tag_type").change(function() {
		var value = $("#tag_type").val();
		if(value == '02' || value =='03') {
			$("tr[sel=tableColumnName_HIde]").show();
		} else {
			$("tr[sel=tableColumnName_HIde]").hide();
		}
	});
	//重置按钮
	$("#resetCommonField").click(function(){
		$("input[name^='CF.']").val("");
		initSelectCommonField();
	});
	
	//返回按钮
	$("#backCommonFieldList").click(function(){
		newOpenTab("commonFieldList","资产公共字段配置","ppe/categoryManager/propertyFieldConfigure.html");
	});
	
	//保存按钮
	$("#saveCommonField").click(function(event){
		//event.stopPropagation(); 	 //阻止事件冒泡，这个很重要。否则激活li 的click事件
		if(!vlidate($("#commonFieldInfo"),"",true)){
			return ;
		}
		var inputs = $("input[name^='CF.']");
		var selects = $("select[name^='CF.']");
		var params = {};	
		//取值
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val();	 
		}
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(3)] = $(selects[i]).val(); 
		}	
		params["is_common"]="00";//公共字段
        baseAjax("propertyFieldConfig/addOrUpdateField.asp", params, function(data) {
        	if (data != undefined && data != null && data.result==true) {
				alert("保存成功");
				$("#backCommonFieldList").click();
			}else{
				alert("保存失败");
			}
		});
	});
}

//修改字段信息时初始化数据
function initOneFieldData(p) {
	baseAjax("propertyFieldConfig/queryOneFieldInfo.asp?col_id="+p, null , function(data) {
		if(data["tag_type"] == "02"||data["tag_type"] == "03") {
			$("tr[sel=tableColumnName_HIde]").show();
		} else {
			$("tr[sel=tableColumnName_HIde]").hide();
		}
		for(var k in data){
			$("input[name='CF." + k + "']").val(data[k]);
			$("select[name='CF." + k + "']").val(data[k]);
		}
		//查询后，初始化下拉选的值
		initSelect($("#col_required"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"CAT_DIC_COL_REQUIRED"},data.col_required);
		initSelect($("#tag_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"CAT_DIC_TAG_TYPE"},data.tag_type);
	});
}


//新增时初始化下拉选
function initSelectCommonField(){
	initSelect($("#col_required"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"CAT_DIC_COL_REQUIRED"});
	initSelect($("#tag_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"CAT_DIC_TAG_TYPE"});
}
initVlidate($("#commonFieldInfo"));
initSelectCommonField();
addOrUpdateCommonField();
