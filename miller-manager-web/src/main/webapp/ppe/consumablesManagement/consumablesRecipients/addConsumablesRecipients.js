//初始化
var room_id="";
function initconsumablesRecipientsEventButton(data){
	$('input[name="ACM.CREATE_USER"]').val($("#main_user_name").attr("user_no"));
	$('input[name="ACM.CREATE_USER_NAME"]').val($("#main_user_name").attr("user_name"));
	$('input[name="ACM.CREATE_ORG"]').val($("#main_user_name").attr("org_no"));
	$('input[name="ACM.OUT_ID"]').val(returnSerialNumber("CM", "CM_SEQ_GOOD_RECIPIENT"));
	$('input[name="ACM.CREATE_DATE"]').val(returnTodayData());
	//点击选择仓库
	var updateId=null;
	if(data){//初始化信息
		updateId=data.ROOM;
		initconsumablesRecipientsInfo(data);
	}
	var selectTeeID=Math.uuid();
	var treeInputObj=$("input[name='ACM.ROOM_NAME']");
	openSelectTreeDivAllName(treeInputObj,selectTeeID,"Config/querystorehouselist.asp",{width:treeInputObj.width()+"px","margin-left": "0px"},function(node){
		treeInputObj.val(node.allname);
		$("input[name='ACM.ROOM']").val(node.id);
		return true;
	},updateId);
	treeInputObj.unbind("click");
	treeInputObj.click(function(){
		showSelectTreeDiv($("#"+selectTeeID));
	});
	//保存
	$("#save_addConsumablesRecipients").click(function(){
		if (!vlidate($("#recipientInfo_table"),"",true)) {			
			return;
		}		
		var inputs=$("input[name^='ACM.']");
		var texts=$("textarea[name^='ACM.']");
		var params={};
		for ( var int = 0; int < inputs.length; int++) {
			params[$(inputs[int]).attr("name").substr(4)]=$(inputs[int]).val();
		}
		for ( var int2 = 0; int2 < texts.length; int2++) {
			params[$(texts[int2]).attr("name").substr(4)]=$(texts[int2]).val();
		}
		var records = $("#table_selectInfo").bootstrapTable('getData');
		var isComplete = true;
		var Messege = "";
		$.each(records, function(i){
			if($("#goods_number"+ i).val()==""){
				Messege += "请将领取数量填写完整";
				isComplete = false;
				return false;
			}
			records[i].GOODS_NUMBER = $("#goods_number"+ i).val();
			var a = parseInt(records[i].GOODS_NUMBER);
			var b = parseInt(records[i].GOODS_NUM);
			if(a>b){
				Messege += "领用数量不能大于剩余数量";
				isComplete = false;
				return false;
			}
		});	
		if(!isComplete){
			alert(Messege);
			return ;
		}
		var new_records=$("#table_selectInfo").bootstrapTable("getData");
		params["new_records"]=JSON.stringify(new_records);
		baseAjax("CMRecipients/addOrUpdateCMRecipients.asp",params,function(data){
			if (data!=undefined && data!=null && data.result=="true") {
				alert("保存成功");
				newOpenTab("consumablesrecipients", "返回","ppe/consumablesManagement/consumablesRecipients/consumablesRecipients.html");
			}else {
				alert("保存失败");
			}
		});
	});
	//保存
	$("#submit_addConsumablesRecipients").click(function(){
		if (!vlidate($("#recipientInfo_table"),"",true)) {			
			return;
		}		
		var inputs=$("input[name^='ACM.']");
		var texts=$("textarea[name^='ACM.']");
		var params={};
		for ( var int = 0; int < inputs.length; int++) {
			params[$(inputs[int]).attr("name").substr(4)]=$(inputs[int]).val();
		}
		for ( var int2 = 0; int2 < texts.length; int2++) {
			params[$(texts[int2]).attr("name").substr(4)]=$(texts[int2]).val();
		}
		var records = $("#table_selectInfo").bootstrapTable('getData');
		var isComplete = true;
		var Messege = "";
		$.each(records, function(i){
			if($("#goods_number"+ i).val()==""){
				Messege += "请将领取数量填写完整";
				isComplete = false;
				return false;
			}
			records[i].GOODS_NUMBER = $("#goods_number"+ i).val();
			var a = parseInt(records[i].GOODS_NUMBER);
			var b = parseInt(records[i].GOODS_NUM);
			if(a>b){
				Messege += "领用数量不能大于剩余数量";
				isComplete = false;
				return false;
			}
		});	
		if(!isComplete){
			alert(Messege);
			return ;
		}
		var new_records=$("#table_selectInfo").bootstrapTable("getData");
		params["new_records"]=JSON.stringify(new_records);
		baseAjax("CMRecipients/submitCMRecipients.asp",params,function(data){
			if (data!=undefined && data!=null && data.result=="true") {
				alert("提交成功");
				newOpenTab("consumablesrecipients", "返回","ppe/consumablesManagement/consumablesRecipients/consumablesRecipients.html");
			}else {
				alert("提交失败");
			}
		});
	});
	//返回
	$("#back_addConsumablesRecipients").click(function(){
		newOpenTab("consumablesrecipients", "返回","ppe/consumablesManagement/consumablesRecipients/consumablesRecipients.html");
	});
	//选择物品
	$("#addConsumables_newadd").click(function(){
		if (!vlidate($("#recipientInfo_table"),"",true)) {			
			return;
		}	
		$("#myModal_addConsumablesStorage_newadd").modal("show");
		var a=$("input[name='ACM.ROOM_NAME']").val();
		var b=$("input[name='ACM.ROOM']").val();
		$("#ConsumablesStorageTitle")[0].innerHTML=a;
		room_id=b;
		initStorageInfo();
	});
	//删除
	$("#addConsumables_delete").click(function(){
		var rol=$("#table_selectInfo").bootstrapTable("getSelections");
		if(rol.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		var id=rol[0].GOODS_ID;
		$("#table_selectInfo").bootstrapTable("removeByUniqueId", id);
	});
	//人员模态框
	$("input[name='ACM.GETUSER_NAME']").unbind();
	$("input[name='ACM.GETUSER_NAME']").click(function(){
		openPTDUserPop("userPop_cmrecipientsModal",{Zuser_name:$("input[name='ACM.GETUSER_NAME']"),Zuser_org:$("input[name='ACM.GETUSER_ORG']"),Zuser_org_name:$("input[name='ACM.GETUSER_ORG_NAME']"),Zuser_no:$("input[name='ACM.GETUSER_NO']")});
	});
	//模态框选择按钮
	$("#addModal_ConsumablesStorage").click(function(e){
		if($("#table_modalStorage").find("input[type='checkbox']").is(':checked')){
			var rol = $("#table_modalStorage").bootstrapTable('getSelections');
			var select = $("#table_selectInfo").bootstrapTable('getData');
			for(var i=0;i<rol.length;i++){
				for(var j=0;j<select.length;j++){
					if(rol[i].GOODS_ID==select[j].GOODS_ID){
						var id=select[j].GOODS_ID;
						$('#table_selectInfo').bootstrapTable("removeByUniqueId", id);
					}
				}
				$('#table_selectInfo').bootstrapTable("append",rol[i]);
			}
			$("#myModal_addConsumablesStorage_newadd").modal("hide");
		}else{
			e.preventDefault();
	        $.Zebra_Dialog('请选择一条或多条要添加的记录!', {
	            'type':     'close',
	            'title':    '提示',
	            'buttons':  ['是'],
	            'onClose':  function(caption) {
	            	if(caption=="是"){
	            	}
	            }
	        });
		}
	});
}
function initconsumablesRecipientsInfo(data){
	for ( var k in data) { 
		if(k=="DESCR"){
			$("textarea[name='ACM." + k + "']").val(data[k]);
		}else{
			 $("input[name='ACM." + k + "']").val(data[k]);
		}
	}
	$('#table_selectInfo').bootstrapTable("refresh",{
		url:'CMRecipients/queryRecipientsInfoById.asp?out_id='+data.OUT_ID});
}
//选择物品表
function initConsumablesStorageTableInfo(){
	$("#table_selectInfo").bootstrapTable({
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "GOODS_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [ {
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
		},{
			field : 'GOODS_ID',
			title : '物品编号',
			align : "center"
		}, {
			field : "GOODS_NAME",
			title : "物品名称",
			align : "center"
		}, {
			field : "BRAND",
			title : "品牌商标",
			align : "center"
		},{
			field : "STANDARD",
			title : "规格型号",
			align : "center"
		},{
			field : "QUANTITY",
			title : "单位",
			align : "center"
		},{
			field : "GOODS_NUM",
			title : "剩余数量",
			align : "center"
		},{
			field : "GOODS_NUMBER",
			title : "领用数量",
			align : "center",
			formatter: function (value, row, index) {
				if(value==undefined){
					value="";
				}
				return '<input type="text" id="goods_number'+index+'" value="'+value+'">';
			}
		}]
	});
}
//模态框物品类别
var StorageTreeObj;
function initStorageTree(){
	var setting = {
		async : {
			enable : true,
			url : "sorting/queryAllSorting.asp",
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
				var treeObj = $.fn.zTree.getZTreeObj("treeDemo_modalStorage");
				treeObj.expandNode(treeObj.getNodeByTId("treeDemo_modalStorage_1"), true, false, true);
				var menus=treeObj.getNodes();
				if(menus!=undefined){
					initStorageTree["data"]={};
					for(var i=0;i<menus.length;i++){
						setConfigNodeTId(menus[i],initStorageTree);
					}
				}
			},
			onClick : function(event, treeId, treeNode) {
			/*	path={};
				pathId="";
				pathName="";*/
				//加载类别对应的字段配置
				reloadPrivateFieldInfo(treeNode.id);
			}
		}
	};
	$.fn.zTree.init($("#treeDemo_modalStorage"), setting);
	StorageTreeObj = $.fn.zTree.getZTreeObj("treeDemo_modalStorage");
}
function reloadPrivateFieldInfo(category_id){
	 $('#table_modalStorage').bootstrapTable('refresh',{url : 'CMRecipients/queryAllStorageField.asp?category_id='+category_id+'&room_id='+room_id});
}
//物品字段表
function initStorageInfo(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#table_modalStorage").bootstrapTable({
			//请求后台的URL（*）
			url : 'CMRecipients/queryAllStorageField.asp?room_id='+room_id,
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable :false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			//pagination : true, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "COL_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: false,
			columns : [ {
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			},{
				field : 'Number',
				title : '序号',
				align : "center",
				formatter: function (value, row, index) {
					return index+1;
				}
			},{
				field : 'GOODS_ID',
				title : '物品编码',
				align : "center"
			}, {
				field : "GOODS_NAME",
				title : "物品名称",
				align : "center"
			}, {
				field : "BRAND",
				title : "品牌商标",
				align : "center"
			}, {
				field : "STANDARD",
				title : "规格型号",
				align : "center"
			}, {
				field : "QUANTITY",
				title : "单位",
				align : "center"
			},{
				field : "GOODS_NUM",
				title : "剩余数量",
				align : "center"
			}]
		});
}

initConsumablesStorageTableInfo();
initStorageTree();
initVlidate($("#recipientInfo_table"));