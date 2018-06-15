
function initCSLEditLayout(item){
	var page = $("#consumablesStorageView");
	var modal = page.find("div[sel=goodsSele_new_modal]"); 
	
	initVlidate($("#consumablesStorage"));
	
	var submit = page.find("button[name=submit]");
	submit.click(function(){
		upload(false);
	});
	
	var commit = page.find("button[name=commit]");
	commit.click(function(){
		upload(true);
	});
	
	var back = page.find("button[name=back]");
	back.click(function(){
		newOpenTab("consumablesstorage","耗材入库","ppe/consumablesManagement/consumablesStorage/consumablesStorageList.html");
	});
	
	var goodsDel = page.find("button[sel=goodsDel]");
	goodsDel.click(function(){
		var table = page.find("table[sel=goods]");
		var seleData = table.bootstrapTable('getSelections');
		for(var i in seleData){
			table.bootstrapTable('removeByUniqueId', seleData[i].GOODS_ID);
		}
	});
	
	var seleGoods = modal.find("button[sel=sele_goods]");
	seleGoods.click(function(){
		var table = modal.find("table[sel=goodsTypeSele]");
		var seleData = table.bootstrapTable('getSelections');
		var gTable = page.find("table[sel=goods]");
		var gData = gTable.bootstrapTable('getData');
		for(var i=0;i<seleData.length;i++){
			for(var j=0;j<gData.length;j++){
				if(seleData[i].GOODS_ID==gData[j].GOODS_ID){
					var id=gData[j].GOODS_ID;
					gTable.bootstrapTable("removeByUniqueId", id);
				}
			}
			gTable.bootstrapTable("append",seleData[i]);
		}
		modal.modal("hide");
	});
	var cancelGoods = modal.find("button[sel=cancel_goods]");
	cancelGoods.click(function(){
		modal.modal("hide");
	});
	init(item);
	
	function init(item){
		if(item){
			for (var key in item) {
				page.find("input[name='csl."+key+"']").val(item[key]);
			}
			page.find("textarea[name='remark']").val(item.remark);
		} else {
			setTimeout(function(){getSeriaNumber()}, 1000);
		}
		
		//选择按钮
		var goodsSele = page.find("button[sel=goodsSele]");
		goodsSele.click(function(){
			var loca = $.trim(page.find("input[name='csl.room']").val());
			if(loca){
				var loca_name = $.trim(page.find("input[name='csl.room_name']").val());
				modal.find("div[sel=curr_room]").html(loca_name);
				modal.modal("show");
				getGoodsInfo(null, loca);
			} else {
				alert("请先选择仓库");
			}
		});
		//getData
		page.find("input[name='csl.create_date']").val(returnTodayData());
		
		//locationTree
		var locationTree = page.find( "input[name='csl.room_name']");
		openSelectTreeDiv(locationTree,"consumableStorageTree","Config/querystorehouselist.asp",{width:locationTree.width()+"px",height:"200px","margin-left": "0px", "margin-top":"-6px"},function(node){
			var treeObj = $.fn.zTree.getZTreeObj("consumableStorageTree");
			var nodes = treeObj.getNodesByParam("pid", node.id, null);
			if(nodes.length==0){
				$("input[name='csl.room_name']").val(node.allname);
				$("input[name='csl.room']").val(node.id);
				return true;
			}
			return false;
		});
		$("#consumableStorageTree").hide();
		locationTree.click(function(){
			$("#consumableStorageTree").show();
		});
		
		//goodsTree
		var goodsTree = modal.find("a[id=csl_goods]");
		initGoodsTree(goodsTree,"csl_goodsTree","sorting/queryAllSorting.asp",{width:"250px",height:"300px","margin-left": "0px", "margin-top":"0px"},function(node){
			var treeObj = $.fn.zTree.getZTreeObj("consumableStorageTree");
			var nodes = treeObj.getNodesByParam("pid", node.id, null);
			if(nodes.length==0){
				var location = $.trim(page.find("input[name='csl.room']").val());
				getGoodsInfo(node.id, location);
				return true;
			}
			return false;
		});
		
		function getGoodsInfo(nodeId, location){
			var table = modal.find("table[sel=goodsTypeSele]");
			var queryParams=function(params){
				var temp={
						limit: params.limit, //页面大小
						offset: params.offset //页码
				};
				return temp;
			};
			table.bootstrapTable('destroy').bootstrapTable({
				url:'goodsIn/queryGoodsByLocation.asp?category_id='+nodeId+'&location='+location,//请求后台的URL（*）
				method : 'get', //请求方式（*）   
				striped : true, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : false, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "GOODS_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: false,
				columns : [{
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'Number',
					title : '序号',
					align : "center",
					sortable: true,
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field: 'GOODS_ID',
					align: 'center',
					title : '物品编号'
				},{
					field : 'GOODS_NAME',
					title : '物品名称',
					align : "center"
				},{
					field : 'STANDARD',
					title : '规格型号',
					align : "center"
				},{
					field : "QUANTITY",
					title : "数量单位",
					align : "center"
				},{
					field : "GOODS_NUM",
					title : "剩余数量",
					align : "center",
					formatter : function(value,row,index){
						if(row.GOODS_NUM&&row.GOODS_NUM!=null&&row.GOODS_NUM!=''){
							return row.GOODS_NUM;
						} else {
							return 0;
						}
					}
				}]
			});
		}
		
		/*******/
		function initGoodsTree(obj,treeId,url,css,callback){
			var marginleft=""; if(css["margin-left"]){marginleft="margin-left:"+css["margin-left"]+";";};
			var margintop=""; if(css["margin-top"]){margintop="margin-top:"+css["margin-top"]+";";};
			var width=""; if(css.width){width="width:"+css.width+";";};
			var height="height:300px;"; if(css.height){height="height:"+css.height+";";};
			obj.after('<div id="'+treeId+'" class="ztree" style="'+marginleft+margintop+' overflow-y: scroll;z-index: 1000;background-color: white;border:1px solid #CDCDCD;'+height+'position:absolute;'+width+'">&nbsp;aaa&nbsp;</div>');
			openSelectTreeDiv[treeId]="11";
			var setting = {
					async : {
						enable : true,
						url : url,
						contentType : "application/json",
						type : "get"
					},
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
						onAsyncSuccess: function(){
							var treeObj = $.fn.zTree.getZTreeObj(treeId);
							treeObj.expandNode(treeObj.getNodeByTId(treeId+"_1"), true, false, true);
						},
						onClick : function(event, treeId, treeNode) {
							treeNode.allname=getAllSelectTreeDivName(treeNode,treeNode.name);
							if(callback){
								var c=callback(treeNode);
							}
						}
					}
				};
				$.fn.zTree.init($("#"+treeId), setting);
		}
	}
	
	function upload(isCommit){
		if(!vlidate($("#consumablesStorage"),"",true)){
			 return;
		}
		var inputs =page.find("input[name^='csl.']");
		var saveItem = new Object();
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			var fieldName = obj.attr("name").split(".")[1];
			saveItem[fieldName] = $.trim(obj.val());
		}
		saveItem.descr=$.trim(page.find("textarea[name='csl.descr']").val());
		saveItem.is_state=isCommit;
		var gooddsTable = page.find("table[sel=goods]");
		var getgoods = gooddsTable.bootstrapTable('getData');
		var isComplete = true;
		var Messege = "";
		$.each(getgoods, function(i){
			if($("#goods_number"+ i).val()==""){
				Messege += "请将入库数量填写完整";
				isComplete = false;
				return false;
			}
		getgoods[i].GOODS_NUMBER = $("#goods_number"+ i).val();
//			if(getgoods[i].GOODS_NUMBER>getgoods[i].GOODS_NUM){
//				Messege += "入库数量不能大于剩余数量";
//				isComplete = false;
//				return false;
//			}
		});	
		if(!isComplete){
			alert(Messege);
			return ;
		}
		//构造详情数据
		for(var i in getgoods){
			if(getgoods[i]!=0){
				saveItem["detailList["+i+"].id"] = saveItem.id;
				saveItem["detailList["+i+"].goodsId"] = getgoods[i].GOODS_ID;
				saveItem["detailList["+i+"].goodsNumber"] = getgoods[i].GOODS_NUMBER;
			} else {
				alert("请至少添加一物品数据");
				return ;
			}
		}
		$.post("goodsIn/saveCSL.asp", saveItem, function(result){
			if(result.result){
				alert("保存成功");
				back.click();
			}
		}, "json");
	}
	
	//类别点击
	$("input[name=categoryName]").unbind("click");
	$("input[name=categoryName]").click(function(){
		openSelectTreeDiv($(this),"assetApplyEdit","propertyTypeConfig/queryAllCategroy.asp",{width:$(this).width()+"px","margin-left": "0px"},function(node){
			$("input[name=categoryName]").val(node.name);
			$("input[name=categoryId]").val(node.id);
			return true;
		});
	});
	
	function getSeriaNumber(){
		var sn = page.find("input[name='csl.id']");
		sn.val(returnSerialNumber("AP","ASS_SEQ_ASSET_APPLY"));
		page.find("input[name='csl.create_no']").val($("#main_user_name").attr("user_no"));
		page.find("input[name='csl.create_no_name']").val($("#main_user_name").attr("user_name"));
		page.find("input[name='csl.create_org']").val($("#main_user_name").attr("org_no"));
	}
	
	var goodsTable = page.find("table[sel=goods]");
	//var adsdData = new Array();
	goodsTable.bootstrapTable('destroy').bootstrapTable({
		//data : adsdData,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : false, //是否启用排序
		sortOrder : "asc", //排序方式
		clickToSelect : false, //是否启用点击选中行
		uniqueId : "GOODS_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: false,
		columns : [{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field: 'GOODS_ID',
			align: 'center',
			title : '物品编号'
		},{
			field : 'GOODS_NAME',
			title : '物品名称',
			align : "center"
		},{
			field : 'STANDARD',
			title : '规格型号',
			align : "center"
		},{
			field : "QUANTITY",
			title : "数量单位",
			align : "center"
		},{
			field : "GOODS_NUM",
			title : "剩余数量",
			align : "center",
			formatter : function(value,row,index){
				if(value&&value!=null&&value!=''){
					return value;
				} else {
					return 0;
				}
			}
		},{
			field : "GOODS_NUMBER",
			title : "入库数量",
			align : "center",
			formatter : function(value,row,index){
				if(value==undefined){
					value="";
				}
				return '<input type="text" id="goods_number'+index+'" value="'+value+'">';
			}
		}/*,{
			field : "GOODS_NUMBER",
			title : "入库单价",
			align : "center",
			visible : false,
			formatter : function(value,row,index){
			}
		},{
			field : "GOODS_NUMBER",
			title : "入库金额",
			align : "center",
			visible : false,
			fomatter : function(value,row,index){
			}
		}*/],
	});
	if(item){
		//var goodinTable = page.find("table[sel=goods]");
		goodsTable.bootstrapTable("refresh",{
			url:'goodsIn/queryGoodsInInfoById.asp?id='+item.id+'&room_id='+item.room});
	}
}