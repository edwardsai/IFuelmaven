
/**
 * 模态框界面初始化
 */
function myModal_warrantroomMapInit(assetType,item){
	var modal = $("#myModal_warr");
	var currLocation = modal.find("li[class=tabBtn]");
	function getCurrLocation(){
		var str = "";
			str += (currSelectLocation.storagePlaceName?currSelectLocation.storagePlaceName:"")+"&nbsp;&nbsp;";
			str += (currSelectLocation.floorName?currSelectLocation.floorName:"")+"&nbsp;&nbsp;";
			str += (currSelectLocation.machineRoomName?currSelectLocation.machineRoomName:"")+"&nbsp;&nbsp;";
			str += (currSelectLocation.cabinetNum?currSelectLocation.cabinetNum:"")+"文件柜&nbsp;&nbsp;第";
			str += (currSelectLocation.layer?currSelectLocation.layer:"")+"柜位";
		return str;
	}
	
	initVlidate($("#myModal_warr"));
	
	var isRefuse = false;
	$('div[sel=myModal_warrantroomMap]').on('hide.bs.modal', function () {
		$(this).find("button[sel=editFloor_warr]").text("选择柜位");
		if(isRefuse){
		} else {
			return false;
		}
	});
	
	$('div[sel=myModal_warrantroomMap]').find('button[sel=closseWarrantModal]').click(function(){
		isRefuse = true;
		if(item){
			currSelectLocation.cabinetNum = item.cabinetNum;
			currSelectLocation.layer = item.layer;
		} else {
			currSelectLocation.cabinetNum = null;
			currSelectLocation.layer = null;
		}
		$('div[sel=myModal_warrantroomMap]').modal("hide");
	});
	
	modal.find("button[sel=sureAddress_warr]").click(function(){
		if(isRefuse||(currSelectLocation.layer&&currSelectLocation.cabinetNum)){
			var page = $("#warrantAreaRoom_info");
			page.find("input[name='wart.STORAGEPLACENAME']").val(currSelectLocation.storagePlaceName);
			page.find("input[name='wart.AREA']").val(currSelectLocation.storagePlace);
			page.find("input[name='wart.FLOOR']").val(currSelectLocation.floor);
			page.find("input[name='wart.FLOORNAME']").val(currSelectLocation.floorName);
			page.find("input[name='wart.MACHINE_ROOM']").val(currSelectLocation.machineRoom);
			page.find("input[name='wart.MACHINEROOMNAME']").val(currSelectLocation.machineRoomName);
			/*page.find("input[name=areaName]").val(currSelectLocation.areaName);
			page.find("input[name=area]").val(currSelectLocation.area);*/
			page.find("input[name='wart.CAB_NUM']").val(currSelectLocation.cabinet);
			page.find("input[name='wart.CABINETNUM']").val(currSelectLocation.cabinetNum);
			page.find("input[name='wart.LAYER']").val(currSelectLocation.layer);
			modal.modal("hide");
		} else {
			alert("请选择文件柜及柜位");
		}
		//page.find("input[name=layeCode");
	});
	
	modal.find("select").select2();
	var edificeObj=modal.find("select[sel=workplace_edifice]");
	var floorObj=modal.find("select[sel=workplace_floor]");
	var areaObj=modal.find("select[sel=workplace_area]");
	//处理回显
	var areaData = null;
	var defV = null;
	if(currSelectLocation&&currSelectLocation.storagePlace){
		defV = currSelectLocation.storagePlace;
		initSelect(floorObj, {value:"ITEM_CODE",text:"ITEM_NAME"},{type:"floor",store_p_id:currSelectLocation.dfV, dic_code:(new Date()).getTime()}, currSelectLocation.floor, "WarrantStorage/findCabinetsMapSelectInfo.asp", null);
		var dic_code = (new Date()).getTime();
		$.post("WarrantStorage/findCabinetsMapSelectInfo.asp",{type:"area",store_p_id:currSelectLocation.floor, dic_code:dic_code},function(data){
			initSelectByData(areaObj,{value:"ITEM_CODE",text:"ITEM_NAME"},data,currSelectLocation.machineRoom);
			if (assetType=='0104') {
				initArea(data, currSelectLocation.machineRoom);
			}
			areaData = data;
		},"json");
		currLocation.html("当前选择位置："+getCurrLocation());
		//initSelect(, {value:"ITEM_CODE",text:"ITEM_NAME"},{type:"area",store_p_id:currSelectLocation.floor, dic_code:dic_code}, , "", null);
	} else {
	}
	
	initSelect(edificeObj, {value:"ITEM_CODE",text:"ITEM_NAME"},{type:"edifice", dic_code:(new Date()).getTime()}, defV, "WarrantStorage/findCabinetsMapSelectInfo.asp", null);
	edificeObj.change( function() {
		currSelectLocation.storagePlace = edificeObj.val();
		currSelectLocation.storagePlaceName = edificeObj.find("option:selected").text();
		initSelect(floorObj, {value:"ITEM_CODE",text:"ITEM_NAME"},{type:"floor",store_p_id:edificeObj.val(), dic_code:(new Date()).getTime()}, null, "WarrantStorage/findCabinetsMapSelectInfo.asp", null);
	});
	floorObj.change(function(){
		areaData = null;
		var dic_code = (new Date()).getTime();
		currSelectLocation.floor = floorObj.val();
		currSelectLocation.floorName = floorObj.find("option:selected").text();
		initSelect(areaObj, {value:"ITEM_CODE",text:"ITEM_NAME"},{type:"area",store_p_id:floorObj.val(), dic_code:dic_code}, null, "WarrantStorage/findCabinetsMapSelectInfo.asp", null);
		areaData = globalSelectCache[dic_code].data;
	});
	areaObj.change(function(){
		if(assetType=="0104"){
			initArea(areaData);
		}
		currSelectLocation.machineRoom = areaObj.val();
		currSelectLocation.machineRoomName = areaObj.find("option:selected").text();
		//initXYpoin(data[0]["ITEM_CODE"],data[0]["STORE_X"],data[0]["STORE_Y"]);
		//initSeatStyle(data[0]["ITEM_CODE"]);
	});
	function initArea(areaDatad, itemc){
		var itemCode = itemc?itemc:areaObj.val();
		for(var i in areaDatad){
			var k = areaDatad[i];
			if(k.ITEM_CODE==itemCode){
				initXYpoin(k, k.STORE_X, k.STORE_Y);
				break;
			}
		}
		initSeatStyle(itemCode);
		modal.find(".tabContListD").show();
	}
	/**
	 * 初始化 X、Y坐标
	 * @param store_id
	 * @param x
	 * @param y
	 */
	function initXYpoin(store_id,x,y){
		var objx=modal.find(".Xcoordinate");
		var xWidthYheight=modal.find(".stationDet");
		objx.empty();
		objx.css("width",90*x);
		xWidthYheight.css("width",90*x);
		for(var i=0;i<x;i++){
			objx.append('<li>'+(i+1)+'</li>');
		}
		var objy=modal.find(".Ycoordinate");
		objy.empty();
		for(i=0;i<y;i++){
			objy.append('<li>'+(i+1)+'</li>');
		}
		xWidthYheight.css("height",90*y);
		initSeatArea(store_id,x,y);
	}
	/**
	 * 根据x、y初始化机柜信息
	 * @param store_id 
	 * @param x
	 * @param y
	 */
	function initSeatArea(store_id,x,y){
		var seatObj=modal.find(".seatArea");
		seatObj.empty();
		for(var i=1;i<=y;i++){
			for(var j=1;j<=x;j++){
				seatObj.append('<li id="seat'+j+"_"+i+'" store_id="'+store_id.ITEM_CODE+'" x="'+j+'" y="'+i+'"><div class="sta-layer"><i></i><span class="sta1"></span></div></li>');
			}
		}
		initSeatEvent();
	}
	/**
	 * 机柜统计
	 */
	function cabinetCount(){
		var newCabinet=getCurrentPageObj().find("#stationDet_edit").find(".hasStation").not(".hasStationed").length;
		var leaveCabinet=getCurrentPageObj().find("#stationDet_edit").find(".marginStation").length;
		var fullCabinet=getCurrentPageObj().find("#stationDet_edit").find(".hasStationed").not(".marginStation").length;
		getCurrentPageObj().find(".editTabContListD").find(".psArea").html(
				"全新文件柜("+newCabinet+")：<i class='UNusedICON'></i>"+
				"余量文件柜("+leaveCabinet+")：<i class='marginusedICON'></i>"+
				"已满文件柜("+fullCabinet+")：<i class='usedICON'></i>");
	}
	/**
	 * 初始化工位事件
	 */
	function initSeatEvent(){
		var seatModal = $("div[sel=myModal_warrantroomMap]");
		var seatArea = modal.find(".seatArea").find("li");
		seatArea.unbind("click");
		seatArea.click(function(){//增加机柜
			seatModal.find("table[sel=cabinetInfo_table_warr]").show();
			seatModal.find("div[sel=warrCabinetInfo_floor_div]").hide();
			seatModal.find("input").val("");
			var obj=$(this);
			var coor_x=obj.attr("x");
			var coor_y=obj.attr("y");
			var cl=obj.attr("class");
			seatModal.find("input[name='cab_num']").removeAttr("disabled");
			if(cl){
				seatModal.find("input[name='cab_num']").attr("disabled","disabled");
				var params={coor_x:coor_x,coor_y:coor_y,store_id:modal.find("select[sel=workplace_area]").val()};
				$.post("cabinetsMap/queryWarrantOneCabinet.asp",params,function(data){
					if(data&&data.CABINET){
						 for(var k in data.CABINET) {
							 var k1=k.toLowerCase();
							$("input[name='" + k1 + "']").val(data.CABINET[k]);
						}
						 //清空层次信息
						seatModal.find("table[sel=cabinetInfo_floor_warr]").html("");
						createCabinetFloor(data.CABINET.TOTAL_CONTENT,data.CABINET.CAB_USE_RATIO, seatModal);
					}
					var uf = data.UFLOORS;
					if(uf&&uf.length>0){
						for(var i=0;i<uf.length;i++){
							var useF = uf[i];
							var floor=seatModal.find("#acabinetFloor_"+useF.UFLOOR_NUM);
							if(item==null||useF.ASSET_NAME!=item.assetName||item.cabinetNum!=data.CABINET.CAB_NUM){
								//floor.css("background","black");
								floor.addClass("notchange");
							}
							floor.addClass("chooseFloor");
						}
					}
					cabinetFloorCount(seatModal);
				},"json");
			}
			if(cl){
			seatModal.modal('show');
				$("input[name='coor_x']").val(coor_x);
				$("input[name='coor_y']").val(coor_y);
				initModalEvent_computerroomMapConfiguration(obj, seatModal);
			}
		});
		//鼠标悬浮事件
		cabinetInfoHover();
	}
	function initModalEvent_computerroomMapConfiguration(obj, seatModal){
		var savemm = $('div[sel=myModal_warrantroomMap]').find("button[sel=modal_save_warrantroomMapConfigration]");
		savemm.unbind();
		savemm.click(function(){
			var sfloorObj=seatModal.find("table[sel=cabinetInfo_floor_warr]").find(".chooseFloor").not(".notchange");
			if(sfloorObj&&sfloorObj.length>0){
				var str = "";
				for(var k = sfloorObj.length; k>0 ; k--){
					str += (str==""?"":",") + $(sfloorObj[k-1]).attr("f");
				}
				currSelectLocation.layer = str;
			}
			if(currSelectLocation.layer){
				isRefuse = true;
				currSelectLocation.cabinet = seatModal.find("input[name='cab_num']").val();
				currSelectLocation.cabinetNum = seatModal.find("input[name='cab_name']").val();
				currLocation.html("当前选择位置："+getCurrLocation());
				$('div[sel=myModal_warrantroomMap]').modal("hide");
			} else {
				alert("请选择文件柜层数");
			}
			
		});
	}
	/**
	 * 计算使用率
	 */
	function calculateUsedRate(obj){
		var objNum=$.trim($(obj).val());
		var ratio=$("input[name='CPTRMPCFG.cab_use_ratio']");
		if(!objNum){
			ratio.val('');
			return;
		}
		var reg =/^([0-9]*[1-9][0-9]*|[0]*)$/;
		objNum=objNum.replace(/^0+/,"0");
		if(objNum.length>1){
			objNum=objNum.replace(/^0+/,"");
		}
		$(obj).val(objNum);
		if(reg.test(objNum)){
			objNum=parseFloat(objNum);
			var rate;
			if(obj.name=='CPTRMPCFG.total_content'){
				var remain=parseFloat($.trim($("input[name='CPTRMPCFG.remain_content']").val()));
				if(remain){
					if(remain>objNum){
						alert("总容量应比剩余容量大！");
						$(obj).val('');
						ratio.val('');
						return;
					}
				}else{return;}
				rate=(Math.round((objNum-remain) / objNum * 10000) / 100.00 + "%");
			}else{
				var total=$.trim($("input[name='CPTRMPCFG.total_content']").val());
				if(objNum>total){
					alert("剩余容量应比总容量小！");
					$(obj).val('');
					ratio.val('');
					return;
				}
				rate=(Math.round((total-objNum) / total * 10000) / 100.00 + "%");
			}
			ratio.val(rate);
		}else{
			if(objNum){
				alert('"'+objNum+'"不是一个正整数。');
				$(obj).val('');
				ratio.val('');
			}
		}
	}
	/**
	 * 初始渲染机柜 样式 
	 * @param store_id
	 */
	function initSeatStyle(store_id){
		$.post("cabinetsMap/findExistWarrantCabinetsInfo.asp",{store_id:store_id},function(data){
			if(data){
				for(var i=0;i<data.length;i++){
					var seat=modal.find("#seat"+data[i]["COOR_X"]+"_"+data[i]["COOR_Y"]);
					seat.addClass("hasStation");
					if(data[i]["CAB_USE_RATIO"]!="0%"){
						seat.addClass("hasStationed");
						if(data[i]["CAB_USE_RATIO"]!="100%"){
							seat.addClass("marginStation");
						}
					}
				}
			}
			endLoading();
		}, "json");
	}
	function cabinetInfoHover(){
		modal.find("[store_id][x][y]").hover(function(){
			var obj=$(this);
			if(obj.hasClass("hasStation")){
				showWorkPlaceDetail(obj);
				jisuanXY(obj);
			}
		},function(){
			modal.find("div[sel=warr_info_detail]").hide();
		});
		//显示
		modal.find("div[sel=warr_info_detail]").hover(function(){
			
			modal.find("div[sel=warr_info_detail]").show();
		},function(){
			modal.find("div[sel=warr_info_detail]").hide();
		});
	}
	/**
	 * 显示详细的工位信息
	 * @param obj
	 */
	function showWorkPlaceDetail(obj){
		var table2 = modal.find("table[sel=warr_socket]");
		var table = modal.find("table[sel=assetList_warrantroomMapConfiguration]");
		var params=getWidByObj(obj);
		var x=0;
		$.post("cabinetsMap/hoverShowWarrantDetail.asp",params,function(data){
			if(data&&data.cabinetInfos){
				 for(var k in data.cabinetInfos) {
					 var k1=k.toLowerCase();
					 table2.find("td[name='CPTRMPCFGG." + k1 + "']").html(data.cabinetInfos[k]);
				}
				 var workplace_area = modal.find("select[sel=workplace_area]").select2('data');
				 //table.html(workplace_area[0].text);
				x++;
			}
			if(data){
				table.show();
				table.html("");
				var assetInfoStr='<tr style="font-weight:bolder;"><td>序号</td>'+
					'<td>权证编码</td><td>押品编号</td><td>押品名称</td><td>状态</td></tr>';
				table.append(assetInfoStr);
				if(data.assetInfos.length>0){
					for(var i=1;i<=data.assetInfos.length;i++){
						var asset=data.assetInfos[i-1];
						assetInfoStr='<tr><td>'+i+'</td><td>'+asset.WARRANT_NO+
						'</td><td>'+asset.GUARANTEE_ID+'</td><td>'+asset.GUARANTEE_NAME+'</td><td>'+(asset.STATUS?asset.STATUS:"")+'</td></tr>';
						table.append(assetInfoStr);
					};
				}
			}
			if(x>0){
				modal.find("div[sel=warr_info_detail]").show();
			};
		},"json");
	}
	function jisuanXY(obj){
		var b_height=$("body:eq(0)").height();
		var offset=obj.offset();
		var scrollTop=$("#myModal_warr").scrollTop();
		var detailObj=modal.find("div[sel=warr_info_detail]");
		if(offset.top+detailObj.height()+obj.height()-b_height>0){
			detailObj.addClass("popLayer-bottom");
			detailObj.css({left:offset.left-$("#myModal_warr").offset().left,top:offset.top-detailObj.height()+43-obj.height()+scrollTop});
		}else{
			detailObj.removeClass("popLayer-bottom");
			detailObj.css({left:offset.left-$("#myModal_warr").offset().left,top:offset.top+28+scrollTop});
		};
	}
	/**
	 * 根据对象获取机柜坐标
	 * @param obj
	 * @returns
	 */
	function getWidByObj(obj){
		var coor_x=obj.attr("x");
		var coor_y=obj.attr("y");
		var store_id=obj.attr("store_id");
		var params={coor_x:coor_x,coor_y:coor_y,store_id:store_id};
		return params;
	}

	/*机柜层次*/
	$(function(){
		var seatModal = $("div[sel=myModal_warrantroomMap]");
		var floorObj = seatModal.find("button[sel=editFloor_warr]");
		floorObj.unbind();
		floorObj.click(function(){
			var seatModal = $("div[sel=myModal_warrantroomMap]");
			if(floorObj.html()=="选择柜位"){
				$("table[sel=cabinetInfo_table_warr]").hide();
				seatModal.find("div[sel=warrCabinetInfo_floor_div]").show();
				floorObj.html("查看信息");
				floorEvent(seatModal);
			}else{
				$("table[sel=cabinetInfo_table_warr]").show();
				seatModal.find("div[sel=warrCabinetInfo_floor_div]").hide();
				floorObj.html("选择柜位");
			}
		});
	});
	function floorEvent(seatModal){
		var floor=seatModal.find("table[sel=cabinetInfo_floor_warr]").find(".floorTr");
		floor.unbind();
		floor.click(function(){
			if($(this).hasClass("notchange")){
				return ;
			}
			var obj=$(this);
			if(!obj.hasClass("chooseFloor")){
				obj.addClass("chooseFloor");
			}else{
				obj.removeClass("chooseFloor");
			}
			cabinetFloorCount(seatModal);
		});
	}
	/**
	 * 创建机柜层次
	 * @param obj
	 */
	function createCabinetFloor(obj,a, seatModal){
		var objNum;
		if(isNaN(obj)){//不是数字为对象(前端this)
			objNum=$.trim($(obj).val());
		}else{//是一个数字
			objNum=obj;
		}
		if((objNum!=""&&!/^([0-4]?\d{1}|50)$/g.test(objNum))){
			return;
		}
		var b=a;
		//存储重建前已满的层次
		var bfFloor="";
		var floorObj=seatModal.find("table[sel=cabinetInfo_floor_warr] .chooseFloor");
		if(floorObj&&floorObj.length>0){
			for(var i=0;i<floorObj.length;i++){
				bfFloor=bfFloor+$(floorObj[i]).attr("f")+",";
			}
			bfFloor.substring(0,bfFloor.length-1);
		}
		seatModal.find("table[sel=cabinetInfo_floor_warr]").html("");
		for(var i=1;i<=objNum;i++){
			var num=objNum-i+1;
			/*var str="<tr id='acabinetFloor_"+num+"' f='"+num+"' class='nav-menu floorTr'><td>第"+num+"层</td></tr>";*/
			var str="<tr id='acabinetFloor_"+num+"'f='"+num+"' class='nav-menu-rotate floorTr'><td>" +
				"<a href='#' class='three-d-rotate'> 文件柜"+ 
			    "<span class='three-d-box-rotate'>"+
			    "<span class='front-rotate'>第"+num+"柜位</span>"+
			    "<span class='back-rotate'>存放物品清单</span>"+
			    "</span></a></td></tr>";
			seatModal.find("table[sel=cabinetInfo_floor_warr]").append(str);
		}
		//渲染重建前已满的层次
		if(bfFloor){
			var times=bfFloor.split(",");
			for (var i=0;i<times.length;i++){
				var floor=modal.find("#acabinetFloor_"+times[i]);
				floor.empty();
				floor.addClass("chooseFloor");
			}
		}
		if(b=="0%"){
			cabinetFloorCount(seatModal);
		}else{
			if(currSelectLocation.layer){
				var layers = currSelectLocation.layer.split(",");
				for(var k in layers){
					var floor=seatModal.find("#acabinetFloor_"+layers[k]).not("notchange");
					floor.addClass("chooseFloor");
					if(!floor.has("notchange")){
					}
				}
			}
			cabinetFloorCount(seatModal);
		}
		
		/****/
		//点击效果代码
		/*for(var i=1;i<=objNum;i++){
			var num=objNum-i+1;
			var str="<div class='example radio'><p  class='floorTr turnBoxButton'>第"+num+"层</p><p class='turnBoxButton turnBoxButtonPrev'>第"+num+"层：交换机、路由</p></div>";
			seatModal.find("table[sel=cabinetInfo_floor]").append(str);
		}
		var duration = 200;
	    var radio = $(".example.radio");
	    var check_box = $(".example.check");
	    radio.turnBox({
	    	duration: duration
	    });
	    $.each(radio.parent().children(".radio"), function(key){
		    var self = this;
		    $(radio).find(".turnBoxButton").on("click", function(){
		    	radio.parent().children(".radio").not(self).turnBoxAnimate();
		    });
	    });
	    radio.turnBoxAnimate({
	    	duration: duration
	    });
	    $(radio.parent().children(".radio")[0]).turnBoxAnimate({
			face: 2,
			animation: false
	    });
	    check_box.turnBox({
	    	duration: duration
	    });*/
	    /*menu.turnBox(
	    {
	      duration: duration
	    });*/
		/****/
		
	}
	/**
	 * 层次统计
	 */
	function cabinetFloorCount(seatModal){
		var emptyFloor=seatModal.find(".floorTr").not(".chooseFloor");
		var enoughFloor=seatModal.find(".chooseFloor");
		seatModal.find(".floorContent").html(
				'空('+emptyFloor.length+')：<i class="emptyFloor"></i><br/>'+
				'满('+enoughFloor.length+')：<i class="enoughFloor"></i>');
	}

}
