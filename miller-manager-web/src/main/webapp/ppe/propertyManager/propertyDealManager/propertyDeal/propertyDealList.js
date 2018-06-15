//初始化列表
function initPropertyDealListTable(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$('#Table_propertyDealList').bootstrapTable('destroy').bootstrapTable({
		url : 'AssetDeal/queryAllDeal.asp',//请求后台的URL（*）
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
		uniqueId : "DEAL_ID", //每一行的唯一标识，一般为主键列
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
			field: 'DEAL_ID',
			align: 'center',
			title : '处置流水号'
		},{
			field : 'DEAL_NAME',
			title : '处置名称',
			align : "center"
		},{
			field : 'DEAL_USER_NAME',
			title : '处置人',
			align : "center"
		}, {
			field : "DEAL_METHOD_NAME",
			title : "处置方式",
			align : "center"
		} , {
			field : "GET_USER_NAME",
			title : "赠予/买断人",
			align : "center"
		} , {
			field : "GET_BELONG_NAME",
			title : "赠予/买断人部门",
			align : "center"
		},{
			field : "DEAL_DATE",
			title : "添加时间",
			align : "center"
		},{
			field : "FINISH_DATE",
			title : "赠予/买断时间",
			align : "center"
		},{
			field : "DEAL_PRICE",
			title : "买断金额",
			align : "center"
		},{
			field : "DEAL_STATUS",
			title : "处置状态",
			align : "center"
		}]
	});
}
//初始化按钮
function initpropertyDealListBtnEvent(){
	//重置按钮
	$('#reset_propertyDealList').bind('click', function(e) {
		$("#propertyDealList_form input,select").val(" ");
		$("#propertyDealList_form select").select2();
	});
	//高级查询按钮 
	$("#showMore_propertyDealList").click(function() {
		showMore($(this),"#moreSearch_propertyDealList");
		showMore($(this),"#moreSearch2_propertyDealList");
	});
	//查询
	$('#select_propertyDealList').click(function(){
		var deal_id=$.trim($('#PDLdeal_id').val());
		var deal_name=$.trim($('#PDLdeal_name').val());
		var deal_method=$.trim($('#PDLdeal_method').val());
		var deal_user_name=$.trim($('#PDLdeal_user_name').val());
		var deal_status=$.trim($('#PDLdeal_status').val());
		$('#Table_propertyDealList').bootstrapTable('refresh',{
			url:'AssetDeal/queryAllDeal.asp?deal_id='+deal_id+'&deal_method='+deal_method+'&deal_status='+deal_status
			+'&deal_name='+escape(encodeURIComponent(deal_name))+'&deal_user_name='+escape(encodeURIComponent(deal_user_name))	
		});
	});
	//新增按钮
	$("#add_propertyDealList").click(function(){
		newOpenTab("addPropertyDeal","新增处置","ppe/propertyManager/propertyDealManager/propertyDeal/addPropertyDeal.html");	
	});
	//修改按钮
	$("#update_propertyDealList").click(function(){
		var id = $("#Table_propertyDealList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var deal_status = id[0].DEAL_STATUS;
		if(deal_status=="已买断"||deal_status=="已赠予"){
			alert("该信息为已买断/已赠予状态，不能修改");
			return;
		}
		newOpenTab("addPropertyDeal","修改处置","ppe/propertyManager/propertyDealManager/propertyDeal/addPropertyDeal.html");
		initupdateDeal(id[0]);
	});
	//删除按钮
	$("#delete_propertyDealList").click(function(){
		var id = $("#Table_propertyDealList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		var ids = id[0].DEAL_ID;  
		var deal_status = id[0].DEAL_STATUS;
		if(deal_status=="已买断"||deal_status=="已赠予"){
			alert("该信息为已买断/已赠予状态，不能删除");
			return;
		}
		nconfirm("确定删除该数据吗？",function(){
			baseAjax("AssetDeal/deleteDeal.asp",{"ids":ids}, function(data) {
				if (data != undefined && data != null&& data.result == "true") {
					alert("删除成功！");
					$('#select_propertyDealList').click();
				}else{
					alert("删除失败！");
				}
			},true);
		});
	});
	//查看按钮
	$("#view_propertyDealList").click(function(){
		var id = $("#Table_propertyDealList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		newOpenTab("viewPropertyDeal","查看处置","ppe/propertyManager/propertyDealManager/propertyDeal/viewPropertyDeal.html");
		initviewDealInfo(id[0]);
		initassetDealInfoList(id[0]);
	});
	//确认按钮
	$("#sure_propertyDealList").click(function(){
		var id = $("#Table_propertyDealList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行确认!");
			return ;
		}
		var deal_status = id[0].DEAL_STATUS;
		if(deal_status=="已买断"||deal_status=="已赠予"){
			alert("该信息为已买断/已赠予状态，不能确认");
			return;
		}
		var params={};
		if(id[0].DEAL_METHOD=="01"){//买断
			params["DEAL_STATUS"]="03";//已买断
		}else{//02赠予
			params["DEAL_STATUS"]="04";//已赠予
		}
		params["DEAL_ID"]=id[0].DEAL_ID;
		nconfirm("确定确认该数据吗？",function(){
		baseAjax("AssetDeal/sureDealInfo.asp",params, function(data) {
	       	if (data != undefined && data != null&&data.result=="true" ) {
	       		alert("----确认成功----");
	       		$('#select_propertyDealList').click();
				}else{
					alert("----确认失败----");
				}
			});
		});
	});
}
autoInitSelect($("#propertyDealList_form"));
initpropertyDealListBtnEvent();
initPropertyDealListTable();