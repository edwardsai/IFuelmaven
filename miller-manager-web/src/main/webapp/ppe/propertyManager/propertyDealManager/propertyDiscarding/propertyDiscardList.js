function initpropertyDiscardListEventButton(){
	//类别点击
//	$("#scrapasset_type").unbind("click");
//	$("#scrapasset_type").click(function(){
//		openSelectTreeDiv($(this),"assetpropertyDiscardList","propertyTypeConfig/queryAllCategroy.asp",{width:$(this).width()+"px","margin-left": "125px"},function(node){
//			$("#scrapasset_type").val(node.name);
//			$("input[name='scrapasset_type_id']").val(node.id);
//			return true;
//		});
//	});
	//高级查询
	$("#showMore_propertyDiscard").click(function(){
		showMore($(this),"#moreSearch_propertyDiscard");
	});
	//查询
	$("#selectPropretyDiscard").click(function(){
		var scrap_id = $.trim($("#APDscrap_id").val());
		var scrap_name=$.trim($("#APDscrap_name").val());
		//var scrapasset_type = $.trim($("input[name='scrapasset_type_id']").val());
		var apply_user = $.trim($("#APDscrap_apply_user").val());
		var approve_state = $.trim($("#APDapprove_state").val());
		$('#table_propertyDiscard_info').bootstrapTable('refresh',{
			url:'PropertyDiscard/queryallScrap.asp?approve_state='+approve_state
			+'&scrap_name='+escape(encodeURIComponent(scrap_name))
			+'&scrap_id='+escape(encodeURIComponent(scrap_id))
			+'&apply_user='+escape(encodeURIComponent(apply_user))});
	});
	
	//重置
	$('#resetPropertyDiscard').bind('click', function(e) {
		$("#asset_propertyDiscard input,select").val(" ");
		$("#asset_propertyDiscard select").select2();
	});
	//新增
	$("#add_propertyDiscardList").click(function(){
		pageDispatchPropertyDiscard(this, "add_propertyDiscardList", "");
	});
	//修改
	$("#update_propertyDiscardList").click(function(){
		var id=$("#table_propertyDiscard_info").bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行修改");
			return;
		}

		var assetScrap_approvestate=id[0].APPROVE_STATE_NAME;
		if (assetScrap_approvestate!="待发起") {
			alert("该信息不是待发起状态，不能修改");
			return;
		}
		pageDispatchPropertyDiscard(this, "update_propertyDiscardList",id[0]);
	});
	//删除
	$("#delete_propertyDiscardList").click(function(){
		var id=$("#table_propertyDiscard_info").bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行删除");
			return;
		}
		var ids=id[0].SCRAP_ID;
		var assetScrap_approvestate=id[0].APPROVE_STATE_NAME;
		if (assetScrap_approvestate!="待发起") {
			alert("该信息不是待发起状态，不能删除");
			return;
		}
		nconfirm("确定删除该数据吗？",function(){
			baseAjax("PropertyDiscard/deleteScrap.asp", {"ids":ids}, function(data){
				if (data!=undefined&&data!=null&&data.result=="true") {
					alert("删除成功");
					$("#selectPropretyDiscard").click();
				}else{
					alert("删除失败");
				}
			},true);
		});
	});
	//查看
	$("#viewApp_propertyDiscardList").click(function(){
		var id=$("#table_propertyDiscard_info").bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行查看");
			return;
		}
		pageDispatchPropertyDiscard("this", "viewApp_propertyDiscardList",id[0]);
	});
	//提交
	$("#app_propertyDiscardList").click(function(){
		var id = $("#table_propertyDiscard_info").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行提交!");
			return ;
		}
		var assetScrap_approvestate = id[0].APPROVE_STATE_NAME;
		if(assetScrap_approvestate!="待发起"){
			alert("该信息不是待发起状态，不能提交");
			return;
		}
		nconfirm("确定提交该数据吗？",function(){
		baseAjax("PropertyDiscard/submitScarp.asp",{"scrap_id":id[0].SCRAP_ID}, function(data) {
	       	if (data != undefined && data != null&&data.result=="true" ) {
	       		alert("----提交成功----");
	       		$("#selectPropretyDiscard").click();
				}else{
					alert("----提交失败----");
				}
			});
		});
	});
	//审批通过
	$("#passApp_propertyDiscardList").click(function(){
		var id=$("#table_propertyDiscard_info").bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行操作");
			return;
		}
		var app_state=id[0].APPROVE_STATE_NAME;
		if(app_state!="审批中"){
			alert("该记录为非审批中状态！");
			return;
		}
		var scrap_id=id[0].SCRAP_ID;
		nconfirm("确定通过审批吗？",function(){
			baseAjax("PropertyDiscard/passAppScrap.asp", {"scrap_id":scrap_id}, function(data){
				if (data!=undefined&&data!=null&&data.result=="true") {
					alert("审批通过");
					$("#selectPropretyDiscard").click();
				}else{
					alert("通过失败");
				}
			},true);
		});
	});
	
}
//跳转方法
function pageDispatchPropertyDiscard(obj,key,params){
	if ("add_propertyDiscardList"==key) {
		newOpenTab("propertyDiscardList", "新增报废","ppe/propertyManager/propertyDealManager/propertyDiscarding/addPropertyDiscard.html",function(){});
		return;
	}else {
			if ("update_propertyDiscardList"==key) {
				newOpenTab("updatepropertyDiscardList", "修改", "ppe/propertyManager/propertyDealManager/propertyDiscarding/addPropertyDiscard.html",function(){
					initpropertyDiscardListUpdate(params);
				});
			}else if("viewApp_propertyDiscardList"==key){
				newOpenTab("viewApppropertyDiscardList", "查看", "ppe/propertyManager/propertyDealManager/propertyDiscarding/appPropertyDiscard.html",function(){
					initviewApppropertyDiscardList(params);
				});
			}
		
	}
}

//列表显示
function initAssetScrapList(){
	var queryParams=function(params){
		var temp={
				limit:params.limit,
				offset:params.offset
		};		
		return temp;
	};
	$("#table_propertyDiscard_info").bootstrapTable({
		url : 'PropertyDiscard/queryallScrap.asp',//请求后台的URL（*）
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
			field: 'SCRAP_ID',
			align: 'center',
			title : '报废流水号'
		},{
			field: 'SCRAP_NAME',
			align: 'center',
			title : '报废名称'
		}, {
			field : 'SCRAP_APPLY_USER_NAME',
			title : '报废申请人',
			align : "center"
		}, {
			field : 'SCRAP_APPLY_DATE',
			title : '申请时间',
			align : "center"
		},{
			field : "APPROVE_STATE_NAME",
			title : "审批状态",
			align : "center"
		},{
			field : "APPROVE_NAME",
			title : "当前审批人",
			align : "center"
		}]
	});
}
initpropertyDiscardListEventButton();
autoInitSelect($("#moreSearch_propertyDiscard"));
initAssetScrapList();
