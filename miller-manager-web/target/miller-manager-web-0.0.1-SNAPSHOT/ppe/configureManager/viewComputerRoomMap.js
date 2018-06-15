/**
 * 统一ajax 调用 做公共处理
 * @param url
 * @param param
 * @param callback
 * @param async
 */
function baseAjax_view(url, param, callback, async) {
		$.ajax({
			type : "post",
			url : url,
			async : async == undefined ? true : false,
			data : param,
			dataType : "json",
			success : function(msg) {
				callback(msg);
				cabinetCount_view();
			},
			error : function() {
				callback();
			}
		});
	}
/**
 * 下拉框级联 
 */
$(function(){
	startLoading();
	getCurrentPageObj().find("select").select2();
	var edificeObj=getCurrentPageObj().find("#workplace_edifice_view");
	baseAjax_view("cabinetsMap/findCabinetsMapSelectInfo.asp",{type:"edifice"},function(data){
		selectAppendByData(edificeObj,{value:"ITEM_CODE",text:"ITEM_NAME"},data,data[0]["ITEM_CODE"]);
		initfloorSelect_view(data[0]["ITEM_CODE"]);
	});
	edificeObj.change( function() {
		initfloorSelect_view($(this).val());
	});
});
/**
 * 初始化楼层下拉
 * @param store_p_id
 */
function initfloorSelect_view(store_p_id){
	var floorObj=getCurrentPageObj().find("#workplace_floor_view");
	floorObj.empty();
	//查询楼层信息 
	baseAjax_view("cabinetsMap/findCabinetsMapSelectInfo.asp",{type:"floor",store_p_id:store_p_id},function(data){
		floorObj.data("data",data);
		selectAppendByData(floorObj,{value:"ITEM_CODE",text:"ITEM_NAME"},data,data[0]["ITEM_CODE"]);
		showFloorWorkPlaceImg_view(data[0]["STORE_FILED"]);
		showAreaSelect_view(data[0]["ITEM_CODE"]);
	});
	floorObj.unbind("change");
	floorObj.change(function() {
		removeFloorImgSuccess_view();
		var val=floorObj.val();
		var data=floorObj.data("data");
		for(var i=0;i<data.length;i++){
			if(data[i]["ITEM_CODE"]==val){
				showFloorWorkPlaceImg_view(data[i]["STORE_FILED"]);
				showAreaSelect_view(data[i]["ITEM_CODE"]);
				break;
			}
		}
	});
}
/**
 * 初始化 区域下拉 信息 
 * @param store_p_id
 */
function showAreaSelect_view(store_p_id){
	endLoading();
	startLoading();
	var areaObj=getCurrentPageObj().find("#workplace_area_view");
	areaObj.empty();
	baseAjax_view("cabinetsMap/findCabinetsMapSelectInfo.asp",{type:"area",store_p_id:store_p_id},function(data){
		$("#Viewworkplace_id").val(data[0]["AREA_TYPE"]);
		try{
			areaObj.data("data",data);
			selectAppendByData(areaObj,{value:"ITEM_CODE",text:"ITEM_NAME"},data,data[0]["ITEM_CODE"]);
			initXYpoin_view(data[0]["ITEM_CODE"],data[0]["STORE_X"],data[0]["STORE_Y"]);
			initSeatStyle_view(data[0]["ITEM_CODE"]);
		}catch(e){
			endLoading();
		}
	});
	areaObj.unbind("change");
	areaObj.change(function(){
		startLoading();
		try{
			var val=areaObj.val();
			var data=areaObj.data("data");
			for(var i=0;i<data.length;i++){
				if(data[i]["ITEM_CODE"]==val){
					$("#Viewworkplace_id").val(data[i]["AREA_TYPE"]);
					initXYpoin_view(val,data[i]["STORE_X"],data[i]["STORE_Y"]);
					break;
				}
			}
			initSeatStyle_view(val);
		}catch(e){
			endLoading();
		}
	});
}
/**
 * 初始化 X、Y坐标
 * @param store_id
 * @param x
 * @param y
 */
