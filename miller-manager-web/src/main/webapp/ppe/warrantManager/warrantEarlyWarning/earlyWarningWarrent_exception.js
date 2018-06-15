function initEarlyWarningWarrent_exceptionEvent(params){
	//初始化信息
	for(var k in params){
		$("#warrantWarningDayExceptionList td[wdel='" + k + "']").html(params[k]);
	}
	if(params["IS_USE"]=="00"){
		$("#warrantWarningDayExceptionList td[wdel='IS_USE']").html("启用");
	}else{
		$("#warrantWarningDayExceptionList td[wdel='IS_USE']").html("禁用");
	}
	/*autoInitSelect($("#add_warrentearlyWarning"));
	var CATEGORY =[{WARR_CATEGORY:"00",WARR_CATEGORY_NAME:"主权证"},{WARR_CATEGORY:"01",WARR_CATEGORY_NAME:"他项权证"}];
	if(params["WARR_CATEGORY"]=="00"){
		initSelectByData($("#add_warrentearlyWarning"),{"value":"WARR_CATEGORY","text":"WARR_CATEGORY_NAME"},CATEGORY,"00");
	}else{
		initSelectByData($("#add_warrentearlyWarning"),{"value":"WARR_CATEGORY","text":"WARR_CATEGORY_NAME"},CATEGORY,"01");
	}*/
		
	
	
	initWarningDayExceptionList(params["EXCEPTION_NUM"],params);
	//返回按钮
	$("#back_warrantWarningDayExceptionList").click(function(){
		newOpenTab("warrantEarlyWarningList","权证预警列表","ppe/warrantManager/warrantEarlyWarning/earlyWarningWarrent_list.html",function(){});
	});
}
function initWarningDayExceptionList(exception_num,params){
	var tbObj=$('#tb_warrantWarningDayExceptionList');
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var columnsx = new Array();
	if(params["key"]=="1"){//通过key判断是查看过期异常  还是借用异常
		columnsx=[ {
			field : 'WARRANT_NO',
			title : '权证编号',
			align : "center"
		}, {
			field : "CONTRACT_NO",
			title : "合同编号",
			align : "center"
		} , {
			field : "TAG_ID",
			title : "标签编码(TID)",
			align : "center"
		
		},{
			field : "GUARANTEE_NAME",
			title : "押品名称",
			align : "center"
		},{
			field : "WARR_STATUS_NAME",
			title : "权证状态",
			align : "center"
		},{
			field : "TAKE_EFFECT_TIME",
			title : "起效日期",
			align : "center"
		},{
			field : "EXPIRE_TIME",
			title : "过期日期",
			align : "center"
		},{
			field : "APPLY_USER_NAME22",
			title : "借用人",
			align : "center",
			formatter: function(value,row,index){
				if(row.WARR_STATUS!="02"&&row.WARR_STATUS!="03"){
					return "--";
				}else{
					return value;
				}
			}
		},{
			field : "INCOME_APPLY_USERNAME",
			title : "入库申请人",
			align : "center"
		},{
			field : "REST_DAY",
			title : "有效期到期(天)",
			align : "center",
			formatter: function (value, row, index) {
				var day=params["ADVANCE_NOTICE_TIME"];
				if(value<day){
					return '<span style="color:red">'+value+'</span>';
				}else{
					return '<span style="color:green">'+value+'</span>';
				}
			}
		}];
		var urlname ='WarrantWarning/queryAllWarningDayException.asp?WARR_CLASSIFY='+params["WARR_CATEGORY"]+'&WARR_TYPE='+params["WARR_TYPE"]+'&KEY='+params["key"];
	}else{
		var urlname ='WarrantWarning/queryAllWarningDayException.asp?WARR_CLASSIFY='+params["WARR_CATEGORY"]+'&WARR_TYPE='+params["WARR_TYPE"]+'&KEY='+params["key"];
		columnsx=[ {
			field : 'WARRANT_NO',
			title : '权证编号',
			align : "center"
		}, {
			field : "CONTRACT_NO",
			title : "合同编号",
			align : "center"
		} , {
			field : "TAG_ID",
			title : "标签编码(TID)",
			align : "center"
		
		},{
			field : "GUARANTEE_NAME",
			title : "押品名称",
			align : "center"
		},{
			field : "WARR_STATUS_NAME",
			title : "权证状态",
			align : "center"
		},{
			field : "TAKE_EFFECT_TIME",
			title : "起效日期",
			align : "center"
		},{
			field : "EXPIRE_TIME",
			title : "过期日期",
			align : "center"
		},{
			field : "APPLY_USER_NAME22",
			title : "借用人",
			align : "center",
			formatter: function(value,row,index){
				if(row.WARR_STATUS!="02"&&row.WARR_STATUS!="03"){
					return "--";
				}else{
					return value;
				}
			}
		},{
			field : "INCOME_APPLY_USERNAME",
			title : "入库申请人",
			align : "center"
		},{
			field : "REST_DAY",
			title : "借用到期(天)",
			align : "center",
			formatter: function (value, row, index) {
				var day=params["ADVANCE_NOTICE_TIME"];
				if(value<day){
					return '<span style="color:red">'+value+'</span>';
				}else{
					return '<span style="color:green">'+value+'</span>';
				}
			}
		}];
	}
	
	tbObj.bootstrapTable({
		url : urlname,//请求后台的URL（*）
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
			autoCombineCells("#tb_warrantWarningDayExceptionList","ASSET_NUM","ASSET_NAME");
			autoCombineCells("#tb_warrantWarningDayExceptionList","ASSET_NUM","ASSET_NUM");
			$("#btns-addBackToRight2").click();
		},
		columns : columnsx
	});
}