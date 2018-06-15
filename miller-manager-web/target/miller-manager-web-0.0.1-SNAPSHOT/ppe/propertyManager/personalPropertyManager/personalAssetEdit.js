var currSelectLocationPersonal = new Object();
function initPersonalAssetEditLayout(item){
	var page = $("#personalAssetStorageEditPart");
	
	initVlidate($("#personalAssetStorageEditPart"));
	if(item){
		for (var key in item) {
			page.find("input[name="+key+"]").val(item[key]);
		}
		if(item.areaType=="0103"){
			page.find("span[sel=isGroundingIn]").show();
		}
	}
	
	var step1Seles = page.find("select");
	for(var i=0; i<step1Seles.length; i++){
		var ss = $(step1Seles[i]);
		if(ss.attr("dic_code")){
			initSelect(ss, {value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:ss.attr("dic_code")}, item?item[ss.attr("name")]:null, null, null);
		}
	}
	var rowNum = 2;
	var assetType = $.trim(page.find("input[name=assetType]").val());
	lastAssetType = assetType;
	//查询公共字段
	$.getJSON("propertyFieldConfig/queryAllCommonField.asp",function(pubFieldData){
		$.getJSON("propertyFieldConfig/queryAllPrivateField.asp?category_id="+assetType,function(priFieldData){
			var appendHtml = getTableBodyHtml(pubFieldData.rows, priFieldData.rows, null);
			var table = page.find("table[sel=assetTypeTable] tbody");
			table.html("");
			table.append(appendHtml);
			//初始化select下拉选择框
			var seles = table.find("select");
			$.ajaxSettings.async = false;
			//假如是更新或查看操作
			var fieldData = null;
			if(item){
				$.getJSON("inventoryManager/assetStorage/querySubAssetStorage.asp", {serialsNumber:item.serialsNumber}, function(data){
					fieldData = data;
					for(var i in fieldData){
						var inpData = fieldData[i];
						if(inpData&&inpData.colCode){
							var obj = table.find("input[col_code="+inpData.colCode+"]");
							if(obj&&obj.length){
								obj.val(inpData.colValue);
							} else{
								obj = table.find("textarea[col_code="+inpData.colCode+"]");
								if(obj&&obj.length){
									obj.text(inpData.colValue);
								}else{
									obj = table.find("select[col_code="+inpData.colCode+"]");
									var a=inpData.colValue;
									if(obj&&obj.length){
										if (a.indexOf("-")>=0) {
											initSelect(obj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:obj.attr("diccode")}, null, null,null);
											var b=a.split("-");
											obj.select2().val(b).trigger("change");
										}else {
											initSelect(obj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:obj.attr("diccode")}, a, null,null);
										}
									}
								}
							}
						}
					}
				});
				$.getJSON("inventoryManager/assetStorage/queryGuaranteed.asp", {assetNum:item.assetNum}, function(data){
					if(data){
						for(var key in data){
							addTableRow(page.find("table[sel=tab]"), data[key]);
						}
					}
				});
			}
			$.ajaxSettings.async = true;
			for(var i=0; i<seles.length; i++){
				var sObj = seles[i];
				var value = null;
				if(fieldData){
					for(var j in fieldData){
						if(fieldData[j].colCode==$(sObj).attr("col_code")){
							value = fieldData[j].colValue;
						}
					}
				}
				initSelect($(sObj),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:$(sObj).attr("diccode")}, null, null,null);
				var a=value.split("-");
				$(sObj).select2().val(a).trigger("change");
				page.find("select,input,textarea").attr("disabled","disabled");
			}
		});
	});
	//初始化动态类型表格
	function getTableBodyHtml(pubField, priField, backPrintValue){
		var appendHtml = "";
		var fieldNum = 1;
		for ( var i = 0; i < pubField.length; i++) {
			var pub_type=pubField[i].TAG_TYPE;
			if (pub_type=="大文本框") {
				appendHtml += fieldNum%rowNum==1?"<tr>":"";
				appendHtml += getRowLine(pubField[i], "00");
				appendHtml += fieldNum%rowNum==0?"</tr>":"";
			} else {
				appendHtml += fieldNum%rowNum==1?"<tr>":"";
				appendHtml += getRowLine(pubField[i], "00");
				appendHtml += fieldNum%rowNum==0?"</tr>":"";
				fieldNum++;
			}
		}
		for ( var j = 0; j < priField.length; j++) {
			var pri_type=priField[j].TAG_TYPE;
			if (pri_type=="大文本框") {
				appendHtml += fieldNum%rowNum==1?"<tr>":"";
				appendHtml += getRowLine(priField[j], "01");
				appendHtml += fieldNum%rowNum==0?"</tr>":"";
			} else {
				appendHtml += fieldNum%rowNum==1?"<tr>":"";
				appendHtml += getRowLine(priField[j], "01");
				appendHtml += fieldNum%rowNum==0?"</tr>":"";
				fieldNum++;
			}
		}
		//补全因非结束产生的表格不全的情况;
		if(!(fieldNum%rowNum==1)){
			while(!(fieldNum%rowNum==1)){
				appendHtml += "<td colspan='2'></td>";
				fieldNum++;
			}
			appendHtml += "</tr>";
		}
		return appendHtml;
	}
	
	
	var back = page.find("button[sel=back]");
	back.click(function(){
		newOpenTab("personalassetmanager","个人资产查询","ppe/propertyManager/personalPropertyManager/personalAssetList.html");
	});
	//生成动态类型表格HTML代码
	function getRowLine(item, isPub){
		var str = "";
		str += "<td><span>" + item.TAG_NAME + ":</span></td>";
		if(item.TAG_TYPE=="文本框"){
			if (item.DEFAULT_VALUE==null) {
				item.DEFAULT_VALUE="";
				str += "<td><input style='width:330px;' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' value='"+item.DEFAULT_VALUE+"'/></td>";
			}else {
				str += "<td><input style='width:330px;' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' value='"+item.DEFAULT_VALUE+"'/></td>";
			}
		} else if(item.TAG_TYPE=="下拉框单选"){
			if (item.DEFAULT_VALUE==null) {
				item.DEFAULT_VALUE="";
				str += "<td><select style='width:344px;' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' diccode='"+item.DIC_CODE+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' val='"+item.DEFAULT_VALUE+"'></select></td>";

			} else {
				str += "<td><select style='width:344px;' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' diccode='"+item.DIC_CODE+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' val='"+item.DEFAULT_VALUE+"'></select></td>";
			}
		} else if(item.TAG_TYPE=="下拉框多选"){
			if (item.DEFAULT_VALUE==null) {
				item.DEFAULT_VALUE="";
				str += "<td><select style='width:344px;' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' diccode='"+item.DIC_CODE+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' multiple='multiple' val='"+item.DEFAULT_VALUE+"'></select></td>";

			} else {
				str += "<td><select style='width:344px;' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' diccode='"+item.DIC_CODE+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' multiple='multiple' val='"+item.DEFAULT_VALUE+"'></select></td>";
			}
		} else if(item.TAG_TYPE=="单选框"){
			if (item.DEFAULT_VALUE==null) {
				item.DEFAULT_VALUE="";
				str += "<td><select style='width:344px;' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' diccode='"+item.DIC_CODE+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' value='"+item.DEFAULT_VALUE+"'></select></td>";

			} else {
				str += "<td><select style='width:344px;' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' diccode='"+item.DIC_CODE+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' value='"+item.DEFAULT_VALUE+"'></select></td>";
			}
		} else if(item.TAG_TYPE=="大文本框"){
			if (item.DEFAULT_VALUE==null) {
				item.DEFAULT_VALUE="";
				str += "<td colspan='3'><textarea style='resize:none;height:50px;width:91.5%' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"'>"+item.DEFAULT_VALUE+"</textarea></td>";

			} else {
				str += "<td colspan='3'><textarea style='resize:none;height:50px;width:91.5%' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"'>"+item.DEFAULT_VALUE+"</textarea></td>";
			}
		}else if(item.TAG_TYPE=="日期框"){
			if (item.DEFAULT_VALUE==null) {
				item.DEFAULT_VALUE="";
				str += "<td><input style='width:330px;' readOnly='readonly' onClick='WdatePicker({})' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' value='"+item.DEFAULT_VALUE+"'/></td>";
			}else {
				str += "<td><input style='width:330px;' readOnly='readonly' onClick='WdatePicker({})' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' value='"+item.DEFAULT_VALUE+"'/></td>";
			}
		}
		
		return str;
	}
	var count=1;//行数ID后缀  
	function addTableRow(tableObj, rowData){
		var space = "";
		var trHtml="";
		if (rowData) {
			if (rowData.status=='00') {
				 trHtml="<tr align='center'><td> <div class='form-control2' ><input name='bxd' value='"+count+"' type='checkbox'/></div></td><td>"+
				    "<div class='col-sm-12'><input class='form-control' type='text' name='guaranteedNum' value='"+(rowData.guaranteedNum)+"'/></div></td><td>"+
				    "<div class='col-sm-12'><input class='form-control' type='text' name='guaranteedName' value='"+(rowData.guaranteedName)+"'/></div></td><td>"+
				    "<div class='col-sm-12'><input class='form-control' type='text' name='startDate' readOnly='readonly' onClick='WdatePicker({})' value='"+(rowData.startDate)+"'/></div></td><td>"+
				    "<div class='col-sm-12'><input class='form-control' type='text' name='endDate' readOnly='readonly' onClick='WdatePicker({})' value='"+(rowData.endDate)+"'></div></td><td>"+
				    "<div class='col-sm-12'><select class='form-control' name='status'>" +
				    "<option value='00' "+('selected')+">正常</option>" +
		    		"<option value='01' "+(space)+">过期</option></select></div></td></tr>";  
			}else if(rowData.status=='01'){
				 trHtml="<tr align='center'><td> <div class='form-control2' ><input name='bxd' value='"+count+"' type='checkbox'/></div></td><td>"+
				    "<div class='col-sm-12'><input class='form-control' type='text' name='guaranteedNum' value='"+(rowData.guaranteedNum)+"'/></div></td><td>"+
				    "<div class='col-sm-12'><input class='form-control' type='text' name='guaranteedName' value='"+(rowData.guaranteedName)+"'/></div></td><td>"+
				    "<div class='col-sm-12'><input class='form-control' type='text' name='startDate' readOnly='readonly' onClick='WdatePicker({})' value='"+(rowData.startDate)+"'/></div></td><td>"+
				    "<div class='col-sm-12'><input class='form-control' type='text' name='endDate' readOnly='readonly' onClick='WdatePicker({})' value='"+(rowData.endDate)+"'></div></td><td>"+
				    "<div class='col-sm-12'><select class='form-control' name='status'>" +
				    "<option value='00' "+(space)+">正常</option>" +
		    		"<option value='01' "+('selected')+">过期</option></select></div></td></tr>";  
			}
		}else{
			 trHtml="<tr align='center'><td> <div class='form-control2' ><input name='bxd' value='"+count+"' type='checkbox'/></div></td><td>"+
			    "<div class='col-sm-12'><input class='form-control' type='text' name='guaranteedNum' value='"+(space)+"'/></div></td><td>"+
			    "<div class='col-sm-12'><input class='form-control' type='text' name='guaranteedName' value='"+(space)+"'/></div></td><td>"+
			    "<div class='col-sm-12'><input class='form-control' type='text' name='startDate' readOnly='readonly' onClick='WdatePicker({})' value='"+(space)+"'/></div></td><td>"+
			    "<div class='col-sm-12'><input class='form-control' type='text' name='endDate' readOnly='readonly' onClick='WdatePicker({})' value='"+(space)+"'></div></td><td>"+
			    "<div class='col-sm-12'><select class='form-control' name='status'>" +
			    "<option value='00' "+(space)+">正常</option>" +
	    		"<option value='01' "+(space)+">过期</option></select></div></td></tr>";  
		}
	    count++;
	    tableObj.append(trHtml);
	    page.find("select,input,textarea").attr("disabled","disabled");
	}
	page.find("select,input,textarea").attr("disabled","disabled");
}
$("#personalAssetStorageEditPart").find("select").attr("disabled","disabled");