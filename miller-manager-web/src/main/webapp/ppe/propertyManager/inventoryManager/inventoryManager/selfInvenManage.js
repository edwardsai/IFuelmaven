function initSelfInvenManageLayOut(params){
	
	var currTab = getCurrentPageObj();//当前页
	var table = currTab.find("#get_SchemeInfoTable");//可自助资产列表对象
	//初始化方案信息
	for ( var k in params) { 
		if(k=="SCHEME_STATE_NAME"){
			var stl;
			if(params[k]=="已完成"){
				stl="statesBg statesBg_inuse";
			}else if(params[k]=="待制定方案"){
				stl="statesBg statesBg_unuse";
			}else{
				stl="statesBg statesBg_underuse";
			}
			currTab.find("span[name='IN." + k + "']").attr("class",stl);
		}
		currTab.find("[name='IN." + k + "']").html(params[k]);
	}
	
	//初始化方案清单列表
	var scheme_num = params.SCHEME_NUM;
	initDeatilSchemeInfo(scheme_num);
	
	//发起自助盘点按钮
	currTab.find("[btn='startInven']").click(function(){
		var ids = table.bootstrapTable("getSelections");
		if(ids.length < 1){
			alert("请选择资产发起盘点");
			return;
		}
		var assets = "";
		for(var i = 0; i < ids.length; i ++){
			if(ids[i].CHECK_STATE_NAME != "待发起"){
				alert("编号为：" + ids[i].PROPERTY_NUM +" 的资产不是待发起状态");
				return;
			}
			assets += ids[i].PROPERTY_NUM + "&&";
		}
		baseAjax("InventorySchemeManager/startSelfInven.asp",
				{"scheme_num":scheme_num,"assets":assets.substring(0,assets.length - 2)},
				function(data) {
			if (data != undefined && data != null) {
				if(data.result == "true"){
					initDeatilSchemeInfo(scheme_num);
				}
				alert(data.msg);
			}else{
				alert("网络错误！");
			}
		},true);
	});
	
	//打回按钮
	currTab.find("[btn='backInven']").click(function(){
		var ids = table.bootstrapTable("getSelections");
		if(ids.length < 1){
			alert("请选择资产打回");
			return;
		}
		for(var i = 0; i < ids.length; i ++){
			if(ids[i].CHECK_STATE_NAME != "审批中"){
				alert("编号为：" + ids[i].PROPERTY_NUM +" 的资产不是审批中状态");
				return;
			}else if(ids[i].INVEN_STATE == "01"){//未盘点
				alert("编号为：" + ids[i].PROPERTY_NUM +" 的资产未盘点,无需打回");
				return;
			}
		}
		initVlidate(currTab.find("#myModal_selfInvenManage"));
		currTab.find("#myModal_selfInvenManage").modal('show');
		
	});
	
	//模态框打回按钮
	currTab.find("[btn='mdlSave']").click(function(){
		if(!vlidate(currTab.find("#myModal_selfInvenManage"),"999999",true)){
			return;
		}
		var ids = table.bootstrapTable("getSelections");
		var assets = "";
		for(var i = 0; i < ids.length; i ++){
			assets += ids[i].PROPERTY_NUM + "&&";
		}
		var repulse_remark = currTab.find("[name='repulse_remark']").val();
		baseAjax("InventorySchemeManager/backInvenResult.asp",
				{"scheme_num":scheme_num,"assets":assets.substring(0,assets.length - 2),
				"repulse_remark":repulse_remark},
				function(data) {
			if (data != undefined && data != null) {
				if(data.result == "true"){
					currTab.find("#myModal_selfInvenManage").modal('hide');
					initDeatilSchemeInfo(scheme_num);
				}
				alert(data.msg);
			}else{
				alert("网络错误！");
			}
		},true);
	});
	
	//审批通过按钮
	currTab.find("[btn='throughInven']").click(function(){
		var ids = table.bootstrapTable("getSelections");
		if(ids.length < 1){
			alert("请选择资产");
			return;
		}
		for(var i = 0; i < ids.length; i ++){
			if(ids[i].CHECK_STATE_NAME != "审批中"){
				alert("编号为：" + ids[i].PROPERTY_NUM +" 的资产不是审批中状态");
				return;
			}
		}
		var alertText = "是否确定通过?";
		var unCheckNum="";
		for(var i = 0; i < ids.length; i ++){
			if(ids[i].INVEN_STATE == "01"){//未盘点
				unCheckNum += ids[i].PROPERTY_NUM + ",";
			}
		}
		if(unCheckNum){
			alertText = "编号为：" + unCheckNum.substring(0, unCheckNum.length - 1) +
						" 的资产还未盘点，若审批通过将视这些资产盘点正常。是否确定通过？";
		}
		nconfirm(alertText,function(){
			var assets = "";
			for(var i = 0; i < ids.length; i ++){
				assets += ids[i].PROPERTY_NUM + "&&";
			}
			baseAjax("InventorySchemeManager/throughSelfInven.asp",
					{"scheme_num":scheme_num,"assets":assets.substring(0,assets.length - 2),
					},
					function(data) {
				if (data != undefined && data != null) {
					if(data.result == "true"){
						initDeatilSchemeInfo(scheme_num);
					}
					alert(data.msg);
				}else{
					alert("网络错误！");
				}
			},true);
		});
	});
	
	//返回按钮
	currTab.find("[btn='goBack']").click(function(){
		newOpenTab("inventorySchemeList","返回","ppe/propertyManager/inventoryManager/inventoryManager/inventorySchemeList.html");
	});
	
	
/**************************内部方法*******************************/	
	//初始化方案可自助盘点清单列表
	function initDeatilSchemeInfo(scheme_num){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		table.bootstrapTable("destroy").bootstrapTable({
			url : 'InventorySchemeManager/querySelfListBySchemeNum.asp?scheme_num='+scheme_num,//请求后台的URL（*）
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: false,
			onLoadSuccess : function(data){
 				currTab.find("[name='IN.TOTAL_AMOUNT']").html(data.total);//总数
				var index = 0;
				var Adata = data.rows;
				for(var i = 0; i < Adata.length; i++){
					if(Adata[i].INVEN_RESULT == "01"){//01正常02盘盈03盘亏
						index++;
					}
				}
				currTab.find("[name='IN.NORMAL_AMOUNT']").html(index);//正常
				currTab.find("[name='IN.PROFIT_AMOUNT']").html(0);//盘盈,不可能盘盈
				currTab.find("[name='IN.LOST_AMOUNT']").html(data.total - index);//盘亏
			},
			columns : [{
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
			}, {
				field: 'PROPERTY_NUM',
				align: 'center',
				title : '资产编号',
			},{
				field : 'ASSET_NAME',
				title : '资产名称',
				align : "center"
			}, {
				field : 'REAL_USER',
				title : '使用人',
				align : "center"
			}, {
				field : "INVEN_STATE",
				title : "自助盘点状态",
				align : "center",
				formatter : function(value, row, index){
					if(value=="00"){
						return "<span class='statesBg statesBg_inuse'>已盘</span>";
					}else if(value=="01"){
						return "<span class='statesBg statesBg_underuse'>未盘</span>";
					}
				}
			},{
				field : "INVEN_RESULT_NAME",
				title : "盘点结果",
				align : "center",
			}, {
				field : "PHOTOS",
				title : "附件图片",
				align : "center",
				formatter : function(value, row, index){
					var photos = "";
					if(row.PHOTO_ADDRESS1){
						photos = "<a class='viewDetail' target='_blank' href='" + row.PHOTO_ADDRESS1 + "'>附图1</a>";
					}
					if(row.PHOTO_ADDRESS2){
						photos  += ", <a class='viewDetail' target='_blank' href='" + row.PHOTO_ADDRESS2 + "'>附图2</a>";
					}
					if(row.PHOTO_ADDRESS3){
						photos  += ", <a class='viewDetail' target='_blank' href='" + row.PHOTO_ADDRESS3 + "'>附图3</a>";
					}
					return photos;
				}
			},{
				field : "RESULT_MARK",
				title : "盘点结果说明",
				align : "center",
			},{
				field : "REPULSE_REMARK",
				title : "打回备注",
				align : "center"
			},{
				field : "CHECK_STATE_NAME",
				title : "审核状态",
				align : "center",
			}]
		});
	}
}

