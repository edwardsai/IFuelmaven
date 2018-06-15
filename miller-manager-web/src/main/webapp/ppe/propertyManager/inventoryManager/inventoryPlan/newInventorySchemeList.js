var planParams;//计划的信息,用于在方案列表和方案清单之间跳转时初始化计划信息
//初始化计划信息
function initInventorySchemeListInfo(params){
	planParams = params;
	var currTab = $("#newInventorySchemeListBody");//当前页
	//返回按钮
	currTab.find('#back_newInventorySchemeList').bind('click', function(e) {
		newOpenTab("inventoryPlanList","盘点计划列表","ppe/propertyManager/inventoryManager/inventoryPlan/inventoryPlanList.html",function(){});
	});
	for ( var k in params) {
		if(k=="STATE_NAME"){
			var stl;
			if(params[k]=="待执行"){
				stl="statesBg statesBg_unuse";
			}else if(params[k]=="执行中"){
				stl="statesBg statesBg_underuse";
			}else{
				stl="statesBg statesBg_inuse";
			}
			currTab.find("[name='INVENS." + k + "']").attr("class",stl);
		}
		currTab.find("[name='INVENS." + k + "']").html(params[k]);
	}
	if(params.INVEN_CONTENT_TYPE == "00"){//权证类型
		currTab.find('[tspn="eState"]').hide();
	}
	var tbObj=currTab.find('#tb_newInventorySchemeList');
	initInventorySchemeListTable3(tbObj,params["PLAN_NUM"]);//初始化方案列表
/**********************************内部方法*****************************************/
	//初始化方案列表
	function initInventorySchemeListTable3(tbObj,plan_num){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		tbObj.bootstrapTable("destroy").bootstrapTable({
			url : 'InventoryPlanManager/querySchemeList.asp?plan_num='+plan_num,//请求后台的URL（*）
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
			onLoadSuccess:function(data){
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
				field: 'SCHEME_NUM',
				align: 'center',
				title : '方案编号',
				width:'15%',
				formatter: function (value, row, index) {
					if(!value){
						return '-';
					}
					return '<span class="viewDetail" '+
					'onclick="viewDetail_newInventorySchemeList('+index+')">'+value+'</span>';
				}
			},{
				field : 'SCHEME_NAME',
				title : '方案名称',
				align : "center"
			},{
				field : 'PRO_TYPE_NAME_abbr',
				title : '盘点资产类型',
				align : "center",
				formatter : function(value, row, index){
					var content = row.PRO_TYPE_NAME;
					var val = content;
					var length = content.length;
					if(length > 12){
						var abbrText = content.substring(0, 10) + "......";
						val = '<abbr hed="盘点资产类型:" title="'+content+'" onclick="abbrModalEvent(this)">' + abbrText + '</abbr>';
					}
					return val;
				}
			}, {
				field : 'INVEN_DEP_NAME',
				title : '盘点部门',
				align : "center"
			}, {
				field : "INVEN_PATTERN_NAME",
				title : "盘点方式",
				align : "center"
			} , {
				field : "PLAN_END_TIME",
				title : "计划完成时间",
				align : "center"
			},{
				field : "INVEN_EMP_NAME",
				title : "盘点负责人",
				align : "center"
			},{
				field : "SCHEME_STATE_NAME",
				title : "执行状态",
				align : "center",
				formatter : function(value, row, index){
					var stl;
					if(value=="已完成"){
						stl="statesBg statesBg_inuse";
					}else if(value=="待制定方案"){
						stl="statesBg statesBg_unuse";
					}else{
						stl="statesBg statesBg_underuse";
					}
					if(!value){
						value = "计划未发起";
					}
					return "<span class='"+stl+"'>"+value+"</span>";
				}
			} , {
				field : "ACTUAL_FILISH_TIME",
				title : "实际完成时间",
				align : "center",
			} , {
				field : "TOTAL_AMOUNT",
				title : "盘点设备数量",
				align : "center",
			} , {
				field : "NORMAL_AMOUNT",
				title : "正常数量",
				align : "center",
			} , {
				field : "PROFIT_AMOUNT",
				title : "盘盈数量",
				align : "center",
			} , {
				field : "LOST_AMOUNT",
				title : "盘亏数量",
				align : "center",
			}]
		});
	}
}

//查看方案清单详情
function viewDetail_newInventorySchemeList(index){
	var schemeParams = $("#tb_newInventorySchemeList").bootstrapTable('getData')[index];//JSON.parse(JSON.stringify(
	newOpenTab("inventorySchemeListDetail","方案清单详情","ppe/propertyManager/inventoryManager/inventoryPlan/inventorySchemeListDetail.html");
	initInventorySchemeListDetailInfo(planParams,schemeParams);
}