function initviewConsumablesStorageIn(data){
	//初始化基本信息
	for ( var k in data) { 
		$("span[name='VCS." + k + "']").html(data[k]);
	}
	//返回
	$("#back_ConsumablesStorageList").click(function(){
		newOpenTab("consumablesstorage","耗材入库","ppe/consumablesManagement/consumablesStorage/consumablesStorageList.html");
	});
	//物品列表
	$('#table_goodsin').bootstrapTable('destroy').bootstrapTable({
		url:'goodsIn/queryGoodsInInfoById.asp?id='+data.id+'&room_id='+data.room,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "GOODS_ID", //每一行的唯一标识，一般为主键列
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
		},{
			field : 'GOODS_ID',
			title : '物品编号',
			align : "center"
		}, {
			field : "GOODS_NAME",
			title : "物品名称",
			align : "center"
		},{
			field : "STANDARD",
			title : "规格型号",
			align : "center"
		},{
			field : "QUANTITY",
			title : "单位",
			align : "center"
		},{
			field : "GOOD_NUM",
			title : "剩余数量",
			align : "center",
			formatter : function (value, row, index) {
				if (row.GOODS_NUM&&row.GOODS_NUM!=null&&row.GOODS_NUM!='') {
					return row.GOODS_NUM;
				}else{
					return 0;
				}
			}
		},{
			field : "GOODS_NUMBER",
			title : "入库数量",
			align : "center"
		}]
	});
}