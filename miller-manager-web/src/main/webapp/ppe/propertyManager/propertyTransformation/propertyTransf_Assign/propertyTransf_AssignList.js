//初始化按钮事件
function initAssetAssignBtnEvent(){
	//查询按钮
	$("#select_AssignInfoList").click(function(){
		var transferasset_name = $.trim($("#PTtransferasset_name").val());
		var assign_status = $.trim($("#PTassign_status").val());
		$('#deptAssign_tableInfo').bootstrapTable('refresh',{
			url:'AssetTransferPer/queryAllAssetAssignInfo.asp?assign_status='+assign_status
			+'&transferasset_name='+escape(encodeURIComponent(transferasset_name))});
	});
	//重置按钮
	$('#reset_AssignInfo').bind('click', function(e) {
		$("#propertyAssignInfo input,select").val("");
		$("#propertyAssignInfo select").select2();
	});
	//调拨分配按钮
	$("#propertyTransf_Assign").click(function(){
		var id = $("#deptAssign_tableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行分配!");
			return ;
		}
		var assign_status = id[0].ASSIGN_STATUS_NAME;
		if(assign_status=="已分配"){
			alert("该信息已分配，不能进行分配");
			return;
		}
		newOpenTab("propertyTransf_AssignRegist","调拨分配","ppe/propertyManager/propertyTransformation/propertyTransf_Assign/propertyTransf_AssignRegist.html");
		initassetAssignInfo(id[0]);
	});
	//查看按钮
	$("#viewpropertyTransf_Assign").click(function(){
		var id = $("#deptAssign_tableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		newOpenTab("viewpropertyTransf_Assign","查看","ppe/propertyManager/propertyTransformation/propertyTransf_Assign/viewpropertyTransf_Assign.html");
		initviewtassetAssignInfo(id[0]);
	});
}
//列表显示
function initAssetAssignInfoList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$('#deptAssign_tableInfo').bootstrapTable({
		url : 'AssetTransferPer/queryAllAssetAssignInfo.asp',//请求后台的URL（*）
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
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
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
			field: 'TRANSFER_ID',
			align: 'center',
			title : '资产调拨流水号'
		},{
			field: 'TRANSFERASSET_NAME',
			align: 'center',
			title : '资产调拨名称'
		},{
			field : 'TRANSFER_EMP_NAME',
			title : '转移人名称',
			align : "center"
		},{
			field : 'TRANSFER_DEPT_NAME',
			title : '转移部门',
			align : "center"
		}, {
			field : "ACCEPT_EMP_NAME",
			title : "接收人名称",
			align : "center"
		} , {
			field : 'ACCEPT_DEPT_NAME',
			title : '接收部门',
			align : "center"
		},  {
			field : "TRANSFER_DATE",
			title : "转移发起日期",
			align : "center"
		},{
			field : "TRANSFER_COMPLETED_DATE",
			title : "转移时间",
			align : "center"
		},{
			field : "ASSIGN_STATUS_NAME",
			title : "分配状态",
			align : "center"
		}]
	});
}

initAssetAssignInfoList();
initAssetAssignBtnEvent();
autoInitSelect($("#propertyAssignInfo"));