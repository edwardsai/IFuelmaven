var currSelectLocation = new Object();
function initWarrantStorageAdd(params){
	var page = $("#warrantAreaRoom_info");
	var storage_type = params['STORAGE_TYPE'];
	for ( var k in params) { 
		  $("span[name='WS." + k + "']").html(params[k]);
		  $("input[name='wart.TAG_ID']").val(params.TAG_ID);
	}
	page.find("input[name=TAG_ID]").val(params['TAG_ID']);
	page.find("img[name=PHOTO_ID]").attr("src",params['PHOTO_ID']);
	
	var makeTag_id = page.find("button[name=makeTag_id]");
	if(storage_type=='02'){//借阅归还
		makeTag_id.hide();
	}else{
		makeTag_id.show();
	}
	if(storage_type=='01'){//借出归还
		page.find("#notag_id").hide();
		page.find("#ntag_id").hide();
	}else{
		page.find("#t_tag_id").hide();
		page.find("#tag_id").hide();
	}
	//信息不符合打回
	var returnInfo = page.find("button[name=returnInfo]");
	returnInfo.click(function(){
		var myModal = $("#myModal_warrantStorage");
		initVlidate(myModal);
		myModal.modal('show');
	});
	
	//模态框打回按钮
	$("#beatStorage").click(function(){
		if(!vlidate($("#myModal_warrantStorage"),"",true)){
			 return;
		 }
		params['RETURN_REASON'] = $("#WS_RETURN_REASON").val();
		baseAjax("WarrantStorage/beatWarrantStorage.asp",params, function(data) {
			if (data != undefined && data != null) {
				if(data.result=="true"){
					$("#myModal_warrantStorage").modal('hide');
					alert("打回成功！");
					newOpenTab("warrantStorage","权证入库","ppe/warrantManager/warrantStorage/warrantStorage_queryList.html");
				}
			}else{
				alert("未知错误！");
			}
		},true);
	});
	
	//信息确认
	var confirmInfo = page.find("button[name=confirmInfo]");
	confirmInfo.click(function(){
		var table =  page.find("#WarrantStorageTable");
		table.show();//入库登记信息显示
		initVlidate(table);
		page.find("#baseInfo").hide();//隐藏基本信息
	});
	
	//上一步
	var before = page.find("button[name=before]");
	before.click(function(){
		var baseInfo =  page.find("#baseInfo");
		baseInfo.show();//基本信息显示
		page.find("#WarrantStorageTable").hide();//入库登记信息隐藏
	});
	
	//返回
	var back = page.find("button[name=warrantAdd_back_list]");
	back.click(function(){
		newOpenTab("warrantStorage","权证入库","ppe/warrantManager/warrantStorage/warrantStorage_queryList.html");
	});
	//选择存放地址
	page.find("button[sel='openWinWar']").click(function(){
		openWinWar();
	});
	function openWinWar(){
		var assetType='0104';
		$.post("ppe/warrantManager/warrantInfoAndExchange/warrantroomMapConfiguration.html", function(data){
			var str = '<div class="modal-header">'
				+'<button type="button" class="close" data-dismiss="modal" title="点击关闭aa">×</button>'
				+'<h5 id="myModalLabel">选择存放位置</h5></div>';
			$("#myModal_warr").append(str + data);
			$("#myModal_warr").modal("show");
			myModal_warrantroomMapInit(assetType,null);
		});
		$("#myModal_warr").on('hide.bs.modal', function () {
			currSelectLocation = new Object();
		});
	}
	$('#myModal_warr').on('hide.bs.modal', function () {
		$("#myModal_warr").children().remove();
	});
	
	
	//制作新标签
	makeTag_id.click(function(){
		var tag_id = page.find("input[name='wart.TAG_ID']");
		var org =$("#main_user_name").attr("org_no");
		tag_id.val(returnSerialNumber2("BQ",org, "WRT_SEQ_WARRANT_TAGID"));
	});
	//入库
	var save = page.find("button[name=warrantStorage_save]");
	save.click(function(){
		if(!vlidate(page.find("#WarrantStorageTable"),"",true)){
			 return;
		 }
		var inputs = $("input[name^='wart.']");
		for (var i = 0; i < inputs.length; i++) {
			params[$(inputs[i]).attr("name").substr(5)] = $(inputs[i]).val(); 
		}
		baseAjax("WarrantStorage/saveWarrantStorage.asp",params, function(data) {
			if (data != undefined && data != null) {
				if(data.result=="true"){
					alert("入库成功！");
					newOpenTab("warrantStorage","权证入库","ppe/warrantManager/warrantStorage/warrantStorage_queryList.html");
				}
				if(data.result=="right"){
					alert("该物品在库存表中未存在，不能进行借出归还或借阅归还操作！");
				}
			}else{
				alert("未知错误！");
			}
		},true);
	});
}