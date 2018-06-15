function initviewconsumablesRecipients(data){
	//初始化基本信息
	for ( var k in data) { 
		$("span[name='VCR." + k + "']").html(data[k]);
	}
	//返回
	$("#view_back_addConsumablesRecipients").click(function(){
		newOpenTab("consumablesrecipients", "返回","ppe/consumablesManagement/consumablesRecipients/consumablesRecipients.html");
	});
	//物品列表
	$('#view_table_selectInfo').bootstrapTable('destroy').bootstrapTable({
		url:'CMRecipients/queryRecipientsInfoById.asp?out_id='+data.OUT_ID+'&room='+data.ROOM,
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
		}, {
			field : "BRAND",
			title : "品牌商标",
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
			field : "GOODS_NUM",
			title : "剩余数量",
			align : "center"
		},{
			field : "GOODS_NUMBER",
			title : "领用数量",
			align : "center"
		}]
	});
}