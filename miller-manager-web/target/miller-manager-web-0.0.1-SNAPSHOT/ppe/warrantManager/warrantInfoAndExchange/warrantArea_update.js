var currSelectLocation = new Object();
function initnewUpdateWarrantAreaEvent(params){
	var currTab = getCurrentPageObj();//当前页
	//赋值
	for(var k in params){
		currTab.find("input[name='wart."+k+"']").val(params[k]);
	}
	initVlidate($("#warrantArea_info"));
	//返回
	currTab.find("#backTo_warrantList").click(function(){
		newOpenTab("backWarrantToList", "返回", "ppe/warrantManager/warrantInfoAndExchange/warrantInfoAndExchange_queryList.html");
	});
	//选择区域
	currTab.find("button[sel='openWinWar']").click(function(){
		openWinWar();
	});
	function openWinWar(){
		//初始化当前地址对象
		if(params){
			currSelectLocation.storagePlace = params.AREA;
			currSelectLocation.storagePlaceName = params.STORAGEPLACENAME;
			currSelectLocation.floor = params.FLOOR;
			currSelectLocation.floorName = params.FLOORNAME;
			currSelectLocation.machineRoom = params.MACHINE_ROOM;
			currSelectLocation.machineRoomName = params.MACHINEROOMNAME;
			currSelectLocation.cabinet = params.CAB_NUM;
			currSelectLocation.cabinetNum = params.CABINETNUM;
			currSelectLocation.layer = params.LAYER;
		}
		var assetType='0104';
		$.post("ppe/warrantManager/warrantInfoAndExchange/warrantroomMapConfiguration.html", function(data){
			var str = '<div class="modal-header">'
				+'<button type="button" class="close" data-dismiss="modal" title="点击关闭aa">×</button>'
				+'<h5 id="myModalLabel">选择存放位置</h5></div>';
			$("#myModal_warr").append(str + data);
			$("#myModal_warr").modal("show");
			myModal_warrantroomMapInit(assetType,params);
		});
		$("#myModal_warr").on('hide.bs.modal', function () {
			currSelectLocation = new Object();
		});
	}
	$('#myModal_warr').on('hide.bs.modal', function () {
		$("#myModal_warr").children().remove();
	});
	//存放位置变更
	currTab.find("#save_warrantArea").click(function(){
		//验证
		var item={};
		//变更后
		item['AREA']=currTab.find("input[name='wart.AREA']").val();
		item['STORAGEPLACENAME']=currTab.find("input[name='wart.STORAGEPLACENAME']").val();
		item['WARRANT_NO']=currTab.find("input[name='wart.WARRANT_NO']").val();
		item['FLOOR']=currTab.find("input[name='wart.FLOOR']").val();
		item['FLOORNAME']=currTab.find("input[name='wart.FLOORNAME']").val();
		item['MACHINE_ROOM']=currTab.find("input[name='wart.MACHINE_ROOM']").val();
		item['MACHINEROOMNAME']=currTab.find("input[name='wart.MACHINEROOMNAME']").val();
		item['CAB_NUM']=currTab.find("input[name='wart.CAB_NUM']").val();
		item['LAYER']=currTab.find("input[name='wart.LAYER']").val();
		item['CABINETNUM']=currTab.find("input[name='wart.CABINETNUM']").val();
		//变更前
		item['OLDSTORAGEPLACENAME']=params.STORAGEPLACENAME;
		item['OLDFLOORNAME']=params.FLOORNAME;
		item['OLDMACHINEROOMNAME']=params.MACHINEROOMNAME;
		item['OLDCABINETNUM']=params.CAB_NUM;
		item['OLDLAYER']=params.LAYER;
		item['SERNO']=params.SERNO;
		baseAjax("warrantInfoAndExchange/updateWarrantArea.asp", item, function(data){
			if (data!=undefined && data!=null) {
				if(data.result=="true"){
					alert("修改成功");
					newOpenTab("backWarrantBefore", "返回", "ppe/warrantManager/warrantInfoAndExchange/warrantInfoAndExchange_queryList.html");
				}
			}else {
				alert("修改失败");
		}
	});	
	});
}