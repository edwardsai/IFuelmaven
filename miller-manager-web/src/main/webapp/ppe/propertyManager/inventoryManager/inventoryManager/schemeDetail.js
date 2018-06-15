function initShemeDeatilLayOut(params){
	var currTab = getCurrentPageObj();//当前页
	var allListTable = currTab.find("[tb='allListTable']");//资产全清单列表对象
	var selfListTable = currTab.find("[tb='selfListTable']");//可自助资产清单列表对象
	var finallyTable = currTab.find("[tb='finallyTable']");//资产最终结果清单列表对象
	autoInitSelect(currTab.find(".tab-content"));
	var init_flag = true;//分步初始化
	//初始化方案信息
	for ( var k in params) { 
		if(k=="SCHEME_STATE_NAME"){
			var stl;
			if(params[k]=="已完成"){
				stl="statesBg statesBg_inuse";
			}else if(params[k]=="待制定方案"){
				stl="statesBg statesBg_unuse";
			}else{
				stl="statesBg statesBg_underuse";
			}
			currTab.find("span[name='IN." + k + "']").attr("class",stl);
		}
		currTab.find("[name='IN." + k + "']").html(params[k]);
		if(k == "PRO_TYPE_NAME" && params[k].length > 15){
			var abbrText =params[k].substring(0, 13) + "......";
			val = '<abbr title="'+params[k]+'">' + abbrText + '</abbr>';
			currTab.find("[name='IN." + k + "']").html(val);
		}
	}
	var inven_content_type = params.INVEN_CONTENT_TYPE;//盘点内容类型
	var scheme_num = params.SCHEME_NUM;
	initAllListTable(scheme_num,inven_content_type);//初始化资产全清单列表(手持端)
	initSelfListTable(scheme_num);//可自助资产清单列表列表
	//手持端查询条件下拉选改变事件
	currTab.find('[sel="equipSelect"]').change(function(){
		var inven_result = $.trim($(this).val());
		allListTable.bootstrapTable('refresh',{
			url:'InventoryPlanManager/queryListBySchemeNum.asp?scheme_num='+scheme_num
				+'&inven_result='+inven_result + '&inven_content_type=' + inven_content_type});
	});
	
	//微信端查询条件下拉选改变事件
	currTab.find('[sel="selfSelect"],[sel="checkSelect"]').change(function(){
		var inven_result =$.trim(currTab.find('[sel="selfSelect"]').val());
		var check_state =$.trim(currTab.find('[sel="checkSelect"]').val());
		selfListTable.bootstrapTable('refresh',{
			url:'InventorySchemeManager/querySelfListBySchemeNum.asp?scheme_num='+scheme_num
				+'&inven_result='+inven_result+'&check_state='+check_state});
		
	});
	//最终盘点结果按钮
	currTab.find("[btn='finally']").click(function(){
		if(init_flag){
			initfinallyTable(scheme_num,inven_content_type);//可自助资产清单列表列表
		}
	});
	//返回按钮
	currTab.find("[btn='back']").click(function(){
		newOpenTab("inventorySchemeList","返回","ppe/propertyManager/inventoryManager/inventoryManager/inventorySchemeList.html");
	});
	/******************************内部方法*********************************/	
	//初始化资产全清单列表
	function initAllListTable(scheme_num,inven_content_type){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		allListTable.bootstrapTable("destroy").bootstrapTable({
			url : 'InventoryPlanManager/queryListBySchemeNum.asp?scheme_num='+scheme_num+'&inven_content_type='+inven_content_type,//请求后台的URL（*）
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
				field : 'Number',
				title : '序号',
				align : "center",
				sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field: 'PROPERTY_NUM',
				align: 'center',
				title : '资产编号',
			},{
				field : 'PROPERTY_NAME',
				title : '资产名称',
				align : "center"
			}, {
				field : 'PROPERTY_TYPE_NAME',
				title : '资产类型',
				align : "center"
			}, {
				field : "BELONG_DEP_NAME",
				title : "所属部门",
				align : "center"
			} , {
				field : "REAL_ADDRESS",
				title : "存放地点",
				align : "center"
			},{
				field : "EQUIPMENT_STATE_NAME",
				title : "设备状态",
				align : "center"
			},{
				field : "ADVICE",
				title : "处理建议",
				align : "center",
			},{
				field : "INVEN_TIMES",
				title : "历史盘点次数",
				align : "center",
				formatter:function(value,row,index){
					return '<span num='+row.PROPERTY_NUM+' class="viewDetail" '+
					'onClick="viewHistoryInvenInfo_schemeDetail(this)">'+value+'</span>';
				}
			},{
				field : "IS_SELF_INVEN",
				title : "是否支持自助盘点",
				align : "center",
				formatter : function(value, row, index){
					if(value=="00"){
						return "是";
					}else if(value=="01"){
						return "否";
					}
				}
			},{
				field : "INVEN_STATE",
				title : "盘点状态",
				align : "center",
				formatter : function(value, row, index){
					if(value=="00"){
						return "<span style='color:blue'>已盘</span>";
					}else if(value=="01"){
						return "<span style='color:red'>未盘</span>";
					}else if(row.IS_INVEN=="01"){
						return "<span style='color:gray'>不盘</span>";
					}
				}
			},{
				field : "EQUIP_INVEN_RESULT_NAME",
				title : "盘点结果",
				align : "center",
				formatter : function(value, row, index) {
					if(value=="正常"){
						return "<span class='statesBg statesBg_inuse'>正常</span>";
					}else if(value=="盘亏"){
						return "<span class='statesBg statesBg_underuse'>盘亏</span>";
					}else if(value=="盘盈"){
						return "<span class='statesBg statesBg_profit'>盘盈</span>";
					}else if(row.IS_INVEN=="01"){
						return "<span class='statesBg statesBg_unuse'>不盘</span>";
					}
				}
			}]
		});
	}
	
	//初始化方案可自助盘点清单列表
	function initSelfListTable(scheme_num){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		selfListTable.bootstrapTable("destroy").bootstrapTable({
			url : 'InventorySchemeManager/querySelfListBySchemeNum.asp?scheme_num='+scheme_num,//请求后台的URL（*）
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
			singleSelect: false,
			columns : [{
				field : 'Number',
				title : '序号',
				align : "center",
				sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field: 'PROPERTY_NUM',
				align: 'center',
				title : '资产编号',
			},{
				field : 'ASSET_NAME',
				title : '资产名称',
				align : "center"
			}, {
				field : 'REAL_USER',
				title : '使用人',
				align : "center"
			},{
				field : "PHOTOS",
				title : "附件图片",
				align : "center",
				formatter : function(value, row, index){
					var photos = "";
					if(row.PHOTO_ADDRESS1){
						photos = "<a class='viewDetail' target='_blank' href='" + row.PHOTO_ADDRESS1 + "'>附图1</a>";
					}
					if(row.PHOTO_ADDRESS2){
						photos  += ", <a class='viewDetail' target='_blank' href='" + row.PHOTO_ADDRESS2 + "'>附图2</a>";
					}
					if(row.PHOTO_ADDRESS3){
						photos  += ", <a class='viewDetail' target='_blank' href='" + row.PHOTO_ADDRESS3 + "'>附图3</a>";
					}
					return photos;
				}
			},{
				field : "RESULT_MARK",
				title : "盘点结果说明",
				align : "center",
			},{
				field : "REPULSE_REMARK",
				title : "打回备注",
				align : "center"
			},{
				field : "CHECK_STATE_NAME",
				title : "审核状态",
				align : "center",
			}, {
				field : "INVEN_STATE",
				title : "自助盘点状态",
				align : "center",
				formatter : function(value, row, index){
					if(value=="00"){
						return "<span style='color:blue'>已盘</span>";
					}else if(value=="01"){
						return "<span style='color:red'>未盘</span>";
					}
				}
			},{
				field : "INVEN_RESULT_NAME",
				title : "盘点结果",
				align : "center",
				formatter : function(value, row, index) {
					if(value=="正常"){ 
						return "<span class='statesBg statesBg_inuse'>正常</span>";
					}else if(value=="盘盈"){
						return "<span class='statesBg statesBg_profit'>盘盈</span>";
					}else{
						return "<span class='statesBg statesBg_underuse'>盘亏</span>";
					}
				}
			}]
		});
	}
	//初始化最终结果列表
	function initfinallyTable(scheme_num,inven_content_type){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		finallyTable.bootstrapTable("destroy").bootstrapTable({
			url : 'InventoryPlanManager/queryListBySchemeNum.asp?scheme_num='+scheme_num+'&inven_content_type='+inven_content_type,//请求后台的URL（*）
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
			onLoadSuccess : function(data) {
				init_flag = false;
			},
			columns : [{
				field : 'Number',
				title : '序号',
				align : "center",
				sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field: 'PROPERTY_NUM',
				align: 'center',
				title : '资产编号',
			},{
				field : 'PROPERTY_NAME',
				title : '资产名称',
				align : "center"
			}, {
				field : 'PROPERTY_TYPE_NAME',
				title : '资产类型',
				align : "center"
			}, {
				field : "BELONG_DEP_NAME",
				title : "所属部门",
				align : "center"
			} , {
				field : "REAL_ADDRESS",
				title : "存放地点",
				align : "center"
			},{
				field : "EQUIPMENT_STATE_NAME",
				title : "设备状态",
				align : "center"
			},{
				
				field : "INVEN_TIMES",
				title : "历史盘点次数",
				align : "center",
				formatter:function(value,row,index){
					return '<span num='+row.PROPERTY_NUM+' class="viewDetail" '+
					'onClick="viewHistoryInvenInfo_schemeDetail(this)">'+value+'</span>';
				}
			},{
				field : "LAST_DATE",
				title : "最后一次盘点时间",
				align : "center",
			},{
				field : "IS_SELF_INVEN",
				title : "是否支持自助盘点",
				align : "center",
				formatter : function(value, row, index){
					if(value=="00"){
						return "是";
					}else if(value=="01"){
						return "否";
					}
				}
			},{
				field : "EQUIP_INVEN_RESULT_NAME",
				title : "手持端盘点结果",
				align : "center",
				formatter : function(value, row, index){
					if(value=="正常"){
						return "<span class='statesBg statesBg_inuse'>正常</span>";
					}else if(value=="盘亏"){
						return "<span class='statesBg statesBg_underuse'>盘亏</span>";
					}else if(value=="盘盈"){
						return "<span class='statesBg statesBg_profit'>盘盈</span>";
					}else if(row.IS_INVEN=="01"){
						return "<span class='statesBg statesBg_unuse'>不盘</span>";
					}
				}
			},{
				field : "SELF_INVEN_RESULT_NAME",
				title : "微信端盘点结果",
				align : "center",
				formatter : function(value, row, index){
					if(value=="正常"){
						return "<span class='statesBg statesBg_inuse'>正常</span>";
					}else if(value=="盘亏"){
						return "<span class='statesBg statesBg_underuse'>盘亏</span>";
					}else if(value=="盘盈"){
						return "<span class='statesBg statesBg_profit'>盘盈</span>";
					}
					if(row.IS_SELF_INVEN=="00"){//基于以上没有结果，若是可自助的，则默认未盘亏
						return "<span class='statesBg statesBg_underuse'>盘亏</span>";
					}
				}
			},{
				field : "INVEN_RESULT_NAME",
				title : "最终盘点结果",
				align : "center",
				formatter : function(value, row, index) {
					/*已确定盘点结果时，初始化最终结果的值*/
					if(value=="正常"){
						return "<span class='statesBg statesBg_inuse'>正常</span>";
					}else if(value=="盘亏"){
						return "<span class='statesBg statesBg_underuse'>盘亏</span>";
					}else if(value=="盘盈"){
						return "<span class='statesBg statesBg_profit'>盘盈</span>";
					}else if(row.IS_INVEN=="01"){
						return "<span class='statesBg statesBg_unuse'>不盘</span>";
					}
				}
			}]
		});
	}
}

function viewHistoryInvenInfo_schemeDetail(obj){
	 var asset_num=$(obj).attr("num");
	 openHistoryAssetPop($("#historyPop_schemeDetail"),asset_num);
}

