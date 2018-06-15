function initShemeWarrantDeatilLayOut(params){
	var currTab = getCurrentPageObj();//当前页
	var allListTable = currTab.find("[tb='allListTable']");//资产全清单列表对象
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
	}
	var scheme_num = params.SCHEME_NUM;
	var inven_content_type = params.INVEN_CONTENT_TYPE;
	initAllListTable(scheme_num,inven_content_type);//初始化资产全清单列表
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
			url : 'InventoryPlanManager/queryListBySchemeNum.asp?scheme_num='+scheme_num+"&inven_content_type="+inven_content_type,
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
				field : "AREA",title : "存放区域",align : "center",
				formatter : function(value,row,index){
					if(value){
						var pos = value.indexOf("->");
						value = value.substring(pos + 2,value.length);//过滤掉第一父级地址
					}
					return value;
				}
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
					'onClick="viewHistoryInvenInfo_schemeWarrantDetail(this)">'+value+'</span>';
				}
			},{
				field : "LAST_DATE",title : "最后一次盘点时间",align : "center",
			}]
		});
	}
}

function viewHistoryInvenInfo_schemeWarrantDetail(obj){
	 var asset_num=$(obj).attr("num");
	 openHistoryAssetPop($("#historyPop_schemeDetail"),asset_num);
}

