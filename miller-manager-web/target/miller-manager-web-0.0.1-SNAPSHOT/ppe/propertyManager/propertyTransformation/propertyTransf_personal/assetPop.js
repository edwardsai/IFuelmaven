function openAssetPop(modalObj,tableObj,url){
	modalObj.find('#myModalAssetInfo_transformation').remove();
	modalObj.load("ppe/propertyManager/propertyTransformation/propertyTransf_personal/assetPop.html",{},function(){
		modalObj.find("#myModalAssetInfo_transformation").modal("show");
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
		modalObj.find("#table_propertyTransferPersonal").bootstrapTable("destroy").bootstrapTable({
			//请求后台的URL（*）
			url : url,
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
			columns :[{
					checkbox:true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'Number',
					title : '序号',
					align : "center",
					formatter: function (value, row, index) {
						return index+1;
					}
				}, {
		        	field : 'ASSET_TYPE',
					title : '资产类型',
					align : "center"
		        }, {
		        	field : "ASSET_NUM",
					title : "资产编号",
					align : "center"
		        }, {
		        	field : "ASSET_NAME",
					title : "资产名称",
					align : "center",
		        },{
		        	field : "REAL_USER",
					title : "实际使用人",
					align : "center"
		        }, {
		        	field : "REAL_ADDRESS",
					title : "实际使用地址",
					align : "center"
		        }, {
		        	field : "STATUS_NAME",
					title : "资产状态",
					align : "center"
		        }]
		});
	
		//选择并返回按钮
		modalObj.find("#addModal_myModal_editPropertyTransf_personal").unbind();
		modalObj.find("#addModal_myModal_editPropertyTransf_personal").click(function(e){
			var rol = modalObj.find("#table_propertyTransferPersonal").bootstrapTable('getSelections');
			var data = tableObj.bootstrapTable('getData');
			if(rol.length<1){
				alert("请选择数据添加");
				return;
			}
			for(var i=0;i<rol.length;i++){
				for(var j=0;j<data.length;j++){
					if(rol[i].ASSET_NUM==data[j].ASSET_NUM){
						var id=data[j].ASSET_NUM;
						tableObj.bootstrapTable("removeByUniqueId", id);
					}
				}
				tableObj.bootstrapTable("append",rol[i]);
			}
			modalObj.find("#myModalAssetInfo_transformation").modal("hide");
		});
		//查询按钮
		modalObj.find("#propertyTransfPersonalQuery").unbind();
		modalObj.find("#propertyTransfPersonalQuery").click(function() {
			var asset_num = modalObj.find("[name='asset_num']").val();
			var asset_name = modalObj.find("[name='asset_name']").val();
			modalObj.find('#table_propertyTransferPersonal').bootstrapTable('refresh',
				{url:url+'&asset_num=' + asset_num + "&asset_name="+escape(encodeURIComponent(asset_name))});
	    });
		//重置按钮
		modalObj.find("#propertyTransfPersonalReset").unbind();
		modalObj.find("#propertyTransfPersonalReset").click(function(){
			modalObj.find("[name='asset_num']").val("");
			modalObj.find("[name='asset_name']").val("");
		});
	}
	
	
	
	
	
}