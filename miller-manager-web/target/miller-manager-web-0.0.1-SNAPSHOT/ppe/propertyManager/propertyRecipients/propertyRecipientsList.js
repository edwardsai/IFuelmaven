//初始化列表
function initPropertyRecipientsListTable(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$('#tb_propertyRecipientsList').bootstrapTable('destroy').bootstrapTable({
		url:'propertyRecipients/queryAllListOfApply.asp',//请求后台的URL（*）
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
		uniqueId : "apply_id", //每一行的唯一标识，一般为主键列
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
			field: 'apply_id',
			align: 'center',
			title : '申请流水号'
		},{
			field : 'category_name',
			title : '资产类型',
			align : "center"
		},{
			field : 'apply_num',
			title : '申请数量',
			align : "center"
		}, {
			field : "apply_date",
			title : "申请时间",
			align : "center"
		} , {
			field : "apply_user_name",
			title : "申请人",
			align : "center"
		} , {
			field : "apply_org_name",
			title : "申请机构",
			align : "center"
		},{
			field : "required_date",
			title : "要求到位时间",
			align : "center"
		},{
			field : "get_status_name",
			title : "领取状态",
			align : "center"
		}]
	});
}
//初始化按钮
function initpropertyRecipientsListBtnEvent(){
	//类别点击
	$("#category_name_propertyRecipientsList").unbind("click");
	$("#category_name_propertyRecipientsList").click(function(){
		openSelectTreeDiv($(this),"assetDiscardList","propertyTypeConfig/queryAllAssetCategroy.asp",{width:$(this).width()+"px","margin-left": "125px"},function(node){
			$("#category_name_propertyRecipientsList").val(node.name);
			$("#category_id_propertyRecipientsList").val(node.id);
			return true;
		});
	});
	//重置按钮
	$('#reset_propertyRecipientsList').bind('click', function(e) {
		$("#searchDiv_propertyRecipientsList input,select").val(" ");
		$("#searchDiv_propertyRecipientsList select").select2();
	});
	//高级查询按钮 
	$("#showMore_propertyRecipientsList").click(function() {
		showMore($(this),"#moreSearch_propertyRecipientsList");
	});
	//查询
	$('#search_propertyRecipientsList').click(function(){
		var apply_id=$.trim($('#apply_id_propertyRecipientsList').val());
		var category_id=$.trim($('#category_id_propertyRecipientsList').val());
		var apply_user=$.trim($('#apply_user_propertyRecipientsList').val());
		var get_status=$.trim($('#get_status_propertyRecipientsList').val());
		$('#tb_propertyRecipientsList').bootstrapTable('refresh',{
			url:'propertyRecipients/queryAllListOfApply.asp?apply_id='+apply_id+'&get_status='+get_status
			+'&category_id='+category_id+'&apply_user_name='+escape(encodeURIComponent(apply_user))	
		});
	});
	//领用登记
	$('#propertyRecipientsList_regist').click(function() {
		var id = $("#tb_propertyRecipientsList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行登记!");
			return;
		}
		var get_status = id[0].get_status_name;
		if(get_status!="未登记"){
			alert("该信息已完成登记");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		pageDispatchRecipientsList(this,"recipientsEdit",params[0]);
	});
	//领用填补
	$('#propertyRecipientsList_rewrite').click(function() {
		var id=$("#tb_propertyRecipientsList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行填补！");
			return;
		}
		var get_status = id[0].get_status_name;
		if(get_status!="完成登记"){
			alert("该信息不是完成登记状态，不能填补");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		newOpenTab("propertyRecipientsAssign","领用分配","ppe/propertyManager/propertyRecipients/propertyRecipientsAssign.html");
		initAssignProperty(params[0]);
	});
	//查看详情
	$('#propertyRecipientsList_readDet').click(function() {
		var id=$("#tb_propertyRecipientsList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看！");
			return;
		}
		var get_status = id[0].get_status_name;
		if(get_status=="未登记"){
			alert("该信息未登记，不能查看");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		newOpenTab("propertyRecipientsDetails","查看详情","ppe/propertyManager/propertyRecipients/propertyRecipientsDetails.html");
		initViewRecipients(params[0]);
		initViewRecipientsList(params[0]);
	});
	//领用通知
	$('#propertyRecipientsList_inform').bind('click', function(e) {
		var id=$("#tb_propertyRecipientsList").bootstrapTable('getSelections');
		if(id.length==1){
			var ids=JSON.stringify(id);
			var params=JSON.parse(ids);
		    var apply_id=params[0]["apply_id"];
		    $.post("propertyRecipients/updateNoticeStatus.asp",{apply_id:apply_id},function(result){
		    	if(result.result){
		    		alert("已通知");
		    	}else{
		    		alert("该申请审核还未通过，通知失败");
		    	}
		    },"json");
			
		}else{
			e.preventDefault();
	        alert("请选择一条数据进行通知！");
		}
	});
}
//页面跳转
function pageDispatchRecipientsList(obj,key,params){
	newOpenTab("recipientsEdit","领用信息登记","ppe/propertyManager/propertyRecipients/EditpropertyRecipients_user.html");
	var k={};
	k["get_user_no"]=params.user_no;
	k["get_user_org"]=params.org_no;
	k["get_user"]=params.apply_user_name;
	k["get_date"]=returnTodayData();
	k["record_user"]=$("#main_user_name").attr("user_name");
	initEditRecipients_users(params,k);
	initRecipientsDetailsList(null,k);
	initTableTab(params,k);
}
autoInitSelect($("#searchDiv_propertyRecipientsList"));
initpropertyRecipientsListBtnEvent();
initPropertyRecipientsListTable();