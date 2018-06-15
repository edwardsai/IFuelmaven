function initViewInventoryReportTable(data){
    //初始化基本信息
	for ( var k in data) { 
		$("span[name='VIR." + k + "']").html(data[k]);
	}
	initviewSchemeInfoTable(data.plan_num);
	//返回按钮
	$("#view_back_report").click(function(){
		newOpenTab("inventoryreportlist","返回列表","ppe/propertyManager/inventoryManager/inventoryReport/inventoryReportList.html");
	});
}

function initviewSchemeInfoTable(plan_num){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$('#view_getSchemeTable').bootstrapTable("destroy").bootstrapTable({
		url : 'InventoryPlanManager/querySchemeList.asp?plan_num='+plan_num,//请求后台的URL（*）
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
		onLoadSuccess:function(data){
		},
		columns : [{
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field: 'SCHEME_NUM',
			align: 'center',
			title : '方案编号',
			width:'15%',
			formatter: function (value, row, index) {
				if(!value){
					return '-';
				}
				return '<span class="viewDetail" '+
				'onclick="view_SchemeList('+index+')">'+value+'</span>';
			}
		},{
			field : 'SCHEME_NAME',
			title : '方案名称',
			align : "center"
		},{
			field : 'PRO_TYPE_NAME',
			title : '盘点资产类型',
			align : "center",
			formatter : function(value, row, index){
				var content = row.PRO_TYPE_NAME;
				var val = content;
				var length = content.length;
				if(length > 12){
					var abbrText = content.substring(0, 10) + "......";
					val = '<abbr hed="资产类型:" title="'+content+'" onclick="abbrModalEvent(this)">' + abbrText + '</abbr>';
				}
				return val;
			}	
		}, {
			field : 'INVEN_DEP_NAME',
			title : '盘点部门',
			align : "center"
		}, {
			field : "INVEN_PATTERN_NAME",
			title : "盘点方式",
			align : "center"
		} , {
			field : "PLAN_END_TIME",
			title : "计划完成时间",
			align : "center"
		},{
			field : "INVEN_EMP_NAME",
			title : "盘点负责人",
			align : "center"
		},{
			field : "SCHEME_STATE_NAME",
			title : "执行状态",
			align : "center"
		} , {
			field : "ACTUAL_FILISH_TIME",
			title : "实际完成时间",
			align : "center",
		} , {
			field : "TOTAL_AMOUNT",
			title : "盘点设备数量",
			align : "center",
		} , {
			field : "NORMAL_AMOUNT",
			title : "正常数量",
			align : "center",
		} , {
			field : "PROFIT_AMOUNT",
			title : "盘盈数量",
			align : "center",
		} , {
			field : "LOST_AMOUNT",
			title : "盘亏数量",
			align : "center",
		}]
	});
}

//查看操作按钮
function view_SchemeList(index){
	var inputs = $("span[name^='VIR.']");
	var params = {};	
	var getdata = $("#view_getSchemeTable").bootstrapTable('getData')[index];
	//取值
	for(var i=0;i<inputs.length;i++){
		params[$(inputs[i]).attr("name").substr(4)] = $(inputs[i]).html();	 
	}
	newOpenTab("back","查看","ppe/propertyManager/inventoryManager/inventoryReport/schemeInfo.html");
	initviewPop(params,getdata);
	initDeatilSchemeInfo(getdata,params.inven_content_type);
}
