//初始化按钮事件
function initWarrantOutBtnEvent(){
	//查询按钮
	$("#select_warrantOutList").click(function(){
		var warrant_no = $.trim($("#WOwarrant_no").val());
		var property_owner_name = $.trim($("#WOproperty_owner_name").val());
		var batch_id = $.trim($("#WObatch_id").val());
		var guarantee_id = $.trim($("#WOguarantee_id").val());
		var guarantee_name = $.trim($("#WOguarantee_name").val());
		var ENTER_FLAG=$.trim($("#enter_flag").val());
		$('#Table_warrantOutList').bootstrapTable('refresh',{
			url:'WarrantOut/queryListWarrantOut.asp?warrant_no='+warrant_no
			+'&property_owner_name='+escape(encodeURIComponent(property_owner_name))
			+'&batch_id='+escape(encodeURIComponent(batch_id))
			+'&guarantee_name='+escape(encodeURIComponent(guarantee_name))
			+'&ENTER_FLAG='+escape(encodeURIComponent(ENTER_FLAG))
			+'&guarantee_id='+escape(encodeURIComponent(guarantee_id))});
	});
	//重置按钮
	$('#reset_warrantOutList').bind('click', function(e) {
		$("#search_warrantOutList input").val("");
	});
	//高级查询按钮 
	$("#showMore_warrantOutList").click(function() {
		showMore($(this),"#moreSearch_warrantOutList");
	});
	
	//出库登记按钮
	$("#edit_warrantOut").click(function(){
		var sele = $("#Table_warrantOutList").bootstrapTable('getSelections');
		if(sele.length!=1){
			alert("请选择一条数据进行登记!");
			return ;
		}
		var flag = sele[0].ENTER_FLAG;
		if(flag!="00"){
			alert("该信息已处理！");
			return;
		}
		newOpenTab("edit_warrantOut","出库登记","ppe/warrantManager/warrantOut/warrantOut_edit.html", function(){
			initwarrantOutEdit(sele[0]);
		});
	});
	//查看出库信息按钮
	$("#view_warrantOut").click(function(){
		var sele = $("#Table_warrantOutList").bootstrapTable('getSelections');
		if(sele.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		newOpenTab("view_warrantOut","查看","ppe/warrantManager/warrantOut/warrantOut_view.html", function(){
			initwarrantOutView(sele[0]);
		});
	});
}
//签收
$("#signIn_warrantOut").click(function(){
	var sele = $("#Table_warrantOutList").bootstrapTable('getSelections');
	if(sele.length!=1){
		alert("请选择一条数据进行登记!");
		return ;
	}
	var flag = sele[0].ENTER_FLAG;
	if(flag!="00"){
		alert("该信息已处理！");
		return;
	}
	newOpenTab("signIn_warrantOut","出库签收","ppe/warrantManager/warrantOut/signIn.html", function(){
		initwarrantOutEdit(sele[0]);
	});
});
//列表显示
function initWarrantOutList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$('#Table_warrantOutList').bootstrapTable({
		url : 'WarrantOut/queryListWarrantOut.asp',//请求后台的URL（*）
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
			field : 'BATCH_ID',
			title : '批次编号',
			align : "center"
		}, {
			field: 'CONTRACT_NO',
			align: 'center',
			title : '担保合同编号'
		},{
			field : 'GUARANTEE_ID',
			title : '押品编号',
			align : "center"
		}, {
			field : 'GUARANTEE_NAME',
			title : '押品名称',
			align : "center"
		}, {
			field : 'WARRANT_NO',
			title : '权证编号',
			align : "center"
		}, {
			field : 'PROPERTY_OWNER_NAME',
			title : "权属人名称",
			align : "center"
		} , {
			field : 'WARR_TYPE_NAME',
			title : "权证类型一",
			align : "center"
		}, {
			field : 'WARR_TYPE2_NAME',
			title : "权证类型二",
			align : "center"
		},{
			field : 'STORAGE_TYPE_NAME',
			title : "出库类型",
			align : "center"
		},{
			field : 'ENTER_FLAG_NAME',
			title : "处理标识",
			align : "center"
		},{
			field : 'APPLY_USER_NAME',
			title : "申请人",
			align : "center"
		},{
			field : 'APPROVE_DATE',
			title : "审批通过日期",
			align : "center"
		},{
			field : 'AREA_NAME',
			title : "存放区域",
			align : "center"
		},{
			field : 'FLOOR_NAME',
			title : "楼层",
			align : "center"
		}]
	});
}

initWarrantOutList();
initWarrantOutBtnEvent();
