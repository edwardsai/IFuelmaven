function initviewDealInfo(data){
	if(data.DEAL_METHOD=="01"){
		$(".Akasset_type1").show();
		$(".Akasset_type2").hide();
	}else if(data.DEAL_METHOD=="02"){
		$(".Akasset_type2").show();
		$(".Akasset_type1").hide();
	}
	for(var k in data){
		  $("span[name='VPD." + k + "']").html(data[k]);
	}
	//返回
	$('#view_back_addPropertyDeal').click(function(){
		newOpenTab("propertydeallist","返回列表","ppe/propertyManager/propertyDealManager/propertyDeal/propertyDealList.html");
	});
}
//资产处置列表
function initassetDealInfoList(data){
	$('#Table_viewpropertyDealInfo').bootstrapTable('destroy').bootstrapTable({
		url : "AssetDeal/queryAssetInfoById.asp?deal_id="+data.DEAL_ID,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : false, //是否启用排序
		sortOrder : "asc", //排序方式
		//queryParams :queryParams,//传递参数（*）
		/*sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 5,//可供选择的每页的行数（*）
*/		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ASSET_NUM", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [ {
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : "ASSET_NUM",
			title : '资产编码',
			align : "center"
		}, {
			field : "ASSET_NAME",
			title : '资产名称',
			align : "center"
		}, {
			field : "ASSET_TYPE",
			title : "资产类型",
			align : "center"
		} , {
			field : "STATUS",
			title : "资产状态",
			align : "center"
		}, {
			field : "STORAGE_PLACE",
			title : "存放地址",
			align : "center"
		} , {
			field : "SCRAP_DATE",
			title : "报废日期",
			align : "center"
		}]
	});	
}