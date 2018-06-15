//初始化字段信息
function initBarCodeSelect(asset_type){	
	$("#notChooseBarList").empty();
	$("#chooseBarList").empty();
	baseAjax("barcode/findAssetTypeNoCode.asp",{asset_type:asset_type},function(data){
		if(data){	
			if(data.notin&&data.notin.length>0) {
				for(var i=0;i<data.notin.length;i++){
					$("#notChooseBarList").append('<li value="'+data.notin[i].ITEM_CODE+'">'+data.notin[i].ITEM_NAME+'</li>');
				}
			}
			if(data.ining&&data.ining.length>0) {
			for ( var j = 0; j < data.ining.length; j++) {
				$("#chooseBarList").append('<li value="'+data.ining[j].ITEM_CODE+'">'+data.ining[j].ITEM_NAME+'</li>');
			}
		}
			saveOrder();
	}
	},false);
	$("#addAssetCode").unbind("click");
	$("#addAssetCode").click(function(){
		var options=$("#chooseBarList li");
		var param={asset_type:asset_type,field_nos:""};
		if(options!=undefined){
			var field_no="0"+$(options[0]).val();
			for(var i=1;i<options.length;i++){
				field_no=field_no+","+("0"+$(options[i]).val());
			}
			param["field_nos"]=field_no;
		}
		baseAjax("barcode/addAssetCode.asp",param,function(data){
			if(data!=undefined&&data.result=="true"){
				
				alert("保存成功");
			}else{
				alert("保存失败");
			}
		},false);
	});
	
}
function initAssetRoleTree(){
	$("#chooseBarList").empty();
	$("#notChooseBarList").empty();
	var setting = {
			async : {
				enable : true,
				url : "propertyTypeConfig/queryAllCategroy.asp",
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
					
					initBarCodeSelect(treeNode.id);
				}
			}
	};
	$.fn.zTree.init($("#treeAssetRole"), setting);
}


$("#dragSortSelect #chooseBarList, #dragSortSelect #notChooseBarList").sortable({
    connectWith: ".connectedSortable",
    stop: function (event, ui) {
    	saveOrder();
    }
}).disableSelection();

function saveOrder() {
	var data = $("#dragSortSelect #chooseBarList li").map(function() { return $(this).html(); }).get();
	$("textarea[name=chooseBarListSortOrder]").val(data.join("+"));
};
saveOrder();
initAssetRoleTree();
