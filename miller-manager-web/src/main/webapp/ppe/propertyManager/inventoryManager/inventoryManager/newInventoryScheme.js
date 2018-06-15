function initPlanInfo_newInventoryScheme(params){
	var currTab = getCurrentPageObj();//当前页
	initVlidate($("#tb_newInventoryScheme"));
	autoInitSelect($("#tb_newInventoryScheme"));
	initBtnEvent_newInventoryScheme();//初始化按钮事件
	for ( var k in params) {//初始化计划信息
		currTab.find("[name='NEWIS." + k + "']").html(params[k]);
		if(params.INVEN_CONTENT_TYPE == "00"){//权证类型
			currTab.find('[tspn="eState"]').hide();
		}
		if(k =="PRO_TYPE_NAME"){
			if(params[k].length > 15){
				var abbrText =params[k].substring(0, 13) + "......";
				val = '<abbr title="'+params[k]+'">' + abbrText + '</abbr>';
				currTab.find("[name='NEWIS." + k + "']").html(val);
			}
		}
	}
	currTab.find("#scheme_num_newInventoryScheme").val(returnSerialNumber("FA","ASS_SEQ_INV_SCHEME_SERIAL"));
/**********************************内部方法*************************************/
	//初始化按钮事件
	function initBtnEvent_newInventoryScheme(){
		//返回按钮
		currTab.find("[btn='back']").click(function(){
			newOpenTab("inventorySchemeList","返回","ppe/propertyManager/inventoryManager/inventoryManager/inventorySchemeList.html");
		});
		//下一步
		currTab.find("[btn='nextStep']").click(function(){
			if(!vlidate($("#tb_newInventoryScheme"))){
				return;
			}
			currTab.find(".show").hide();
			currTab.find(".hide").show();
			initListTble_newInventoryScheme();//生成清单
		});
		//上一步
		currTab.find("[btn='preStep']").click(function(){
			nconfirm("返回上一步清单将重置，是否返回？",function(){
				currTab.find(".hide").hide();
				currTab.find(".show").show();
			});
			
		});
		//保存
		currTab.find("[btn='save']").click(function(){
			var msg = "是否保存？";
			var data = currTab.find("#listTb_newInventoryScheme").bootstrapTable('getData');
			if(data.length<1){
				msg = "该方案下没有资产清单,是否也保存?";
			}
			nconfirm(msg,function(){
				 var inputs = currTab.find("[name^='INVENNS.']");
				 var inven_content_type = currTab.find("[name^='NEWIS.INVEN_CONTENT_TYPE']").html();//盘点内容类型
					var params = {};
					for (var i = 0; i < inputs.length; i++) {
						var obj = currTab.find(inputs[i]);
						params[obj.attr("name").substr(8)] = obj.val();
					}
					 var asset_id_str_arr=[];
					 for(var i=0;i<data.length;i++){
						 var asset_id_str="";
						 var is_inven = "";//是否盘点
						 var asset_id=data[i]["PROPERTY_NUM"];
						 var is_self_inven = "";
						 if(inven_content_type == "00"){//权证类型盘点，则默认是非自助盘点的
							 is_self_inven = "01"//非自助
						 }else if(inven_content_type == "01"){//非权证类型，则自助视情况而定
							 is_self_inven = data[i]["IS_SELF_INVEN"];
						 }
						 if($("#is_inven_"+i).is(":checked")){
							 is_inven = "00";//选择盘点
						 }else{
							 is_inven = "01";//不盘点
						 }
						 var not_inven_remark = $("#not_inven_remark_"+i).val();
						 asset_id_str = asset_id + "&&" + is_inven + "&&" + not_inven_remark + "&&" + is_self_inven;
						 asset_id_str_arr.push(asset_id_str);
					 }
					 params["INVEN_PATTERN"]=currTab.find('[name="INVENNS.INVEN_PATTERN"]').val();
					 params["ID"]=currTab.find('[name="NEWIS.ID"]').html();
					 params["ASSET_ID_STR_ARR"]=asset_id_str_arr;
					baseAjax("InventorySchemeManager/addScheme.asp", params, function(data) {
						if (data != undefined && data != null) {
							alert(data.msg);
							if(data.result=="true"){
								newOpenTab("inventorySchemeList","返回","ppe/propertyManager/inventoryManager/inventoryManager/inventorySchemeList.html");
							}
						}else{
							alert("网络错误！");
						}
					},true);
			});
		});
	}
	//生成清单
	function initListTble_newInventoryScheme(){
		var equipment_state = currTab.find('[name="NEWIS.EQUIPMENT_STATE"]').html();
		var inven_dep_id = currTab.find('[name="NEWIS.INVEN_DEP_ID"]').html();
		var pro_type_id = currTab.find('[name="NEWIS.PRO_TYPE_ID"]').html();
		var user_no = currTab.find('[name="NEWIS.USER_NO"]').html();
		var inven_content_type = currTab.find('[name="NEWIS.INVEN_CONTENT_TYPE"]').html();
		var queryParams = {
				equipment_state : equipment_state,
				inven_dep_id : inven_dep_id,
				pro_type_id : pro_type_id,
				user_no : user_no,
				inven_content_type : inven_content_type
		};
		var columns = new Array();
		if(inven_content_type =="01"){//盘点内容类型为非权证类型，加载对应的字段
			columns = [{
				field : 'ID',title : '序号',align : "center",
				formatter: function(value,row,index){
					return index+1;
				}	
			},{
				field: 'PROPERTY_NUM',title : '资产编号',align: 'center',
			},{
				field : 'PROPERTY_NAME',title : '资产名称',align : "center"
			}, {
				field : 'PROPERTY_TYPE_NAME',title : '资产类型',align : "center"
			}, {
				field : "BELONG_DEP_NAME",title : "所属部门",align : "center"
			},{
				field : "REAL_ADDRESS",title : "存放地点",align : "center"
			},{
				field : "REAL_USER",title : "实际使用人",align : "center"
			},{
				field : "EQUIPMENT_STATE_NAME",title : "资产状态",align : "center"
			},{
				field : "INVEN_TIMES",title : "历史盘点次数",align : "center",
				formatter:function(value,row,index){
					return '<span num='+row.PROPERTY_NUM+' class="viewDetail" '+
					'onClick="viewHistoryInvenInfo(this)">'+value+'</span>';
				}
			},{
				field : "LAST_DATE",title : "最后一次盘点时间",align : "center"
			},{
				field : "IS_SELF_INVEN_NAME",title : "是否可自助盘点",align : "center",
				formatter:function(value,row,index){
					if(row.IS_SELF_INVEN == "00"){//可自助盘点
						return '<span style="blue">是</span>';
					}else{
						return '<span>否</span>';
					}
				}
			},{
				field : 'opt',title : '是否盘点',align : "center",
				formatter:function(value,row,index){
					return '<input class="switch_btn" id="is_inven_'+index+'" type="checkbox" checked />';
				}
			},{
				field : 'opt',title : '不盘说明',align : "center",
				formatter:function(value,row,index){
					return '<input id="not_inven_remark_'+index+'" />';
				}
			}];
		}else if(inven_content_type =="00"){//盘点内容类型为权证类型，加载对应的字段
			columns = [{
				field : 'ID',title : '序号',align : "center",
				formatter: function(value,row,index){
					return index+1;
				}	
			},{
				field: 'CONTRACT_NO',title : '合同编号',align: 'center',
			},{
				field : 'GUARANTEE_ID',title : '押品编号',align : "center"
			}, {
				field : 'GUARANTEE_NAME',title : '押品名称',align : "center"
			}, {
				field : "WARR_CLASSIFY",title : "权证分类",align : "center"
			},{
				field : "WARR_TYPE",title : "权证类型",align : "center"
			},{
				field : "PROPERTY_NUM",title : "权证编号",align : "center"
			},{
				field : "AREA",title : "存放区域",align : "center"
			},{
				field : "INVEN_TIMES",title : "历史盘点次数",align : "center",
				formatter:function(value,row,index){
					return '<span num='+row.PROPERTY_NUM+' class="viewDetail" '+
					'onClick="viewHistoryInvenInfo(this)">'+value+'</span>';
				}
			},{
				field : "LAST_DATE",title : "最后一次盘点时间",align : "center"
			},{
				field : 'opt',title : '是否盘点',align : "center",
				formatter:function(value,row,index){
					return '<input class="switch_btn" id="is_inven_'+index+'" type="checkbox" checked />';
				}
			},{
				field : 'not_inven',title : '不盘说明',align : "center",
				formatter:function(value,row,index){
					return '<input id="not_inven_remark_'+index+'" />';
				}
			}];
		}
		$('#listTb_newInventoryScheme').bootstrapTable("destroy").bootstrapTable({
			url : 'InventorySchemeManager/productAssetListByParams.asp',//请求后台的URL（*）
			method : 'get', //请求方式（*）   
			queryParams : queryParams,//传递参数（*）
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			onLoadSuccess:function(data){
				setTimeout(function(){switch_btn_event()}, 5);//初始化开关样式
			},
			columns : columns
		});
	}
}
//删除资产方法
function deleteList_newInvS(obj){
	 var index=parseInt($(obj).attr("num"));
	 $('#listTb_newInventoryScheme').bootstrapTable('removeByUniqueId', index);
}
//查看盘点历史
function viewHistoryInvenInfo(obj){
	 var asset_num=$(obj).attr("num");
	 openHistoryAssetPop($("#pop_newInventoryScheme"),asset_num);
}
