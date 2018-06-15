//资产处置列表
function initassetDealInfoList(){
	$('#Table_propertyDealInfo').bootstrapTable('destroy').bootstrapTable({
		//data: rowData,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : false, //是否启用排序
		sortOrder : "asc", //排序方式
		//queryParams :queryParams,//传递参数（*）
		/*sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 5,//可供选择的每页的行数（*）
*/		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ASSET_NUM", //每一行的唯一标识，一般为主键列
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
		},{
			field : "ASSET_NUM",
			title : '资产编码',
			align : "center"
		}, {
			field : "ASSET_NAME",
			title : '资产名称',
			align : "center"
		}, {
			field : "ASSET_TYPE",
			title : "资产类型",
			align : "center"
		} , {
			field : "STATUS",
			title : "资产状态",
			align : "center"
		}, {
			field : "STORAGE_PLACE",
			title : "存放地址",
			align : "center"
		} , {
			field : "SCRAP_DATE",
			title : "报废日期",
			align : "center"
		}]
	});	
}
//资产信息模态框
function initpropertyDealPop(){
	$("#PDasset_num").val("");
	$("#PDasset_name").val("");
	$("#PDasset_type").val("");
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#Table_modalassetInfo").bootstrapTable('destroy').bootstrapTable({
      url: 'AssetDeal/queryassetInfo.asp?user_num='+user_num,     //请求后台的URL（*）
      method: 'get',           //请求方式（*）   
      striped: true,           //是否显示行间隔色
      cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）		       
      sortable: true,           //是否启用排序
      sortOrder: "asc",          //排序方式
      queryParams: queryParams,//传递参数（*）
      sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
      pagination: true,          //是否显示分页（*）
      pageList: [5],    //可供选择的每页的行数（*）
      pageNumber:1,            //初始化加载第一页，默认第一页
      pageSize: 5,            //每页的记录行数（*）		       
      clickToSelect: true,        //是否启用点击选中行
      uniqueId: "SERIALS_NUMBER",           //每一行的唯一标识，一般为主键列
      cardView: false,          //是否显示详细视图
      detailView: false,          //是否显示父子表	
      singleSelect: false,//复选框单选
      columns: [
		{	
			checkbox:true,
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
	        field: 'ASSET_NUM',
	        title: '资产编号',
	        align:"center"
	      }, {
	        field: 'ASSET_NAME',
	        title: '资产名称',
	        align:"center"
	      }, {
	      	field:"ASSET_TYPE",
	      	title:"资产类别",
	        align:"center"
	      },{
	      	field:"CREATE_DATE",
	      	title:"登记时间",
	        align:"center"
	      }, {
	      	field:"CREATE_USER",
	      	title:"登记人",
	        align:"center"
	      }, {
	    	field:"STATUS",
	      	title:"设备状态",
	        align:"center"
	      }, {
			field : "STORAGE_PLACE",
			title : "存放地址",
			align : "center"
		  } , {
			field : "SCRAP_DATE",
			title : "报废日期",
			align : "center"
		  }]
    });
}
//模态框按钮
function initDealModalBtn(){
	//选择按钮
	$("#addModal_addPropertyDeal").click(function(e){
		//点击选择按钮，获取复选框中被选中的记录id
		if($("#Table_modalassetInfo").find("input[type='checkbox']").is(':checked')){
			var rol = $("#Table_modalassetInfo").bootstrapTable('getSelections');
			var select = $("#Table_propertyDealInfo").bootstrapTable('getData');
			for(var i=0;i<rol.length;i++){
				for(var j=0;j<select.length;j++){
					if(rol[i].ASSET_NUM==select[j].ASSET_NUM){
						var id=select[j].ASSET_NUM;
						$('#Table_propertyDealInfo').bootstrapTable("removeByUniqueId", id);
					}
				}
				$('#Table_propertyDealInfo').bootstrapTable("append",rol[i]);
			}
			$("#myModal_addPropertyDeal").modal("hide");
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
	//查询按钮
	$("#searchModal_addPropertyDeal").click(function() {
		var asset_num=$("#PDasset_num").val();
		var asset_name=$("#PDasset_name").val();
		var asset_type=$("#PDasset_type").val();
		$('#Table_modalassetInfo').bootstrapTable('refresh',
			{url:'AssetDeal/queryassetInfo.asp?asset_num='+escape(encodeURIComponent(asset_num))
			+"&asset_name="+escape(encodeURIComponent(asset_name))+"&asset_type="+asset_type+"&user_num="+user_num});
    });
	//重置按钮
	$("#resert_addPropertyDeal").click(function(){
		$("#PDasset_num").val("");
		$("#PDasset_name").val("");
		$("#PDasset_type").val("");
	});
	//资产类型
	var currTab=getCurrentPageObj();
	var assetTypeTree = currTab.find("input[name=assetTypeTree]");
	initTreeDeal("assetTypeTree");
	assetTypeTree.click(function(){
		var treeObj = currTab.find("div[sel=assetTypeTree]");
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
	
	//初始化树的方法
	function initTreeDeal(treeId){
		//z-index: 1000; margin: 0px 126px; border: 1px solid rgb(205, 205, 205); height: 200px; width: 23%; overflow: auto; position: absolute; display: block; background-color: white;
		var Y = assetTypeTree.position().left;
		var y = assetTypeTree.offset().left;
		assetTypeTree.after('<div sel="'+treeId+'" id="assTypeTree" class="ztree" style="display:none;overflow-y: scroll;z-index: 1000;margin:0px 109px;background-color: white;border:1px solid #CDCDCD;height:200px;width:'+(assetTypeTree[0].scrollWidth+148)+'px;overflow:auto;position:absolute;">&nbsp;&nbsp;</div>');
		var treeObj = currTab.find("div[sel="+treeId+"]");
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
						currTab.find("input[name=assetTypeDeal]").val(treeNode.id);
						currTab.find("input[name=assetTypeTree]").val(treeNode.name);
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
//初始化按钮
var user_num;
var today;
function initpropertyDealTab(){
	//获取当前申请人，机构和时间
	today=returnTodayData();
	user_num=$("#main_user_name").attr("user_no");
	$("#APDdeal_user_no").val($("#main_user_name").attr("user_no"));
	$("#APDdeal_user_name").val($("#main_user_name").attr("user_name"));
	
	$("#APDdeal_id").val(returnSerialNumber("AD","ASS_SEQ_ASSET_DEAL"));
	//新增按钮
	$('#add_addPropertyDeal').click(function(){
		//显示模态框
		$("#myModal_addPropertyDeal").modal("show");
		initpropertyDealPop();
	});
	//删除按钮
	$("#delete_addPropertyDeal").click(function(){
		var rol = $("#Table_propertyDealInfo").bootstrapTable('getSelections');
		var id=rol[0].ASSET_NUM;
		$('#Table_propertyDealInfo').bootstrapTable("removeByUniqueId", id);
	});
    //保存按钮
	$('#save_addPropertyDeal').click(function(){
		if(!vlidate($("#propertyDeal_table"),"",true)){
		    return;
		}
		var records = $("#Table_propertyDealInfo").bootstrapTable('getData');
		var inputs = $("input[name^='APD.']");
		var selects = $("tr").find("select[name^='APD.']");
		var textareas = $("textarea[name^='APD.']");
		var params = {};
		// 必填项验证
		// 取值
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(4)] = $(inputs[i]).val(); 
		}
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(4)] = $(selects[i]).val(); 
		}		
		for(var i=0;i<textareas.length;i++){
			params[$(textareas[i]).attr("name").substr(4)] = $(textareas[i]).val(); 
		}
		params["records"]=JSON.stringify(records);
		if($('#APDdeal_method').val()=="01"){
			params["DEAL_STATUS"]="01";
		}else{
			params["DEAL_STATUS"]="02";
		}
		params["DEAL_DATE"]=today;
		params["FINISH_DATE"]="";
		params["DEL_FLAG"]="00";
		baseAjax("AssetDeal/addDealInfo.asp", params , function(data) {
			if(data.result=="true"){
				alert("保存成功！");
				//关闭申请页并返回List主页面
				newOpenTab("propertydeallist","返回列表","ppe/propertyManager/propertyDealManager/propertyDeal/propertyDealList.html");
			}else{
				alert("保存失败！");
			}
		});
		
	});
	//保存提交按钮
	$('#sure_addPropertyDeal').click(function(){
		if(!vlidate($("#propertyDeal_table"),"",true)){
		    return;
		}
		var records = $("#Table_propertyDealInfo").bootstrapTable('getData');
		var inputs = $("input[name^='APD.']");
		var selects = $("tr").find("select[name^='APD.']");
		var textareas = $("textarea[name^='APD.']");
		var params = {};
		// 必填项验证
		// 取值
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(4)] = $(inputs[i]).val(); 
		}
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(4)] = $(selects[i]).val(); 
		}		
		for(var i=0;i<textareas.length;i++){
			params[$(textareas[i]).attr("name").substr(4)] = $(textareas[i]).val(); 
		}
		params["records"]=JSON.stringify(records);
		if($('#APDdeal_method').val()=="01"){
			params["DEAL_STATUS"]="03";
		}else{
			params["DEAL_STATUS"]="04";
		}
		params["DEAL_DATE"]=today;
		params["FINISH_DATE"]=today;
		params["DEL_FLAG"]="01";
		baseAjax("AssetDeal/addDealInfo.asp", params , function(data) {
			if(data.result=="true"){
				alert("保存成功！");
				//关闭申请页并返回List主页面
				newOpenTab("propertydeallist","返回列表","ppe/propertyManager/propertyDealManager/propertyDeal/propertyDealList.html");
			}else{
				alert("保存失败！");
			}
		});
	});
	//返回
	$('#back_addPropertyDeal').click(function(){
		newOpenTab("propertydeallist","返回列表","ppe/propertyManager/propertyDealManager/propertyDeal/propertyDealList.html");
	});
	//人员模态框
	$("#APDget_user_name").click(function(){
		openPRPUserPop("chooseUser_addDeal",{Zuser_no:$("#APDget_user_no"),Zuser_name:$("#APDget_user_name"),
			          Zuser_org:$("#APDget_belong_no"),Zuser_org_name:$("#APDget_belong_name")});
	});	
}	

