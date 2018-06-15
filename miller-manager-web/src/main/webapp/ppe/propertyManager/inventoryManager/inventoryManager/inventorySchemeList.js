autoInitSelect($("#searchDiv_inventorySchemeList"));//初始化字典项
initInventorySchemeListTable1();//初始化列表
initInventorySchemeListBtnEvent();//初始化按钮事件
//初始化列表
function initInventorySchemeListTable1(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#tb_inventorySchemeList").bootstrapTable("destroy").bootstrapTable({
		url : 'InventorySchemeManager/queryAllScheme.asp',//请求后台的URL（*）
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
		},{
			field : 'PLAN_NUM',
			title : '计划编号',
			align : "center"
		},{
			field : 'PLAN_NAME',
			title : '计划名称',
			align : "center"
		}, {
			field: 'SCHEME_NUM',
			align: 'center',
			title : '方案编号',
			width:'15%',
			formatter: function (value, row, index) {
				if(!value){
					value = "待制定方案";
				}
				return '<span class="viewDetail" '+
				'onclick="viewDetail_inventorySchemeist('+index+')">'+value+'</span>';
			}
		},{
			field : 'SCHEME_NAME',
			title : '方案名称',
			align : "center"
		},{
			field : 'PRO_TYPE_NAME_abbr',
			title : '资产类型',
			align : "center",
			formatter : function(value, row, index){
				var content = row.PRO_TYPE_NAME;
				var val = content;
				var length = content.length;
				if(length > 12){
					var abbrText = content.substring(0, 10) + "......";
					val = '<abbr hed="资产类型:" title="'+content+'" onclick="abbrModalEvent(this)">' + abbrText + '</abbr>';
				}
				return val;
			}
		}, {
			field : 'AREA_NAME',
			title : '盘点部门',
			align : "center"
		}, {
			field : "INVEN_PATTERN_NAME",
			title : "盘点方式",
			align : "center"
		} , {
			field : "PLAN_EMP",
			title : "创建人",
			align : "center"
		} , {
			field : "CREATE_DATE",
			title : "创建时间",
			align : "center"
		} , {
			field : "END_TIME",
			title : "要求完成时间",
			align : "center"
		},{
			field : "IMPORT_STATE_NAME",
			title : "录入状态",
			align : "center"
		},{
			field : "SCHEME_STATE_NAME",
			title : "方案状态",
			align : "center"
		}]
	});
}
//初始化按钮事件
function initInventorySchemeListBtnEvent(){
	 var currTab = getCurrentPageObj();//当前页
	//重置按钮
	 currTab.find('#reset_inventorySchemeList').bind('click', function(e) {
		$("#searchDiv_inventorySchemeList input,select").val("");
		$("#searchDiv_inventorySchemeList select").select2();
	});
	//高级查询按钮 
	 currTab.find("#showMore_inventorySchemeList").click(function() {
		showMore($(this),"#moreSearch_inventorySchemeList");
		showMore($(this),"#moreSearch2_inventorySchemeList");
	});
	//更多按钮
	 currTab.find("#moreIlsh_inventorySchemeList").click(function(){
		moreIlsh($(this),"#submenuList_inventorySchemeList");
	});
	//查询
	 currTab.find('#search_inventorySchemeList').click(function(){
		var scheme_num = $.trim($("#scheme_num_inventorySchemeList").val());
		var scheme_name = $.trim($("#scheme_name_inventorySchemeList").val());
		var scheme_state = $.trim($("#scheme_state_inventorySchemeList").val());
		var plan_emp = $.trim($("#plan_emp_inventorySchemeList").val());
		var create_date = $.trim($("#create_date_inventorySchemeList").val());
		var plan_end_time = $.trim($("#plan_end_time_inventorySchemeList").val());
		$('#tb_inventorySchemeList').bootstrapTable('refresh',{
			url:'InventorySchemeManager/queryAllScheme.asp?scheme_num='+scheme_num
			+'&scheme_name='+escape(encodeURIComponent(scheme_name))
			+'&scheme_state='+scheme_state+'&create_date='+create_date
			+'&plan_emp='+plan_emp+'&plan_end_time='+plan_end_time});
	});
	//制定方案
	 currTab.find('#makeScheme_inventorySchemeList').click(function() {
		var id = $("#tb_inventorySchemeList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据制定!");
			return;
		}
		var state_name=id[0].SCHEME_STATE_NAME;
		if(state_name!='待制定方案'){
			alert("该计划已制定方案！");
			return;
		}
		pageDispatchSchemeList("makeScheme",id[0]);
	});
	//执行盘点
	currTab.find('#executeInv_inventorySchemeList').click(function() {
		var id =  currTab.find("#tb_inventorySchemeList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据执行!");
			return;
		}
		var state_name=id[0].SCHEME_STATE_NAME;
		if(state_name=='待制定方案'){
			alert("该计划尚未制定方案！");
			return;
		}
		if(state_name!='待执行'){
			alert("该计划已执行！");
			return;
		}
		nconfirm("是否确定执行盘点 ?",function(){
			baseAjax("InventorySchemeManager/executeScheme.asp", {scheme_num:id[0].SCHEME_NUM}, function(data) {
				if (data != undefined && data != null) {
					alert(data.msg);
					$('#search_inventorySchemeList').click();
				}else{
					alert("网络错误！");
				}
			},true);
		 });
	});
	//查看详情
	 currTab.find('#detail_inventorySchemeList').click(function() {
		var id =  currTab.find("#tb_inventorySchemeList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		var state_name=id[0].SCHEME_STATE_NAME;
		if(state_name=='待制定方案'){
			alert("该计划尚未制定方案，不能查看");
			return;
		}
		var inven_content_type = id[0].INVEN_CONTENT_TYPE;
		if(inven_content_type == "00"){//盘点权证类型
			pageDispatchSchemeList("detailSchemeWarrant",id[0]);
		}else if(inven_content_type == "01"){//盘点非权证类型
			pageDispatchSchemeList("detailScheme",id[0]);
		}
		
	});
	//导入盘点结果
	 currTab.find('[btn="insert_result"]').click(function(){
		 currTab.find("#fielIda_insertResult").val("");
		 currTab.find("#insert_result_file").val("");
		 currTab.find("[mod='insertResultzPop']").modal("show");
	});
	//模态框导入按钮
	 currTab.find('[btn="insert"]').click(function(){
		if(!$.trim(currTab.find("#insert_result_file").val())){
			alert("请选择文件上传");
			return;
		}
		$.ajaxFileUpload({
		    url:"InventorySchemeManager/insertResult.asp",
		    type:"post",
			secureuri:false,
			fileElementId:'insert_result_file',
			data:'',
			dataType: 'json',
			success:function (data){
				endLoading();
				alert(data.msg);
				currTab.find("[mod='insertResultzPop']").modal("hide");
			},
			error: function (data){
				endLoading();
				alert(data.msg);
			}
	   });
		
	});
	//手工录入结果
	 currTab.find('#write_inventorySchemeList').click(function() {
		var id = $("#tb_inventorySchemeList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行录入!");
			return;
		}
		var scheme_state = id[0].SCHEME_STATE_NAME;
		if(scheme_state!="执行中"){
			alert("不是执行中状态!");
			return;
		}
		pageDispatchSchemeList("handMakeResult",id[0]);
	});
	//确定盘点结果
	 currTab.find('#get_inventorySchemeList').click(function() {
		var id =  currTab.find("#tb_inventorySchemeList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行确定结果!");
			return;
		}
		var state = id[0].IMPORT_STATE_NAME;
		var scheme_state = id[0].SCHEME_STATE_NAME;
		if(state!="已录入"){
			alert("请先录入盘点结果!");
			return;
		}
		if(scheme_state=="已完成"){
			alert("该方案已确定盘点结果!");
			return;
		}
		var inven_content_type = id[0].INVEN_CONTENT_TYPE;
		nconfirm("是否确定结果？",function(){
	        baseAjax("InventorySchemeManager/confirmResult.asp",
	        		{id : id[0].ID, 
	        		scheme_num : id[0].SCHEME_NUM,
	        		inven_content_type : inven_content_type},
	        	function(data) {
	        	if(data != undefined && data != null){
	        		if(data.result=="true"){
	        			 currTab.find('#search_inventorySchemeList').click();
	        		}
	        		alert(data.msg);
	        	}
	        });
		});
	});
	//导出excel
	 currTab.find("#export_excel").bind('click', function(e) {
		var id = $("#tb_inventorySchemeList").bootstrapTable('getSelections');
		var state_name=id[0].SCHEME_STATE_NAME;
		if(state_name=='待制定方案'){
			alert("该计划尚未制定方案，不能导出");
			return;
		}
		var ids = $.map(id, function (row) {
			return row.SCHEME_NUM;
			});
		url ="InventorySchemeManager/exportExcelInfoById.asp?pkId="+ids;
		window.location.href = url;
	});
	 //自助盘点
	 currTab.find("[btn='self_invenManage']").click(function() {
		var id =  currTab.find("#tb_inventorySchemeList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行管理!");
			return;
		}
		var inven_content_type = id[0].INVEN_CONTENT_TYPE;
		if(inven_content_type == "00"){//权证类型盘点
			alert("该方案不可自助盘点!");
			return;
		}
		var scheme_state = id[0].SCHEME_STATE_NAME;
		if(scheme_state!="执行中"){
			alert("该方案不是执行中的状态!");
			return;
		}
		pageDispatchSchemeList("selfInvenManage",id[0]);
	 });
	 
	 //导出盘点设备文件(导出.json文件)
	currTab.find("[btn='exportToEquip']").click(function() {
		var id =  currTab.find("#tb_inventorySchemeList").bootstrapTable('getSelections');
		if(id.length < 1 ){
			alert("请选择数据进行导入!");
			return;
		}
		var schemes = "";
		for(var i = 0; i < id.length; i ++){
			var state_name=id[i].SCHEME_STATE_NAME;
			if(state_name!='执行中'){
				alert("方案:" + id[i].SCHEME_NUM + "不是执行中状态，不能导出盘点");
				return;
			}
			schemes += id[i].SCHEME_NUM + "&&";
		}
		schemes = JSON.stringify(id);
		baseAjax("InventorySchemeManager/exportToEquip.asp",
        		{schemes : schemes},
        	function(data) {
        	if(data != undefined && data != null){
        		alert(data.msg);
        	}
        });
	 });
}
//页面跳转
function pageDispatchSchemeList(key,params){
	if(key=="makeScheme"){
		newOpenTab("makeScheme","制定方案","ppe/propertyManager/inventoryManager/inventoryManager/newInventoryScheme.html");
		initPlanInfo_newInventoryScheme(params);
	}else if(key=="handMakeResult"){
		newOpenTab("handMakeResult","手工录入结果","ppe/propertyManager/inventoryManager/inventoryManager/handMakeResult.html");
		initHandMakeResultLayOut(params);
	}else if(key=="detailScheme") {
		newOpenTab("detailScheme","详情","ppe/propertyManager/inventoryManager/inventoryManager/schemeDetail.html");
		initShemeDeatilLayOut(params);
	}else if(key=="selfInvenManage") {
		newOpenTab("selfInvenManage","自助盘点管理","ppe/propertyManager/inventoryManager/inventoryManager/selfInvenManage.html");
		initSelfInvenManageLayOut(params);
	}else if(key=="detailSchemeWarrant") {
		newOpenTab("detailScheme","详情","ppe/propertyManager/inventoryManager/inventoryManager/schemeWarrantDetail.html");
		initShemeWarrantDeatilLayOut(params);
	}
}
//查看详情
function viewDetail_inventorySchemeist(index){
	var params = $("#tb_inventorySchemeList").bootstrapTable('getData')[index];
	if(params.SCHEME_STATE_NAME=="已完成"){
		var inven_content_type = params.INVEN_CONTENT_TYPE;
		if(inven_content_type == "00"){
			pageDispatchSchemeList("detailSchemeWarrant",params);//initDeatilSheme(key,params)key值用于后面判断
		}else if(inven_content_type == "01"){
			pageDispatchSchemeList("detailScheme",params);//initDeatilSheme(key,params)key值用于后面判断
		}
	}else if(params.SCHEME_STATE_NAME=="待制定方案"){
		pageDispatchSchemeList("makeScheme",params);
	}else if(params.SCHEME_STATE_NAME=="执行中"){
		pageDispatchSchemeList("handMakeResult",params);
	}else if(params.SCHEME_STATE_NAME=="待执行"){
		alert("方案待执行!");
	}
}

