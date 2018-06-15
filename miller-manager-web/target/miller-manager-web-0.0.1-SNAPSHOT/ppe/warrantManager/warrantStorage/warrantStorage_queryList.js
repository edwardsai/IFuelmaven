initWarrantStorageListLayout();

function initWarrantStorageListLayout(){
	initButtonShowMore();
	function initButtonShowMore(){
		$("#showMore_WSlist").click(function(){
			showMore($(this),"#moreSearch_WSList");
		});
	}
	
	var page = $("#warrantStorage");
	//查询
	var query = page.find("div[sel=query]");
	query.click(function(){
		initTable();
	});
	
	//重置
	var reset = page.find("div[sel=reset]");
	reset.click(function(){
		page.find("input[name=WARRANT_NO]").val("");
		page.find("input[name=PROPERTY_OWNER]").val("");
		page.find("input[name=BATCH_ID]").val("");
		page.find("input[name=GUARANTEE_ID]").val('');
		page.find("input[name=GUARANTEE_NAME]").val('');
		page.find("input[name=CONTRACT_NO]").val('');
	});
	
	//入库登记
	var add = page.find("#warrantStorage");
	add.click(function(){
		var id=$("#tb_WSList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行登记！");
			return;
		}
		if(id[0].ENTER_FLAG != '00'){
			alert("该信息已处理！");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		newOpenTab("warrantStorage_add","权证入库","ppe/warrantManager/warrantStorage/warrantStorage_add.html");
		initWarrantStorageAdd(params[0]);
	});
	
	//查看
	var view = page.find("#viewWarrantStorage");
	view.click(function(){
		var id=$("#tb_WSList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看！");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		newOpenTab("warrantStorage_view","权证入库查看","ppe/warrantManager/warrantStorage/warrantStorage_view.html");
		initWarrantStorageView(params[0]);
	});
	
	/*初始化待入库表格*/
	initTable();
	function initTable(){
		var WARRANT_NO = $.trim(page.find("input[name=WARRANT_NO]").val());
		var PROPERTY_OWNER = $.trim(page.find("input[name=PROPERTY_OWNER]").val());
		var BATCH_ID=$.trim(page.find("input[name=BATCH_ID]").val());
		var GUARANTEE_ID=$.trim(page.find("input[name=GUARANTEE_ID]").val());
		var GUARANTEE_NAME=$.trim(page.find("input[name=GUARANTEE_NAME]").val());
		var CONTRACT_NO=$.trim(page.find("input[name=CONTRACT_NO]").val());
		var ENTER_FLAG=$.trim(page.find("input[name=ENTER_FLAG]").val());
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		$('#tb_WSList').bootstrapTable('destroy').bootstrapTable({
			url:'WarrantStorage/queryListWarrantStorage.asp?WARRANT_NO='+WARRANT_NO
			+'&PROPERTY_OWNER='+escape(encodeURIComponent(PROPERTY_OWNER))
			+'&BATCH_ID='+BATCH_ID
			+'&GUARANTEE_ID='+GUARANTEE_ID
			+'&GUARANTEE_NAME='+escape(encodeURIComponent(GUARANTEE_NAME))
			+'&ENTER_FLAG='+escape(encodeURIComponent(ENTER_FLAG))
			+'&CONTRACT_NO='+CONTRACT_NO,//请求后台的URL（*）
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "ID", //每一行的唯一标识，一般为主键列
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
			}, {
				field : 'BATCH_ID',
				title : '批次编号',
				align : "center"
			}, {
				field: 'CONTRACT_NO',
				align: 'center',
				title : '担保合同编号'
			},{
				field : 'GUARANTEE_ID',
				title : '押品编号',
				align : "center"
			}, {
				field : 'GUARANTEE_NAME',
				title : '押品名称',
				align : "center"
			}, {
				field : 'WARRANT_NO',
				title : '权证编号',
				align : "center"
			}, {
				field : 'PROPERTY_OWNER_NAME',
				title : "权属人名称",
				align : "center"
			} , {
				field : 'WARR_TYPE_NAME',
				title : "权证类型一",
				align : "center"
			}, {
				field : 'WARR_TYPE2_NAME',
				title : "权证类型二",
				align : "center"
			},{
				field : 'STORAGE_TYPE_NAME',
				title : "入库类型",
				align : "center"
			},{
				field : 'ENTER_FLAG_NAME',
				title : "入库标识",
				align : "center"
			},{
				field : 'APPLY_USER_NAME',
				title : "申请人",
				align : "center",
			},{
				field : 'APPROVE_DATE',
				title : "审批通过日期",
				align : "center",
			}]
		});
	}
}