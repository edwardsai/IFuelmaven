initConsumablesStorageListLayout();

function initConsumablesStorageListLayout(){
	var page = $("#consumablesStorageListPart");
	
	autoInitSelect($("#consumablesStorageListPart"));
	
	var query = page.find("div[sel=query]");
	query.click(function(){
		initTable();
	});
	
	var reset = page.find("div[sel=reset]");
	reset.click(function(){
		page.find("input[name=csl_id]").val("");
		page.find("input[name=csl_start_time]").val("");
		page.find("input[name=csl_end_time]").val("");
		page.find("input[name=csl_room_name]").val("");
		page.find("input[name=csl_room_id]").val("");
		page.find("select[name=csl_in_status]").val(" ");
		page.find("select[name=csl_in_status]").select2();
		
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
	//locationTree
	var locationTree = page.find( "input[name='csl_room_name']");
	openSelectTreeDiv(locationTree,"consumableStorageTree2","Config/querystorehouselist.asp",{width:locationTree.width()+"px",height:"200px","margin-left": "125px", "margin-top":"0px"},function(node){
		var treeObj = $.fn.zTree.getZTreeObj("consumableStorageTree2");
		var nodes = treeObj.getNodesByParam("pid", node.id, null);
		if(nodes.length==0){
			$("input[name='csl_room_name']").val(node.allname);
			$("input[name='csl_room_id']").val(node.id);
			return true;
		}
		return false;
	});
	$("#consumableStorageTree2").hide();
	locationTree.click(function(){
		$("#consumableStorageTree2").show();
	});
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

	var add = page.find("li[sel=addCsl]");
	add.click(function(){
		newOpenTab("newConsumablesStorage","新增","ppe/consumablesManagement/consumablesStorage/consumablesStorageEdit.html",function(){
			initCSLEditLayout(null);
		});
	});
	
	// 修改
	var update = page.find("li[sel=updateCsl]");
	update.click(function(){
		var seles = $('#tb_consumablesStorageList').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var in_status = seles[0].in_status_name;
		if(in_status!="未入库"){
			alert("该信息不是未入库状态，不能修改");
			return;
		}
		newOpenTab("newConsumablesStorage","修改","ppe/consumablesManagement/consumablesStorage/consumablesStorageEdit.html",function(){
			initCSLEditLayout(seles[0]);
		});
	});
	//删除
	var del = page.find("li[sel=deleteCsl]");
	del.click(function(){
		var seles = $("#tb_consumablesStorageList").bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		var in_status = seles[0].in_status_name;
		if(in_status!="未入库"){
			alert("该信息不是未入库状态，不能删除");
			return;
		}
		var msg="是否删除此数据？";
		nconfirm(msg,function(){
			baseAjax("goodsIn/delCSL.asp",{"id":seles[0].id}, function(data) {
				if (data!=undefined && data!=null&&data.result==true) {
					alert("删除成功");
					initTable();
				}else{
					alert("删除失败！");
				}
			});
		});
	});
	//确认入库
	var sure = page.find("li[sel=sureCsl]");
	sure.click(function(){
		var seles = $("#tb_consumablesStorageList").bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行确认!");
			return;
		}
		var in_status = seles[0].in_status_name;
		if(in_status!="未入库"){
			alert("该信息不是未入库状态，不能确认");
			return;
		}
		var msg="是否确认入库？";
		nconfirm(msg,function(){
			baseAjax("goodsIn/sureCSL.asp",{"id":seles[0].id,"room":seles[0].room}, function(data) {
				if (data!=undefined && data!=null&&data.result==true) {
					alert(data.msg);
					query.click();
				}else {
					alert("确认失败！");
				}
			});
		});
	});
	//查看入库
	var view = page.find("li[sel=viewCsl]");
	view.click(function(){
		var seles = $("#tb_consumablesStorageList").bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		newOpenTab("viewConsumablesStorage","查看","ppe/consumablesManagement/consumablesStorage/viewconsumablesStorage.html",function(){
			initviewConsumablesStorageIn(seles[0]);
		});
	});
	
	initTable();
	
	function initTable(){
		var id = $.trim(page.find("input[name=csl_id]").val());
		var in_status = $.trim(page.find("select[name=csl_in_status]").val());
		var room_id = $.trim(page.find("input[name=csl_room_id]").val());
		var start_time = $.trim(page.find("input[name=csl_start_time]").val());
		var end_time = $.trim(page.find("input[name=csl_end_time]").val());
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		$('#tb_consumablesStorageList').bootstrapTable('destroy').bootstrapTable({
			url:'goodsIn/queryCSL.asp?id='+id+'&in_status='+in_status+'&room_id='+room_id+'&start_time='+start_time+'&end_time='+end_time,//请求后台的URL（*）
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
			uniqueId : "id", //每一行的唯一标识，一般为主键列
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
				field: 'id',
				align: 'center',
				title : '入库流水号'
			},{
				field : 'room_name',
				title : '入库仓库',
				align : "center"
			}, {
				field : 'create_date',
				title : '入库日期',
				align : "center"
			}, {
				field : "supplierName",
				title : "供应商",
				align : "center"
			} , {
				field : "create_name",
				title : "登记人",
				align : "center"
			},{
				field : "in_status_name",
				title : "入库状态",
				align : "center"
			},{
				field : "descr",
				title : "备注",
				align : "center"
			}]
		});
	}
}