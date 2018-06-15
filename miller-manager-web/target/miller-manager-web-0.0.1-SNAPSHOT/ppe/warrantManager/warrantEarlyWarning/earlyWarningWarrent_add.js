function initEarlyWarningWarrent_addEvent(params){
	if(params){//初始化信息
		initNewEarlyWarningConfigureInfo(params);
		$("#headTle_newEarlyWarningWarrant").html("修改预警信息");
	}else{
		$("#headTle_newEarlyWarningWarrant").html("新增预警信息");
	}
	
	//$.trim($("#is_use_earlyWarningConfigureList").val());
	//保存按钮
	$('#save_newEarlyWarningWarrant').unbind();
	$('#save_newEarlyWarningWarrant').bind('click', function(e) {
		if(!vlidate($("#infoDiv_newEarlyWarningWarrant"))){
			return;
		}
		 nconfirm("是否保存？",function(){
			var params = {"DESCREB":$("textarea[name^='NEWCFG.']").val()};
			var inputs = $("input[name^='NEWCFG.']");
			for (var i = 0; i < inputs.length; i++) {
				var obj = $(inputs[i]);
				params[obj.attr("name").substr(7)] = obj.val();
			}
			if($("#is_use_state_newEarlyWarningwarrant").is(":checked")){
				params["IS_USE"]="00";
			}else{
				params["IS_USE"]="01";
			}
			var WARR_CATEGORY=$("#add_warrentearlyWarning").val();
			params["WARR_CATEGORY"]=WARR_CATEGORY;
			baseAjax("WarrantWarning/newWarning.asp", params, function(data) {
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						newOpenTab("warrantEarlyWarningList","权证预警列表","ppe/warrantManager/warrantEarlyWarning/earlyWarningWarrent_list.html",function(){});
					}
				}else{
					alert("未知错误！");
				}
			},true);
		 });
	});
	//重置按钮
	$('#reset_newEarlyWarningWarrant').unbind();
	$('#reset_newEarlyWarningWarrant').bind('click', function(e) {
		if(params){//初始化信息
			initNewEarlyWarningConfigureInfo(params);
		}else{
			$("input[name^='NEWCFG.']").val("");
			$("textarea[name^='NEWCFG.']").val("");
			$("#add_warrentearlyWarning").val("");
			$("#add_warrentearlyWarning").select2();
			//$("#is_use_earlyWarningConfigureList").val("");
		}
	});
	//返回
	$('#back_newEarlyWarningWarrant').unbind();
	$('#back_newEarlyWarningWarrant').bind('click', function(e) {
		newOpenTab("warrantEarlyWarningList","权证预警列表","ppe/warrantManager/warrantEarlyWarning/earlyWarningWarrent_list.html",function(){});
	});
	//点击资产类别
	var currTab = getCurrentPageObj();
	$("input[name='NEWCFG.WARR_TYPE_NAME']").unbind("click");
	$("input[name='NEWCFG.WARR_TYPE_NAME']").click(function(){
		var pre_category_id="0104";
		openSelectTreeDivWar($(this),"warrantListSelectTreeType_invPL","warrantInfoAndExchange/queryAllWarrantCategroy.asp?pre_category_id="+pre_category_id,{width:$(this).width()+"px","margin-left": "0"},function(node){
		currTab.find("#earlywarning_warr_classify_two").val(node.NAME);
		currTab.find("#earlywarning_warr_typeId_two").val(node.ID);
		return true;
		});
	});
	//点击资产类别的 子方法
	function openSelectTreeDivWar(obj,treeId,url,css,callback){
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
/**
 * 初始化信息
 * @param params 信息数据
 */
function initNewEarlyWarningConfigureInfo(params){
	for(var k in params){
		if(k=="DESCREB"){
			$("textarea[name='NEWCFG." + k + "']").val(params[k]);
		}else{
			$("input[name='NEWCFG." + k + "']").val(params[k]);
		}
	}
	//权证类别
	var CATEGORY =[{WARR_CATEGORY:"00",WARR_CATEGORY_NAME:"主权证"},{WARR_CATEGORY:"01",WARR_CATEGORY_NAME:"他项权证"}];
	if(params["WARR_CATEGORY"]=="00"){
		initSelectByData($("#add_warrentearlyWarning"),{"value":"WARR_CATEGORY","text":"WARR_CATEGORY_NAME"},CATEGORY,"00");
	}else{
		initSelectByData($("#add_warrentearlyWarning"),{"value":"WARR_CATEGORY","text":"WARR_CATEGORY_NAME"},CATEGORY,"01");
	}//是否启用
	if(params["IS_USE"]=="00"){
		if(!$("#is_use_state_newEarlyWarningwarrant").is(":checked")){
			$("#is_use_state_newEarlyWarningwarrant").click();
		}
	}else{
		if($("#is_use_state_newEarlyWarningwarrant").is(":checked")){
			$("#is_use_state_newEarlyWarningwarrant").click();
		}
	}
}
autoInitSelect($("#add_warrentearlyWarning"));
initVlidate($("#infoDiv_newEarlyWarningWarrant"));
setTimeout(function(){switch_btn_event()}, 5);