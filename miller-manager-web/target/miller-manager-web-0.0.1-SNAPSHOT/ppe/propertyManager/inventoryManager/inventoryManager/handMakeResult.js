function initHandMakeResultLayOut(params){
	var currTab = getCurrentPageObj();//当前页
	var table = currTab.find("#get_SchemeInfoTable");//资产列表对象
	//初始化方案信息
	for ( var k in params) { 
		if(k=="SCHEME_STATE_NAME"){
			var stl;
			if(params[k]=="已完成"){
				stl="statesBg statesBg_inuse";
			}else if(params[k]=="待制定方案"){
				stl="statesBg statesBg_unuse";
			}else{
				stl="statesBg statesBg_underuse";
			}
			currTab.find("span[name='IN." + k + "']").attr("class",stl);
		}
		currTab.find("[name='IN." + k + "']").html(params[k]);
	}
	var inven_content_type = params.INVEN_CONTENT_TYPE;//盘点内容类型
	if(inven_content_type == "00"){//权证盘点
		currTab.find('[hspn="eState"]').hide();
	}
	//初始化方案清单列表
	initDeatilSchemeInfo(params);
	//保存按钮
	currTab.find("#save_Scheme").click(function(){
		var assetArr = new Array();
		currTab.find("[name='assetInfoList']").each(
				function() {
					var property_num = $(this).find("[name='property_num']").html() == "" ? $(this).find("input[name='property_num']").val() : $(this).find("[name='property_num']").html();
					var inven_result = $(this).find("[name='inven_result']").val();
					var advice = $(this).find("[name='advice']").val();
					var new_add_flag = $(this).find("[new_add_flag]").attr("new_add_flag");
					assetArr.push(JSON.stringify({"property_num":property_num,"inven_result":inven_result,"advice":advice,"new_add_flag":new_add_flag}));
				}
		);
        baseAjax("InventorySchemeManager/handMakeResult.asp", {assetArr:assetArr,scheme_num:params.SCHEME_NUM} , function(data) {
        	if(data != undefined && data != null&&data.result=="true"){
				alert("保存成功！");
				newOpenTab("inventorySchemeList","保存成功","ppe/propertyManager/inventoryManager/inventoryManager/inventorySchemeList.html");
			}else{
				alert("保存失败！");
			}
        });
	});
	
	//返回按钮
	currTab.find("#goBack_Scheme").click(function(){
		newOpenTab("inventorySchemeList","返回","ppe/propertyManager/inventoryManager/inventoryManager/inventorySchemeList.html");
	});
	//新增按钮
	currTab.find("#add_addSchemeList").click(function(){
		var tr = "<tr><td colspan='12'>新增错误</td><td new_add_flag='00'><span class='viewDetail' onclick='deleteTr_shemeDetail(this)'>删除</span></td></tr>";
		if(inven_content_type == "00"){//权证类型
			tr = "<tr name='assetInfoList'>" 
	 			+ "<td></td><td></td><td></td><td></td><td></td>"
	 			+ "<td><input name='property_num' type='text' value=''/></td>"
	 			+ "<td></td><td></td><td></td>"
	 			+ "<td><select style='width:100%' name='inven_result' diccode='INV_DIC_LIST_INVEN_RESULT' val='02'></select></td>"
	 			+ "<td>未盘</td>"
				+ "<td><input name='advice' type='text' value=''/></td>"
	 			+ "<td new_add_flag='00'><span class='viewDetail' onclick='deleteTr_shemeDetail(this)'>删除</span></td>" +
			  "</tr>";
		}else if(inven_content_type == "01"){//非权证类型
			tr = "<tr name='assetInfoList'>" 
	 			+ "<td><input name='property_num' type='text' value=''/></td>"
	 			+ "<td></td><td></td><td></td><td></td><td></td><td></td><td></td>"
	 			+ "<td><select style='width:100%' name='inven_result' diccode='INV_DIC_LIST_INVEN_RESULT' val='02'></select></td>"
	 			+ "<td>未盘</td><td></td>"
				+ "<td><input name='advice' type='text' value=''/></td>"
	 			+ "<td new_add_flag='00'><span class='viewDetail' onclick='deleteTr_shemeDetail(this)'>删除</span></td>" +
			  "</tr>";
		}
		 table.append(tr);
		autoInitSelect(table);
	});
	
/*********************************内部方法***************************************/	
//初始化方案清单列表
function initDeatilSchemeInfo(params){
	var scheme_num = params.SCHEME_NUM;
    baseAjax('InventoryPlanManager/queryListBySchemeNum.asp',
    		{
    		scheme_num: scheme_num,
    		inven_content_type : inven_content_type
    		} 
    		,function(data) {
    	if(data != undefined && data != null){
    		var list = data.rows;
    		if (list != undefined && list != null) {
    			var tTh;
    			if(inven_content_type == "00"){//盘点内容类型为权证类型
        			tTh = "<tr>" 
    						+ "<th width='8%'>合同编号</th>"
    						+ "<th width='8%'>押品编号</th>"
    						+ "<th width='8%'>押品名称</th>"
    						+ "<th width='8%'>权证分类</th>"
    						+ "<th width='8%'>权证类型</th>"
    						+ "<th width='8%'>权证编号</th>"
    						+ "<th width='8%'>权证状态</th>"
    						+ "<th width='8%'>存放区域</th>"
    						+ "<th width='7%'>历史盘点次数</th>"
    						+ "<th width='8%'>盘点结果</th>"
    						+ "<th width='8%'>盘点状态</th>"
    						+ "<th width='8%'>处理建议</th>"
    						+ "<th width='5%'>操作</th>"
    					+ "</tr>";
        			table.append(tTh);//加表头
        			for ( var i = 0; i < list.length; i++) {
      					 var map = list[i];
      					 var property_num = map.PROPERTY_NUM == undefined ? "" : map.PROPERTY_NUM;
      					 var contract_no = map.CONTRACT_NO == undefined ? "" : map.CONTRACT_NO;
      					 var guarantee_id = map.GUARANTEE_ID == undefined ? "" : map.GUARANTEE_ID;
      					 var guarantee_name= map.GUARANTEE_NAME == undefined ? "" : map.GUARANTEE_NAME;
      					 var warr_classify = map.WARR_CLASSIFY == undefined ? "" : map.WARR_CLASSIFY;
      					 var warr_type = map.WARR_TYPE == undefined ? "" : map.WARR_TYPE;
      					 var warr_status = map.WARR_STATUS == undefined ? "" : map.WARR_STATUS;
      					 var area = map.AREA == undefined ? "" : map.AREA;
      					 var inven_result = $.trim(map.INVEN_RESULT) == "" ? "01" : map.INVEN_RESULT;
      					 var advice = map.ADVICE == undefined ? "" : map.ADVICE;
      					 var inven_times = map.INVEN_TIMES;
      					 var new_add_flag = map.NEW_ADD_FLAG;
      					 var inven_state = map.INVEN_STATE;
      					 var is_inven = map.IS_INVEN;
      					 var td_delStr;
      					 if(new_add_flag == "00"){//是新增加进来的,则可操作删除
      						 td_delStr = "<td new_add_flag='00'><span class='viewDetail' onclick='deleteTr_shemeDetail(this)'>删除</span></td>";
      					 }else{
      						 td_delStr = "<td new_add_flag='01'></td>";
      					 }
      					 var invenState;//是否已盘点
      					 if(inven_state != "00"){
      						 invenState = "未盘";
      					 }else{
      						 invenState = "已盘";
      					 }
      					 var isInven;//是否需要盘点
      					 var trHead;//资产信息的TR,用于过滤不需要盘点的资产
      					 if(is_inven == "00"){//需要盘点
      						 trHead = "<tr name='assetInfoList'>";
      						 isInven = "<td><select style='width:100%' name='inven_result' diccode='INV_DIC_LIST_INVEN_RESULT' val='" + inven_result + "'></select></td>";
      					 }else{
      						 trHead = "<tr name='noInvenAssetInfoList'>" ;
      						 isInven = "<td>不盘点</td>";
      					 }
      					 var tr = 	trHead
      					 			+ "<td>" + contract_no + "</td>"
      					 			+ "<td>" + guarantee_id + "</td>"
      					 			+ "<td>" + guarantee_name + "</td>"
      					 			+ "<td>" + warr_classify + "</td>"
      					 			+ "<td>" + warr_type + "</td>"
      					 			+ "<td name='property_num' >" + property_num + "</td>"
      					 			+ "<td>" + warr_status + "</td>"
      					 			+ "<td>" + area + "</td>"
      					 			+ "<td><span num="+property_num+" class='viewDetail' onClick='viewHistoryInvenInfo_handMakeResult(this)'>" + inven_times + "</span></td>"
      					 			+ isInven
      					 			+ "<td>" + invenState + "</td>"
       								+ "<td><input name='advice' type='text' value='" + advice + "'/></td>"
      					 			+ td_delStr +
      							  "</tr>";
      					table.append(tr);
      				 }
        		}else{//盘点内容类型为非权证类型
        			tTh = "<tr>" 
    						+ "<th width='8%'>资产编号</th>"
    						+ "<th width='8%'>资产名称</th>"
    						+ "<th width='8%'>资产类型</th>"
    						+ "<th width='8%'>所属部门</th>"
    						+ "<th width='8%'>存放地点</th>"
    						+ "<th width='8%'>设备状态</th>"
    						+ "<th width='8%'>实际使用人</th>"
    						+ "<th width='7%'>历史盘点次数</th>"
    						+ "<th width='8%'>盘点结果</th>"
    						+ "<th width='8%'>盘点状态</th>"
    						+ "<th width='8%'>是否支持自助盘点</th>"
    						+ "<th width='8%'>处理建议</th>"
    						+ "<th width='5%'>操作</th>"
    					+ "</tr>";
        			table.append(tTh);//加表头
        			for ( var i = 0; i < list.length; i++) {
   					 var map = list[i];
   					 var property_num = map.PROPERTY_NUM;
   					 var property_name = map.PROPERTY_NAME == undefined ? "" : map.PROPERTY_NAME;
   					 var property_type_name = map.PROPERTY_TYPE_NAME == undefined ? "" : map.PROPERTY_TYPE_NAME;
   					 var belong_dep_name = map.BELONG_DEP_NAME == undefined ? "" : map.BELONG_DEP_NAME;
   					 var real_address = map.REAL_ADDRESS == undefined ? "" : map.REAL_ADDRESS;
   					 var equipment_state_name = map.EQUIPMENT_STATE_NAME == undefined ? "" : map.EQUIPMENT_STATE_NAME;
   					 var real_user = map.REAL_USER == undefined ? "" : map.REAL_USER;
   					 var inven_result = map.INVEN_RESULT == undefined ? "01" : map.INVEN_RESULT;
   					 var advice = map.ADVICE == undefined ? "" : map.ADVICE;
   					 var inven_times = map.INVEN_TIMES;
   					 var new_add_flag = map.NEW_ADD_FLAG;
   					 var inven_state = map.INVEN_STATE;
   					 var is_self_inven = map.IS_SELF_INVEN;
   					 var is_inven = map.IS_INVEN;
   					 var td_delStr;
   					 if(new_add_flag == "00"){//是新增加进来的,则可操作删除
   						 td_delStr = "<td new_add_flag='00'><span class='viewDetail' onclick='deleteTr_shemeDetail(this)'>删除</span></td>";
   					 }else{
   						 td_delStr = "<td new_add_flag='01'></td>";
   					 }
   					 var invenState;//是否已盘点
   					 if(inven_state != "00"){
   						 invenState = "未盘";
   					 }else{
   						 invenState = "已盘";
   					 }
   					 var isSelfInven;//是否支持自助盘点
   					 if(is_self_inven != "00"){
   						 isSelfInven = "否";
   					 }else{
   						 isSelfInven = "是";
   					 }
   					 var isInven;//是否需要盘点
   					 var trHead;//资产信息的TR,用于过滤不需要盘点的资产
   					 if(is_inven == "00"){//需要盘点
   						 trHead = "<tr name='assetInfoList'>";
   						 isInven = "<td><select style='width:100%' name='inven_result' diccode='INV_DIC_LIST_INVEN_RESULT' val='" + inven_result + "'></select></td>";
   					 }else{
   						 trHead = "<tr name='noInvenAssetInfoList'>" ;
   						 isInven = "<td>不盘点</td>";
   					 }
   					 var tr = 	trHead
   					 			+ "<td name='property_num'>" + property_num + "</td>"
   					 			+ "<td>" + property_name + "</td>"
   					 			+ "<td>" + property_type_name + "</td>"
   					 			+ "<td>" + belong_dep_name + "</td>"
   					 			+ "<td>" + real_address + "</td>"
   					 			+ "<td>" + equipment_state_name + "</td>"
   					 			+ "<td>" + real_user + "</td>"
   					 			+ "<td><span num="+property_num+" class='viewDetail' onClick='viewHistoryInvenInfo_handMakeResult(this)'>" + inven_times + "</span></td>"
   					 			+ isInven
   					 			+ "<td>" + invenState + "</td>"
   					 			+ "<td>" + isSelfInven + "</td>"
    								+ "<td><input name='advice' type='text' value='" + advice + "'/></td>"
   					 			+ td_delStr +
   							  "</tr>";
   					table.append(tr);
   				 }
        	  }
    		autoInitSelect(table);
    		}
		}else{
			alert("初始化清单失败！");
		}
    });
}
}
//删除一行数据
function deleteTr_shemeDetail(obj){
	$(obj).parent().parent().remove();
}
//查看历史清单
function viewHistoryInvenInfo_handMakeResult(obj){
	 var asset_num=$(obj).attr("num");
	 openHistoryAssetPop($("#historyPop_handMakeResult"),asset_num);
}

