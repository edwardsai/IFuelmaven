//初始化按钮事件
function initPropertyRepairBtnEvent(){
	//查询按钮
	$("#select_propertyRepairList").click(function(){
		var asset_name = $.trim($("#PRasset_name").val());
		var repair_status = $.trim($("#PRrepair_status").val());
		var apply_user = $.trim($("#PRrepair_result").val());
		var rep_id = $.trim($("#PRrep_id").val());
		var flag = "04";
		$('#Table_propertyRepairList').bootstrapTable('refresh',{
			url:'AssetRepair/queryAllRepairInfo.asp?repair_status='+repair_status
			+'&asset_name='+escape(encodeURIComponent(asset_name))
			+'&apply_user='+escape(encodeURIComponent(apply_user))
			+'&rep_id='+escape(encodeURIComponent(rep_id))
			+'&flag='+escape(encodeURIComponent(flag))
			});
	});
	//重置按钮
	$('#reset_propertyRepairList').bind('click', function(e) {
		$("#search_propertyRepairList input,select").val("");
		$("#search_propertyRepairList select").select2();
	});
	//高级查询按钮 
	$("#showMore_propertyRepairList").click(function() {
		showMore($(this),"#moreSearch_propertyRepairList");
	});
	//派单按钮
	$("#dispatch_repair").click(function(){
		var id = $("#Table_propertyRepairList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行派单!");
			return ;
		}
		var repair_status = id[0].REPAIR_STATUS_NAME;
		if(repair_status!="待接单"){
			alert("该信息不是待接单状态，不能进行派单");
			return;
		}
	    initRepairPop(id[0].ID);
	});
	//维修情况登记按钮
	$("#finish_repair").click(function(){
		var id = $("#Table_propertyRepairList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行登记!");
			return ;
		}
		var repair_status = id[0].REPAIR_STATUS_NAME;
		if(repair_status!="维修中"){
			alert("该信息不是维修中状态，不能进行登记");
			return;
		}
		pageDispatchPropertyRepair(this,"finish_repair",id[0].ID);
	});
	//查看按钮
	$("#view_repair_info").click(function(){
		var id = $("#Table_propertyRepairList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		var repair_status = id[0].REPAIR_STATUS_NAME;
		pageDispatchPropertyRepair(this,"view_repair_info",id[0].ID,repair_status);
	});
	//维修人员POP重置
	$("#pop_Reset_repair").click(function(){
		$("#PRrepuser_num").val("");
		$("#PRrepuser_name").val("");
		
	});
	//多条件查询维修人员
	$("#pop_Search_repair").click(function(){
		var repuser_num = $("#PRrepuser_num").val();
		var repuser_name =  $("#PRrepuser_name").val();
		$('#Table_Repairmanpop').bootstrapTable('refresh',{url:"AssetRepair/queryRepairPop.asp?repuser_num="
				+repuser_num+"&repuser_name="+escape(encodeURIComponent(repuser_name))});
	});
}
//列表显示
function initPropertyRepairList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var flag = "04";
	$('#Table_propertyRepairList').bootstrapTable({
		url : 'AssetRepair/queryAllRepairInfo.asp?flag='+flag,//请求后台的URL（*）
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
			field: 'REP_ID',
			align: 'center',
			title : '流水号'
		},{
			field : 'ASSET_NUM',
			title : '资产编码',
			align : "center"
		}, {
			field : 'ASSET_NAME',
			title : '资产名称',
			align : "center"
		}, {
			field : 'ASSET_TYPE_NAME',
			title : '资产类别',
			align : "center"
		}, {
			field : "APPLY_USER_NAME",
			title : "申请人",
			align : "center"
		} ,
		{
			field : "APPLY_ORG_NAME",
			title : "申请人部门",
			align : "center"
		} , {
			field : "APPLY_DATE",
			title : "申请时间",
			align : "center"
		},{
			field : "REQUIRED_DATE",
			title : "要求完成时间",
			align : "center"
		},{
			field : "FINISH_DATE",
			title : "实际完成时间",
			align : "center"
		},{
			field : "USER_NAME",
			title : "维修人员",
			align : "center"
		},{
			field : "REPAIR_STATUS_NAME",
			title : "维修状态",
			align : "center"
		},{
			field : "REPAIR_RESULT_NAME",
			title : "维修结果",
			align : "center"
		}]
	});
}

//跳转方法
function pageDispatchPropertyRepair(obj,key,params,repair_status){
	baseAjax("AssetRepair/queryOneRepair.asp?id="+params, null , function(data) {
		newOpenTab("completeRepairRegister","维修情况登记","ppe/propertyManager/repairOrderManager/completeRepairRegister.html",function(){
			initCompleteRepairRegister(key,data,repair_status);
		});
	});
}
//维修人员模态框
function initRepairPop(id){
	$("#pop_Reset_repair").click();
	var repuser_num = $("#PRrepuser_num").val();
	var repuser_name =  $("#PRrepuser_name").val();
	$("#propertyRepairmanPop").modal("show");
	//分页
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	//查询维修人员POP框
	$('#Table_Repairmanpop').bootstrapTable({
		//请求后台的URL（*）
		url : 'AssetRepair/queryRepairPop.asp?repuser_num='
			+repuser_num+"&repuser_name="+escape(encodeURIComponent(repuser_name)),
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "USER_NO", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		onDblClickRow:function(row){
			$('#propertyRepairmanPop').modal('hide');
			getRepusername(id,row.USER_NAME,row.USER_NO,row.ORG_NO);
		},
		columns :[{
				field : 'Number',
				title : '序号',
				align : "center",
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
	        	field : 'USER_NO',
				title : '维修人员编号',
				align : "center"
	        }, {
	        	field : "USER_NAME",
				title : "维修人员名称",
				align : "center"
	        }, {
	        	field : 'ORG_NO',
				title : '人员编号',
				align : "center",
				visible:false
	        }, {
	        	field : "ORG_NAME",
				title : "维修人员部门",
				align : "center"
	        }, {
	        	field : "REPAIRLIST_NUM",
				title : "维修单数量",
				align : "center",
	        }, {
	        	field : "FINISH_REPAIRLIST_NUM",
				title : "完成数量",
				align : "center"
	        }, {
	        	field : "UNFINISH_REPAIRLIST_NUM",
				title : "未完成数量",
				align : "center"
	        }]
	});
}

function getRepusername(id,p,m,z){
	var param = {};
	param["id"]=id;
	param["user_name"]=p;
	param["user_no"]=m;
	param["org_no"]=z;
	 baseAjax("AssetRepair/updatepropertyRepairList.asp", param, function(data) {
       	if (data != undefined && data != null&&data.result=="true" ) {
       		newOpenTab("propertyRepairList","返回","ppe/propertyManager/repairOrderManager/propertyRepairList.html");
			}else{
				alert("----派单失败----");
			}
		});
}

initPropertyRepairBtnEvent();
initPropertyRepairList();
autoInitSelect($("#search_propertyRepairList"));