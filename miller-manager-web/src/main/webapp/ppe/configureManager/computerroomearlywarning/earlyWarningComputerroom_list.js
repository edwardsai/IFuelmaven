;function initEarlyWarningComputerRoomListTableEvent(){
	var tbObj=$('#tb_EarlyWarningComputerRoomList');
	var currTab = getCurrentPageObj();
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	tbObj.bootstrapTable({
		url : 'ComputerroomWarning/queryAllWarning.asp',//请求后台的URL（*）
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
		},{
			field : 'IS_USE',
			title : '是否启用',
			align : "center",
			formatter: function(value,row,index){
				if(value=="00"){
					return "启用";
				}else{
					return "启用";
				}
			}
		}, {
			field: 'ROOM_NAME',
			align: 'center',
			title : '仓库位置',
			formatter: function (value, row, index) {
				return "<p style='float:left'>"+value+"</p>";
			 }
			
		}, {
			field: 'AREA_TYPENAME',
			align: 'center',
			title : '仓库类型'
		},{
			field: 'WARNING_LINE',
			align: 'center',
			title : '预警线',
			formatter: function(value,row,index){
				return value+"%";
			}
			
		},{
			field : "CREATE_TIME",
			title : "设置时间",
			align : "center"
		},{
			field : "EXCPTION_NUMBER",
			title : "预警信息",
			align : "center",
			formatter: function(value,row,index){
				var strInfo="";
				if(value){
					//var nums=value.split(",").length;
				strInfo=strInfo+'<p style="color:red">仓库容量预警异常：<span style="font-size:20px;" class="viewDetail" onclick="viewWarnComputerRoomNumInfo('+index+')">'+
				value+'</span> 个；</p>';
				}
				if(!strInfo){
					strInfo='<p style="color:green">正常</p>';
				}
				return strInfo;
			}
		}]
	});
	//仓库选择
	$("#computerRoom_plance").unbind("click");
	$("#computerRoom_plance").click(function(){
		openSelectTreeDiv($(this),"proComputerSelectTreeInField_earlyWarn","Config/queryareatreelist.asp",{width:$(this).width()+"px","margin-left": "118px"},function(node){
			$("#computerRoom_plance").val(node.name);
			$("#computerRoom_plance_id").val(node.id);
			return true;
		});
	});
	/*//权证类别
	var CATEGORY =[{WARR_CATEGORY:"00",WARR_CATEGORY_NAME:"主权证"},{WARR_CATEGORY:"01",WARR_CATEGORY_NAME:"他项权证"}];
	initSelectByData($("#earlyWarning_area_type"),{"value":"WARR_CATEGORY","text":"WARR_CATEGORY_NAME"},CATEGORY,"00");*/
	var arr = ["02"];
	initSelect($("#earlyWarning_area_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AMC_DIC_AREA_TYPE"}," sda",null,arr);
	//查询
	$("#search_earlyWarningComputer").unbind("click");
	$("#search_earlyWarningComputer").click(function(){
		var WARNING_PLANCE= $.trim($("#computerRoom_plance_id").val());
		var AREA_TYPE= $.trim($("#earlyWarning_area_type").val());
		tbObj.bootstrapTable('refresh',{url:'ComputerroomWarning/queryAllWarning.asp?WARNING_PLANCE='+WARNING_PLANCE+'&AREA_TYPE='+AREA_TYPE});
	});
	//重置
	$("#reset_earlyWarningComputer").click(function(){
		$("#computerRoom_plance").val("");
		$("#computerRoom_plance_id").val("");
		initSelect($("#earlyWarning_area_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AMC_DIC_AREA_TYPE"}," sda",null,arr);
	});
}
function initEarlyWarningComputerRoomListBtnEvent(){
	//添加__权证预警
	$("#computerEarlyWarning_add").unbind("click");
	$("#computerEarlyWarning_add").click(function(){
		pageDispatchEarlyWarningComputer(this,"addWarn","");
	});
	//修改预警
	$("#computerearlyWarning_update").unbind("click");
	$("#computerearlyWarning_update").click(function(){
		var id = $("#tb_EarlyWarningComputerRoomList").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		pageDispatchEarlyWarningComputer(this,"updateWarn",params[0]);
	});
	//删除预警
	$("#computerDel_earlyWarning").unbind("click");
	$("#computerDel_earlyWarning").click(function(){
		var id = $("#tb_EarlyWarningComputerRoomList").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请选择一条数据进行删除!");
			return;
		}
		nconfirm("确定删除？",function(){
			var WARNING_ID = id[0].WARNING_ID;                    
			baseAjax("ComputerroomWarning/delWarning.asp",{"WARNING_ID":WARNING_ID}, function(data) {
				if (data != undefined && data != null&&data.result=="true") {
					alert("删除成功！");
					$("#search_earlyWarningComputer").click();
				}else{
					alert("删除失败！");
				}
			});
		});
	});
}
//跳转新增、修改、查看异常
function pageDispatchEarlyWarningComputer(obj,key,params){
	if(key=="addWarn"||key=="updateWarn"){
		newOpenTab("EarlyWarningComputerRoom_add","机柜预警添加修改","ppe/configureManager/computerroomearlywarning/earlyWarningComputerroom_add.html",function(){
			initEarlyWarningComputerRoom_addEvent(params);
		});
		return;
	}else if(key=="exception"){
		newOpenTab("EarlyWarningComputerRoom_exception","机柜预警异常信息","ppe/configureManager/computerroomearlywarning/earlyWarningComputerroom_exception.html",function(){
			initEarlyWarningComputerRoom_exceptionEvent(params);
		});
	}
}
//异常信息查看
function viewWarnComputerRoomNumInfo(index){
	var data = $("#tb_EarlyWarningComputerRoomList").bootstrapTable('getData');
	var ids=JSON.stringify(data[index]);
	var params=JSON.parse(ids);
	pageDispatchEarlyWarningComputer("","exception",params);
}
//初始化类型下拉框
//autoInitSelect($("#is_warrentearlyWarning"));
initEarlyWarningComputerRoomListTableEvent();
initEarlyWarningComputerRoomListBtnEvent();
