function initViewPersonalAssetTransfer(params){
	var currTab = getCurrentPageObj();//当前页
	for(var k in params){
		var k1=k.toLowerCase();
		if (k1=="approve_remark") {
			currTab.find("textarea[name='PTP."+k1+"']").val(params[k]);
		}else {
			currTab.find("span[name='PTP."+k1+"']").html(params[k]);
		}
	}
	initPersonalAssetList(params.TRANSFER_ID);//初始化转移列表
	
	//返回按钮
	currTab.find("#goBack_propertyTransf_personal").click(function(){
		newOpenTab("employeeassettransfer", "返回", "ppe/propertyManager/propertyTransformation/propertyTransf_personal/propertyTransf_personal.html");
	});
/****************************************************************************************/
	function initPersonalAssetList(transfer_id){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		currTab.find("#tb_propertyTransf_personalDetailsList").bootstrapTable('destroy').bootstrapTable({
			url:'AssetTransferPer/queryAssetlistTransf.asp?transfer_id='+transfer_id,//请求后台的URL（*）
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		//	pagination : true, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			columns : [{
				field : 'Number',
				title : '序号',
				align : "center",
				sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field : "ASSET_NUM",
				title : '资产编码',
				align : "center"
			}, {
				field : "ASSET_NAME",
				title : '资产名称',
				align : "center"
			}, {
				field : "ASSET_TYPE",
				title : '资产类型',
				align : "center"
			},{
				field : "STATUS_NAME",
				title : "资产状态",
				align : "center"
			}]
		});
	}
}
