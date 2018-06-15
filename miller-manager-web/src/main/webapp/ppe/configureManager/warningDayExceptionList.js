function initWarningDayExceptionEvent(params){
	for(var k in params){
		if(k=="EXCEPTION_NUM"){
			initWarningDayExceptionList(params['ASSET_TYPE'] ,params['ID']);
		}else{
			$("#infoDiv_warningDayExceptionList td[wdel='" + k + "']").html(params[k]);
		}
		if(params["IS_USE"]=="1"){
			$("#infoDiv_warningDayExceptionList td[wdel='IS_USE']").html("启用");
		}else{
			$("#infoDiv_warningDayExceptionList td[wdel='IS_USE']").html("禁用");
		}
	}
	
	//返回按钮
	$("#back_warningDayExceptionList").click(function(){
		newOpenTab("earlyWarningConfigureList","预警列表","ppe/configureManager/earlyWarningConfigureList.html",function(){});
	});
}
function initWarningDayExceptionList(asset_type ,id){
	var tbObj=$('#tb_warningDayExceptionList');
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	tbObj.bootstrapTable({
		url : 'EarlyWarning/queryAllWarningDayException.asp?asset_type=' + asset_type+'&id=' + id,//请求后台的URL（*）
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
		onLoadSuccess:function(){
			autoCombineCells("#tb_warningDayExceptionList","ASSET_NUM","ASSET_NAME");
			autoCombineCells("#tb_warningDayExceptionList","ASSET_NUM","ASSET_NUM");
			$("#btns-addBackToRight2").click();
		},
		columns : [ {
			field: 'ASSET_NUM',
			align: 'center',
			title : '资产编号'
			
		}, {
			field : 'ASSET_NAME',
			title : '资产名称',
			align : "center"
		}, {
			field : 'GUARANTEED_NUM',
			title : '保修编号',
			align : "center"
		}, {
			field : "GUARANTEED_NAME",
			title : "保修设备名称",
			align : "center"
		} , {
			field : "START_DATE",
			title : "保修开始时间",
			align : "center"
		
		},{
			field : "END_DATE",
			title : "保修结束时间",
			align : "center"
		},{
			field : "REST_DAY",
			title : "保修剩余天数",
			align : "center",
			formatter: function (value, row, index) {
				var day=$("#infoDiv_warningDayExceptionList td[wdel='WARN_DAY']").html();
				if(value<day){
					return '<span style="color:red">'+value+'</span>';
				}else{
					return '<span style="color:green">'+value+'</span>';
				}
			}
		}]
	});
}