function initXYpoin_view(store_id,x,y){
	var objx=getCurrentPageObj().find("#Xcoordinate_view");
	var xWidthYheight=getCurrentPageObj().find("#stationDet_view");
	objx.empty();
	objx.css("width",90*x);
	xWidthYheight.css("width",90*x);
	for(var i=0;i<x;i++){
		objx.append('<li>'+(i+1)+'</li>');
	}
	var objy=getCurrentPageObj().find("#Ycoordinate_view");
	objy.empty();
	for(i=0;i<y;i++){
		objy.append('<li>'+(i+1)+'</li>');
	}
	xWidthYheight.css("height",90*y);
	initSeatArea_view(store_id,x,y);
}
/**
 * 根据x、y初始化机柜信息
 * @param store_id 
 * @param x
 * @param y
 */
function initSeatArea_view(store_id,x,y){
	var seatObj=getCurrentPageObj().find("#stationDet_view").find(".seatArea");
	seatObj.empty();
	for(var i=1;i<=y;i++){
		for(var j=1;j<=x;j++){
			seatObj.append('<li id="view_seat'+j+"_"+i+'" store_id="'+store_id+'" x="'+j+'" y="'+i+'"></li>');
		}
	}
	initSeatEvent_view();
}
/**
 * 机柜统计
 */
function cabinetCount_view(){
	var area_type=$("#Viewworkplace_id").val();
	if (area_type=='01') {
		var newCabinet=getCurrentPageObj().find("#stationDet_view").find(".hasStation").not(".hasStationed").length;
		var leaveCabinet=getCurrentPageObj().find("#stationDet_view").find(".marginStation").length;
		var fullCabinet=getCurrentPageObj().find("#stationDet_view").find(".hasStationed").not(".marginStation").length;
		getCurrentPageObj().find(".viewTabContListD").find(".psArea").html(
				"全新机柜("+newCabinet+")：<i class='UNusedICON'></i>"+
				"余量机柜("+leaveCabinet+")：<i class='marginusedICON'></i>"+
				"已满机柜("+fullCabinet+")：<i class='usedICON'></i>");
	} else if(area_type=='03') {
		var newCabinet=getCurrentPageObj().find("#stationDet_view").find(".hasStation").not(".hasStationed").length;
		var leaveCabinet=getCurrentPageObj().find("#stationDet_view").find(".marginStation").length;
		var fullCabinet=getCurrentPageObj().find("#stationDet_view").find(".hasStationed").not(".marginStation").length;
		getCurrentPageObj().find(".viewTabContListD").find(".psArea").html(
				"全新文件柜("+newCabinet+")：<i class='UNusedICON'></i>"+
				"余量文件柜("+leaveCabinet+")：<i class='marginusedICON'></i>"+
				"已满文件柜("+fullCabinet+")：<i class='usedICON'></i>");
	}
	
}
/**
 * 初始化工位事件
 */
