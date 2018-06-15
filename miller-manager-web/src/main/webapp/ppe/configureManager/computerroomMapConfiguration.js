initVlidate($("#myModal_computerroomMapConfiguration"));
/**
 * 统一ajax 调用 做公共处理
 * @param url
 * @param param
 * @param callback
 * @param async
 */
function baseAjax_(url, param, callback, async) {
		$.ajax({
			type : "post",
			url : url,
			async : async == undefined ? true : false,
			data : param,
			dataType : "json",
			success : function(msg) {
				callback(msg);
				cabinetCount();
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
	var edificeObj=getCurrentPageObj().find("#workplace_edifice");
	baseAjax_("cabinetsMap/findCabinetsMapSelectInfo.asp",{type:"edifice"},function(data){
		selectAppendByData(edificeObj,{value:"ITEM_CODE",text:"ITEM_NAME"},data,data[0]["ITEM_CODE"]);
		initfloorSelect(data[0]["ITEM_CODE"]);
	});
	edificeObj.change( function() {
		initfloorSelect($(this).val());
	});
});
/**
 * 初始化楼层下拉
 * @param store_p_id
 */
function initfloorSelect(store_p_id){
	var floorObj=getCurrentPageObj().find("#workplace_floor");
	floorObj.empty();
	//查询楼层信息 
	baseAjax_("cabinetsMap/findCabinetsMapSelectInfo.asp",{type:"floor",store_p_id:store_p_id},function(data){
		floorObj.data("data",data);
		selectAppendByData(floorObj,{value:"ITEM_CODE",text:"ITEM_NAME"},data,data[0]["ITEM_CODE"]);
		showFloorWorkPlaceImg(data[0]["STORE_FILED"]);
		showAreaSelect(data[0]["ITEM_CODE"]);
	});
	floorObj.unbind("change");
	floorObj.change(function() {
		removeFloorImgSuccess();
		var val=floorObj.val();
		var data=floorObj.data("data");
		for(var i=0;i<data.length;i++){
			if(data[i]["ITEM_CODE"]==val){
				showFloorWorkPlaceImg(data[i]["STORE_FILED"]);
				showAreaSelect(data[i]["ITEM_CODE"]);
				break;
			}
		}
	});
}
/**
 * 初始化 区域下拉 信息 
 * @param store_p_id
 */
function showAreaSelect(store_p_id){
	endLoading();
	startLoading();
	var areaObj=getCurrentPageObj().find("#workplace_area");
	areaObj.empty();
	baseAjax_("cabinetsMap/findCabinetsMapSelectInfo.asp",{type:"area",store_p_id:store_p_id},function(data){
		getCurrentPageObj().find("#workplace_id").val(data[0]["AREA_TYPE"]);
		try{
			areaObj.data("data",data);
			selectAppendByData(areaObj,{value:"ITEM_CODE",text:"ITEM_NAME"},data,data[0]["ITEM_CODE"]);
			initXYpoin(data[0]["ITEM_CODE"],data[0]["STORE_X"],data[0]["STORE_Y"]);
			initSeatStyle(data[0]["ITEM_CODE"]);
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
					getCurrentPageObj().find("#workplace_id").val(data[i]["AREA_TYPE"]);
					initXYpoin(val,data[i]["STORE_X"],data[i]["STORE_Y"]);
					break;
				}
			}
			initSeatStyle(val);
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
function initXYpoin(store_id,x,y){
	var objx=getCurrentPageObj().find("#Xcoordinate_edit");
	var xWidthYheight=getCurrentPageObj().find("#stationDet_edit");
	objx.empty();
	objx.css("width",90*x);
	xWidthYheight.css("width",90*x);
	for(var i=0;i<x;i++){
		objx.append('<li>'+(i+1)+'</li>');
	}
	var objy=getCurrentPageObj().find("#Ycoordinate_edit");
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
	var seatObj=getCurrentPageObj().find("#stationDet_edit").find(".seatArea");
	seatObj.empty();
	for(var i=1;i<=y;i++){
		for(var j=1;j<=x;j++){
			seatObj.append('<li id="seat'+j+"_"+i+'" store_id="'+store_id+'" x="'+j+'" y="'+i+'"><div class="sta-layer"><i></i><span class="sta1"></span></div></li>');
		}
	}
	initSeatEvent();
}
/**
 * 机柜统计
 */
function cabinetCount(){
	var area_type=getCurrentPageObj().find("#workplace_id").val();
	if (area_type=='01') {
		var newCabinet=getCurrentPageObj().find("#stationDet_edit").find(".hasStation").not(".hasStationed").length;
		var leaveCabinet=getCurrentPageObj().find("#stationDet_edit").find(".marginStation").length;
		var fullCabinet=getCurrentPageObj().find("#stationDet_edit").find(".hasStationed").not(".marginStation").length;
		getCurrentPageObj().find(".editTabContListD").find(".psArea").html(
				"全新机柜("+newCabinet+")：<i class='UNusedICON'></i>"+
				"余量机柜("+leaveCabinet+")：<i class='marginusedICON'></i>"+
				"已满机柜("+fullCabinet+")：<i class='usedICON'></i>");
	}else if(area_type=='03'){
		var newCabinet=getCurrentPageObj().find("#stationDet_edit").find(".hasStation").not(".hasStationed").length;
		var leaveCabinet=getCurrentPageObj().find("#stationDet_edit").find(".marginStation").length;
		var fullCabinet=getCurrentPageObj().find("#stationDet_edit").find(".hasStationed").not(".marginStation").length;
		getCurrentPageObj().find(".editTabContListD").find(".psArea").html(
				"全新文件柜("+newCabinet+")：<i class='UNusedICON'></i>"+
				"余量文件柜("+leaveCabinet+")：<i class='marginusedICON'></i>"+
				"已满文件柜("+fullCabinet+")：<i class='usedICON'></i>");
	}
}
/**
 * 初始化工位事件
 */
function initSeatEvent(){
	var area_type=getCurrentPageObj().find("#workplace_id").val();
	var seatArea=getCurrentPageObj().find("#stationDet_edit").find(".seatArea").find("li");
	seatArea.unbind("click");
	seatArea.click(function(){//增加机柜
		$("#cabinetInfo_table").show();
		$("#cabinetInfo_floor_div").hide();
		$("#editFloor").hide();
		$("input[name^='CPTRMPCFG.']").val("");
		$("input[name^='CPTRMPCFG.cab_use_ratio']").val("0%");
		var obj=$(this);
		var coor_x=obj.attr("x");
		var coor_y=obj.attr("y");
		var cl=obj.attr("class");
		$("input[name='CPTRMPCFG.cab_num'],input[name='CPTRMPCFG.total_content']").removeAttr("disabled");
		if(cl){
			$("#editFloor").html("占用信息");
			$("#editFloor").show();
			$("input[name='CPTRMPCFG.cab_num'],input[name='CPTRMPCFG.total_content']").attr("disabled","disabled");
			var params={coor_x:coor_x,coor_y:coor_y,store_id:getCurrentPageObj().find("#workplace_area").val()};
			if (area_type=='01') {
				baseAjax_("cabinetsMap/queryOneCabinet.asp",params,function(data){
					if(data&&data.CABINET){
						 for(var k in data.CABINET) {
							 var k1=k.toLowerCase();
							$("input[name='CPTRMPCFG." + k1 + "']").val(data.CABINET[k]);
						}
						createCabinetFloor(data.CABINET.TOTAL_CONTENT);
					}
					if(data.UFLOORS&&data.UFLOORS.length>0){
						for(var i=0;i<data.UFLOORS.length;i++){
							var floor=getCurrentPageObj().find("#cabinetFloor_"+data.UFLOORS[i]["UFLOOR_NUM"]);
							floor.removeClass("turnBoxFaceNum1");
							floor.addClass("turnBoxFaceNum2");
							floor.html("第"+data.UFLOORS[i]["UFLOOR_NUM"]+"U："+data.UFLOORS[i]["ASSET_NAME"]);
						}
					}
					cabinetFloorCount();
				});
			}else if(area_type=='03'){
				baseAjax_("cabinetsMap/queryWarrantOneCabinet.asp",params,function(data){
					if(data&&data.CABINET){
						 for(var k in data.CABINET) {
							 var k1=k.toLowerCase();
							$("input[name='CPTRMPCFG." + k1 + "']").val(data.CABINET[k]);
						}
						createCabinetFloor(data.CABINET.TOTAL_CONTENT);
					}
					if(data.UFLOORS&&data.UFLOORS.length>0){
						for(var i=0;i<data.UFLOORS.length;i++){
							var floor=getCurrentPageObj().find("#cabinetFloor_"+data.UFLOORS[i]["UFLOOR_NUM"]);
							floor.removeClass("turnBoxFaceNum1");
							floor.addClass("turnBoxFaceNum2");
							floor.html("第"+data.UFLOORS[i]["UFLOOR_NUM"]+"柜位："+data.UFLOORS[i]["WARRANT_NO"]);
						}
					}
					cabinetFloorCount();
				});
			}
			
		}
		if (area_type=="01") {
			$('#myModal_computerroomMapConfiguration').modal('show');
		}else if (area_type=="03") {
			getCurrentPageObj().find("#jg_info").html("文件柜详情");
			getCurrentPageObj().find("span[sel='cab_id']").html("文件柜编号：");
			getCurrentPageObj().find("span[sel='cab_name']").html("文件柜名称：");
			getCurrentPageObj().find("span[sel='coor_x']").html("文件柜X坐标：");
			getCurrentPageObj().find("span[sel='coor_y']").html("文件柜Y坐标：");
			getCurrentPageObj().find("span[sel='total_content']").html("总容量：");
			getCurrentPageObj().find("span[sel='remain_content']").html("剩余容量：");
			$('#myModal_computerroomMapConfiguration').modal('show');
		}
		$("input[name='CPTRMPCFG.coor_x']").val(coor_x);
		$("input[name='CPTRMPCFG.coor_y']").val(coor_y);
		initModalEvent_computerroomMapConfiguration(obj);
	});
	var closeSeatArea=getCurrentPageObj().find("[store_id][x][y] i");
	closeSeatArea.click(function(e){
		 e.stopPropagation();
		var parent=$(this).parents("[store_id][x][y]:eq(0)");
		if(!parent.hasClass("hasStation")){
			return;
		}
		if(parent.hasClass("hasStationed")){
			nconfirm("该机柜已有资产确定要移除吗？",function(){
				removeSeatInfo(parent);
			});
			return;
		}
		removeSeatInfo(parent);
	});
	//鼠标悬浮事件
	cabinetInfoHover();
}
function initModalEvent_computerroomMapConfiguration(obj){
	$("#modal_save_computerroomMapConfigration").unbind();
	$("#modal_save_computerroomMapConfigration").click(function(){
		 if(!vlidate($("#myModal_computerroomMapConfiguration"),999999999)){
			 return;
		 }
		var params={store_id:getCurrentPageObj().find("#workplace_area").val()};
		var inputs = $("#myModal_computerroomMapConfiguration").find($("input[name^='CPTRMPCFG.']"));
		for(var i=0;i<inputs.length;i++){
			var obji = $(inputs[i]);
			params[obji.attr("name").substr(10)] = obji.val();
		}
		startLoading();
		baseAjax_("cabinetsMap/newCabinetsInfo.asp",params,function(data){
			if(data){
				alert(data.msg);
				if(data.result=="true"){
					if(!params["cab_id"]){//新增时添加样式
						obj.addClass("hasStation");
					}
					$('#myModal_computerroomMapConfiguration').modal('hide');
				}
			}
			endLoading();
		});
	});
}
/**
 * 移除机柜信息
 * @param x
 * @param y
 * @param store_id
 */
function removeSeatInfo(obj){
	var params=getWidByObj(obj);
	baseAjax_("cabinetsMap/deleteExistCabinetInfo.asp",params,function(data){
		if(data&&data.result=="true"){
			obj.removeClass();
			alert("移除成功！");
		}
	});
}
/**
 * 初始化剩余U值
 */
function initRemainContentUNum(obj){
	$('input[name="CPTRMPCFG.remain_content"]').val($(obj).val());
}
/**
 * 初始渲染机柜 样式 
 * @param store_id
 */
function initSeatStyle(store_id){
	var area_type=getCurrentPageObj().find("#workplace_id").val();
	if (area_type=='01') {
		baseAjax_("cabinetsMap/findExistCabinetsInfo.asp",{store_id:store_id},function(data){
			if(data){
				for(var i=0;i<data.length;i++){
					var seat=getCurrentPageObj().find("#stationDet_edit").find("#seat"+data[i]["COOR_X"]+"_"+data[i]["COOR_Y"]);
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
	}else if (area_type=='03') {
		baseAjax_("cabinetsMap/findExistWarrantCabinetsInfo.asp",{store_id:store_id},function(data){
			if(data){
				for(var i=0;i<data.length;i++){
					var seat=getCurrentPageObj().find("#stationDet_edit").find("#seat"+data[i]["COOR_X"]+"_"+data[i]["COOR_Y"]);
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
function cabinetInfoHover(){
	var area_type=getCurrentPageObj().find("#workplace_id").val();
	getCurrentPageObj().find("#stationDet_edit").find("[store_id][x][y]").hover(
	function(){
		var obj=$(this);
		if(obj.hasClass("hasStation")){
			showWorkPlaceDetail(obj);
			jisuanXY(obj);
		}
	},function(){
		getCurrentPageObj().find("#wp_info_detail").hide();
	});
	/*显示*/
	if (area_type=='01') {
		getCurrentPageObj().find("#wp_info_detail").hover(function(){
			getCurrentPageObj().find("#wp_info_detail").show();
		},function(){
			getCurrentPageObj().find("#wp_info_detail").hide();
		});
	}else if (area_type='03') {
		getCurrentPageObj().find("span[cel='cab_id']").html("文件柜编号：");
		getCurrentPageObj().find("span[cel='cab_area']").html("文件柜区域：");
		getCurrentPageObj().find("span[cel='cab_name']").html("文件柜名称：");
		getCurrentPageObj().find("span[cel='cab_radio']").html("总容量：");
		getCurrentPageObj().find("span[cel='cab_content']").html("剩余容量：");
		getCurrentPageObj().find("#wp_info_detail").hover(function(){
			getCurrentPageObj().find("#wp_info_detail").show();
		},function(){
			getCurrentPageObj().find("#wp_info_detail").hide();
		});
	}
}
/**
 * 显示详细的工位信息
 * @param obj
 */
function showWorkPlaceDetail(obj){
	$("#assetList_computerroomMapConfiguration").hide();
	var area_type=getCurrentPageObj().find("#workplace_id").val();
	var params=getWidByObj(obj);
	var x=0;
	if (area_type=='01') {
		baseAjax_("cabinetsMap/hoverShowDetail.asp",params,function(data){
			if(data&&data.cabinetInfos){
				 for(var k in data.cabinetInfos) {
					 var k1=k.toLowerCase();
					$("td[name='CPTRMPCFGG." + k1 + "']").html(data.cabinetInfos[k]);
				}
				 var workplace_area = $("#workplace_area").select2('data');
				 $("#cabinetArea_computerroomMapConfiguration").html(workplace_area[0].text);
				x++;
			}
			if(data&&data.assetInfos.length>0){
				$("#assetList_computerroomMapConfiguration").show();
				var assets=$("#assetList_computerroomMapConfiguration");
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
				getCurrentPageObj().find("#wp_info_detail").show();
			};
		});
	}else if(area_type=='03'){
		baseAjax_("cabinetsMap/hoverShowWarrantDetail.asp",params,function(data){
			if(data&&data.cabinetInfos){
				 for(var k in data.cabinetInfos) {
					 var k1=k.toLowerCase();
					$("td[name='CPTRMPCFGG." + k1 + "']").html(data.cabinetInfos[k]);
				}
				 var workplace_area = $("#workplace_area").select2('data');
				 $("#cabinetArea_computerroomMapConfiguration").html(workplace_area[0].text);
				x++;
			}
			if(data&&data.assetInfos.length>0){
				$("#assetList_computerroomMapConfiguration").show();
				var assets=$("#assetList_computerroomMapConfiguration");
				assets.html("");
				var assetInfoStr='<tr style="font-weight:bolder;"><td>序号</td><td>柜位序号</td>'+
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
				getCurrentPageObj().find("#wp_info_detail").show();
			};
		});
	}
	
}
function jisuanXY(obj){
	var b_height=$("body:eq(0)").height();
	var offset=obj.offset();
	var detailObj=getCurrentPageObj().find("#wp_info_detail");
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
function getWidByObj(obj){
	var coor_x=obj.attr("x");
	var coor_y=obj.attr("y");
	var store_id=obj.attr("store_id");
	var params={coor_x:coor_x,coor_y:coor_y,store_id:store_id};
	return params;
}
/**
 * 机柜全景图上传 
 */
function uploadEvent(){
	var fileObj=getCurrentPageObj().find("#workplace_imgview_file");
	fileObj.unbind("click");
	fileObj.click(function(){
		fileObj.unbind("click");
		var old_val=$(this).val();
		var int=setInterval(function(){
			if(old_val!=getCurrentPageObj().find("#workplace_imgview_file").val()){
				startLoading();
				clearInterval(int);
				$.ajaxFileUpload({
				    url:"cabinetsMap/uploadWorkPlaceImg.asp?path_id=UPLOAD_IMG&store_id="+getCurrentPageObj().find("#workplace_floor").val(),
				    type:"post",
					secureuri:false,
					fileElementId:'workplace_imgview_file',
					data:'',
					dataType: 'json',
					success:function (msg){
						endLoading();
						uploadEvent();
						showFloorWorkPlaceImg(msg.file_id);
					},
					error: function (msg){
						endLoading();
						uploadEvent();
					}
			   });
			}
		},300);
	});
	var img_delete=getCurrentPageObj().find(".img_delete");
	img_delete.unbind("click");
	img_delete.click(function(){//删除工位全景图
		nconfirm("确定删除该楼层的全景视图？",function(){
			baseAjax_("cabinetsMap/deleteWorkPlaceImg.asp",{path_id:"UPLOAD_IMG",store_id:getCurrentPageObj().find("#workplace_floor").val()},function(data){
				if(data&&data.result=="true"){
					removeFloorImgSuccess();
				}else{
					alert("删除失败!");
				}
			});
		});
	});
}
uploadEvent();
/**
 * 机柜全景图图片加载成功
 */
function loadFloorWorkPlaceImg(i,ths){
	if(i==0){//加载成功
		getCurrentPageObj().find("#workplace_img_view_element").removeClass("whide");
		getCurrentPageObj().find(".editTabContListD").find(".uploadImg").addClass("whide");
		getCurrentPageObj().find(".img_delete").removeClass("whide");
	}else if(i==1){//加载失败
		removeFloorImgSuccess();
	}
}
/**
 * 显示楼层图片
 * @param file_id
 */
function showFloorWorkPlaceImg(file_id){
	getCurrentPageObj().find("#workplace_img_view_element").attr("src","cabinetsMap/imageFileViewToPage.asp?path_id=UPLOAD_IMG&fid="+file_id);
}
/**
 * 全景视图删除成功
 */
function removeFloorImgSuccess(){
	getCurrentPageObj().find("#workplace_img_view_element").addClass("whide");
	getCurrentPageObj().find(".editTabContListD").find(".uploadImg").removeClass("whide");
	getCurrentPageObj().find(".img_delete").addClass("whide");
}
/*机柜U值层次*/
$(function(){
	$("#editFloor").unbind();
	$("#editFloor").click(function(){
		if(!vlidate($("#myModal_computerroomMapConfiguration"),999999999)){
			 return;
		 }
		if($("#editFloor").html()=="占用信息"){
			$("#cabinetInfo_table").hide();
			$("#cabinetInfo_floor_div").show();
			$("#editFloor").html("基本信息");
		}else{
			$("#cabinetInfo_table").show();
			$("#cabinetInfo_floor_div").hide();
			$("#editFloor").html("占用信息");
		}
	});
});
/**
 * 创建机柜层次
 * @param obj
 */
function createCabinetFloor(nums){
	var objNum=nums;
	$("#cabinetInfo_floor").html("");
	var area_type=getCurrentPageObj().find("#workplace_id").val();
	if (area_type=='01') {
		for(var i=1;i<=objNum;i++){
			var num=objNum-i+1;
			var str="<div class='example check'><p id='cabinetFloor_"+num+"' class='turnBoxFaceNum1'>第"+num+"U</p></div>";
			$("#cabinetInfo_floor").append(str);
		}
	}else if (area_type=='03') {
		for(var i=1;i<=objNum;i++){
			var num=objNum-i+1;
			var str="<div class='example check'><p id='cabinetFloor_"+num+"' class='turnBoxFaceNum1'>第"+num+"柜位</p></div>";
			$("#cabinetInfo_floor").append(str);
		}
	}
	
	cabinetFloorCount();
}
/**
 * 层次统计
 */
function cabinetFloorCount(){
	var emptyFloor=getCurrentPageObj().find("#cabinetInfo_floor").find(".turnBoxFaceNum1").length;
	var enoughFloor=getCurrentPageObj().find("#cabinetInfo_floor").find(".turnBoxFaceNum2").length;
	getCurrentPageObj().find("#cabinetInfo_floor_div").find(".floorContent").html(
			'空('+emptyFloor+')：<i class="emptyFloor"></i><br/>'+
			'满('+enoughFloor+')：<i class="enoughFloor"></i>');
}
