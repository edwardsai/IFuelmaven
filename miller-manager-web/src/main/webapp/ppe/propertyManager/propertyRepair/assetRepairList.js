//初始化按钮事件
function initAssetRepairBtnEvent(){
	//查询按钮
	$("#select_assetRepairList").click(function(){
		var asset_name = $.trim($("#ARasset_name").val());
		var repair_status = $.trim($("#ARrepair_status").val());
		var apply_user = $.trim($("#ARrepair_result").val());
		var rep_id = $.trim($("#ARrep_id").val());
		$('#Table_assetRepairList').bootstrapTable('refresh',{
			url:'AssetRepair/queryallRepair.asp?repair_status='+repair_status
			+'&asset_name='+escape(encodeURIComponent(asset_name))
			+'&apply_user='+escape(encodeURIComponent(apply_user))
			+'&rep_id='+escape(encodeURIComponent(rep_id))});
	});
	//重置按钮
	$('#reset_assetRepairList').bind('click', function(e) {
		$("#search_assetRepairList input").val("");
		$("#search_assetRepairList select").val(" ");
		$("#search_assetRepairList select").select2();
	});
	//高级查询按钮 
	$("#showMore_assetRepairList").click(function() {
		showMore($(this),"#moreSearch_assetRepairList");
	});
	//新增按钮
	$("#add_assetRepair").click(function(){
		pageDispatchRepair(this,"add_assetRepair","");
	});
	//修改按钮
	$("#update_assetRepair").click(function(){
		var id = $("#Table_assetRepairList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var repair_status = id[0].REPAIR_STATUS_NAME;
		if(repair_status!="待提交"){
			alert("该信息不是待提交状态，不能修改");
			return;
		}
		pageDispatchRepair(this,"update_assetRepair",id[0].ID);
	});
	//查看按钮
	$("#view_assetRepair").click(function(){
		var id = $("#Table_assetRepairList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		var repair_status = id[0].REPAIR_STATUS_NAME;
		pageDispatchRepair(this,"view_assetRepair",id[0].ID,repair_status);
	});
	//提交维修按钮
	$("#submit_assetRepair").click(function(){
		var id = $("#Table_assetRepairList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行提交!");
			return ;
		}
		var repair_status = id[0].REPAIR_STATUS_NAME;
		if(repair_status!="待提交"){
			alert("该信息不是待提交状态，不能提交");
			return;
		}
		nconfirm("确定提交该数据吗？",function(){
		baseAjax("AssetRepair/submitRepair.asp",{"id":id[0].ID}, function(data) {
	       	if (data != undefined && data != null&&data.result=="true" ) {
	       		alert("----提交成功----");
	       		$("#select_assetRepairList").click();
				}else{
					alert("----提交失败----");
				}
			});
		});
	});
	//删除按钮
	$("#delete_assetRepair").click(function(){
		var id = $("#Table_assetRepairList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		var ids = id[0].ID;  
		repair_status = id[0].REPAIR_STATUS_NAME;
		if(repair_status!="待提交"){
			alert("该信息不是待提交状态，不能删除");
			return;
		}
		nconfirm("确定删除该数据吗？",function(){
			baseAjax("AssetRepair/deleteRepair.asp",{"ids":ids}, function(data) {
				if (data != undefined && data != null&& data.result == "true") {
					alert("删除成功！");
					$("#select_assetRepairList").click();
				}else{
					alert("删除失败！");
				}
			},true);
		});
	});
}
//列表显示
function initAssetRepairList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$('#Table_assetRepairList').bootstrapTable({
		url : 'AssetRepair/queryallRepair.asp',//请求后台的URL（*）
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
			field: 'REP_ID',
			align: 'center',
			title : '流水号'
		},{
			field : 'ASSET_NUM',
			title : '资产编码',
			align : "center"
		}, {
			field : 'ASSET_NAME',
			title : '资产名称',
			align : "center"
		}, {
			field : 'ASSET_TYPE_NAME',
			title : '资产类别',
			align : "center"
		},{
			field : "USER_NO",
			title : "申请人编号",
			align : "center",
			visible:false
		}, {
			field : "APPLY_USER_NAME",
			title : "申请人",
			align : "center"
		} , {
			field : "APPLY_DATE",
			title : "申请时间",
			align : "center"
		},{
			field : "REQUIRED_DATE",
			title : "要求完成时间",
			align : "center"
		},{
			field : "REPAIR_STATUS_NAME",
			title : "维修状态",
			align : "center"
		},{
			field : "REPAIR_RESULT_NAME",
			title : "维修结果",
			align : "center"
		}]
	});
}
//跳转方法
function pageDispatchRepair(obj,key,params,repair_status){
	if("add_assetRepair"==key){
		newOpenTab("addAssetRepair","新增维修","ppe/propertyManager/propertyRepair/addAssetRepair.html", function(){
		});
		return;
	}else { 
		baseAjax("AssetRepair/queryOneRepair.asp?id="+params, null , function(data) {
			if("update_assetRepair"==key){
				newOpenTab("addAssetRepair","修改维修","ppe/propertyManager/propertyRepair/addAssetRepair.html", function(){
					initAssetRepairUpdate(data);
				});
			}else if("view_assetRepair"==key){
				newOpenTab("viewAssetRepair","查看维修","ppe/propertyManager/propertyRepair/viewAssetRepair.html",function(){
					initviewRepairInfo(data,repair_status);
				});
			}
		});
	}
}

initAssetRepairList();
initAssetRepairBtnEvent();
autoInitSelect($("#search_assetRepairList"));