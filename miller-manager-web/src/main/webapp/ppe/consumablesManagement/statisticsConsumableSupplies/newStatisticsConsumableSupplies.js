function initNewEarlyWarningConfigureEvent(params){
	var updateCategoryId=null;
	var updateRoomId=null;
	if(params){//初始化信息
		updateCategoryId=params.CATEGORY_ID;
		updateRoomId=params.ROOM_ID;
		initStatisticsConsumableSuppliesInfo(params);
		$("#headTle_statisticsConsumableSupplies").html("修改耗材预警信息");
	}else{
		$("#headTle_statisticsConsumableSupplies").html("新增耗材预警信息");
	}
	//保存按钮
	$('#save_statisticsConsumableSupplies').unbind();
	$('#save_statisticsConsumableSupplies').bind('click', function(e) {
		if(!vlidate($("#infoDiv_statisticsConsumableSupplies"))){
			return;
		}
		 nconfirm("是否保存？",function(){
			var params = {"MARKS":$("textarea[name^='NEWSCFG.']").val()};
			var inputs = $("input[name^='NEWSCFG.']");
			for (var i = 0; i < inputs.length; i++) {
				var obj = $(inputs[i]);
				params[obj.attr("name").substr(8)] = obj.val();
			}
			if($("#is_use_state_newStatisticsConsumableSupplies").is(":checked")){
				params["STATUS"]="1";
			}else{
				params["STATUS"]="2";
			}
			baseAjax("StatisticsConsumableSupplies/newStatistics.asp", params, function(data) {
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						newOpenTab("statisticsConsumableSupplies","耗材预警列表","ppe/consumablesManagement/statisticsConsumableSupplies/statisticsConsumableSupplies.html",function(){});
					}
				}else{
					alert("未知错误！");
				}
			},true);
		 });
	});
	//重置按钮
	$('#reset_statisticsConsumableSupplies').unbind();
	$('#reset_statisticsConsumableSupplies').bind('click', function(e) {
		if(params){//初始化信息
			initStatisticsConsumableSuppliesInfo(params);
		}else{
			$("input[name^='NEWSCFG.']").val("");
			$("textarea[name^='NEWSCFG.']").val("");
		}
	});
	//返回
	$('#back_statisticsConsumableSupplies').unbind();
	$('#back_statisticsConsumableSupplies').bind('click', function(e) {
		newOpenTab("statisticsConsumableSupplies","耗材预警列表","ppe/consumablesManagement/statisticsConsumableSupplies/statisticsConsumableSupplies.html",function(){});
	});
	//初始化耗材类别树
	var selectTeeID=Math.uuid();
	var treeInputObj=$("input[name='NEWSCFG.CATEGORY_NAME']");
	openSelectTreeDivAllName(treeInputObj,selectTeeID,"sorting/queryAllSorting.asp",{width:treeInputObj.width()+"px","margin-left": "0px"},function(node){
		treeInputObj.val(node.allname);
		$("input[name='NEWSCFG.CATEGORY_ID']").val(node.id);
		return true;
	},updateCategoryId);
	//点击耗材类别
	treeInputObj.unbind("click");
	treeInputObj.click(function(){
		showSelectTreeDiv($("#"+selectTeeID));
	});
	
	//初始化仓库树
	var selectTeeID1=Math.uuid();
	var treeInputObj1=$("input[name='NEWSCFG.ROOM_NAME']");
	openSelectTreeDivAllName(treeInputObj1,selectTeeID1,"Config/querystorehouselist.asp",{width:treeInputObj.width()+"px","margin-left": "0px"},function(node){
		var treeObj = $.fn.zTree.getZTreeObj(selectTeeID1);
		var nodes = treeObj.getNodesByParam("pid", node.id, null);
		if(nodes.length==0){
			treeInputObj1.val(node.allname);
			$("input[name='NEWSCFG.ROOM_ID']").val(node.id);
			return true;
		}
		return false;
	},updateRoomId);
	//点击仓库
	treeInputObj1.unbind("click");
	treeInputObj1.click(function(){
		showSelectTreeDiv($("#"+selectTeeID1));
	});
	
}
/**
 * 初始化信息
 * @param params 信息数据
 */
function initStatisticsConsumableSuppliesInfo(params){
	for(var k in params){
		if(k=="MARKS"){
			$("textarea[name='NEWSCFG." + k + "']").val(params[k]);
		}else{
			$("input[name='NEWSCFG." + k + "']").val(params[k]);
		}
		if(params["STATUS"]==1){
			if(!$("#is_use_state_newStatisticsConsumableSupplies").is(":checked")){
				$("#is_use_state_newStatisticsConsumableSupplies").click();
			}
		}else{
			if($("#is_use_state_newStatisticsConsumableSupplies").is(":checked")){
				$("#is_use_state_newStatisticsConsumableSupplies").click();
			}
		}
	}
}
initVlidate($("#infoDiv_statisticsConsumableSupplies"));
setTimeout(function(){switch_btn_event()}, 5);