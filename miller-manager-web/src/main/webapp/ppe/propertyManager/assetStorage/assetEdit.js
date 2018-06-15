var currSelectLocation = new Object();
function initAssetEditLayout(item){
	var assetInfo = new Object();
	
	var page = $("#assetStorageEditPart");
	var step1Seles = page.find("select");
	for(var i=0; i<step1Seles.length; i++){
		var ss = $(step1Seles[i]);
		if(ss.attr("dic_code")){
			initSelect(ss, {value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:ss.attr("dic_code")}, item?item[ss.attr("name")]:null, null, null);
		}
	}
	var assetTypeTree = page.find("input[name=assetTypeName]");
	if(item){
		for (var key in item) {
			page.find("input[name="+key+"]").val(item[key]);
		}
	}
	initTree("assetTypeTree");//内含隐藏显示存放机柜信息方法
	
	initVlidate($("#assetStorageEditPart"));
	
	if(item==null){
		//getSeriaNumber();
		//setTimeout(getSeriaNumber(), 1000);ie8不兼容
		setTimeout(function(){
			getSeriaNumber()
			}, 1000);
	}
	function getSeriaNumber(){
		var sn = page.find("input[name=serialsNumber]");
		sn.val(returnSerialNumber("AS","ASS_SEQ_ASSET_STORAGE"));
		//获取当前用户信息，机构和时间
		baseAjax("AssetRepair/getuserinfo.asp",null, function(data) {
			if(data!=null){
				page.find("input[name=createUser]").val(data.user_no);
				page.find("input[name=createUserName]").val(data.user_name);
				page.find("input[name=createOrg]").val(data.org_no);
				page.find("input[name=createOrgName]").val(data.org_name);
			}
		});
	}
	
	
	
	page.find(".step2").hide();
	
	
	if(!item){
		assetTypeTree.click(function(){
			var treeObj = page.find("div[sel=assetTypeTree]");
			//树形之外隐藏树
			$("#body").mousedown(function(){
				$("#body").unbind("mousedown");
				treeObj.hide();
			});
			treeObj.mouseout(function(){
				$("#body").unbind("mousedown");
				$("#body").mousedown(function(){
					treeObj.hide();
					$("#body").unbind("mousedown");
				});
			});
			treeObj.mouseover(function(){
				$("#body").unbind("mousedown");
			});
			treeObj.show();
		});
	}
	var nextStep = page.find("button[sel=nextAssetEdit]");
	var lastAssetType = "";
	var rowNum = 2;
	nextStep.click(function(){
		//判断当前步骤数据完整性
		if(!vlidate(page.find("div[sel=assetEditView]"),"",true)){
			 return;
		}
		var aa = page.find("input[name=assetNum]").val();
		//TODO
		var assetType = $.trim(page.find("input[name=assetType]").val());
		if(!assetType){
			alert("请先选择类别");
			return ;
		}
		if(lastAssetType&&lastAssetType==assetType){
			page.find("div[sel=assetTpyeView]").show();
			page.find("div[sel=assetEditView]").hide();
			page.find(".step1").hide();
			page.find(".step2").show();
		}else if(!(lastAssetType==assetType)||assetType == item.assetType){
			lastAssetType = assetType;
			//可设置列数
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
						$.ajaxSettings.async = true;
					}else {
						$.ajaxSettings.async = true;
						autoInitSelect(table);
						var sobj = table.find("select");
						for(var i = 0;i<sobj.length;i++){
							var b=$(sobj[i]).attr("val").split(",");
							$(sobj[i]).select2().val(b).trigger("change");
						}
					}	
				});
			});
			page.find("div[sel=assetTpyeView]").show();
			page.find("div[sel=assetEditView]").hide();
			page.find(".step1").hide();
			page.find(".step2").show();
		}
	});
	
	var preStep = page.find("button[sel=preAssetEdit]");
	preStep.click(function(){
		alert("若更换类别，当前页面未保存的改动数据将丢失");
		page.find("div[sel=assetTpyeView]").hide();
		page.find("div[sel=assetEditView]").show();
		page.find(".step2").hide();
		page.find(".step1").show();
	});
	
	var save = page.find("button[sel=save]");
	save.click(function(){
		upload(false);
	});

	var commit = page.find("button[sel=commit]");
	commit.click(function(){
		upload(true);
	});
	
	var back = page.find("button[sel=back]");
	back.click(function(){
		newOpenTab("assetStorageList","资产申请","ppe/propertyManager/assetStorage/assetList.html");
	});
	
	var openWin = page.find(" button[sel=openWin]");
	openWin.click(function(){
		open_win();
	});
	
	function upload(isCommit){
		if(!vlidate($("#assetStorageEditPart"),"",true)){
			 return;
		 }
		startLoading();
		var serialsNumber = page.find("input[name=serialsNumber]").val();
		var assetEditView = page.find("div[sel=assetEditView]");
		var assetTypeView = page.find("table[sel=assetTypeTable]");
		var inputs = assetEditView.find("input");
		var selects = assetEditView.find("select");
		var textarea = assetEditView.find("textarea[name=descr]");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			assetInfo[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < selects.length; i++) {
			var obj = $(selects[i]);
			assetInfo[obj.attr("name")] = $.trim(obj.val());
		}
		assetInfo[textarea.attr("name")] = $.trim(textarea.val());
		var typeInputs = assetTypeView.find("input[type='text']");
		var typeSelects = assetTypeView.find("select");
		var typeTextareas = assetTypeView.find("textarea");
		var len = 0;
		for(var i=0; i<typeInputs.length; i++){
			var obj = $(typeInputs[i]);
			if(obj.attr("col_code")){//ie8不知为何，多了一个无关的input对象，用此过滤
				assetInfo["subList["+len+"].serialsNumber"] = serialsNumber;
				assetInfo["subList["+len+"].colCode"] = obj.attr("col_code");
				assetInfo["subList["+len+"].colName"] = obj.attr("name");
				assetInfo["subList["+len+"].colValue"] = obj.val()?obj.val():"null";
				assetInfo["subList["+len+"].isCommon"] = obj.attr("is_common");
				len++;
			}
		}
		for(var i=0; i<typeSelects.length; i++){
			var obj = $(typeSelects[i]);
			assetInfo["subList["+len+"].serialsNumber"] = serialsNumber;
			assetInfo["subList["+len+"].colCode"] = obj.attr("col_code");
			assetInfo["subList["+len+"].colName"] = obj.attr("name");
			var a=obj.val();
			if (a instanceof Array) {
				if (a.length==1) {
					var c=a[0];
					assetInfo["subList["+len+"].colValue"] = obj.val()?c:"null";
				} else if(a.length>1) {
					var b=a.join("-");
					assetInfo["subList["+len+"].colValue"] = obj.val()?b:"null";
				}
			}else {
				assetInfo["subList["+len+"].colValue"] = obj.val()?a:"null";
			}
			assetInfo["subList["+len+"].isCommon"] = obj.attr("is_common");
			len++;
		}
		for(var i=0; i<typeTextareas.length; i++){
			var obj = $(typeTextareas[i]);
			assetInfo["subList["+len+"].serialsNumber"] = serialsNumber;
			assetInfo["subList["+len+"].colCode"] = obj.attr("col_code");
			assetInfo["subList["+len+"].colName"] = obj.attr("name");
			assetInfo["subList["+len+"].colValue"] = obj.val()?obj.val():"null";
			assetInfo["subList["+len+"].isCommon"] = obj.attr("is_common");
			len++;
		}
		
		//整合保修单信息
		var trs = page.find("table[sel=tab] tbody tr");
		for(var i=0; i<trs.length; i++){
			var gInputs = $(trs[i]).find("input");
			assetInfo["guaranteedList["+i+"].assetNum"] = assetInfo.assetNum;
			assetInfo["guaranteedList["+i+"].guaranteedNum"] = $(gInputs[1]).val();
			assetInfo["guaranteedList["+i+"].guaranteedName"] = $(gInputs[2]).val();
			assetInfo["guaranteedList["+i+"].startDate"] = $(gInputs[3]).val();
			assetInfo["guaranteedList["+i+"].endDate"] = $(gInputs[4]).val();
			assetInfo["guaranteedList["+i+"].status"] = $(trs[i]).find("select").val();
		}
		assetInfo.residualVal = 0;
		$.post("inventoryManager/assetStorage/saveAssetStorage.asp", assetInfo, function(result){
			endLoading();
			if(result.result){
				alert("保存成功");
				newOpenTab("assetStorageList","资产入库","ppe/propertyManager/assetStorage/assetList.html");
			} else {
				alert("保存失败，"+result.msg);
			}
		}, 'json');
	}
	
	/* */
	function open_win(){
		//初始化当前地址对象
		if(item){
			currSelectLocation.storagePlace = item.storagePlace;
			currSelectLocation.storagePlaceName = item.storagePlaceName;
			currSelectLocation.floor = item.floor;
			currSelectLocation.floorName = item.floorName;
			currSelectLocation.machineRoom = item.machineRoom;
			currSelectLocation.machineRoomName = item.machineRoomName;
			currSelectLocation.cabinet = item.cabinet;
			currSelectLocation.cabinetNum = item.cabinetNum;
			currSelectLocation.layer = item.layer;
		}
		var treeObj = $.fn.zTree.getZTreeObj("assTypeTree");
		if($("#assetType").val()){
			var areaType = getAreaType(treeObj, $("#assetType").val());
			if(areaType=="0103"){
				$.post("ppe/propertyManager/assetStorage/computerroomMapConfiguration.html", function(data){
					var str = '<div class="modal-header">'
							+'<button type="button" class="close" data-dismiss="modal" title="点击关闭aa">×</button>'
							+'<h5 id="myModalLabel">选择资产类型</h5></div>';
					$("#myModal_aa").append(str + data);
					$("#myModal_aa").modal("show");
					myModal_computerroomMapInit(areaType, item);
				});
				$("#myModal_aa").on('hide.bs.modal', function () {
					currSelectLocation = new Object();
				});
			} else if(areaType=="0102"){
				initModalbb();
			}
		} else {
			alert("请先选择类型");
		}
	}
	var modalBB = $("div[sel=myModal_bb]");
	var edificeBBObj = modalBB.find("select[sel=workplace_edifice]");
	var floorBBObj = modalBB.find("select[sel=workplace_floor]");
	var areaBBObj = modalBB.find("select[sel=workplace_area]");
	var buildingData;
	var floorData;
	function initModalbb(){
		$.post("Config/queryareatreelist.asp", function(result){
			var treeObj = $.fn.zTree.getZTreeObj("assTypeTree");
			tempData = treeObj.transformTozTreeNodes(result);
			buildingData = tempData[0].children;
			selectAppendByData(edificeBBObj, {value:"id",text:"name"}, buildingData, currSelectLocation.storagePlace?currSelectLocation.storagePlace:null);
			if(buildingData[0].children.length>0){
				selectAppendByData(floorBBObj, {value:"id",text:"name"}, buildingData[0].children, currSelectLocation.storagePlace?currSelectLocation.storagePlace:null);
				if(buildingData[0].children[0].children.length>0){
					selectAppendByData(areaBBObj, {value:"id",text:"name"}, buildingData[0].children[0].children, currSelectLocation.area?currSelectLocation.area:null);
				} else {
					areaBBObj.empty();
				}
			} else {
				floorBBObj.empty();
			}
			modalBB.modal("show");
		},"json");
	}
	
	edificeBBObj.change(function(){
		var val = edificeBBObj.val();
		for(var key in buildingData){
			floorData = buildingData[key].children;
			if(buildingData[key].id==val){
				selectAppendByData(floorBBObj, {value:"id",text:"name"}, floorData, currSelectLocation.floor?currSelectLocation.floor:null);
				if(floorData[0].children.length>0){
					selectAppendByData(areaBBObj, {value:"id",text:"name"}, floorData[0].children, currSelectLocation.area?currSelectLocation.area:null);
				} else {
					areaBBObj.empty();
				}
				return ;
			}
		}
	});
	floorBBObj.change(function(){
		var val = edificeBBObj.val();
		for(var key in floorData){
			var areaData = floorData[key].children;
			if(floorData[key].id==val){
				selectAppendByData(areaBBObj, {value:"id",text:"name"}, areaData, currSelectLocation.area?currSelectLocation.area:null);
			}
		}
	});
	modalBB.find("button[sel=modal_save]").click(function(){
		page.find("input[name=storagePlace]").val(edificeBBObj.val());
		page.find("input[name=storagePlaceName]").val(edificeBBObj.find("option:selected").text());
		page.find("input[name=floor]").val(floorBBObj.val());
		page.find("input[name=floorName]").val(floorBBObj.find("option:selected").text());
		page.find("input[name=machineRoom]").val(areaBBObj.val());
		page.find("input[name=machineRoomName]").val(areaBBObj.find("option:selected").text());
		modalBB.modal("hide");
	});
	
	function getAreaType(treeObj, key){
		var nodes = treeObj.getNodesByParam("id", key, null);
		if(nodes[0].id == "0102" || nodes[0].id == "0103"){
			return nodes[0].id;	
		} else {
			return getAreaType(treeObj,nodes[0].pid);
		}
	}
	
	$('#myModal_aa').on('hide.bs.modal', function () {
		$("#myModal_aa").children().remove();
	});
	
	/*$("#aa").click(function(){
		$("#myModal_aa2").modal("show");
	});*/
	
	//初始化树的方法
	function initTree(treeId){
		assetTypeTree.after('<div sel="'+treeId+'" id="assTypeTree" class="ztree" style="display:none;overflow-y: scroll;z-index: 1000;background-color: white;border:1px solid #CDCDCD;height:200px;width:23%;overflow:auto;position:absolute;">&nbsp;&nbsp;</div>');
		var treeObj = page.find("div[sel="+treeId+"]");
		//树形之外隐藏树
		$("#body").mousedown(function(){
			$("#body").unbind("mousedown");
			treeObj.hide();
		});
		treeObj.mouseout(function(){
			$("#body").unbind("mousedown");
			$("#body").mousedown(function(){
				treeObj.hide();
				$("#body").unbind("mousedown");
			});
		});
		treeObj.mouseover(function(){
			$("#body").unbind("mousedown");
		});
		var setting = {
				view : {
					dblClickExpand : false,
					showLine : true,
					selectedMulti : false
				},
				data : {
					simpleData : {
						enable : true,
						idKey : "id",
						pIdKey : "pid",
						rootPId : ""
					}
				},
				
				callback : {
					onClick : function(event, treeId, treeNode) {
						page.find("input[name=assetType]").val(treeNode.id);
						page.find("input[name=assetTypeName]").val(treeNode.name);
						//生成资产条形码编号
						/*baseAjax("inventoryManager/assetStorage/createAssetNum.asp",{"asset_type":treeNode.id}, function(data) {
							if(data != undefined && data!=null){
								page.find("input[name=assetNum]").val(data.assetNum);
							}
						});*/
						var org =$("#main_user_name").attr("org_no");
						page.find("input[name=assetNum]").val(returnSerialNumber2("ZC",org,"ASS_SEQ_ASSET_ASSETNUM"));
						var ztreeObj = $.fn.zTree.getZTreeObj("assTypeTree");
						var areaType = getAreaType(ztreeObj, treeNode.id);
						if(areaType=="0103"){
							page.find("tr[sel=isTypeIt]").show();
							page.find("span[sel=isGroundingIn]").show();
							page.find("span[sel=isTypeItNo]").show();
						} else if(areaType=="0102"){
							page.find("span[sel=isGroundingIn]").hide();
							page.find("span[sel=isTypeItNo]").hide();
							page.find("tr[sel=isTypeIt]").hide();
						}
						treeObj.hide();
					}
				}
			};
		$.getJSON("propertyTypeConfig/queryAllAssetCategroy.asp", function(result){
			for(var key in result){
				if(result[key].id=="01"){
					result.splice(key, 1);
				}
			}
			var zTreeObj = $.fn.zTree.init(treeObj, setting, result);
			if($("#assetType").val()){
				var tt = getAreaType(zTreeObj, $("#assetType").val());
				if(tt=='0103'){
					page.find("tr[sel=isTypeIt]").show();
					page.find("input[name=isGrounding]").show();
					page.find("span[sel=isGroundingIn]").show();
					page.find("span[sel=isTypeItNo]").show();
				}
			}
			zTreeObj.expandAll(true);
		});
	}
	
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
	//生成动态类型表格HTML代码
	function getRowLine(item, isPub){
		var str = "";
		str += "<td><span>" + item.TAG_NAME + ":</span></td>";
		if(item.TAG_TYPE=="文本框"){
			if (item.DEFAULT_VALUE==null) {
				item.DEFAULT_VALUE="";
				str += "<td><input style='width:330px;' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' value='"+item.DEFAULT_VALUE+"' /></td>";
			}else {
				str += "<td><input style='width:330px;' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' value='"+item.DEFAULT_VALUE+"' /></td>";
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
				str += "<td><input style='width:330px;' readOnly='readonly' onClick='WdatePicker({})' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' value='"+item.DEFAULT_VALUE+"' /></td>";
			}else {
				str += "<td><input style='width:330px;' readOnly='readonly' onClick='WdatePicker({})' type='text' maxlength='"+item.MAX_LENGTH+"' col_code='"+item.COL_ID+"' name='"+item.CATEGORY_NAME+"' is_common='"+isPub+"' value='"+item.DEFAULT_VALUE+"' /></td>";
			}
		}
		
		return str;
	}
	
	var addRow = page.find("button[sel=addRow]");
	addRow.click(function(){
		addTableRow(page.find("table[sel=tab]"), null);
	});
	
	var tableData = page.find("button[sel=getTableData]");
	tableData.click(function(){
		
	});
	
	var delRow = page.find("button[sel=delRow]");
	delRow.click(function(){
		table = page.find("table[sel=tab]");
		var chobj= table.find("input[name=bxd]");
		chobj.each(function(){  
		    if($(this).is(":checked")){
		    	delid += $(this).val()+",";  
		        $(this).parent().parent().parent().remove();  
		    }  
		});  
	});
	var count=1;//行数ID后缀  
	var delid="";//删除的ID  
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
	}
	//全选功能  
	
	var checkAll = page.find("input[sel=allCkb]");
	checkAll.click(function(){
		if(checkAll.is(":checked")){
			page.find("table[sel=tab] input[name=bxd]:checkbox").attr("checked", true);
		}else{  
			page.find("table[sel=tab] input[name=bxd]:checkbox").attr("checked", false);
		}
	});
}