function initEarlyWarningConfigureListTableEvent(){
	var tbObj=$('#tb_earlyWarningConfigureList');
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	tbObj.bootstrapTable({
		url : 'EarlyWarning/queryAllWarning.asp',//请求后台的URL（*）
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
			field: 'ASSET_TYPE_NAME',
			align: 'center',
			title : '资产类别'
			
		},{
			field : 'IS_USE',
			title : '是否启用',
			align : "center",
			formatter: function (value, row, index) {
				if(value=="1"){
					return "启用";
				}else{
					return "禁用";
				}
			}
		}, {
			field : 'UNUSE_WARN',
			title : '资产闲置预警线',
			align : "center",
			formatter: function(value,row,index){
				return value+"%";
			}
		}, {
			field : 'WARN_DAY',
			title : '类别维保预警线',
			align : "center",
			formatter: function(value,row,index){
				return value+"天";
			}
		}, {
			field : "DOWN_WARN",
			title : "安全库存下限(数量)",
			align : "center"
		} , {
			field : "UP_WARN",
			title : "安全库存上限(数量)",
			align : "center"
		
		},{
			field : "CREATE_TIME",
			title : "设置时间",
			align : "center"
		},{
			field : "EXCEPTION_NUM",
			title : "预警信息",
			align : "center",
			formatter: function(value,row,index){
				if(row.IS_USE=="2"){
					return '-';
				}
				var strInfo="";
				if(value){
					//var nums=value.split(",").length;
					strInfo=strInfo+ '<p style="color:red">维保异常：<span style="font-size:20px;" class="viewDetail" onclick="viewWarnDayAssetNumInfo('+index+')">'+
					value+'</span> 条资产；</p>';
				}
				var unuse_rate=row.UNUSE_NUM/row.ALL_NUM*100;
				if(unuse_rate>row.UNUSE_WARN){
					strInfo =strInfo+ '<p style="color:red">闲置率异常：<span style="font-size:20px;color:blue" >'+
					unuse_rate.toFixed(2)+'%</span>； </p>';
				}
				if(row.ALL_NUM<row.DOWN_WARN){
					strInfo =strInfo+ '<p style="color:red">下限异常：该资产仅有<span style="font-size:20px;color:blue">'+
					+row.ALL_NUM+'</span>条； </p>';
				}else if(row.ALL_NUM>row.UP_WARN){
					strInfo =strInfo+ '<p style="color:red">上限异常：该资产已有<span style="font-size:20px;color:blue" >'+
					+row.ALL_NUM+'</span>条； </p>';
				}
				if(!strInfo){
					strInfo=strInfo+ '<p style="color:green">正常</p>';
				}
				return strInfo;
			}
		}]
	});
	//查询
	$("#search_earlyWarningConfigureList").unbind("click");
	$("#search_earlyWarningConfigureList").click(function(){
		var asset_type= $.trim($("#asset_type_id_earlyWarningConfigureList").val());
		var is_use= $.trim($("#is_use_earlyWarningConfigureList").val());
		tbObj.bootstrapTable('refresh',{url:'EarlyWarning/queryAllWarning.asp?is_use='+is_use+'&asset_type='+asset_type});
	});
	//重置
	$("#reset_earlyWarningConfigureList").click(function(){
		$("#asset_type_id_earlyWarningConfigureList").val("");
		$("#asset_type_name_earlyWarningConfigureList").val("");
		$("#is_use_earlyWarningConfigureList").val("");
//		$("#is_use_earlyWarningConfigureList").select2();
		autoInitSelect($("#is_use_earlyWarningConfigureList"));
	});
	//类别点击
	$("#asset_type_name_earlyWarningConfigureList").unbind("click");
	$("#asset_type_name_earlyWarningConfigureList").click(function(){
		openSelectTreeDiv($(this),"proConfigSelectTreeInField_earlyWarn","propertyTypeConfig/queryAllAssetCategroy.asp",{width:$(this).width()+"px","margin-left": "127px"},function(node){
			$("#asset_type_name_earlyWarningConfigureList").val(node.name);
			$("#asset_type_id_earlyWarningConfigureList").val(node.id);
			return true;
		});
	});
}
function initEarlyWarningConfigureListBtnEvent(){
	//添加预警
	$("#add_earlyWarningConfigureList").unbind("click");
	$("#add_earlyWarningConfigureList").click(function(){
		pageDispatchEarlyWarningConfigureList(this,"addWarn","");
	});
	//修改预警
	$("#edit_earlyWarningConfigureList").unbind("click");
	$("#edit_earlyWarningConfigureList").click(function(){
		var id = $("#tb_earlyWarningConfigureList").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		pageDispatchEarlyWarningConfigureList(this,"updateWarn",params[0]);
	});
	//删除预警
	$("#del_earlyWarningConfigureList").unbind("click");
	$("#del_earlyWarningConfigureList").click(function(){
		var id = $("#tb_earlyWarningConfigureList").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请选择一条数据进行删除!");
			return;
		}
		nconfirm("确定删除？",function(){
			var id_num = id[0].ID;                    
			baseAjax("EarlyWarning/delWarning.asp",{"id":id_num}, function(data) {
				if (data != undefined && data != null&&data.result=="true") {
					alert("删除成功！");
					$("#search_earlyWarningConfigureList").click();
				}else{
					alert("删除失败！");
				}
			});
		});
	});
}
function pageDispatchEarlyWarningConfigureList(obj,key,params){
	if(key=="addWarn"||key=="updateWarn"){
		newOpenTab("newEarlyWarningConfigure","操作预警配置","ppe/configureManager/newEarlyWarningConfigure.html",function(){
			initNewEarlyWarningConfigureEvent(params);
		});
		return;
	}else if(key=="exception"){
		newOpenTab("newEarlyWarningConfigure","操作预警配置","ppe/configureManager/warningDayExceptionList.html",function(){
			initWarningDayExceptionEvent(params);
		});
	}
}
function viewWarnDayAssetNumInfo(index){
	var data = $("#tb_earlyWarningConfigureList").bootstrapTable('getData');
	var ids=JSON.stringify(data[index]);
	var params=JSON.parse(ids);
	pageDispatchEarlyWarningConfigureList("","exception",params);
}
autoInitSelect($("#is_use_earlyWarningConfigureList"));
initEarlyWarningConfigureListTableEvent();
initEarlyWarningConfigureListBtnEvent();
