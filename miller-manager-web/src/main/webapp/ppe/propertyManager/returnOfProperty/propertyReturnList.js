//初始化按钮事件
function initAssetReturnBtnEvent(){
	//查询按钮
	$("#select_assetReturnList").click(function(){
		var asset_num = $.trim($("#RPRasset_num").val());
		var asset_name = $.trim($("#RPRasset_name").val());
		var real_user_name = $.trim($("#RPRreal_user_name").val());
		var is_return = $.trim($("#RPRis_return").val());
		$('#Table_assetReturnList').bootstrapTable('refresh',{
			url:'AssetReturn/queryAllReturnInfo.asp?asset_num='+asset_num
			+'&asset_name='+escape(encodeURIComponent(asset_name))
			+'&real_user_name='+escape(encodeURIComponent(real_user_name))
			+'&is_return='+escape(encodeURIComponent(is_return))});
	});
	//重置按钮
	$('#reset_assetReturnList').bind('click', function(e) {
		$("#assetreturn_form input,select").val("");
		$("#assetreturn_form select").select2();
	});
	//高级查询按钮 
	$("#showMore_assetReturnList").click(function() {
		showMore($(this),"#moreSearch_assetReturnList");
	});
	//归还登记按钮
	$("#propertyReturnRegist").click(function(){
		var id = $("#Table_assetReturnList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行登记!");
			return ;
		}
		var is_return = id[0].IS_RETURN_VAL;
		if(is_return=="已归还"){
			alert("该资产已归还，不能进行登记");
			return;
		}
		newOpenTab("propertyReturnRegist","归还登记","ppe/propertyManager/returnOfProperty/propertyReturnRegist.html");
		initgetReturnInfo(id[0]);
	});
	//查看按钮
	$("#readPropertyReturnDet").click(function(){
		var id = $("#Table_assetReturnList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		var is_return = id[0].IS_RETURN_VAL;
		newOpenTab("viewPropertyReturn","归还查看","ppe/propertyManager/returnOfProperty/viewPropertyReturn.html");
		initviewtReturnInfo(id[0],is_return);
	});
}
//列表显示
function initAssetReturnInfoList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$('#Table_assetReturnList').bootstrapTable({
		url : 'AssetReturn/queryAllReturnInfo.asp',//请求后台的URL（*）
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
		uniqueId : "ASSET_NUM", //每一行的唯一标识，一般为主键列
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
		},{
			field : 'ASSET_NUM',
			title : '资产编码',
			align : "center"
		}, {
			field : 'ASSET_NAME',
			title : '资产名称',
			align : "center"
		}, {
			field : 'ASSET_TYPE_VAL',
			title : '资产类别',
			align : "center"
		}, {
			field : "REAL_USER_NAME",
			title : "使用人",
			align : "center"
		} , {
			field : "REAL_USER_ORG_NAME",
			title : "使用人机构",
			align : "center"
		} , {
			field : "REAL_ADDRESS",
			title : "资产使用地址",
			align : "center"
		},{
			field : "GET_DATE",
			title : "领取时间",
			align : "center"
		},{
			field : "IS_RETURN_VAL",
			title : "是否归还",
			align : "center"
		},{
			field : "RETURN_USER_NAME",
			title : "归还登记人",
			align : "center"
		}]
	});
}

initAssetReturnInfoList();
initAssetReturnBtnEvent();
autoInitSelect($("#assetreturn_form"));