function initSeatEvent_view(){
	var seatAreaA=getCurrentPageObj().find("#stationDet_view").find(".seatArea").find("li");
	$("#cabinetInfo_table_view input").attr("disabled","disabled");
	seatAreaA.unbind("click");
	seatAreaA.click(function(){
		var area_type=$("#Viewworkplace_id").val();
		if(!$(this).hasClass("hasStation")){
			return;
		}
		$("#cabinetInfo_table_view").show();
		$("#cabinetInfo_floor_div_view").hide();
		var obj=$(this);
		var coor_x=obj.attr("x");
		var coor_y=obj.attr("y");
		var cl=obj.attr("class");
		if (cl) {
			$("#editFloor_view").html("占用信息");
			var params={coor_x:coor_x,coor_y:coor_y,store_id:getCurrentPageObj().find("#workplace_area_view").val()};
			
			if (area_type=='01') {
				baseAjax_view("cabinetsMap/queryOneCabinet.asp",params,function(data){
					if(data&&data.CABINET){
						 for(var k in data.CABINET) {
							 var k1=k.toLowerCase();
							$("input[name='CPTRMPCFGV." + k1 + "']").val(data.CABINET[k]);
						}
						createCabinetFloor_view(data.CABINET.TOTAL_CONTENT);
					}
					if(data.UFLOORS&&data.UFLOORS.length>0){
						for(var i=0;i<data.UFLOORS.length;i++){
							var floor=getCurrentPageObj().find("#cabinetFloor_view_"+data.UFLOORS[i]["UFLOOR_NUM"]);
							floor.removeClass("turnBoxFaceNum1");
							floor.addClass("turnBoxFaceNum2");
							floor.html("第"+data.UFLOORS[i]["UFLOOR_NUM"]+"U："+data.UFLOORS[i]["ASSET_NAME"]);
						}
					}
					cabinetFloorCount_view();
				});
			}else if(area_type=='03'){
				baseAjax_view("cabinetsMap/queryWarrantOneCabinet.asp",params,function(data){
					if(data&&data.CABINET){
						 for(var k in data.CABINET) {
							 var k1=k.toLowerCase();
							$("input[name='CPTRMPCFGV." + k1 + "']").val(data.CABINET[k]);
						}
						createCabinetFloor_view(data.CABINET.TOTAL_CONTENT);
					}
					if(data.UFLOORS&&data.UFLOORS.length>0){
						for(var i=0;i<data.UFLOORS.length;i++){
							var floor=getCurrentPageObj().find("#cabinetFloor_view_"+data.UFLOORS[i]["UFLOOR_NUM"]);
							floor.removeClass("turnBoxFaceNum1");
							floor.addClass("turnBoxFaceNum2");
							floor.html("第"+data.UFLOORS[i]["UFLOOR_NUM"]+"柜位："+data.UFLOORS[i]["WARRANT_NO"]);
						}
					}
					cabinetFloorCount_view();
				});
			}
		}
		
		if (area_type=="01") {
			$('#myModal_computerroomMapConfiguration_view').modal('show');
		}else if (area_type=="03") {
			getCurrentPageObj().find("#jg_view").html("文件柜详情");
			getCurrentPageObj().find("span[sel='jg_viewnum']").html("文件柜编号：");
			getCurrentPageObj().find("span[sel='jg_viewname']").html("文件柜名称：");
			getCurrentPageObj().find("span[sel='jg_viewx']").html("文件柜X坐标：");
			getCurrentPageObj().find("span[sel='jg_viewy']").html("文件柜Y坐标：");
			getCurrentPageObj().find("span[sel='jg_viewprow']").html("总容量：");
			getCurrentPageObj().find("span[sel='jg_viewlastpro']").html("剩余容量：");
			$('#myModal_computerroomMapConfiguration_view').modal('show');
		}
		$("input[name='CPTRMPCFGV.coor_x']").val(coor_x);
		$("input[name='CPTRMPCFGV.coor_y']").val(coor_y);
	});
	//鼠标悬浮事件
	cabinetInfoHover_view();
}
/**
 * 初始渲染机柜 样式 
 * @param store_id
 */
