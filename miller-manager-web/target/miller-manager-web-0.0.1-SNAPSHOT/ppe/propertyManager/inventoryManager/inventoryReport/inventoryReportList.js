//初始化按钮事件
function initInventoryReportButtonEvent(){
	$("#select_report").click(function(){
		var plan_num = $("#Splan_num").val();
		var report_name = $("#Sreport_name").val();
		$('#inventoryreporttable').bootstrapTable('refresh',
				{url:'InventoryReport/queryallReport.asp?report_name=' +escape(encodeURIComponent(report_name))+'&plan_num='+plan_num});
		});
	//重置按钮
	$("#reset_report").click(function(){
		$("#reportlist_form input").val("");
	 });
	//新增报告
	$("#add_InventoryReport").click(function(){
		pageDispatchReport(this,"add_InventoryReport","");
	});
	//修改报告
	$("#update_InventoryReport").click(function(){
		var id = $("#inventoryreporttable").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var ids = id[0].ID; 
		var inven_content_type = id[0].INVEN_CONTENT_TYPE;//盘点内容类型		2017-04-12新增权证盘点功能新增
		report_state = id[0].REPORT_STATE;
		if(report_state!="待发起"){
			alert("报告"+id[0].REPORT_NAME+"不是待发起状态，不能修改");
			return;
		}
		pageDispatchReport(this,"update_InventoryReport",{ids : ids, inven_content_type : inven_content_type});
	});
	//查看报告
	$("#view_InventoryReport").click(function(){
		var id = $("#inventoryreporttable").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		var ids = id[0].ID; 
		var inven_content_type = id[0].INVEN_CONTENT_TYPE;
		pageDispatchReport(this,"view_InventoryReport",{ids : ids, inven_content_type : inven_content_type});
	});
	//删除报告
	$("#delete_InventoryReport").click(function(e){
		if($("#inventoryreporttable input[type='checkbox']").is(':checked')){			
			var id = $("#inventoryreporttable").bootstrapTable('getSelections');
			var ids = id[0].ID;                    
			var report_state = "";
			report_state = id[0].REPORT_STATE;
			if(report_state!="待发起"){
				alert("报告"+id[0].REPORT_NAME+"不是待发起状态，不能删除");
				return;
			}
			nconfirm("确定要删除该数据吗？",function(){
				$("#inventoryreporttable").bootstrapTable('remove', {
					field: 'ID',
					values: ids
				});	
				var url="InventoryReport/deleteReport.asp?id="+ids;
				$.ajax({
					type : "post",
					url : url,
					async :  true,
					data : "",
					dataType : "json",
					success : function(map) {
						$('#inventoryreporttable').bootstrapTable('refresh',{url:'InventoryReport/queryallReport.asp'});
					},
					error : function() {	
						alert("删除失败！");
					}
				});
			});
	     }else{
			e.preventDefault();
	        $.Zebra_Dialog('请选择一条数据进行删除!', {
	            'type':     'close',
	            'title':    '提示',
	            'buttons':  ['是'],
	            'onClose':  function(caption) {
	            	if(caption=="是"){
	            	}
	            }
	        });
		}
		
	});
}
//报告列表显示
function initInventoryReportInfo() {
	var plan_num = $("#Splan_num").val();
	var report_name = $("#Sreport_name").val();
	//分页
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#inventoryreporttable").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'InventoryReport/queryallReport.asp?report_name=' +escape(encodeURIComponent(report_name))+'&plan_num='+plan_num,
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
				uniqueId : "id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'ID',
					title : '序号',
					align : "center",
					sortable: true,
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : 'REPORT_NAME',
					title : '报告名称',
					align : "center"
				}, {
					field : "PLAN_NUM",
					title : "盘点计划编号",
					align : "center"
				}, {
					field : "INVEN_SCHEME_NUM",
					title : "包含盘点方案个数",
					align : "center"
				}, {
					field : "REPORT_TIME",
					title : "报告时间",
					align : "center",
				}, {
					field : "PLAN_EMP_NAME",
					title : "计划负责人",
					align : "center"
				} ,{
					field : "REPORT_STATE",
					title : "报告状态",
					align : "center"
				}, {
					field : "INVEN_SCOPE_NAME",
					title : "盘点范围",
					align : "center"
				}]
			});
}

//跳转方法(新增或修改)
function pageDispatchReport(obj,key,params){
	var p = params;
	if("add_InventoryReport"==key){
		newOpenTab("add_InventoryReport","新增报告","ppe/propertyManager/inventoryManager/inventoryReport/addInventoryReport.html", function(){
		});
		return;
	}else { 
		baseAjax("InventoryReport/queryOneReport.asp?id="+p.ids, null , function(data) {
			data.inven_content_type = p.inven_content_type;//增加一条数据盘点内容类型
			if("update_InventoryReport"==key){
				newOpenTab("update_InventoryReport","修改报告","ppe/propertyManager/inventoryManager/inventoryReport/addInventoryReport.html",function(){
					//初始化基本信息
					data.inven_content_type = p.inven_content_type;
					for ( var k in data) { 
						$("input[name='MK." + k + "']").val(data[k]);
					}
					initSchemeInfoTable(data.plan_num);
				});
			}else if("view_InventoryReport"==key){
				newOpenTab("view_InventoryReport","查看报告","ppe/propertyManager/inventoryManager/inventoryReport/viewInventoryReport.html",function(){
					initViewInventoryReportTable(data);
				});
			}
		});
	}
}
		
		
initInventoryReportButtonEvent();
initInventoryReportInfo();