//初始化按钮
function initaddPropertyDiscardButton(){
	//人员
	$('input[name="APS.SCRAP_APPLY_USER"]').val($("#main_user_name").attr("user_no"));
	$('input[name="APS.SCRAP_APPLY_USER_NAME"]').val($("#main_user_name").attr("user_name"));
	//流水号
	$("#APSscrap_id").val(returnSerialNumber("PDD", "ASS_SEQ_ASSET_SCARP"));
	//时间
	$("#APSscrap_apply_date").val(returnTodayData());
	//类别点击
//	$("#APSscrapasset_type").unbind("click");
//	$("#APSscrapasset_type").click(function(){
//		openSelectTreeDiv($(this),"assetPropertyTransf","propertyTypeConfig/queryAllCategroy.asp",{width:$(this).width()+"px","margin-left": "0px"},function(node){
//			$("#APSscrapasset_type").val(node.name);
//			$("input[name='APS.SCRAPASSET_TYPE']").val(node.id);
//			return true;
//		});
//	});
	//返回
	$("#back_addPropertyDiscard").click(function(){
		newOpenTab("propertydiscardlist", "返回", "ppe/propertyManager/propertyDealManager/propertyDiscarding/propertyDiscardList.html");
	});
	//保存
	$("#save_addPropertyDiscard").click(function(){
		if (!vlidate($("#assetScarp_add"), "", true)) {
			return;
		}
		var inputs=$("input[name^='APS.']");
		var textareas=$("textarea[name^='APS.']");
		var params={};
		for ( var int = 0; int < inputs.length; int++) {
			params[$(inputs[int]).attr("name").substr(4)]=$(inputs[int]).val();
		}
		for ( var int2 = 0; int2 < textareas.length; int2++) {
			params[$(textareas[int2]).attr("name").substr(4)]=$(textareas[int2]).val();
		}
		params["APPROVE_STATE"]="01";
		var id=$("#table_PropertyDiscard_addAsset").bootstrapTable("getData");
		$.each(id, function(i){
			id[i].SCRAP_ID=params.scrap_id;
		});	
		var new_id=$("#table_PropertyDiscard_addAsset").bootstrapTable("getData");
		params["new_id"]=JSON.stringify(new_id);
		baseAjax("PropertyDiscard/addOrupdateScarp.asp", params, function(data){
			if (data!=undefined&&data!=null&&data.result=="true") {
				alert("保存成功");
				newOpenTab("propertydiscardlist", "返回", "ppe/propertyManager/propertyDealManager/propertyDiscarding/propertyDiscardList.html");
			}else {
				alert("保存失败");
			}
		});
	});
	//提交
	$("#submit_addPropertyDiscard").click(function(){
		if (!vlidate($("#assetScarp_add"), "", true)) {
			return;
		}
		var inputs=$("input[name^='APS.']");
		var textareas=$("textarea[name^='APS.']");
		var params={};
		for ( var int = 0; int < inputs.length; int++) {
			params[$(inputs[int]).attr("name").substr(4)]=$(inputs[int]).val();
		}
		for ( var int2 = 0; int2 < textareas.length; int2++) {
			params[$(textareas[int2]).attr("name").substr(4)]=$(textareas[int2]).val();
		}
		params["APPROVE_STATE"]="02";
		
		var id=$("#table_PropertyDiscard_addAsset").bootstrapTable("getData");
		$.each(id, function(i){
			id[i].SCRAP_ID=params.scrap_id;
		});	
		var new_id=$("#table_PropertyDiscard_addAsset").bootstrapTable("getData");
		params["new_id"]=JSON.stringify(new_id);
		
		baseAjax("PropertyDiscard/addOrupdateScarp.asp", params, function(data){
			if (data!=undefined&&data!=null&&data.result=="true") {
				alert("保存成功");
				newOpenTab("propertydiscardlist", "返回", "ppe/propertyManager/propertyDealManager/propertyDiscarding/propertyDiscardList.html");
			}else {
				alert("保存失败");
			}
		});
	});
}
//修改页面赋值
function initpropertyDiscardListUpdate(params){
	for ( var k in params) { 
		//var k1=k.toLowerCase();
		if(k=="SCRAP_REMARK"){
			$("textarea[name='APS." +k+ "']").val(params[k]);
		}else{
			 $("input[name='APS." +k+ "']").val(params[k]);
		}
	}
	$("#table_PropertyDiscard_addAsset").bootstrapTable("refresh",{
		url:"PropertyDiscard/queryByScrapId.asp?scrap_id="+params.SCRAP_ID});
}
//列表
function initAsset_PropertyDiscardInfo(){
	$("#table_PropertyDiscard_addAsset").bootstrapTable({
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		/*queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 5,//可供选择的每页的行数（*）
*/		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ASSET_NUM", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : 'ASSET_NUM',
			title : '资产编码',
			align : "center"
		}, {
			field : "ASSET_NAME",
			title : "资产名称",
			align : "center"
		}, {
			field : "ASSET_TYPE",
			title : "资产类型",
			align : "center"
		},{
			field : "STATUS_NAME",
			title : "资产状态",
			align : "center",
		}, {
			field : "STORAGE_PLACE",
			title : "存放地址",
			align : "center"
		},{
			field : "SCRAP_DATE",
			title : "报废时间",
			align : "center",
		}]
	});
}
//资产模态框
function assetScarpPop(){
	var queryParams=function(params){
		var temp={
			limit:params.limit,
			offset:params.offset
		};
		return temp;
	};
	$("#table_addPropertyDiscard").bootstrapTable("destroy").bootstrapTable({
		url : "PropertyDiscard/queryAllAssetInfo.asp?",
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "SERIALS_NUMBER", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: false,
		columns :[{
				checkbox:true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			},{
				field : 'Number',
				title : '序号',
				align : "center",
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
	        	field : 'ASSET_TYPE',
				title : '资产类型',
				align : "center"
	        }, {
	        	field : "ASSET_NUM",
				title : "资产编号",
				align : "center"
	        }, {
	        	field : "ASSET_NAME",
				title : "资产名称",
				align : "center",
	        }, {
	        	field : "STATUS_NAME",
				title : "资产状态",
				align : "center"
	        },{
	        	field : "CREATE_USER_NAME",
				title : "登记人",
				align : "center"
	        }, {
				field : "STORAGE_PLACE",
				title : "存放地址",
				align : "center"
			},{
	        	field : "SCRAP_DATE",
				title : "报废时间",
				align : "center"
	        }]
	});
}
function Pop_assetTable(){
	//新增按钮
	$("#add_addPropertyDiscard").click(function(){
//		if($("input[name='APS.SCRAPASSET_TYPE_NAME']").val()==""){
//			alert("请先选择资产类型");
//			return;
//		}
		$("#myModal_addPropertyDiscard").modal("show");
		assetScarpPop();
	});
	//删除
	$("#delete_addPropertyDiscard").click(function(){
		var id=$("#table_PropertyDiscard_addAsset").bootstrapTable("getSelections");
		var ids=id[0].ASSET_NUM;
		$("#table_PropertyDiscard_addAsset").bootstrapTable("removeByUniqueId",ids);
	});
}
//模态框按钮
function PopbuttonDemo(){
	//选择按钮
	$("#addModal_addPropertyDiscard").click(function(e){
		if($("#table_addPropertyDiscard").find("input[type='checkbox']").is(':checked')){
			var rol = $("#table_addPropertyDiscard").bootstrapTable('getSelections');
			var select = $("#table_PropertyDiscard_addAsset").bootstrapTable('getData');
			for(var i=0;i<rol.length;i++){
				for(var j=0;j<select.length;j++){
					if(rol[i].ASSET_NUM==select[j].ASSET_NUM){
						var id=select[j].ASSET_NUM;
						$('#table_PropertyDiscard_addAsset').bootstrapTable("removeByUniqueId", id);
					}
				}
				$('#table_PropertyDiscard_addAsset').bootstrapTable("append",rol[i]);
			}
			$("#myModal_addPropertyDiscard").modal("hide");
		}else{
			e.preventDefault();
	        $.Zebra_Dialog('请选择一条或多条要添加的记录!', {
	            'type':     'close',
	            'title':    '提示',
	            'buttons':  ['是'],
	            'onClose':  function(caption) {
	            	if(caption=="是"){
	            	}
	            }
	        });
		}
	});
	//高级查询
	$("#seniorSearch_addPropertyDiscard").click(function(){
		showMore($(this),"#moreSearch_propertyDiscardAssset");
	});
	//查询
	$("#searchModal_addPropertyDiscard").click(function(){
		var asset_name=$("#PropertyAsset_name").val();
		var asset_num=$("#PropertyAsset_num").val();
		var scrap_date=$("#PropertyDiscard_date").val();
		var asset_state=$("#PropertyAsset_state").val();
		$("#table_addPropertyDiscard").bootstrapTable("refresh",{
			url:"PropertyDiscard/queryAllAssetInfo.asp?asset_name="+escape(encodeURIComponent(asset_name))+"&scrap_date="+escape(encodeURIComponent(scrap_date))+"&asset_state="+asset_state+"&asset_num="+escape(encodeURIComponent(asset_num))
		});
	});
	//重置
	$("#reset_addPropertyDiscard").click(function(e){
		$("#modal_body_addPropertyDiscard input,select").val("");
		$("#modal_body_addPropertyDiscard select").select2();
	});
	
/*	$("input[name='APD.scrap_apply_user']").unbind();
	$("input[name='APD.scrap_apply_user']").click(function(){
		openUserPop("userDiv_PropertyDiscard",{"name":$("input[name='APD.scrap_apply_user']")});
	});*/
}


initaddPropertyDiscardButton();
autoInitSelect($("#assetScarp_add"));
initVlidate($("#assetScarp_add"));
initAsset_PropertyDiscardInfo();
Pop_assetTable();
PopbuttonDemo();
autoInitSelect($("#moreSearch_propertyDiscardAssset"));
