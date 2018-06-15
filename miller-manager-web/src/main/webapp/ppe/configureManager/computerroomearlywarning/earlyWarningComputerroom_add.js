function initEarlyWarningComputerRoom_addEvent(params){
	/**
	 * 定义一个变量  存放区域号
	 * @twoID 
	 */
	var areaNumber="";//新增时间提交的位置id;(最精确的:区域id)
	//修改是用的变量
	var areaThereNUmber="";//记录第三级菜单(区域)的ID
	var areaTwoNUmber="";//记录第二级菜单(楼层)的ID
	var areaOneNUmber="";//记录第一级菜单(办公楼层)的ID
	var areaMAXNUmber="";//记录第0级菜单(办公楼层的上层)的ID
	var key="add";//判断是新增还是修改;
	var WARNING_ID="";//判断是新增还是修改;
	if(params){//初始化信息
		key="update";
		WARNING_ID=params["WARNING_ID"];
		initNewEarlyWarningComputerRoomInfo(params);
		$("#headTle_newEarlyWarningComputer").html("修改预警信息");
	}else{
		elrlyComputer_add();
		$("#headTle_newEarlyWarningComputer").html("新增预警信息");
	}
	
/**
 * 下拉框级联 新增的时候直接初始化——————————————————————————————————————————————————
 */
	function elrlyComputer_add(){
		startLoading();
		getCurrentPageObj().find("select").select2();
		var edificeObj=getCurrentPageObj().find("#workplace_edifice");
		baseAjax_("cabinetsMap/findCabinetsMapSelectInfo.asp",{type:"edifice"},function(data){
			if(key=="update"){
				selectAppendByData(edificeObj,{value:"ITEM_CODE",text:"ITEM_NAME"},data,areaOneNUmber);
				endLoading();
			}else{
				selectAppendByData(edificeObj,{value:"ITEM_CODE",text:"ITEM_NAME"},data,data[0]["ITEM_CODE"]);
				initfloorSelect(data[0]["ITEM_CODE"]);
			}
		});
		edificeObj.change( function() {
			key="add";
			initfloorSelect($(this).val());
		});
	};
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
			if(key=="update"){
				selectAppendByData(floorObj,{value:"ITEM_CODE",text:"ITEM_NAME"},data,areaTwoNUmber);
			}else{
				selectAppendByData(floorObj,{value:"ITEM_CODE",text:"ITEM_NAME"},data,data[0]["ITEM_CODE"]);
				showAreaSelect(data[0]["ITEM_CODE"]);
			}
		});
		floorObj.unbind("change");
		floorObj.change(function() {
			var val=floorObj.val();
			var data=floorObj.data("data");
			for(var i=0;i<data.length;i++){
				if(data[i]["ITEM_CODE"]==val){
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
			try{
				areaObj.data("data",data);
				if(key=="update"){
					selectAppendByData(areaObj,{value:"ITEM_CODE",text:"ITEM_NAME"},data,areaThereNUmber);
					areaNumber=areaThereNUmber;
				}else{
					selectAppendByData(areaObj,{value:"ITEM_CODE",text:"ITEM_NAME"},data,data[0]["ITEM_CODE"]);
					areaNumber=data[0]["ITEM_CODE"];
				}
			}catch(e){
				endLoading();
			}
		});
		areaObj.unbind("change");
		areaObj.change(function(){
			areaNumber=areaObj.val();
		});
		endLoading();
	}
		
		
	//调用的ajxs
	function baseAjax_(url, param, callback, async) {
		$.ajax({
			type : "post",
			url : url,
			async : async == undefined ? true : false,
			data : param,
			dataType : "json",
			success : function(msg) {
				callback(msg);
			},
			error : function() {
				callback();
			}
		});
	}	
		
	/**
	 * 保存按钮
	 **/
	$('#save_newEarlyWarningcomputer').unbind();
	$('#save_newEarlyWarningcomputer').bind('click', function(e) {
		if(!vlidate($("#infoDiv_newEarlyWarningComputer"))){
			return;
		}
		 nconfirm("是否保存？",function(){
			var params = {"DESCREB":$("textarea[name^='NEWCPR.']").val()};
			var inputs = $("input[name^='NEWCPR.']");
			for (var i = 0; i < inputs.length; i++) {
				var obj = $(inputs[i]);
				params[obj.attr("name").substr(7)] = obj.val();
			}
			if($("#is_use_state_newEarlyWarningComputer").is(":checked")){
				params["IS_USE"]="00";
			}else{
				params["IS_USE"]="01";
			}
			
			params["WARNING_PLANCE"]=areaNumber;//提交的位置（区域）ID；
			if(WARNING_ID!=""){
				params["WARNING_ID"]=WARNING_ID;//提交的修改的预警ID；
			}
			
			baseAjax("ComputerroomWarning/newWarning.asp", params, function(data) {
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						newOpenTab("ComputerRoomEarlyWarningList","机柜预警列表","ppe/configureManager/computerroomearlywarning/earlyWarningComputerroom_list.html",function(){});
					}
				}else{
					alert("未知错误！");
				}
			},true);
		 });
	});
	//重置按钮
	$('#reset_newEarlyWarningComputer').unbind();
	$('#reset_newEarlyWarningComputer').bind('click', function(e) {
		if(params){//初始化信息
			key="update";
			initNewEarlyWarningComputerRoomInfo(params);
		}else{
			$("input[name^='NEWCPR.']").val("");
			$("textarea[name^='NEWCPR.']").val("");
			elrlyComputer_add();
		}
	});
	//返回
	$('#back_newEarlyWarningComputer').unbind();
	$('#back_newEarlyWarningComputer').bind('click', function(e) {
		newOpenTab("ComputerRoomEarlyWarningList","机柜预警列表","ppe/configureManager/computerroomearlywarning/earlyWarningComputerroom_list.html",function(){});
	});

	/**
	 * 初始化信息   修改操作)_______________________________________________________________________
	 * @param params 信息数据
	 */
	function initNewEarlyWarningComputerRoomInfo(params){
		for(var k in params){
			if(k=="DESCREB"){
				$("textarea[name='NEWCPR." + k + "']").val(params[k]);
			}else{
				$("input[name='NEWCPR." + k + "']").val(params[k]);
			}
		}
		//一、获取区域位置---------
		//1.先求到上级（楼层）的位置ID
		areaThereNUmber=params["WARNING_PLANCE"];//获取修改传入的 （ 区域ID）
		baseAjax("Config/findonearea.asp", {id : areaThereNUmber}, function(data) {
			if (data != undefined && data != null) {
				areaTwoNUmber=data["store_p_id"];
			}else{
				alert("未知错误！");
			}
		},true);
		showAreaSelect(areaTwoNUmber);//2.对区域赋值
		
		//二、获取楼层位置---------
		//1.先求到上级（办公楼）的位置ID
		baseAjax("Config/findonearea.asp", {id : areaTwoNUmber}, function(data) {
			if (data != undefined && data != null) {
				areaOneNUmber=data["store_p_id"];
			}else{
				alert("未知错误！");
			}
		},true);
		initfloorSelect(areaOneNUmber);//2.对楼层赋值
		
		//三、获取办公楼位置---------
		//1.先求到办公楼的上级的位置ID
		baseAjax("Config/findonearea.asp", {id : areaOneNUmber}, function(data) {
			if (data != undefined && data != null) {
				areaMAXNUmber=data["store_p_id"];
			}else{
				alert("未知错误！");
			}
		},true);
		elrlyComputer_add(areaMAXNUmber);//2.对办公楼赋值
		
		
		//是否启用
		if(params["IS_USE"]=="00"){
			if(!$("#is_use_state_newEarlyWarningComputer").is(":checked")){
				$("#is_use_state_newEarlyWarningComputer").click();
			}
		}else{
			if($("#is_use_state_newEarlyWarningComputer").is(":checked")){
				$("#is_use_state_newEarlyWarningComputer").click();
			}
		}
	}

}
autoInitSelect($("#add_warrentearlyWarning"));
initVlidate($("#infoDiv_newEarlyWarningComputer"));
setTimeout(function(){switch_btn_event()}, 5);