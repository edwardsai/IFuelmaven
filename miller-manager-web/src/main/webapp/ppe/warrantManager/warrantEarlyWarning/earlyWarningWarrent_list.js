;function initEarlyWarningWarrentListTableEvent(){
	var tbObj=$('#tb_EarlyWarningWarrentList');
	var currTab = getCurrentPageObj();
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	tbObj.bootstrapTable({
		url : 'WarrantWarning/queryAllWarning.asp',//请求后台的URL（*）
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
			field: 'WARR_CATEGORY_NAME',
			align: 'center',
			title : '权证类别'
			
		}, {
			field : 'WARR_TYPE_NAME',
			title : '权证类型',
			align : "center"
		}, {
			field : 'IS_USE',
			title : '是否启用',
			align : "center",
			formatter: function(value,row,index){
				if(value=="00"){
					return "启用";
				}else{
					return "启用";
				}
			}
		}, {
			field : 'ADVANCE_NOTICE_TIME',
			title : '到期提前通知',
			align : "center",
			formatter: function(value,row,index){
				return value+"天";
			}
		}, {
			field : "BORROW_TIME",
			title : "借用提前通知",
			align : "center",
			formatter: function(value,row,index){
				return value+"天";
			}
		},{
			field : "CREATE_TIME",
			title : "设置时间",
			align : "center"
		},{
			field : "EXCEPTION_NUM",
			title : "预警信息",
			align : "center",
			formatter: function(value,row,index){
				var strInfo="";
				var key2="1";//有效期异常信息 与 借阅异常信息  区分
				if(value){//有效期异常信息
					//var nums=value.split(",").length;
				strInfo=strInfo+'<p style="color:red">有效期超时异常：<span style="font-size:20px;" class="viewDetail" onclick="viewWarnDayAssetNumInfoWarrant('+index+','+key2+')">'+
				value+'</span> 条权证；</p>';
				}
				if(row.EXCEPTION_NUM_BORROW){//借阅异常信息
					key2="2";
					//var nums_borrow=row.EXCEPTION_NUM_BORROW.split(",").length;
					strInfo=strInfo+'<p style="color:red">借用超时异常：<span style="font-size:20px;" class="viewDetail" onclick="viewWarnDayAssetNumInfoWarrant('+index+','+key2+')">'+
					row.EXCEPTION_NUM_BORROW+'</span> 条权证；</p>';
				}
				if(!strInfo){
					strInfo='<p style="color:green">正常</p>';
				}
				return strInfo;
			}
		}]
	});
	//查询
	$("#search_earlyWarningwarrant").unbind("click");
	$("#search_earlyWarningwarrant").click(function(){
		var WARR_CATEGORY= $.trim($("#is_warrentearlyWarning").val());
		var WARR_TYPE= $.trim($("#earlywarning_warr_typeId").val());
		tbObj.bootstrapTable('refresh',{url:'WarrantWarning/queryAllWarning.asp?WARR_CATEGORY='+WARR_CATEGORY+'&WARR_TYPE='+WARR_TYPE});
	});
	//重置
	$("#reset_earlyWarningwarrant").click(function(){
		$("#is_warrentearlyWarning").val(" ");
		$("#is_warrentearlyWarning").select2();
		$("#earlywarning_warr_classify_o").val("");
		$("#earlywarning_warr_typeId").val("");
		//$("#is_use_earlyWarningConfigureList").select2();
	});
	//权证类型
	currTab.find('#earlywarning_warr_classify_o').bind('click', function() {
		var pre_category_id="0104";
		openSelectTreeDivWarr($(this),"warrantListSelectTreeType_invear","warrantInfoAndExchange/queryAllWarrantCategroy.asp?pre_category_id="+pre_category_id,{width:$(this).width()+"px","margin-left": "127px"},function(node){
			currTab.find("#earlywarning_warr_classify_o").val(node.NAME);
			currTab.find("#earlywarning_warr_typeId").val(node.ID);
			return true;
		});
		
	});
	//点击资产类别的 子方法
	function openSelectTreeDivWarr(obj,treeId,url,css,callback){
		if(!$("#"+treeId)[0]){
			var marginleft=""; if(css["margin-left"]){marginleft="margin-left:"+css["margin-left"]+";";};
			var margintop=""; if(css["margin-top"]){margintop="margin-top:"+css["margin-top"]+";";};
			var width=""; if(css.width){width="width:"+css.width+";";};
			var height="height:300px;"; if(css.height){height="height:"+css.height+";";};
			obj.after('<div id="'+treeId+'" class="ztree" style="'+marginleft+margintop+' overflow-y: scroll;z-index: 1000;background-color: white;border:1px solid #CDCDCD;'+height+'position:absolute;'+width+'">&nbsp;aaa&nbsp;</div>');
			openSelectTreeDiv[treeId]="11";
		}else{
			if(css.width){
				$("#"+treeId).css("width",css.width);
			}
			$("#"+treeId).show();
		}
		$("#body").mousedown(function(){
			$("#body").unbind("mousedown");
			$("#"+treeId).hide();
		});
		$("#"+treeId).mouseout(function(){
			$("#body").unbind("mousedown");
			$("#body").mousedown(function(){
				$("#"+treeId).hide();
				$("#body").unbind("mousedown");
			});
		});
		$("#"+treeId).mouseover(function(){
			$("#body").unbind("mousedown");
		});
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
						key : {
							name : "NAME",
						},
						simpleData : {
							enable : true,
							idKey : "ID",
							pIdKey : "PID",
							rootPId : "0104"
						}
					},
					callback : {
						onAsyncSuccess: function(){
							var treeObj = $.fn.zTree.getZTreeObj(treeId);
							treeObj.expandNode(treeObj.getNodeByTId(treeId+"_1"), true, false, true);
						},
						onClick : function(event, treeId, treeNode) {
							treeNode.allname=getAllSelectTreeDivName(treeNode,treeNode.NAME);
							if(callback){
								var c=callback(treeNode);
								if(c==undefined||c==true){
									$("#"+treeId).hide();
								}
							}else{
								$("#"+treeId).hide();
							}
						}
					}
				};
				$.fn.zTree.init($("#"+treeId), setting);
	}
}
function initEarlyWarningConfigureListBtnEvent(){
	//添加__权证预警
	$("#earlyWarning_add").unbind("click");
	$("#earlyWarning_add").click(function(){
		pageDispatchEarlyWarningWarrant(this,"addWarn","");
	});
	//修改预警
	$("#earlyWarning_update").unbind("click");
	$("#earlyWarning_update").click(function(){
		var id = $("#tb_EarlyWarningWarrentList").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		pageDispatchEarlyWarningWarrant(this,"updateWarn",params[0]);
	});
	//删除预警
	$("#del_earlyWarningwarrant").unbind("click");
	$("#del_earlyWarningwarrant").click(function(){
		var id = $("#tb_EarlyWarningWarrentList").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请选择一条数据进行删除!");
			return;
		}
		nconfirm("确定删除？",function(){
			var WARNING_ID = id[0].WARNING_ID;                    
			baseAjax("WarrantWarning/delWarning.asp",{"WARNING_ID":WARNING_ID}, function(data) {
				if (data != undefined && data != null&&data.result=="true") {
					alert("删除成功！");
					$("#search_earlyWarningwarrant").click();
				}else{
					alert("删除失败！");
				}
			});
		});
	});
}
//跳转新增、修改、查看异常
function pageDispatchEarlyWarningWarrant(obj,key,params){
	if(key=="addWarn"||key=="updateWarn"){
		newOpenTab("EarlyWarningWarrent_add","操作权证预警","ppe/warrantManager/warrantEarlyWarning/earlyWarningWarrent_add.html",function(){
			initEarlyWarningWarrent_addEvent(params);
		});
		return;
	}else if(key=="exception"){
		newOpenTab("EarlyWarningWarrent_exception","操作权证预警异常信息","ppe/warrantManager/warrantEarlyWarning/earlyWarningWarrent_exception.html",function(){
			initEarlyWarningWarrent_exceptionEvent(params);
		});
	}
}
//异常信息查看
function viewWarnDayAssetNumInfoWarrant(index,key){
	var data = $("#tb_EarlyWarningWarrentList").bootstrapTable('getData');
	var ids=JSON.stringify(data[index]);
	var params=JSON.parse(ids);
	params["key"]=key;
	pageDispatchEarlyWarningWarrant("","exception",params);
}
//初始化类型下拉框
autoInitSelect($("#is_warrentearlyWarning"));
initEarlyWarningWarrentListTableEvent();
initEarlyWarningConfigureListBtnEvent();
