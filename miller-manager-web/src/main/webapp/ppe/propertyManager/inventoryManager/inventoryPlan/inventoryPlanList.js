initInventoryPlanListEvent();
function initInventoryPlanListEvent(){
	var currTab = getCurrentPageObj();//当前页
	autoInitSelect(currTab.find("#searchDiv_inventoryPlanList"));
	initInventoryPlanList();//初始化列表
	//查询按钮
	currTab.find("#search_inventoryPlanList").click(function(){
		var plan_num = $.trim(currTab.find("#plan_num_inventoryPlanList").val());
		var plan_name = $.trim(currTab.find("#plan_name_inventoryPlanList").val());
		var inven_content = $.trim(currTab.find("#inven_content_inventoryPlanList").val());
		var inven_scope = $.trim(currTab.find("#inven_scope_inventoryPlanList").val());
		var state = $.trim(currTab.find("#state_inventoryPlanList").val());
		currTab.find('#tb_inventoryPlanList').bootstrapTable('refresh',{
			url:'InventoryPlanManager/queryAllPlan.asp?plan_num='+plan_num
			+'&plan_name='+escape(encodeURIComponent(plan_name))
			+'&inven_content='+escape(encodeURIComponent(inven_content))+'&state='+state
			+'&inven_scope='+escape(encodeURIComponent(inven_scope))});
	});
	//增加计划
	currTab.find('#addPlan_inventoryPlanList').bind('click', function(e) {
		pageDispatchInventoryPlanList("addPlan","");
	});
	//修改计划
	currTab.find('#updatePlan_inventoryPlanList').bind('click', function(e) {
		var id = currTab.find("#tb_inventoryPlanList").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var state = id[0].STATE_NAME;                    
		if(state!="待发起"){
			alert("该计划已发起不能修改!");
			return ;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		pageDispatchInventoryPlanList("updatePlan",params[0]);
	});
	//删除计划
	currTab.find("#deletePlan_inventoryPlanList").bind('click',function(){
		var id = currTab.find("#tb_inventoryPlanList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		var state = id[0].STATE_NAME;                    
		if(state!="待发起"){
			alert("该计划已发起不能删除!");
			return ;
		}
		nconfirm(msg,function(){
			var plan_num = id[0].PLAN_NUM;                    
			baseAjax("InventoryPlanManager/deletePlan.asp",{"plan_num":plan_num}, function(data) {
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						currTab.find("#search_inventoryPlanList").click();
					}
				}else{
					alert("删除失败！");
				}
			},true);
		});
	});
	//执行盘点
	currTab.find('#executeScheme_inventoryPlanList').bind('click', function(e) {
		var id = currTab.find("#tb_inventoryPlanList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据执行盘点!");
			return;
		}
		var state = id[0].STATE_NAME;
		if(state!="待发起"){
			alert("该计划已发起执行！");
			return ;
		}
		nconfirm("确定执行吗？",function(){
			var plan_num = id[0].PLAN_NUM;                    
			baseAjax("InventoryPlanManager/executeScheme.asp",{"PLAN_NUM":plan_num}, function(data) {
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						currTab.find("#search_inventoryPlanList").click();
					}
				}else{
					alert("执行盘点失败！");
				}
			},true);
		});
	});
	//查阅方案
	currTab.find('#viewScheme_inventoryPlanList').bind('click', function(e) {
		var id = currTab.find("#tb_inventoryPlanList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查阅!");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		pageDispatchInventoryPlanList("viewScheme",params[0]);
	});
	//重置按钮
	$('#reset_inventoryPlanList').bind('click', function(e) {
		currTab.find("#searchDiv_inventoryPlanList input,select").val("");
		currTab.find("#searchDiv_inventoryPlanList select").select2();
	});
	//高级查询按钮 
	currTab.find("#showMore_inventoryPlanList").click(function() {
		showMore($(this),"#moreSearch_inventoryPlanList");
		showMore($(this),"#moreSearch2_inventoryPlanList");
	});
	//更多按钮
	currTab.find("#moreIlsh_inventoryPlanList").click(function(){
		moreIlsh($(this),"#submenuList_inventoryPlanList");
	});
	//选择类别
	currTab.find('#inven_content_inventoryPlanList').bind('click', function(e) {
		openSelectTreeDiv($(this),"proConfigSelectTreeType_invPL","propertyTypeConfig/queryAllCategroy.asp",{width:$(this).width()+"px","margin-left": "140px"},function(node){
			currTab.find("#inven_content_inventoryPlanList").val(node.name);
			return true;
		});
	});
	//选择部门
	currTab.find('#inven_scope_inventoryPlanList').bind('click', function(e) {
		openSelectTreeDiv($(this),"proConfigSelectTreeScope_invPL","SOrg/queryorgtreelist.asp",{width:$(this).width()+"px","margin-left": "140px"},function(node){
			currTab.find("#inven_scope_inventoryPlanList").val(node.name);
			return true;
		});
	});
