function openReportPop(id,callparams){
		
		$("#"+id).load("ppe/propertyManager/inventoryManager/inventoryReport/inventoryPop.html",{},function(){
			$("#myModalInventoryPlan").modal("show");
			//获取input里面的值
			//盘点计划POP重置
			$("#reset_Modalplan").click(function(){
				$("#Mplan_num").val("");
				$("#Mplan_name").val("");
				
			});
			//多条件查询盘点计划
			$("#search_Modalplan").click(function(){
				var plan_num = $("#Mplan_num").val();
				var plan_name =  $("#Mplan_name").val();
				$("#inventoryplanModal").bootstrapTable('refresh',{url:"InventoryReport/queryPlanPop.asp?plan_num="
						+plan_num+"&plan_name="+escape(encodeURIComponent(plan_name))});
			});
			
			var plan_num = $("#Mplan_num").val();
			var plan_name =  $("#Mplan_name").val();
			ReportPop("#inventoryplanModal","InventoryReport/queryPlanPop.asp?plan_num="
					+plan_num+"&plan_name="+escape(encodeURIComponent(plan_name)),callparams);
		});
		
	}
/**
 * 盘点计划模态框
 */
function ReportPop(ReportTable,ReportUrl,ReportParam){
	//分页
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	//查询所有盘点计划POP框
	$(ReportTable).bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : ReportUrl,
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
		uniqueId : "ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		onDblClickRow:function(row){
			$('#myModalInventoryPlan').modal('hide');
			ReportParam.Zplan_num.val(row.PLAN_NUM);
			ReportParam.Zplan_name.val(row.PLAN_NAME);
			ReportParam.Zplan_emp.val(row.PLAN_EMP);
			ReportParam.Zplan_emp_name.val(row.PLAN_EMP_NAME);
			ReportParam.Zinven_content_type.val(row.INVEN_CONTENT_TYPE);
			getnum(row.PLAN_NUM);
		},
		columns :[{
				field : 'ID',
				title : '序号',
				align : "center",
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
	        	field : 'PLAN_NUM',
				title : '盘点计划编号',
				align : "center"
	        }, {
	        	field : "PLAN_NAME",
				title : "盘点计划名称",
				align : "center"
	        }, {
	        	field : "START_TIME",
				title : "计划开始时间",
				align : "center",
	        }, {
	        	field : "END_TIME",
				title : "计划结束时间",
				align : "center"
	        }, {
	        	field : "PLAN_EMP",
				title : "计划负责人id",
				align : "center",
				visible:false
	        },{
	        	field : "PLAN_EMP_NAME",
				title : "计划负责人",
				align : "center"
	        }, {
	        	field : "INVEN_CONTENT_NAME_abbr",
				title : "盘点内容",
				align : "center",
				formatter : function(value, row, index){
					var content = row.INVEN_CONTENT_NAME;
					var val = content;
					var length = content.length;
					if(length > 12){
						var abbrText = content.substring(0, 10) + "......";
						val = '<abbr hed="资产类型:" title="'+content+'">' + abbrText + '</abbr>';
					}
					return val;
				}
	        }]
	});
	
}
