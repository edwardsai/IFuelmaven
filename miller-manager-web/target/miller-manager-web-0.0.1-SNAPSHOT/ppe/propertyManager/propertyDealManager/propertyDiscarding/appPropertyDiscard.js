
function initviewApppropertyDiscardList(params){
	for ( var k in params) { 
		var k1=k.toLowerCase();
		if(k1=="scrap_remark"){
			
			$("textarea[name='AAP." +k1+ "']").val(params[k]);
		}else{
			 $("span[name='AAP." +k1+ "']").html(params[k]);
		}
	}
	//返回按钮
	$("#back_appPropertyDiscard").click(function(){
		newOpenTab("propertydiscardlist", "返回", "ppe/propertyManager/propertyDealManager/propertyDiscarding/propertyDiscardList.html");
	});
	//列表
	$("#table_info_appPropertyDiscard").bootstrapTable('destroy').bootstrapTable({
		url:'PropertyDiscard/queryByScrapId.asp?scrap_id='+params.SCRAP_ID,//请求后台的URL（*）
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : false, //是否启用排序
		sortOrder : "asc", //排序方式
		/*queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 5,//可供选择的每页的行数（*）
*/		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ASSET_NUM", //每一行的唯一标识，一般为主键列
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
			field : 'ASSET_NUM',
			title : '资产编码',
			align : "center"
		}, {
			field : "ASSET_NAME",
			title : "资产名称",
			align : "center"
		}, {
			field : "ASSET_TYPE",
			title : "资产类型",
			align : "center"
		},{
			field : "STATUS_NAME",
			title : "资产状态",
			align : "center",
		}, {
			field : "STORAGE_PLACE",
			title : "存放地址",
			align : "center"
		},{
			field : "SCRAP_DATE",
			title : "报废时间",
			align : "center",
		}]
	});
}

//function init_table_approvePropertyDiscard(){
//	var queryParams=function(params){
//		var temp={
//				limit: params.limit, //页面大小
//				offset: params.offset //页码
//		};
//		return temp;
//	};
//	$("#table_approve_course").bootstrapTable({
//		method : 'get', //请求方式（*）   
//		striped : true, //是否显示行间隔色
//		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
//		sortable : true, //是否启用排序
//		sortOrder : "asc", //排序方式
//		queryParams : queryParams,//传递参数（*）
//		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
//		pagination : true, //是否显示分页（*）
//		pageList : [5,10],//每页的记录行数（*）
//		pageNumber : 1, //初始化加载第一页，默认第一页
//		pageSize : 5,//可供选择的每页的行数（*）
//    	clickToSelect : true, //是否启用点击选中行
//		uniqueId : "ASSET_NUM", //每一行的唯一标识，一般为主键列
//		cardView : false, //是否显示详细视图
//		detailView : false, //是否显示父子表
//		singleSelect: true,
//		columns : [ {
//			field: 'middle',
//			checkbox: true,
//			rowspan: 2,
//			align: 'center',
//			valign: 'middle'
//		}, {
//			field : 'Number',
//			title : '序号',
//			align : "center",
//			sortable: true,
//			formatter: function (value, row, index) {
//				return index+1;
//			}
//		},{
//			field : 'APPROVE_STATION',
//			title : '审批岗位',
//			align : "center"
//		}, {
//			field : "APPROVE_NAME",
//			title : "审批人",
//			align : "center"
//		}, {
//			field : "APPROVE_ADVICE",
//			title : "审批情况",
//			align : "center"
//		},{
//			field : "APPROVE_OPERATE",
//			title : "审批操作",
//			align : "center",
//		},{
//			field : "APPROVE_ADVICE",
//			title : "审批说明",
//			align : "center",
//		},{
//			field : "APPROVE_DATE",
//			title : "审批时间",
//			align : "center",
//		}]
//	});
//}

