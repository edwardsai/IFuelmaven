//初始化按钮事件
function initCategoryButtonEvent(){
	//重置
	$("#resetInputField").click(function(){
		$("#tag_id").val("");
		$("#tag_name").val("");
	});
	//查询公共字段
	$("#queryCommonField").click(function(){
		var tag_id = $("#tag_id").val();
		var tag_name = $("#tag_name").val();
		$('#commonFieldTable').bootstrapTable('refresh',
			{url:'propertyFieldConfig/queryAllCommonField.asp?tag_name=' + escape(encodeURIComponent(tag_name))
				+ '&tag_id=' + tag_id});
	});
	//新增公共字段
	$("#addCommonField").click(function(){
		pageDispatchField(this,"addField","");
	});
	//修改公共字段
	$("#updateCommonField").click(function(){
		var selectedRow = $("#commonFieldTable").bootstrapTable('getSelections');
		if(selectedRow.length != 1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var col_id = $.map(selectedRow, function (index) {
			return index.COL_ID;                    
		});
		pageDispatchField(this,"updateField",col_id);
	});
	//删除公共字段
	$("#deleteCommonField").click(function(){
		var selectedRow = $("#commonFieldTable").bootstrapTable('getSelections');
		var col_id = $.map(selectedRow, function (row) {
			return row.COL_ID;                    
		});
		if(selectedRow.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			baseAjax("propertyFieldConfig/deleteField.asp?col_id="+col_id, null, function(data) {
				if (data != undefined && data != null && data.result == true) {
					$("#queryCommonField").click();
				} else {
					alert("删除失败");
				}
			});
		});	
	});	
	
}




//初始化查询供应商列表显示table
function initCommonFieldTable() {
	//分页
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#commonFieldTable").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'propertyFieldConfig/queryAllCommonField.asp?',
				method : 'get', //请求方式（*）   
				striped : true, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "COL_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				onLoadSuccess:function(data){},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'Number',
					title : '序号',
					align : "center",
					//sortable: true,
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : 'COL_ID',
					title : '主键',
					align : "center",
					visible: false
				},{
					field : 'TAG_ID',
					title : '标签ID',
					align : "center"
				}, {
					field : "TAG_NAME",
					title : "标签名",
					align : "center"
				}, {
					field : "COL_REQUIRED",
					title : "是否必填",
					align : "center",
				}, {
					field : "TAG_TYPE",
					title : "标签类型",
					align : "center"
				}, {
					field : "MAX_LENGTH",
					title : "最大长度",
					align : "center"
				}, {
					field : "DIC_CODE",
					title : "字典项编号",
					align : "center"
				}, {
					field : "ORDER_ID",
					title : "排序序号",
					align : "center"
				}, {
					field : "DEFAULT_VALUE",
					title : "默认值",
					align : "center"
				}, {
					field : "INIT_TEMPLATE",
					title : "初始化模版",
					align : "center"
				}]
			});
};

//跳转方法(新增或修改)
function pageDispatchField(obj,key,params){
	var p = params;
	if("addField"==key){
		newOpenTab("add_field","新增公共字段","ppe/categoryManager/addCommonfield.html");
		return;
	}else if("updateField"==key){
		newOpenTab("update_field","修改公共字段","ppe/categoryManager/addCommonfield.html",function(){
			initOneFieldData(p);
		});
	}
}

initCommonFieldTable();
initCategoryButtonEvent();