//修改赋值
function initupdateDeal(data){
	for ( var k in data) { 
		if(k=="DEAL_REMARK"){
			$("textarea[name='APD." + k + "']").val(data[k]);
		}else if(k=="DEAL_METHOD"){
			 $("select[name='APD." + k + "']").val(data[k]);
		}else{
			 $("input[name='APD." + k + "']").val(data[k]);
		}
	}
	initSelect($("select[name='APD.DEAL_METHOD']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"ASS_DIC_DEAL_METHOD"},data.DEAL_METHOD);
	$("#dealIt01").show();
	if(data.DEAL_METHOD=="01"){
		$(".Akasset_type1").show();
		$(".Akasset_type2").hide();
	}else if(data.DEAL_METHOD=="02"){
		$(".Akasset_type2").show();
		$(".Akasset_type1").hide();
	}
	/*baseAjax("AssetDeal/queryAssetInfoById.asp?deal_id="+data.DEAL_ID, null , function(data) {
		$('#Table_propertyDealInfo').bootstrapTable("load",data.rows);
	});*/
	//或者,load方式表不可以分页，refresh可以,但是不分页refresh不用传rows，load任意
	$('#Table_propertyDealInfo').bootstrapTable("refresh",{
		url:'AssetDeal/queryAssetInfoById.asp?deal_id='+data.DEAL_ID});
}
//买断或赠与
function dealIt(){
	$("#dealIt01 input").val("");
	$("#APDdeal_price").val("");
	var dealIt=$("#APDdeal_method").val();
	if(dealIt==" "){
		$("#dealIt01").hide();
		$(".Akasset_type1").hide();
	}else{
		$("#dealIt01").show();
		if(dealIt=="01"){
			$(".Akasset_type1").show();
			$(".Akasset_type2").hide();
		}else if(dealIt=="02"){
			$(".Akasset_type2").show();
			$(".Akasset_type1").hide();
			$("#APDdeal_price").val("0");
		}
	}
}

initassetDealInfoList();
initDealModalBtn();
initpropertyDealTab();
autoInitSelect($("#propertyDeal_table"));
initVlidate($("#propertyDeal_table"));