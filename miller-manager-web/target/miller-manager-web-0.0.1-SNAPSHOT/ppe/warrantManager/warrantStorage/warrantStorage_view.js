function initWarrantStorageView(params){
	var page = $("#warrantStorage_view");
	var in_get=page.find("#in_get");
	var in_reason = page.find("#in_reason");
	var in_no = page.find("#in_no");
	var storage_type = params['STORAGE_TYPE'];
	if(params.ENTER_FLAG=="01"){//已处理——通过
		in_reason.hide();
		in_no.hide();
	}else{
		if(params.ENTER_FLAG=="00"){//未处理
			in_get.hide();
			in_reason.hide();
		}else{//已处理——打回
			in_get.hide();
			in_no.hide();
		}
	}
	if(storage_type=='01'){//借出归还
		page.find("#notag_id").hide();
		page.find("#ntag_id").hide();
	}else{
		page.find("#t_tag_id").hide();
		page.find("#tag_id").hide();
	}
	for ( var k in params) { 
		  $("span[name='VS." + k + "']").html(params[k]);
	}
	var photo = params['PHOTO_ID'];
	if(photo){
		page.find("img[name=PHOTO_ID]").attr("src",photo);
	}else{
		page.find("img[name=PHOTO_ID]").attr("src","image/default.png");
	}
	//返回
	var back = page.find("button[name=warrantView_back_list]");
	back.click(function(){
		newOpenTab("warrantStorage","权证入库","ppe/warrantManager/warrantStorage/warrantStorage_queryList.html");
	});
	
}