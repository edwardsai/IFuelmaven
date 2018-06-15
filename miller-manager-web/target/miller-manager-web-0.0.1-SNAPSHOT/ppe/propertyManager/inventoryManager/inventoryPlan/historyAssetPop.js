function openHistoryAssetPop(modalObj,asset_num){
	modalObj.find('#myModal_inventorySchemeListDetail').remove();
	modalObj.load("ppe/propertyManager/inventoryManager/inventoryPlan/historyAssetPop.html",{},function(){
		modalObj.find("#myModal_inventorySchemeListDetail").modal("show");
		AssetPop();
	});
	
	//资产模态框列表
	function AssetPop(){
		var queryParams=function(params){
			var temp={
					limit:params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};	
		 var listUrl='InventorySchemeManager/queryHistoryList.asp?asset_num='+asset_num;
		 modalObj.find('#modalTb_inventorySchemeListDetail').bootstrapTable("destroy").bootstrapTable({
				url : listUrl,//请求后台的URL（*）
				//请求后台的URL（*）
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
				uniqueId : "ASSET_NUM", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: false,
				columns : [{
					field : 'ID',
					title : '序号',
					align : "center",
					formatter: function(value,row,index){
						return index+1;
					}	
				}, {
					field: 'PLAN_NAME',
					align: 'center',
					title : '盘点计划名称',
				}, {
					field: 'SCHEME_NAME',
					align: 'center',
					title : '盘点方案名称',
				}, {
					field: 'INVEN_USER',
					align: 'center',
					title : '盘点人员',
				}, {
					field: 'INVEN_EMP_ID',
					align: 'center',
					title : '人员编号',
				},{
					field : 'INVEN_DEP',
					title : '盘点部门',
					align : "center"
				}, {
					field: 'INVEN_DEP_ID',
					align: 'center',
					title : '部门编号',
				}, {
					field : "RESULT_NAME",
					title : "盘点结果",
					align : "center",
					formatter : function(value, row, index){
						if(!value){
							if(row.IS_INVEN == "01"){//不盘点
								value = "<span class='viewDetail'>不盘点</span>";
							}
						}
						return value;
					}
				},{
					field : "ADVICE",
					title : "处理建议",
					align : "center"
				},{
					field : 'INVEN_DATE',
					title : '盘点时间',
					align : "center"
				}]
			});
	}
}