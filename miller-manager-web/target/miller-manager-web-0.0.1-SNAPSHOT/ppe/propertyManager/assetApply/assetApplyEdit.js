function initAssetApplyEditLayout(item){
	var page = $("#assetApplyEditPart");
	var select = page.find("select[name=useMethod]");
	initSelect(select, {value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:select.attr("dic_code")}, item?item.useMethod:null, null, null);
	initVlidate($("#assetApplyEditPart"));
	
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
		newOpenTab("assetapply","资产申请","ppe/propertyManager/assetApply/assetApplyList.html");
	});
	
	var typeSele = page.find("button[sel=typeSele]");
	typeSele.click(function(){
		page.find("div[sel=typeSeleModel]").modal("show");
	});
	
	function callback(){
		
	}
	function upload(isCommit){
		if(!vlidate($("#assetApplyEditPart"),"",true)){
			 return;
		 }
		var inputs =page.find("input");
		var saveItem = new Object();
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			saveItem[obj.attr("name")] = $.trim(obj.val());
		}
		saveItem.useMethod=$.trim(page.find("select[name=useMethod]").val());
		saveItem.remark=$.trim(page.find("textarea[name=remark]").val());
		saveItem.is_state=isCommit;
		$.post("inventoryManager/assetApply/saveAssetApply.asp", saveItem, function(result){
			if(result.result){
				alert("保存成功");
				back.click();
			}
		}, "json");
	}
	
	/* */
	//类别点击
	$("input[name=categoryName]").unbind("click");
	$("input[name=categoryName]").click(function(){
		openSelectTreeDiv($(this),"assetApplyEdit","propertyTypeConfig/queryAllAssetCategroy.asp",{width:$(this).width()+"px","margin-left": "22px"},function(node){
			$("input[name=categoryName]").val(node.name);
			$("input[name=categoryId]").val(node.id);
			return true;
		});
	});
	if(item){
		for (var key in item) {
			page.find("input[name="+key+"]").val(item[key]);
		}
		page.find("textarea[name=remark]").val(item.remark);
		if(item.useMethod=="01"){
			$(".returndate").show();
		}else if(item.useMethod=="02"){
			$(".returndate").hide();
		}
		page.find("input[name=categoryName]").val(item.categoryIdName);
	} else {
		
		setTimeout(function(){getSeriaNumber()}, 1000);
		//getSeriaNumber();
		
	}
	
	function getSeriaNumber(){
		var sn = page.find("input[name=applyId]");
		sn.val(returnSerialNumber("AP","ASS_SEQ_ASSET_APPLY"));
		baseAjax("AssetRepair/getuserinfo.asp",null, function(data) {
			if(data!=null){
				page.find("input[name=user_no]").val(data.user_no);
				page.find("input[name=applyUserName]").val(data.user_name);
				page.find("input[name=org_no]").val(data.org_no);
				page.find("input[name=applyOrgName]").val(data.org_name);
				page.find("input[name=applyDate]").val(data.apply_date);
			}
		});
	}
}

//归还时间
function returndate(){
	$("input[name=returnDate]").val("");
	var Method=$("select[name=useMethod]").val();
	if(Method==" "){
		$(".returndate").hide();
	}else{
		if(Method=="01"){
			$(".returndate").show();
		}else if(Method=="02"){
			$("input[name=returnDate]").val("");
			$(".returndate").hide();
		}
	}
}