function initSeatStyle_view(store_id){
	var area_type=$("#Viewworkplace_id").val();
	if (area_type=='01') {
		baseAjax_view("cabinetsMap/findExistCabinetsInfo.asp",{store_id:store_id},function(data){
			if(data){
				for(var i=0;i<data.length;i++){
					var seat=getCurrentPageObj().find("#stationDet_view").find("#view_seat"+data[i]["COOR_X"]+"_"+data[i]["COOR_Y"]);
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
		});
	}else if(area_type=='03'){
		baseAjax_view("cabinetsMap/findExistWarrantCabinetsInfo.asp",{store_id:store_id},function(data){
			if(data){
				for(var i=0;i<data.length;i++){
					var seat=getCurrentPageObj().find("#stationDet_view").find("#view_seat"+data[i]["COOR_X"]+"_"+data[i]["COOR_Y"]);
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
		});
	}
	
}
function cabinetInfoHover_view(){
	getCurrentPageObj().find("#stationDet_view").find("[store_id][x][y]").hover(
	function(){
		var obj=$(this);
		if(obj.hasClass("hasStation")){
			showWorkPlaceDetail_view(obj);
			jisuanXY_view(obj);
		}
	},function(){
		getCurrentPageObj().find("#wp_info_detail_view").hide();
	});
	var area_type=$("#Viewworkplace_id").val();
	/*显示*/
	if (area_type=='01') {
		getCurrentPageObj().find("#wp_info_detail_view").hover(function(){
			getCurrentPageObj().find("#wp_info_detail_view").show();
		},function(){
			getCurrentPageObj().find("#wp_info_detail_view").hide();
		});
	}else if (area_type='03') {
		getCurrentPageObj().find("span[cel='jg_cag_id']").html("文件柜编号：");
		getCurrentPageObj().find("span[cel='jg_cag_area']").html("文件柜区域：");
		getCurrentPageObj().find("span[cel='jg_cag_name']").html("文件柜名称：");
		getCurrentPageObj().find("span[cel='jg_cag_count']").html("总容量：");
		getCurrentPageObj().find("span[cel='jg_cag_last']").html("剩余容量：");
		getCurrentPageObj().find("#wp_info_detail_view").hover(function(){
			getCurrentPageObj().find("#wp_info_detail_view").show();
		},function(){
			getCurrentPageObj().find("#wp_info_detail_view").hide();
		});
	}
}
/**
 * 显示详细的工位信息
 * @param obj
 */
function showWorkPlaceDetail_view(obj){
	var area_type=$("#Viewworkplace_id").val();
	$("#assetList_computerroomMapConfiguration_view").hide();
	var params=getWidByObj_view(obj);
	var x=0;
	if (area_type=='01') {
		baseAjax_view("cabinetsMap/hoverShowDetail.asp",params,function(data){
			if(data&&data.cabinetInfos){
				 for(var k in data.cabinetInfos) {
					 var k1=k.toLowerCase();
					$("td[name='CPTRMPCFGGV." + k1 + "']").html(data.cabinetInfos[k]);
				}
				 var workplace_area = $("#workplace_area_view").select2('data');
				 $("#cabinetArea_computerroomMapConfiguration_view").html(workplace_area[0].text);
				x++;
			}
			if(data&&data.assetInfos.length>0){
				$("#assetList_computerroomMapConfiguration_view").show();
				var assets=$("#assetList_computerroomMapConfiguration_view");
				assets.html("");
				var assetInfoStr='<tr style="font-weight:bolder;"><td>序号</td><td>U值序号</td>'+
					'<td>资产条形码编码</td><td>物品名称</td><td>资产状态</td></tr>';
				assets.append(assetInfoStr);
				for(var i=1;i<=data.assetInfos.length;i++){
					var asset=data.assetInfos[i-1];
					 assetInfoStr='<tr><td>'+i+'</td><td>第'+asset.UFLOOR_NUM+
					'U</td><td>'+asset.ASSET_NUM+'</td><td>'+asset.ASSET_NAME+
					'</td><td>'+asset.STATUS+'</td></tr>';
					assets.append(assetInfoStr);
				};
			}
			if(x>0){
				getCurrentPageObj().find("#wp_info_detail_view").show();
			};
		});
	}else if(area_type=='03'){
		baseAjax_view("cabinetsMap/hoverShowWarrantDetail.asp",params,function(data){
			if(data&&data.cabinetInfos){
				 for(var k in data.cabinetInfos) {
					 var k1=k.toLowerCase();
					$("td[name='CPTRMPCFGGV." + k1 + "']").html(data.cabinetInfos[k]);
				}
				 var workplace_area = $("#workplace_area_view").select2('data');
				 $("#cabinetArea_computerroomMapConfiguration_view").html(workplace_area[0].text);
				x++;
			}
			if(data&&data.assetInfos.length>0){
				$("#assetList_computerroomMapConfiguration_view").show();
				var assets=$("#assetList_computerroomMapConfiguration_view");
				assets.html("");
				var assetInfoStr='<tr style="font-weight:bolder;"><td>序号</td><td>柜位号</td>'+
					'<td>权证编码</td><td>押品编号</td><td>押品名称</td><td>权证状态</td></tr>';
				assets.append(assetInfoStr);
				for(var i=1;i<=data.assetInfos.length;i++){
					var asset=data.assetInfos[i-1];
					 assetInfoStr='<tr><td>'+i+'</td><td>第'+asset.UFLOOR_NUM+
					'柜位</td><td>'+asset.WARRANT_NO+'</td><td>'+asset.GUARANTEE_ID+'</td><td>'+asset.GUARANTEE_NAME+
					'</td><td>'+asset.STATUS+'</td></tr>';
					assets.append(assetInfoStr);
				};
			}
			if(x>0){
				getCurrentPageObj().find("#wp_info_detail_view").show();
			};
		});
	}

}
function jisuanXY_view(obj){
	var b_height=$("body:eq(0)").height();
	var offset=obj.offset();
	var detailObj=getCurrentPageObj().find("#wp_info_detail_view");
	var scrollTop=$("#contentHtml").scrollTop();
	if(offset.top+detailObj.height()+obj.height()-b_height>0){
		detailObj.addClass("popLayer-bottom");
		detailObj.css({left:offset.left-225,top:offset.top-detailObj.height()-12-obj.height()+scrollTop});
	}else{
		detailObj.removeClass("popLayer-bottom");
		detailObj.css({left:offset.left-225,top:offset.top-15+scrollTop});
	};
}
/**
 * 根据对象获取机柜坐标
 * @param obj
 * @returns
 */
function getWidByObj_view(obj){
	var coor_x=obj.attr("x");
	var coor_y=obj.attr("y");
	var store_id=obj.attr("store_id");
	var params={coor_x:coor_x,coor_y:coor_y,store_id:store_id};
	return params;
}
/**
 * 机柜全景图图片加载成功
 */
function loadFloorWorkPlaceImg_view(i,ths){
	if(i==0){//加载成功
		getCurrentPageObj().find("#workplace_img_view_element_view").removeClass("whide");
		getCurrentPageObj().find(".viewTabContListD").find(".uploadImg").addClass("whide");
	}else if(i==1){//加载失败
		removeFloorImgSuccess_view();
	}
}
/**
 * 显示楼层图片
 * @param file_id
 */
function showFloorWorkPlaceImg_view(file_id){
	getCurrentPageObj().find("#workplace_img_view_element_view").attr("src","cabinetsMap/imageFileViewToPage.asp?path_id=UPLOAD_IMG&fid="+file_id);
}
/**
 * 全景视图删除成功
 */
function removeFloorImgSuccess_view(){
	getCurrentPageObj().find("#workplace_img_view_element_view").addClass("whide");
	getCurrentPageObj().find(".viewTabContListD").find(".uploadImg").removeClass("whide");
}
/*机柜U值层次*/
$(function(){
	$("#editFloor_view").unbind();
	$("#editFloor_view").click(function(){
		if($(this).html()=="占用信息"){
			$("#cabinetInfo_table_view").hide();
			$("#cabinetInfo_floor_div_view").show();
			$(this).html("基本信息");
		}else{
			$("#cabinetInfo_table_view").show();
			$("#cabinetInfo_floor_div_view").hide();
			$(this).html("占用信息");
		}
	});
});
/**
 * 创建机柜层次
 * @param obj
 */
function createCabinetFloor_view(nums){
	var objNum=nums;
	$("#cabinetInfo_floor_view").html("");
	for(var i=1;i<=objNum;i++){
		var num=objNum-i+1;
		var str="<div class='example check'><p id='cabinetFloor_view_"+num+"' class='turnBoxFaceNum1'>第"+num+"U</p></div>";
		$("#cabinetInfo_floor_view").append(str);
	}
	cabinetFloorCount_view();
}
/**
 * 层次统计
 */
function cabinetFloorCount_view(){
	var emptyFloor=getCurrentPageObj().find("#cabinetInfo_floor_view").find(".turnBoxFaceNum1").length;
	var enoughFloor=getCurrentPageObj().find("#cabinetInfo_floor_view").find(".turnBoxFaceNum2").length;
	getCurrentPageObj().find("#cabinetInfo_floor_div_view").find(".floorContent").html(
			'空('+emptyFloor+')：<i class="emptyFloor"></i><br/>'+
			'满('+enoughFloor+')：<i class="enoughFloor"></i>');
}
