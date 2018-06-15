function initInventorySchemeListDetailInfo(planParams,schemeParams){
	var currTab = getCurrentPageObj();//当前页
	for ( var k in schemeParams) {//初始化方案信息
		if(k=="SCHEME_STATE_NAME"){
			var stl;
			if(schemeParams[k]=="已完成"){
				stl="statesBg statesBg_inuse";
			}else if(schemeParams[k]=="待制定方案"){
				stl="statesBg statesBg_unuse";
			}else{
				stl="statesBg statesBg_underuse";
			}
			currTab.find("[name='INVSCMLSTDTL." + k + "']").attr("class",stl);
		}
		currTab.find("[name='INVSCMLSTDTL." + k + "']").html(schemeParams[k]);
	}
	currTab.find("[name='INVSCMLSTDTL.EQUIPMENT_STATE_NAME']").html(planParams.EQUIPMENT_STATE_NAME);
	var inven_content_type = planParams.INVEN_CONTENT_TYPE;//盘点内容类型
	if(inven_content_type == "00"){//权证类型
		currTab.find('[hspn="eState"]').hide();
	}
	initInventorySchemeListTable2(schemeParams["SCHEME_NUM"]);//初始化清单列表
	//返回按钮
	currTab.find("#back_inventorySchemeListDetail").unbind();
	currTab.find("#back_inventorySchemeListDetail").bind('click',function(){
		newOpenTab("newInventorySchemeList","方案列表","ppe/propertyManager/inventoryManager/inventoryPlan/newInventorySchemeList.html",function(){
			initInventorySchemeListInfo(planParams);
		});
	});

/***********************************内部方法*************************************/
	
	//初始化清单列表
	function initInventorySchemeListTable2(scheme_num){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		var columns = new Array();
		if(inven_content_type =="01"){//盘点内容类型为非权证类型，加载对应的字段
			columns = [{
				field: 'middle',checkbox: true,rowspan: 2,align: 'center',valign: 'middle'
			}, {
				field : 'Number',title : '序号',align : "center",sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field: 'PROPERTY_NUM',align: 'center',title : '资产编号',
			},{
				field : 'PROPERTY_NAME',title : '资产名称',align : "center"
			}, {
				field : 'PROPERTY_TYPE_NAME',title : '资产类型',align : "center"
			}, {
				field : "BELONG_DEP_NAME",title : "所属部门",align : "center"
			} , {
				field : "REAL_ADDRESS",title : "存放地点",align : "center"
			},{
				field : "EQUIPMENT_STATE_NAME",title : "设备状态",align : "center"
			},{
				field : "INVEN_RESULT_NAME",title : "盘点结果",align : "center",
				formatter : function(value, row, index){
					if(!value){
						if(row.IS_INVEN == "01"){//不盘点
							value = "<span class='viewDetail'>不盘点</span>";
						}
					}
					return value;
				}
			},{
				field : "ADVICE",title : "处理建议",align : "center",
			},{
				field : "INVEN_TIMES",title : "历史盘点次数",align : "center",
				formatter:function(value,row,index){
					return '<span num='+row.PROPERTY_NUM+' class="viewDetail" '+
					'onClick="viewHistoryInvenInfo_plan(this)">'+value+'</span>';
				}
			},{
				field : "LAST_DATE",title : "最后一次盘点时间",align : "center",
			}];
		}else if(inven_content_type =="00"){//盘点内容类型为权证类型，加载对应的字段
			columns = [{
				field: 'middle',checkbox: true,rowspan: 2,align: 'center',valign: 'middle'
			}, {
				field : 'Number',title : '序号',align : "center",sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field: 'CONTRACT_NO',title : '合同编号',align: 'center',
			},{
				field : 'GUARANTEE_ID',title : '押品编号',align : "center"
			}, {
				field : 'GUARANTEE_NAME',title : '押品名称',align : "center"
			}, {
				field : "WARR_CLASSIFY",title : "权证分类",align : "center"
			},{
				field : "WARR_TYPE",title : "权证类型",align : "center"
			},{
				field : "PROPERTY_NUM",title : "权证编号",align : "center"
			},{
				field : "AREA",title : "存放区域",align : "center"
			},{
				field : "INVEN_RESULT_NAME",title : "盘点结果",align : "center",
				formatter : function(value, row, index){
					if(!value){
						if(row.IS_INVEN == "01"){//不盘点
							value = "<span class='viewDetail'>不盘点</span>";
						}
					}
					return value;
				}
			},{
				field : "ADVICE",title : "处理建议",align : "center",
			},{
				field : "INVEN_TIMES",title : "历史盘点次数",align : "center",
				formatter:function(value,row,index){
					return '<span num='+row.PROPERTY_NUM+' class="viewDetail" '+
					'onClick="viewHistoryInvenInfo_plan(this)">'+value+'</span>';
				}
			},{
				field : "LAST_DATE",title : "最后一次盘点时间",align : "center",
			}];
		}
		$('#tb_inventorySchemeListDetail').bootstrapTable("destroy").bootstrapTable({
			url : 'InventoryPlanManager/queryListBySchemeNum.asp?scheme_num='+scheme_num+"&inven_content_type="+inven_content_type,//请求后台的URL（*）
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
			columns : columns
		});
	}
}
function viewHistoryInvenInfo_plan(obj){
	 var asset_num=$(obj).attr("num");
	 openHistoryAssetPop($("#pop_inventorySchemeListDetail"),asset_num);
}