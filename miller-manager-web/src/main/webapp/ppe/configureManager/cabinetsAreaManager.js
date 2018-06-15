autoInitSelect($("#selectAreaType_areaManager"));
var CabinetsZTtreeObj;
//按钮方法
function initCabinetsAreaManagerButtonEvent() {
	//人员模态框
	$("input[name='CBNTAM.story_mgrname']").unbind();
	$("input[name='CBNTAM.story_mgrname']").click(function(){
		openCMUserPop("userPop_cabinetsAreaModal",{Zuser_name:$("input[name='CBNTAM.story_mgrname']"),Zuser_no:$("input[name='CBNTAM.story_mgr']")});
	});
	
	$("#add_cabinetsAreaManager").click(function() {
		$("#tb_cabinetsAreaManager input,textarea").val("");
		var selectsed = CabinetsZTtreeObj.getSelectedNodes();
		if(selectsed!=undefined&&selectsed.length>0){
			var selected=selectsed[0];
			$("input[name='CBNTAM.store_p_id']").val(selected.id);
			$("input[name='CBNTAM.store_p_name']").val(selected.name);
		}
		initAreaNameByLevel(selected.level+1);
	});
	$("#save_cabinetsAreaManager").click(function() {
		if(!vlidate($("#tb_cabinetsAreaManager"))){
			return;
		};
		var inputs = $("input[name^='CBNTAM.']");
		var params = {"store_level":'0'};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(7)] = obj.val();
		}
		params["area_type"]=$("#selectAreaType_areaManager").val();
		params["store_memo"] = $("textarea[name='CBNTAM.store_memo']").val();
		if(params["store_p_id"]!=undefined&&$.trim(params["store_p_id"])){
			var treeNode=initTree_CabinetsAreaManager["data"][params["store_p_id"]];
			if(treeNode!=undefined&&treeNode.level!=undefined){
				params["store_level"]=treeNode.level+1+'';
			}
		}
		baseAjax("Config/newarea.asp",params,function(data){
			if(data != undefined && data != null){
				alert(data.msg);
				if(data.result == "true"){
					initTree_CabinetsAreaManager();
					getCurrentPageObj().find("#tb_cabinetsAreaManager input,select").val("");
					getCurrentPageObj().find("#tb_cabinetsAreaManager select").select2();
				}
			}else{
				alert("操作失败");
			}
		});
	});
	$("#delete_cabinetsAreaManager").click(function() {
		nconfirm("是否确认删除？",function(){
			var selected = CabinetsZTtreeObj.getSelectedNodes()[0];
			var nodeIds = getAllChilderNodeId(selected);
			baseAjax("Config/deletearea.asp", {"store_ids":nodeIds}, function(data) {
				if (data != undefined&&data!=null&&data.result=="true") {
					alert(data.msg);
					initTree_CabinetsAreaManager();
				}else{
					alert(data.msg);
				}
			});
		});
	});
	$("#selectAreaType_areaManager").change(function(){
		if($(this).val()=="01"){
			getCurrentPageObj().find(".area_xy_cabinetsAreaManager").show();
			getCurrentPageObj().find(".choiceManagerMan").hide();
		}else if($(this).val()=="03"){
			getCurrentPageObj().find(".area_xy_cabinetsAreaManager").show();
			getCurrentPageObj().find(".choiceManagerMan").show();
		}else{
			getCurrentPageObj().find(".area_xy_cabinetsAreaManager").hide();
			getCurrentPageObj().find(".choiceManagerMan").hide();
			getCurrentPageObj().find(".area_xy_cabinetsAreaManager").find("input").val("");
			getCurrentPageObj().find(".choiceManagerMan").find("input").val("");
		}
	});
}
//初始化方法
function initTree_CabinetsAreaManager() {
	var setting = {
			async : {
				enable : true,
				url : "Config/queryareatreelist.asp",
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
					var treeObj = $.fn.zTree.getZTreeObj("tree_CabinetsAreaManager");
					treeObj.expandNode(treeObj.getNodeByTId("tree_CabinetsAreaManager_1"), true, false, true);
					var menus=treeObj.getNodes();
					if(menus!=undefined){
						initTree_CabinetsAreaManager["data"]={};
						for(var i=0;i<menus.length;i++){
							setConfigNodeTId(menus[i],initTree_CabinetsAreaManager);
						}
					}
				},
				onClick : function(event, treeId, treeNode) {//点击后查询数据方法
					baseAjax("Config/findonearea.asp", {
						id : treeNode.id
					}, function(data) {
						var supNode=initTree_CabinetsAreaManager["data"][data["store_p_id"]];
						if(supNode!=undefined){
							$("input[name='CBNTAM.store_p_name']").val(supNode.name);
							$("ininput[name='CBNTAM.store_p_id']").val(supNode.id);
						}else{
							$("input[name='CBNTAM.store_p_name']").val("");
							$("input[name='CBNTAM.store_p_id']").val("");
						}
						for ( var k in data) {
							if(k=="area_type"){
								$("#selectAreaType_areaManager").val(data[k]);
								$("#selectAreaType_areaManager").select2();
							}
							$("input[name='CBNTAM." + k + "']").val(data[k]);
						}
						$("textarea[name='CBNTAM.store_memo']").val(data['store_memo']);
						initAreaNameByLevel(data.store_level);
					});
				}
			}
	};
	$.fn.zTree.init($("#tree_CabinetsAreaManager"), setting);
	CabinetsZTtreeObj = $.fn.zTree.getZTreeObj("tree_CabinetsAreaManager");
}
var areaTypeName_cabinetsAreaManager=['银行','大厦','楼层','区域'];
function initAreaNameByLevel(level){
	if(level<3){
		getCurrentPageObj().find(".areaType_cabinetsAreaManager,.area_xy_cabinetsAreaManager,.choiceManagerMan").hide();
		$("#add_cabinetsAreaManager").removeAttr("disabled");
		$("#add_cabinetsAreaManager").css({"cursor":"pointer","background-color":"#1AB394"});
	}else if(level==3){
		var areaObj=getCurrentPageObj().find(".areaType_cabinetsAreaManager");
		areaObj.show();
		if($("#selectAreaType_areaManager").val()=="01"){//01 it机房区域,03 权证区域
			getCurrentPageObj().find(".area_xy_cabinetsAreaManager").show();
			getCurrentPageObj().find(".choiceManagerMan").hide();
		}else if($("#selectAreaType_areaManager").val()=="03"){
			getCurrentPageObj().find(".area_xy_cabinetsAreaManager").show();
			getCurrentPageObj().find(".choiceManagerMan").show();
		}else{
			getCurrentPageObj().find(".area_xy_cabinetsAreaManager").hide();
			getCurrentPageObj().find(".choiceManagerMan").hide();
		}
		$("#add_cabinetsAreaManager").attr("disabled","disabled");
		$("#add_cabinetsAreaManager").css({"cursor":"not-allowed","background-color":"#62BFAC"});
	}
	$("#area_name_cabinetsAreaManager").html(areaTypeName_cabinetsAreaManager[level]+"名称：");
	$("#area_order_cabinetsAreaManager").html(areaTypeName_cabinetsAreaManager[level]+"序号：");
}
initVlidate($("#tb_cabinetsAreaManager"));
initTree_CabinetsAreaManager();
initCabinetsAreaManagerButtonEvent();