/**************************************************************************/	
	//初始化列表
	function initInventoryPlanList(){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		currTab.find('#tb_inventoryPlanList').bootstrapTable({
			url : 'InventoryPlanManager/queryAllPlan.asp',//请求后台的URL（*）
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
			onLoadSuccess : function(data){
			},
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
				field: 'PLAN_NUM',
				align: 'center',
				title : '盘点计划编号',
				width:'15%',
				formatter: function (value, row, index) {
					return '<span class="viewDetail" '+
					'onclick="viewDetail_inventoryPlanList('+index+')">'+value+'</span>';
				}
			},{
				field : 'PLAN_NAME',
				title : '盘点计划名称',
				align : "center"
			}, {
				field : 'START_TIME',
				title : '计划开始时间',
				align : "center"
			}, {
				field : 'END_TIME',
				title : '计划结束时间',
				align : "center"
			}, {
				field : "PLAN_EMP_NAME",
				title : "计划负责人",
				align : "center"
			} , {
				field : "INVEN_CONTENT_NAME_ABBR",
				title : "盘点内容",
				align : "center",
				formatter : function(value, row, index){
					var content = row.INVEN_CONTENT_NAME;
					var val = content;
					var length = content.length;
					if(length > 12){
						var abbrText = content.substring(0, 10) + "......";
						val = '<abbr hed="盘点内容:" title="'+content+'" onclick="abbrModalEvent(this)">' + abbrText + '</abbr>';
					}
					return val;
				}
			},{
				field : "INVEN_SCOPE_NAME_abbr",
				title : "盘点范围",
				align : "center",
				formatter : function(value, row, index){
					var content = row.INVEN_SCOPE_NAME;
					var val = content;
					var length = content.length;
					if(length > 12){
						var abbrText = content.substring(0, 10) + "......";
						val = '<abbr hed="盘点范围:" title="'+content+'">' + abbrText + '</abbr>';
					}
					return val;
				}
			},{
				field : "INVEN_TYPE_NAME",
				title : "盘点类型",
				align : "center"
			},{
				field : "INVEN_SCHEME_NUM",
				title : "盘点方案个数",
				align : "center"
			},{
				field : "STATE_NAME",
				title : "盘点执行状态",
				align : "center"
			}]
		});
	}
}
//页面跳转
function pageDispatchInventoryPlanList(key,params){
	if(key=="addPlan"||key=="updatePlan"){
		newOpenTab("newInventoryPlan","操作计划","ppe/propertyManager/inventoryManager/inventoryPlan/newInventoryPlan.html",function(){
			initNewInventoryPlanBtnAndSelectEvent(params);
		});
		return;
	}else if(key=="viewScheme"){
		newOpenTab("newInventorySchemeList","查阅方案","ppe/propertyManager/inventoryManager/inventoryPlan/newInventorySchemeList.html",function(){
			initInventorySchemeListInfo(params);
		});
		return;
	}
}
function viewDetail_inventoryPlanList(index){
	var params = $("#tb_inventoryPlanList").bootstrapTable('getData')[index];
	pageDispatchInventoryPlanList("viewScheme",params);
}