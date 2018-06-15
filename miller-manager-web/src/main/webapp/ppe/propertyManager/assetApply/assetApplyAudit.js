function initreadAssetApplyAudit(params){
	for ( var k in params) { 
		var k1=k.toLowerCase();
		if(k1=="remark"){			
			$("textarea[name='APA." +k1+ "']").val(params[k]);
		}else{
			 $("span[name='APA." +k1+ "']").html(params[k]);
		}
	}
}

initbuttonEvent();
function initbuttonEvent(){
	$("#back_assetApplyList").click(function(){
		newOpenTab("assetapply","资产申请","ppe/propertyManager/assetApply/assetApplyList.html");
	});
}