initAssetApplyListLayout();

function initAssetApplyListLayout(){
	var page = $("#assetApplyListPart");
	
	autoInitSelect($("#supplierManager"));
	
	var query = page.find("div[sel=query]");
	query.click(function(){
		initTable();
	});
	
	var reset = page.find("div[sel=reset]");
	reset.click(function(){
		page.find("input[name=applyNum]").val("");
		page.find("input[name=applyDate]").val("");
		page.find("select[name=applyStatus]").val(" ");
		page.find("select[name=applyStatus]").select2();
		//page.find("select[name=assetSource]").val("");
		//page.find("select[name=assetSource]").select2();
	});
	
	var showMore = page.find("div[sel=showMore]");
	showMore.click(function(){
		var tog = page.find("div[sel=moreSearch]");
		if($(this).is(":hidden")){
			$(this).find("i").attr("class","icon-zoom-out");
		}else{
			$(this).find("i").attr("class","icon-zoom-in");
		}
		tog.toggle("normal hide");
	});
	
	var add = page.find("li[sel=addAssetApply]");
	add.click(function(){
		newOpenTab("newAssetApply","操作计划","ppe/propertyManager/assetApply/assetApplyEdit.html",function(){
			initAssetApplyEditLayout(null);
		});
	});
	
	// 修改
	var update = page.find("li[sel=editAssetApply]");
	update.click(function(){
		var seles = $('#tb_assetApplyList').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var state = seles[0].applyStatus;                    
		if(state=="02"||state=="03"){
			alert("该申请正在审批或已通过审批，不能修改");
			return ;
		}
		newOpenTab("newAssetApply","操作计划","ppe/propertyManager/assetApply/assetApplyEdit.html",function(){
			initAssetApplyEditLayout(seles[0]);
		});
	});
	//删除
	var del = page.find("li[sel=delAssetApply]");
	del.click(function(){
		var seles = $("#tb_assetApplyList").bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		var state = seles[0].applyStatus;                    
		if(state=="02"||state=="03"){
			alert("该申请正在审批或已通过审批，不能删除");
			return ;
		}
		var msg="是否删除此申请？";
		nconfirm(msg,function(){
			var applyId = seles[0].applyId;                    
			baseAjax("inventoryManager/assetApply/delAssetApply.asp",{"applyId":applyId}, function(data) {
				if (data != undefined && data != null) {
					alert("删除成功");
					if(data.result==true){
						initTable();
					}
				}else{
					alert("删除失败！");
				}
			},true);
		});
	});
	//确认审批
	var sureApply = page.find("li[sel=sureAssetApplyAudit]");
	sureApply.click(function(){
		var seles = $("#tb_assetApplyList").bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行确认!");
			return;
		}
		var state = seles[0].applyStatus;                    
		if(state!="02"){
			alert("该申请不在审批中，不能确认");
			return ;
		}
		nconfirm("是否确认审批？",function(){
			var applyId = seles[0].applyId;                    
			baseAjax("inventoryManager/assetApply/sureAssetApply.asp",{"applyId":applyId}, function(data) {
				if (data != undefined && data != null) {
					alert("确认成功");
					if(data.result==true){
						initTable();
					}
				}else{
					alert("删除失败！");
				}
			},true);
		});
	});
	//查看审批
	var examination = page.find("li[sel=readAssetApplyAudit]");
	examination.click(function(){
		var seles = $('#tb_assetApplyList').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		var state = seles[0].useMethod;                    
//		if(state=="02"||state=="03"){
//			alert("该申请正在审批或已通过审批，不能修改");
//			return ;
//		}

		newOpenTab("readAssetApplyAudit","查看计划","ppe/propertyManager/assetApply/assetApplyAudit.html",function(){
			initreadAssetApplyAudit(seles[0]);
			
		});
	});
	
	initTable();
	
	function initTable(){
		var applyId = page.find("input[name=applyNum]").val();
		var applyStatus = $.trim(page.find("select[name=applyStatus]").val());
		var applyDate = $.trim(page.find("input[name=applyDate]").val());
		//var resFrom = $.trim(page.find("select[name=assetSource]").val());
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		var permission = true;//是否做权限控制
		$('#tb_assetApplyList').bootstrapTable('destroy').bootstrapTable({
			url:'inventoryManager/assetApply/queryAssetApply.asp?applyId='+applyId+'&applyStatus='+applyStatus
				+'&applyDate='+applyDate +'&permission='+permission,//请求后台的URL（*）
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
			uniqueId : "applyId", //每一行的唯一标识，一般为主键列
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
				field: 'applyId',
				align: 'center',
				title : '申请流水号'
			},{
				field : 'categoryIdName',
				title : '资产类型',
				align : "center"
			}, {
				/*field : 'resFrom',
				title : '资产来源',
				align : "center"
			}, {*/
				field : 'applyNum',
				title : '申请数量',
				align : "center"
			}, {
				field : "applyDate",
				title : "申请时间",
				align : "center"
			} , {
				field : "applyUserName",
				title : "申请人",
				align : "center"
			},{
				field : "requiredDate",
				title : "要求到位时间",
				align : "center"
			},{
				field : "apply_status",
				title : "申请状态",
				align : "center",
				formatter : function(value, row, index){
					return row.applyStatusName;
				}
			},{
				field : "none",
				title : "当前审批人",
				align : "center",
				formatter : function(value, row, index){
					return "无";
				}
			},{
				field : "use_method",
				title : "借用方式",
				align : "center",
				formatter : function(value, row, index){
					return row.useMethodName;
				},
				visible:false
			}]
		});
	}
	
}

