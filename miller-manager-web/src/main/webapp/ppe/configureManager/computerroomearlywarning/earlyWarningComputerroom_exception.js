function initEarlyWarningComputerRoom_exceptionEvent(params){
	//初始化信息
	var strInfo="";
	if(params){
		strInfo=params["ROOM_NAME"];
		var numsArray=strInfo.split("->");
		$("#infoDiv_ComputerWarningDayExceptionList td[wdel='DESCREB']").html(params["DESCREB"]);
		$("#infoDiv_ComputerWarningDayExceptionList td[wdel='OFFICE_BUILDING']").html(numsArray[1]);
		$("#infoDiv_ComputerWarningDayExceptionList td[wdel='FLOOR']").html(numsArray[2]);
		$("#infoDiv_ComputerWarningDayExceptionList td[wdel='AREA']").html(numsArray[3]);
		$("#infoDiv_ComputerWarningDayExceptionList td[wdel='WARNING_LINE']").html(params["WARNING_LINE"]);
		if(params["IS_USE"]=="00"){
			$("#infoDiv_ComputerWarningDayExceptionList td[wdel='IS_USE']").html("启用");
		}else{
			$("#infoDiv_ComputerWarningDayExceptionList td[wdel='IS_USE']").html("禁用");
		}
	}
	initWarningDayExceptionList(params["EXCPTION_NUMBER"],params);
	//返回按钮
	$("#back_ComputerWarningDayExceptionList").click(function(){
		newOpenTab("ComputerRoomEarlyWarningList","机柜预警列表","ppe/configureManager/computerroomearlywarning/earlyWarningComputerroom_list.html",function(){});
	});
}
function initWarningDayExceptionList(exception_num,params){
	var tbObj=$('#Computer_tb_warningDayExceptionList');
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var columnsx = new Array();
	if(params["AREA_TYPE2"]=="01"){
		columnsx = [{
			field : 'CAB_NUM',
			title : '机柜编号',
			align : "center"
		},{
			field : "CAB_NAME",
			title : "机柜名称",
			align : "center"
		} ,{
			field : "TOTAL_CONTENT",
			title : "总容量值",
			align : "center"
		}, {
			field : "CAB_USE_RATIO",
			title : "使用率",
			align : "center"
		
		},{
			field : "COOR_X",
			title : "机柜x坐标",
			align : "center"
		},{
			field : "COOR_Y",
			title : "机柜y坐标",
			align : "center"
		},{
			field : "CAB_USE_RATIO",
			title : "预警信息",
			align : "center",
			formatter: function (value, row, index) {
				var day=params["WARNING_LINE"];
				if(row.CAB_USE_RATIO>day){
					return '<span style="color:red">容量超出比：'+(parseInt(value)-parseInt(day))+"%"+'</span>';
				}else{
					return '<span style="color:green">'+value+'</span>';
				}
			}
		}];
	}else{
		columnsx = [{
			field : 'CAB_NUM',
			title : '文件柜编号',
			align : "center"
		},{
			field : "CAB_NAME",
			title : "文件柜名称",
			align : "center"
		} ,{
			field : "TOTAL_CONTENT",
			title : "总容量值",
			align : "center"
		}, {
			field : "CAB_USE_RATIO",
			title : "使用率",
			align : "center"
		
		},{
			field : "COOR_X",
			title : "机柜x坐标",
			align : "center"
		},{
			field : "COOR_Y",
			title : "机柜y坐标",
			align : "center"
		},{
			field : "CAB_USE_RATIO",
			title : "预警信息",
			align : "center",
			formatter: function (value, row, index) {
				var day=params["WARNING_LINE"];
				if(row.CAB_USE_RATIO>day){
					return '<span style="color:red">容量超出比：'+(parseInt(value)-parseInt(day))+"%"+'</span>';
				}else{
					return '<span style="color:green">'+value+'</span>';
				}
			}
		}];
	}
	
	tbObj.bootstrapTable({
		url : 'ComputerroomWarning/queryAllWarningDayException.asp?WARNING_PLANCE='+params["WARNING_PLANCE"],//请求后台的URL（*）
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
		columns : columnsx
	});
}