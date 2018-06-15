function initwarrantOutView(params){
	if(params.ENTER_FLAG=="01"){//已处理——通过
		$("#WarrantOut_reason").hide();
		$("#WarrantOut_no").hide();
	}else{
		if(params.ENTER_FLAG=="00"){//未处理
			$("#WarrantOut_get").hide();
			$("#WarrantOut_reason").hide();
		}else{//已处理——打回
			$("#WarrantOut_get").hide();
			$("#WarrantOut_no").hide();
		}
	}
	for ( var k in params) { 
		  $("span[name='WV." + k + "']").html(params[k]);
	}
	var photo = params['PHOTO_ID'];
	if(photo){
		$("img[name='WV.PHOTO_ID']").attr("src",photo);
	}else{
		$("img[name='WV.PHOTO_ID']").attr("src","image/default.png");
	}
	//返回
	$("#view_warrantOut_back").click(function(){
		newOpenTab("view_warrantOut_back","返回","ppe/warrantManager/warrantOut/warrantOut_queryList.html");
	});
	
}