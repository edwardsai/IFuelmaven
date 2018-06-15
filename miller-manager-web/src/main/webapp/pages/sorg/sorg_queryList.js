var SorgZTtreeObj;
//按钮方法
function initOrgButtonEvent() {
	$("#suporg_name").click(function(){
		openSelectTreeDiv($(this),"orgSelectTree","SOrg/queryorgtreelist.asp",{width:$("#suporg_name").width()+"px","margin-left":"0px"},function(node){
			if($("#org_code").val()==node.id){
				return false;
			}
			$("#suporg_name").val(node.name);
			$("#suporg_code").val(node.id);
			return true;
		});
	});
	$("#addOrg").click(function() {
		
		$("input[name^='ORG.'][name!='ORG.old_org_code']").val("");
		$("input[name='ORG.org_code']").val(returnTypeId("S_SEQ_ORG_ID"));
		$("textarea[name^='ORG.']").val("");
		var selectsed = SorgZTtreeObj.getSelectedNodes();
		if(selectsed!=undefined&&selectsed.length>0){
			var selected=selectsed[0];
			$("input[name='ORG.suporg_code']").val(selected.id);
			$("input[name='ORG.suporg_name']").val(selected.name);
		}
		$("#old_org_code").val("");
	});
	$("#updateOrg").click(function() {
		var old_org_no = $("#old_org_code").val();
		if(""==$.trim(old_org_no)){
			updateOrg("SOrg/createsorg.asp","添加");
		}else{
			updateOrg("SOrg/updatesorg.asp","修改");
		}
	});
	
	$("#delOrg").click(function() {
		var inputs = $("input[name^='ORG.']");
		var params = {};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(4)] = obj.val();
		}
		baseAjax("SOrg/deletesorg.asp", params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				initOrgTree();
				alert("删除成功");
				//initMenuTree();
			}else{
				alert("删除失败");
			}
		});
	});
	
	$("#resetOrg").click(function(){
		$("input[name^='ORG.'][name!='ORG.old_menu_no']").val("");
		$("textarea[name^='ORG.']").val("");
		$("select[name^='ORG.']").val("");
	});
}

//保存方法
function updateOrg(url,msg){
	if(vlidate($("#org_from"),"",true)){
		var inputs = $("input[name^='ORG.']");
		var texts = $("textarea[name^='ORG.']");
		var select = $("select[name^='ORG.']");
		var params = {};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(4)] = obj.val();
		}
		for (var i = 0; i < texts.length; i++) {
			var obj = $(texts[i]);
			params[obj.attr("name").substr(4)] = obj.val();
		}
		for(var i = 0; i < select.length; i++){
			var obj = $(select[i]);
			params[obj.attr("name").substr(4)] = obj.val();
		}
		baseAjax(url,params,function(data){
			if(data != undefined && data != null && data.result == "true"){
				initOrgTree();
				alert(msg+"成功");
			}else{
				alert(data.msg);
			}
		});
	}
}

//初始化方法
function initOrgTree() {
	var setting = {
			async : {
				enable : true,
				url : "SOrg/queryorgtreelist.asp",
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
				onClick : function(event, treeId, treeNode) {//点击后查询数据方法
					baseAjax("SOrg/findonesorg.asp", {
						org_code : treeNode.id
					}, function(data) {
						for ( var k in data) {
							$("input[name='ORG." + k + "']").val(data[k]);
							if(k=='business_type'){
								$("select[name^='ORG.']").val(data[k]);
							}
						}
						setSelected($("#org_area"),$("#org_area").val());
						setSelected($("#business_type"),$("#business_type").val());
						$("#old_org_code").val(data['org_code']);
						data['org_code'] != undefined ? $("input[name='ORG.old_org_code']").val(data['org_code']) : "";
						data['org_address'] != undefined ? $("textarea[name='ORG.org_address']").val(data['org_address']) : "";
					});
				}
			}
	};
	$.fn.zTree.init($("#treeOrg"), setting);
	SorgZTtreeObj = $.fn.zTree.getZTreeObj("treeOrg");
}

//下拉框方法
function initSorgType(){
	//初始化数据
	initSelect($("#org_area"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_AREA"});
	initSelect($("#business_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_BUSINESS"});
}

//POP控件
function initPOP(){
	$("#org_manager_name").click(function(){
		openUserPop("userOrgDivPop",{"name":$("#org_manager_name"),"no":$("#org_manager_code")});
	});
}

//时间控件
function initDate(){
	$("#launch_date").focus(function() {
		WdatePicker({
			dateFmt : 'yyyy-MM-dd',
			minDate : '1990-01-01',
			maxDate : '2050-12-01'
		});
	});
}

$("#userDivPop").load("pages/suser/suserPop.html");// pages/suser/suserPop.html
initPOP();
initOrgTree();
initOrgButtonEvent();
initSorgType();
initDate();