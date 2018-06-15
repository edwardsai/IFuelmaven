initAssetApplyListLayout();

autoInitSelect($("#moreSearch_assetList"));
function initAssetApplyListLayout(){
	
	//高级查询
	
	var page = $("#personalAssetListPart");

	var query = page.find("div[sel=query]");
	query.click(function(){
		initPersonalTable();
	});
	var reset = page.find("div[sel=reset]");
	reset.click(function(){
		page.find("input[name=assetName]").val("");
		page.find("input[name=assetType]").val("");
		page.find("input[name=assetTypeTree]").val("");
	});
	var assetTypeTree = page.find("input[name=assetTypeTree]");
	initPersonalAssetTree("assetTypeTree");
	assetTypeTree.click(function(){
		var treeObj = page.find("div[sel=assetTypeTree]");
		//树形之外隐藏树
		$("#body").mousedown(function(){
			$("#body").unbind("mousedown");
			treeObj.hide();
		});
		treeObj.mouseout(function(){
			$("#body").unbind("mousedown");
			$("#body").mousedown(function(){
				treeObj.hide();
				$("#body").unbind("mousedown");
			});
		});
		treeObj.mouseover(function(){
			$("#body").unbind("mousedown");
		});
		treeObj.show();
	});
	
	var update = page.find("li[sel=edit]");
	update.click(function(){
		var seles = $('#tb_personalAssetList').bootstrapTable("getSelections");
		if(seles&&seles.length==1){
			newOpenTab("personalAssetEdit","操作计划","ppe/propertyManager/personalPropertyManager/personalAssetEdit.html",function(){
				initPersonalAssetEditLayout(seles[0]);
			});
		} else {
			alert("请选择一条数据进行操作");
		}
	});
	initPersonalTable();
	function initPersonalTable(){
		var assetName = $.trim(page.find("input[name=assetName]").val());
		var assetType = $.trim(page.find("input[name=assetType]").val());
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		$('#tb_personalAssetList').bootstrapTable('destroy').bootstrapTable({
			url:'personalAssetManager/queryAsset.asp?assetName='+escape(encodeURIComponent(assetName))+'&assetType='+assetType,
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
				field : 'assetName',
				title : '资产名称',
				align : "center"
			}, {
				field : 'assetTypeName',
				title : '资产类别',
				align : "center"
			}, {
				field : "createUserName",
				title : "登记人",
				align : "center"
			} , {
				field : "scrapDate",
				title : "预计报废时间",
				align : "center"
			},{
				field : "realUser",
				title : "拥有人",
				align : "center"
			},{
				field : "statusName",
				title : "资产状态",
				align : "center",
				formatter : function(value, row, idnex){
					return value?value:"";
				}
			}]
		});
	}
	
	//初始化树的方法
	function initPersonalAssetTree(treeId){
		//z-index: 1000; margin: 0px 126px; border: 1px solid rgb(205, 205, 205); height: 200px; width: 23%; overflow: auto; position: absolute; display: block; background-color: white;
		var Y = assetTypeTree.position().left;
		var y = assetTypeTree.offset().left;
		assetTypeTree.after('<div sel="'+treeId+'" id="assTypeTree" class="ztree" style="display:none;overflow-y: scroll;z-index: 1000;margin:0px 126px;background-color: white;border:1px solid #CDCDCD;height:200px;width:'+(assetTypeTree[0].scrollWidth-10)+'px;overflow:auto;position:absolute;">&nbsp;&nbsp;</div>');
		var treeObj = page.find("div[sel="+treeId+"]");
		treeObj.position().left = Y;
		//树形之外隐藏树
		$("#body").mousedown(function(){
			$("#body").unbind("mousedown");
			treeObj.hide();
		});
		treeObj.mouseout(function(){
			$("#body").unbind("mousedown");
			$("#body").mousedown(function(){
				treeObj.hide();
				$("#body").unbind("mousedown");
			});
		});
		treeObj.mouseover(function(){
			$("#body").unbind("mousedown");
		});
		
		var setting = {
				view : {
					dblClickExpand : false,
					showLine : true,
					selectedMulti : false
				},
				data : {
					simpleData : {
						enable : true,
						idKey : "id",
						pIdKey : "pid",
						rootPId : ""
					}
				},
				callback : {
					onClick : function(event, treeId, treeNode) {
						page.find("input[name=assetType]").val(treeNode.id);
						page.find("input[name=assetTypeTree]").val(treeNode.name);
						treeObj.hide();
					}
				}
			};
		$.getJSON("propertyTypeConfig/queryAllAssetCategroy.asp", function(result){
			var zTreeObj = $.fn.zTree.init(treeObj, setting, result);
			zTreeObj.expandNode(zTreeObj.getNodeByTId("assTypeTree_1"), true, false, true);
		});
	}
	
}
