function initStatisticsConsumableSuppliesTableEvent(){
	var tbObj=$('#tb_statisticsConsumableSupplies');
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	tbObj.bootstrapTable({
		url :'StatisticsConsumableSupplies/queryAllStatistics.asp',//请求后台的URL（*）
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
			field: 'CATEGORY_ID',
			align: 'center',
			title : '类型编号'
			
		}, {
			field : 'CATEGORY_NAME',
			title : '类型名称',
			align : "center",
		},{
			field : 'STATUS',
			title : '是否启用',
			align : "center",
			formatter: function (value, row, index) {
				if(value==1){
					return "启用";
				}else{
					return "禁用";
				}
			 }
		},{
			field : 'ROOM_NAME',
			title : '仓库',
			align : "center",
			formatter: function (value, row, index) {
				return "<p style='float:left'>"+value+"</p>";
			 }
		}, {
			field : "CREATE_DATE",
			title : "设置时间",
			align : "center"
		
		},{
			field : "MIN_NUM",
			title : "下限",
			align : "center"
		},{
			field : "MAX_NUM",
			title : "上限",
			align : "center"
		},{
			field : "GOODS_NUM",
			title : "库存",
			align : "center",
			formatter: function(value,row,index){
				if(row.GOODS_NUM==null){
					return "0";
				}else{
					return row.GOODS_NUM;
				}
			}
		},{
			field : "STATUS",
			title : "状态",
			align : "center",
			formatter: function(value,row,index){
				var strInfo="";
				if(parseInt(row.GOODS_NUM)>parseInt(row.MAX_NUM)){
					strInfo+='<p style="color:blue">超额</p>';
				}else if(parseInt(row.GOODS_NUM)<parseInt(row.MIN_NUM)){
					strInfo+='<p style="color:red">紧缺</p>';					//return "紧缺";
				}else if(row.GOODS_NUM==null){
					strInfo+='<p style="color:red">紧缺</p>';
				}else{
					strInfo+='<p style="color:green">正常</p>';
				}
				return strInfo;
			 }
		}]
	});
	//类别点击
	$("#CATEGORY_NAME_list").unbind("click");
	$("#CATEGORY_NAME_list").click(function(){
		openSelectTreeDiv($(this),"proConfigSelectTreeInField_statisticsType","sorting/queryAllSorting.asp",{width:$(this).width()+"px","margin-left": "127px"},function(node){
			$("#CATEGORY_NAME_list").val(node.name);
			$("#CATEGORY_ID_list").val(node.id);
			return true;
		});
	});
	//初始化下拉框
	autoInitSelect($("#is_status_statisticsConsumableSupplies"));
	//查询
	$("#search_statisticsConsumableSupplies").unbind("click");
	$("#search_statisticsConsumableSupplies").click(function(){
		var category_id= $.trim($("#CATEGORY_ID_list").val());
		var status= $.trim($("#is_status_statisticsConsumableSupplies").val());
		tbObj.bootstrapTable('refresh',{url:'StatisticsConsumableSupplies/queryAllStatistics.asp?category_id='+category_id+'&status='+status});
	});
	//重置
	$("#reset_statisticsConsumableSupplies").click(function(){
		$("#CATEGORY_NAME_list").val("");
		$("#CATEGORY_ID_list").val("");
		$("#is_status_statisticsConsumableSupplies").val(" ");
		$("#is_status_statisticsConsumableSupplies").select2();
	});
}

function initStatisticsConsumableSuppliesBtnEvent(){
	//添加预警
	$("#add_statisticsConsumableSupplies").unbind("click");
	$("#add_statisticsConsumableSupplies").click(function(){
		pageDispatchStatisticsConsumableSupplies(this,"addConsumables","");
	});
	//修改预警
	$("#edit_statisticsConsumableSupplies").unbind("click");
	$("#edit_statisticsConsumableSupplies").click(function(){
		var id = $("#tb_statisticsConsumableSupplies").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		pageDispatchStatisticsConsumableSupplies(this,"updateConsumables",params[0]);
	});
	//删除预警
	$("#del_statisticsConsumableSupplies").unbind("click");
	$("#del_statisticsConsumableSupplies").click(function(){
		var id = $("#tb_statisticsConsumableSupplies").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请选择一条数据进行删除!");
			return;
		}
		nconfirm("确定删除？",function(){
			var id_num = id[0].ID;                    
			baseAjax("StatisticsConsumableSupplies/delStatistics.asp",{"id":id_num}, function(data) {
				if (data != undefined && data != null&&data.result=="true") {
					alert("删除成功！");
					$("#search_statisticsConsumableSupplies").click();
				}else{
					alert("删除失败！");
				}
			});
		});
	});
}

function pageDispatchStatisticsConsumableSupplies(obj,key,params){
		newOpenTab("newStatisticsConsumableSupplies","操作耗材预警配置","ppe/consumablesManagement/statisticsConsumableSupplies/newStatisticsConsumableSupplies.html",function(){
			initNewEarlyWarningConfigureEvent(params);
		});	
}

autoInitSelect($("#is_status_statisticsConsumableSupplies"));
initStatisticsConsumableSuppliesTableEvent();
initStatisticsConsumableSuppliesBtnEvent();
