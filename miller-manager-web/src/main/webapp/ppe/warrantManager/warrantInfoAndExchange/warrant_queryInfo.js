function initnewQueryWarrantEvent(param){
	var currTab = getCurrentPageObj();//当前页
	//赋值
	for(var k in param){
		currTab.find("span[name='wrt."+k+"']").html(param[k]);
	}
	//隐藏/显示
	if(param.WARR_CLASSIFY_NAME=="他项权证"){
		currTab.find("tr[sel='hide']").show();
	}
	if (param.WARR_STATUS_NAME=='借用') {
		currTab.find("tr[rel='warr']").show();
		currTab.find("span[name='cel']").show();
		currTab.find("span[name='wrt.RETURN_DATE']").show();
	}
	if (param.WARR_STATUS_NAME=='已注销') {
		currTab.find("tr[rel='warr']").show();
		currTab.find("span[name='gel']").show();
		currTab.find("span[name='wrt.EXECUTE_DATE']").show();
	}
	var serno=param.SERNO;//入库流水号
	var params={};
	params["SERNO"] = serno;
	//权证价值信息
	baseAjax("warrantInfoAndExchange/queryWarrantWorth.asp",params, function(data) {
		if (data != undefined && data != null&& data.result == true) {
			for(var k in data){
				if (k=="rows") {
					for(var b in data[k][0]){
						currTab.find("span[name='worth."+b+"']").html(data[k][0][b]);
					}
				}
			}
		}else{
			currTab.find("#warrant_listInfo").hide();
		}
	},true);
	
	//返回按钮
	currTab.find("#back_warrant").click(function(){
		newOpenTab("warrantExchange", "权证查询返回", "ppe/warrantManager/warrantInfoAndExchange/warrantInfoAndExchange_queryList.html");
	});
	//权证关联
	 initWarrantList(param["CONTRACT_NO"]);//初始化列表
	 function initWarrantList(contract_no){
		 var queryParams=function(params){
				var temp={
						limit: params.limit, //页面大小
						offset: params.offset //页码
				};
				return temp;
		};
		currTab.find("#table_warrantInfo").bootstrapTable('destroy').bootstrapTable({
			url:'warrantInfoAndExchange/queryWarrantByContract.asp?contract_no='+contract_no,//请求后台的URL（*）
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams :queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "ASSET_NUM", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			columns : [ {
				field : 'Number',
				title : '序号',
				align : "center",
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field : "CONTRACT_NO",
				title : '担保合同编号',
				align : "center"
			}, {
				field : "GUARANTEE_ID",
				title : '押品编号',
				align : "center"
			}, {
				field : "GUARANTEE_NAME",
				title : '押品名称',
				align : "center"
			},{
				field : "WARRANT_NO",
				title : "权证编号",
				align : "center",
				formatter : function(value,row,index){
					if(value){
						strInfo='<p><span style="font-size:20px;" class="viewDetail" onclick="viewWarrantInfo('+index+')">'+
						row.WARRANT_NO+'</span></p>'
					}
					return strInfo;
				}
			} , {
				field : "WARR_CLASSIFY_NAME",
				title : "权证分类",
				align : "center"
			}]
		});
	 }
	 //权证影像
	 currTab.find("#warrant_img_view_element1").attr("src",param.PHOTO_ID);
	 currTab.find("#warrant_img_view_element2").attr("src",param.PHOTO_ID);
	 currTab.find("#warrant_img_view_element3").attr("src",param.PHOTO_ID);
	 //权证出入库记录
	 initWarrantHistoryList(param["SERNO"]);//初始化列表
	 function initWarrantHistoryList(serno){
		 var queryParams=function(params){
				var temp={
						limit: params.limit, //页面大小
						offset: params.offset //页码
				};
				return temp;
		};
		currTab.find("#warrant_exit").bootstrapTable('destroy').bootstrapTable({
			url:'warrantInfoAndExchange/queryWarrantHistory.asp?serno='+serno,//请求后台的URL（*）
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams :queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			columns : [ {
				field : 'Number',
				title : '序号',
				align : "center",
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field : "STORAGE_TYPE_NAME",
				title : '出入库类型',
				align : "center"
			}, {
				field : "APPLY_USER_NAME",
				title : '申请人',
				align : "center"
			},{
				field : "EXECUTE_DATE",
				title : "出入库执行时间",
				align : "center"
			} , {
				field : "EXCHANGE_USER_NAME",
				title : "交接人",
				align : "center"
			}, {
				field : "APPROVE_USER_NAME",
				title : "审核人",
				align : "center"
			}]
		});
	 }
	 
	 initWarrantChangeList(param["SERNO"]);//初始化列表
	 function initWarrantChangeList(serno){
		 var queryParams=function(params){
				var temp={
						limit: params.limit, //页面大小
						offset: params.offset //页码
				};
				return temp;
		};
		currTab.find("#warrant_updateDate").bootstrapTable('destroy').bootstrapTable({
			url:'warrantInfoAndExchange/queryWarrantChange.asp?serno='+serno,//请求后台的URL（*）
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams :queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			columns : [ {
				field : 'Number',
				title : '序号',
				align : "center",
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field : "EXCHANGE_DATE",
				title : '变更日期',
				align : "center"
			}, {
				field : "EXCHANGE_TYPE_NAME",
				title : '变更类型',
				align : "center"
			}, {
				field : "ORIGINAL_VALUE",
				title : '原内容',
				align : "center"
			},{
				field : "NOW_VALUE",
				title : "变更后内容",
				align : "center"
			} , {
				field : "EXCHANGE_USER_NAME",
				title : "变更人",
				align : "center"
			}]
		});
	 }
	 //权证位置地图
	 /**
	  * 初始化楼层
	  * @param store_p_id
	  */
	 initWarrfloorSelect(param.AREA,param.FLOOR);
	 function initWarrfloorSelect(store_p_id,floor){
	 	//查询楼层信息 
		startLoading();
	 	baseAjax("cabinetsMap/findCabinetsMapSelectInfo.asp",{type:"floor",store_p_id:store_p_id},function(data){
	 		for(var i in data){
	 			if (data[i]['ITEM_CODE']==floor) {
	 				showWarrFloorWorkPlaceImg(data[i]["STORE_FILED"]);
				}
	 		}
	 		endLoading();
	 	});
	 }
	 /**
	  * 显示楼层图片
	  * @param file_id
	  */
	 function showWarrFloorWorkPlaceImg(file_id){
	 	currTab.find("#warrant_img_map_element").attr("src","cabinetsMap/imageFileViewToPage.asp?path_id=UPLOAD_IMG&fid="+file_id);
	 	}
	}
	function pageDispatchWarrantList(obj,key,params){
		 if(key=="exception"){
				newOpenTab("newWarrantInfo","权证详情","ppe/warrantManager/warrantInfoAndExchange/warrant_queryInfo.html",function(){
					initnewQueryWarrantEvent(params);
				});
			}
		}
	function viewWarrantInfo(index){
		var currTab = getCurrentPageObj();//当前页
		var data = currTab.find("#table_warrantInfo").bootstrapTable('getData');
		var warrant_no=data[index]['WARRANT_NO'];
		baseAjax("warrantInfoAndExchange/queryAllWarrant.asp",{warrant_no:warrant_no},function(data){
			pageDispatchWarrantList("","exception",data['rows'][0]);
	 	});
	}