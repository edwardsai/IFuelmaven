//初始化按钮事件
function initcmRecipientsBtnEvent(){
	//查询按钮
	$("#select_cmRecipients").click(function(){
		var room = $.trim($("#CMRroom_id").val());
		var out_status = $.trim($("#CMRout_status").val());
		var out_id = $.trim($("#CMRout_id").val());
		var start_time = $.trim($("#CMstart_time").val());
		var end_time = $.trim($("#CMend_time").val());
		$('#table_cmRecipientsInfo').bootstrapTable('refresh',{
			url:'CMRecipients/queryAllRecipients.asp?out_id='+out_id
			+'&out_status='+out_status+'&room='+room+'&start_time='+start_time+'&end_time='+end_time});
	});
	//高级查询按钮 
	$("#showMore_cmRecipients").click(function(){
		showMore($(this),"#moreSearch_cmRecipients");
	});
	//仓库选择
	var selectTeeID=Math.uuid();
	var treeInputObj=$("#CMRroom_name");
	openSelectTreeDivAllName(treeInputObj,selectTeeID,"Config/querystorehouselist.asp",{width:treeInputObj.width()+"px","margin-left": "125px"},function(node){
		treeInputObj.val(node.allname);
		$("#CMRroom_id").val(node.id);
		return true;
	},null);
	treeInputObj.unbind("click");
	treeInputObj.click(function(){
		showSelectTreeDiv($("#"+selectTeeID));
	});
	//重置按钮
	$('#reset_cmRecipients').bind('click', function(e) {
		$("#search_RecipientInfo input,select").val(" ");
		$("#search_RecipientInfo select").select2();
	});
	//新增按钮
	$("#addconsumablesRecipients").click(function(){
		pageDispatchcmRecipients(this,"addconsumablesRecipients","");
	});
	//修改按钮
	$("#updateconsumablesRecipients").click(function(){
		var data = $("#table_cmRecipientsInfo").bootstrapTable('getSelections');
		if(data.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var out_status = data[0].OUT_STATUS_NAME;
		if(out_status!="未出库"){
			alert("该信息不是未出库状态，不能修改");
			return;
		}
		pageDispatchcmRecipients(this,"updateconsumablesRecipients",data[0]);
	});
	//查看按钮
	$("#viewconsumablesRecipients").click(function(){
		var data = $("#table_cmRecipientsInfo").bootstrapTable('getSelections');
		if(data.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		pageDispatchcmRecipients(this,"viewconsumablesRecipients",data[0]);
	});
	//确认按钮
	$("#sureconsumablesRecipients").click(function(){
		var data = $("#table_cmRecipientsInfo").bootstrapTable('getSelections');
		if(data.length!=1){
			alert("请选择一条数据进行确认!");
			return ;
		}
		var out_status = data[0].OUT_STATUS_NAME;
		if(out_status!="未出库"){
			alert("该信息不是未出库状态，不能确认");
			return;
		}
		nconfirm("是否确认该数据？",function(){
		baseAjax("CMRecipients/surecmRecipients.asp",{"out_id":data[0].OUT_ID,"room":data[0].ROOM}, function(data) {
	       	if (data != undefined && data != null ) {
		       		alert(data.msg);
		       		if(data.result=="true"){
		       			$("#select_cmRecipients").click();
		       		}
				}
			});
		});
	});
	//删除按钮
	$("#deleteconsumablesRecipients").click(function(){
		var data = $("#table_cmRecipientsInfo").bootstrapTable('getSelections');
		if(data.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		var out_status = data[0].OUT_STATUS_NAME;
		if(out_status!="未出库"){
			alert("该信息不是未出库状态，不能删除");
			return;
		}
		nconfirm("确定删除该数据吗？",function(){
			baseAjax("CMRecipients/deletecmRecipients.asp",{"out_id":data[0].OUT_ID}, function(data) {
				if (data != undefined && data != null&& data.result == "true") {
					alert("删除成功！");
					$("#select_cmRecipients").click();
				}else{
					alert("删除失败！");
				}
			},true);
		});
	});
}
//列表显示
function initcmRecipientsList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$('#table_cmRecipientsInfo').bootstrapTable({
		url : 'CMRecipients/queryAllRecipients.asp',//请求后台的URL（*）
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
			field: 'OUT_ID',
			align: 'center',
			title : '出库单号'
		},{
			field : 'ROOM_NAME',
			title : '出库仓库',
			align : "center",
			formatter: function (value, row, index) {
				return "<p style='float:left'>"+value+"</p>";
			 }
		}, {
			field : 'OUT_DATE',
			title : '出库时间',
			align : "center"
		}, {
			field : 'CREATE_USER_NAME',
			title : '登记人',
			align : "center"
		},{
			field : "CREATE_ORG_NAME",
			title : "登记人部门",
			align : "center"
		} , {
			field : "CREATE_DATE",
			title : "登记时间",
			align : "center"
		},{
			field : "GETUSER_NAME",
			title : "领用人",
			align : "center"
		} , {
			field : "GETUSER_ORG_NAME",
			title : "领用人部门",
			align : "center"
		},{
			field : "OUT_STATUS_NAME",
			title : "出库状态",
			align : "center"
		}]
	});
}
//跳转方法
function pageDispatchcmRecipients(obj,key,params){
	if("addconsumablesRecipients"==key||"updateconsumablesRecipients"==key){
		newOpenTab("addConsumablesRecipients","新增","ppe/consumablesManagement/consumablesRecipients/addConsumablesRecipients.html", function(){
			initconsumablesRecipientsEventButton(params);
		});
	}else if("viewconsumablesRecipients"==key){
		newOpenTab("viewconsumablesRecipients","查看","ppe/consumablesManagement/consumablesRecipients/viewConsumablesRecipients.html",function(){
			initviewconsumablesRecipients(params);
		});
	}
}

initcmRecipientsList();
initcmRecipientsBtnEvent();
autoInitSelect($("#search_RecipientInfo"));