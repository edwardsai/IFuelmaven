 function initNewInventoryPlanBtnAndSelectEvent(params){		//params新增修改标识
	 var currTab = getCurrentPageObj();							//当前页
	 initVlidate(currTab.find("#infoDiv_newInventoryPlan"));	//渲染必填项
	 var inven_type = "";
	 var inven_content_type = "";
	 var equipment_state = "";
	 if(params){
		 inven_type = params.INVEN_TYPE;
		 inven_content_type = params.INVEN_CONTENT_TYPE;
		 equipment_state = params.EQUIPMENT_STATE;
		 initInventoryPlanInfo(params);							//修改时初始化数据
	 }else{
		 initInventoryPlanUserInfo();							//新增时初始化发起人信息
		 currTab.find("#plan_num_newInventoryPlan").val(returnSerialNumber("PD","ASS_SEQ_INV_PLAN_SERIAL"));
	 }
	 initSelect(currTab.find('[name="INVENP.INVEN_TYPE"]'),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"INV_DIC_INVEN_TYPE"},inven_type);
	 initSelect(currTab.find('[name="INVENP.INVEN_CONTENT_TYPE"]'),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"INV_DIC_INVEN_CONTENT_TYPE"},inven_content_type);
	 var statesObj = currTab.find('[name="INVENP.EQUIPMENT_STATE"]');
	 initSelect(statesObj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"PRO_DIC_EQUIPMENT_STATE"},null, null," ");
	 if(equipment_state){//如果设备状态有选
		 currTab.find("span[tspn='eState']").show();
		 statesObj.select2().val(equipment_state.split(",")).trigger("change");
	 }
	//选择资产类型：
	currTab.find("[name='INVENP.INVEN_CONTENT_NAME']").click(function(){
		var content_type = $.trim(currTab.find('[name="INVENP.INVEN_CONTENT_TYPE"]').val());
		var noChooseZtreeObj = "";
		if(!content_type){
			alert("请先选择盘点内容类型");
			return;
		}else if(content_type == "00"){//权证类型
			noChooseZtreeObj = "0102&&0103";
		}else if(content_type == "01"){//非权证类型
			noChooseZtreeObj = "0104";//权证类型
		}
		var uuid=Math.uuid();
		var objId=currTab.find("[name='INVENP.INVEN_CONTENT_ID']");
		openMuiltipleSelectTreeDiv($(this),objId,"proConfigSelectTreeType_invPlan",uuid,"propertyTypeConfig/queryAllCategroy.asp",{width:$(this).width()+"px","margin-left": "0px"},noChooseZtreeObj,function(node){
			currTab.find("[name='INVENP.INVEN_CONTENT_NAME']").val(node.name);
			objId.val(node.id);
			return true;
		});
	});
	//选择区域：
	 currTab.find("[name='INVENP.INVEN_SCOPE_NAME']").click(function(){
		var uuid=Math.uuid();
		var objId=currTab.find("[name='INVENP.INVEN_SCOPE_ID']");
		openMuiltipleSelectTreeDiv($(this),objId,"proConfigSelectTreeScope_invPlan",uuid,"SOrg/queryorgtreelist.asp",{width:$(this).width()+"px","margin-left": "0px"},null,function(node){
			currTab.find("[name='INVENP.INVEN_SCOPE_NAME']").val(node.name);
			objId.val(node.id);
			return true;
		});
	});
	 
	 //盘点内容类型事件
	 var conTypeObj = currTab.find('[name="INVENP.INVEN_CONTENT_TYPE"]');
	 var old_inven_content_type =  conTypeObj.val();//判断内容类型是否发生改变
	 conTypeObj.bind('change',function(){
		 if(!old_inven_content_type){
			 old_inven_content_type = $(this).val();
		 }
		 if($(this).val() == "00"){//权证类型
			 currTab.find("span[tspn='eState']").hide();
			 currTab.find('[name="INVENP.EQUIPMENT_STATE"]').select2().val("").trigger("change");
		 }else{
			 currTab.find("span[tspn='eState']").show();
		 }
		 if(old_inven_content_type != $(this).val()){//发生改变,清空所选类型
			 currTab.find("[name='INVENP.INVEN_CONTENT_ID']").val("");
			 currTab.find("[name='INVENP.INVEN_CONTENT_NAME']").val("");
			 old_inven_content_type = $(this).val();
		 }
	 });
	 
	 //下一步
	 currTab.find("[btn='nextStep']").click(function(){
		 if(!vlidate(currTab.find("#infoDiv_newInventoryPlan"))){
			 return;
		 }
		 currTab.find(".hide").show();
		 currTab.find(".show").hide();
		 var scope_id=currTab.find("[name='INVENP.INVEN_SCOPE_ID']").val();
		 var conType = currTab.find('[name="INVENP.INVEN_CONTENT_TYPE"]').val();
		 var role_no = "";
		 if(conType == "00"){//权证类型
			 role_no = "wrtManager"//权证管理员角色编号
		 }else if(conType == "01"){//非权证类型
			 role_no = "ppe_02"//资产管理员角色编号
		 }
		 initSchemeList_newInvP(scope_id,role_no);//加载方案列表
	 });
	//上一步
	 currTab.find("[btn='preStep']").click(function(){
		 nconfirm("返回上一步将清空方案信息，是否返回？",function(){
			 currTab.find(".hide").hide();
			 currTab.find(".show").show();
		 });
	 });
	 
	 //保存按钮
	 currTab.find('[btn="save"]').bind('click', function(e) {
		 saveOrSubmit_newInvPEvent('06');//盘点执行状态为待发起--字典项06
	 });
	//保存&提交按钮
	 currTab.find('[btn="submit"]').bind('click', function(e) {
		 saveOrSubmit_newInvPEvent('03');//盘点执行状态为执行中--字典项03;		01待制定方案,02待执行,04已完成,05已生成报告
	 });
	 //返回按钮
	 currTab.find('[btn="back"]').bind('click', function(e) {
		 nconfirm("确定返回？",function(){
			 newOpenTab("inventoryPlanList","盘点计划列表","ppe/propertyManager/inventoryManager/inventoryPlan/inventoryPlanList.html",function(){});
		 });
	 }); 
	 //重置按钮
	 currTab.find('[btn="reset"]').click(function() {
		 nconfirm("确认重置？",function(){
			 if(params){
				 initInventoryPlanInfo(params);
				 setSelected(currTab.find("[name='INVENP.INVEN_TYPE']"),params.INVEN_TYPE);
				 setSelected(currTab.find("[name='INVENP.INVEN_CONTENT_TYPE']"),params.INVEN_CONTENT_TYPE);
				 var statesObj =  currTab.find('[name="INVENP.EQUIPMENT_STATE"]');
				 if(statesObj.val()){
					 statesObj.select2().val(params.EQUIPMENT_STATE.split(",")).trigger("change");
				 }
			 }else{
				 currTab.find("#infoDiv_newInventoryPlan textarea,select,input:not(#plan_num_newInventoryPlan)").val("");
				 currTab.find("#infoDiv_newInventoryPlan select").select2();
				 initInventoryPlanUserInfo();
			 }
		 });
	 }); 
	 //删除按钮
	 currTab.find('[btn="deleteTr"]').click(function() {
		 var id = currTab.find("#tb_newInventoryPlan").bootstrapTable('getSelections');
		 for(var i = 0; i < id.length; i++){
			 currTab.find('#tb_newInventoryPlan').bootstrapTable('removeByUniqueId', id[i].ID);
			 var data= $('#tb_newInventoryPlan').bootstrapTable('getData');
			 initInvAssetTypeSel(data.length);
		 }
	 });
/**************************************内部方法****************************************/
	//初始化计划负责人信息
	 function initInventoryPlanUserInfo(){
		 currTab.find('[name="INVENP.PLAN_EMP"]').val($("#main_user_name").attr("user_no"));
		 currTab.find('[name="INVENP.PLAN_EMP_NAME"]').val($("#main_user_name").attr("user_name"));
	 }
	 //初始化计划信息
	 function initInventoryPlanInfo(params){
		  for( var k in params) {
			currTab.find("[name='INVENP." + k + "']").val(params[k]);
		  }
	 }
	 //保存方法
	 function saveOrSubmit_newInvPEvent(state){
		 var msg="是否保存？";
		 if(state=="03"){
			msg="是否提交？";
		 }
		 nconfirm(msg,function(){
			 var objs = currTab.find("[name^='INVENP.']");
				var params = {};
				for (var i = 0; i < objs.length; i++) {
					var obj = $(objs[i]);
					params[obj.attr("name").substr(7)] = obj.val();
				}
				var estates=$('[name="INVENP.EQUIPMENT_STATE"]');
				if(estates.val()){
					params["EQUIPMENT_STATE"] = estates.val().join(",");
					var estates_name = "";
					for(var j = 0;j < estates.select2("data").length; j ++){
						estates_name += estates.select2("data")[j].text + ",";
					}
					params["EQUIPMENT_STATE_NAME"] = estates_name.substring(0, estates_name.length - 1);
				}
				params["STATE"]=state;
				/*下面取方案列表信息*/
				var schemeList = [];
				var inven_scope_id = "";//盘点区域重新获取,应该与最后选择哪些部门为主
				var inven_scope_name = "";
				var data= $('#tb_newInventoryPlan').bootstrapTable('getData');
				if(data.length < 1){
					alert("无盘点部门,请重新选择盘点部门");
					return;
				}
				for(var i=0;i<data.length;i++){
					var inven_emp_id=data[i]["USER_NO"];
					if(!inven_emp_id){
						alert("请删除未分配资产管理员的部门！");
						return;
					}
					var inven_dep_id = data[i]["ORG_CODE"];
					var inven_dep_name = data[i]["ORG_NAME"];
					inven_scope_id += inven_dep_id + ",";
					inven_scope_name += inven_dep_name + ",";
					var selObj=$('select[tp="type_'+i+'"]');
					var pro_type_id = selObj.val().join(",");
					var pro_type_name = "";
					for(var j = 0;j < selObj.select2("data").length; j ++){
						pro_type_name += selObj.select2("data")[j].text + ",";
					}
					pro_type_name = pro_type_name.substring(0, pro_type_name.length - 1);
					schemeList.push(inven_emp_id + "&&" + inven_dep_id + "&&" + pro_type_id + "&&" + pro_type_name);
				}
				params["INVEN_SCOPE_ID"] = inven_scope_id.substring(0, inven_scope_id.length - 1);
				params["INVEN_SCOPE_NAME"] = inven_scope_name.substring(0, inven_scope_name.length - 1);
				params["SCHEME_LIST"] = schemeList;
				baseAjax("InventoryPlanManager/newPlan.asp", params, function(data) {
					if (data != undefined && data != null) {
						alert(data.msg);
						if(data.result=="true"){
							newOpenTab("inventoryPlanList","盘点计划列表","ppe/propertyManager/inventoryManager/inventoryPlan/inventoryPlanList.html",function(){});
						}
					}else{
						alert("网络出错,稍后重试！");
					}
				},true);
		 });
	 }
	 function initSchemeList_newInvP(scope_id,role_no){
		 var conType = currTab.find('[name="INVENP.INVEN_CONTENT_TYPE"]').val();
		 var MgrTitle = "";
		 if(conType == "00"){//权证类型
			 MgrTitle = "权证管理员";//权证管理员角色编号
		 }else if(conType == "01"){//非权证类型
			 MgrTitle = "资产管理员";//资产管理员角色编号
		 }
		$('#tb_newInventoryPlan').bootstrapTable("destroy").bootstrapTable({
			url : 'InventoryPlanManager/findScopeEmp.asp?scope_id='+scope_id+'&role_no='+role_no,//请求后台的URL（*）
			method : 'get', //请求方式（*）   
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
			singleSelect: false,
			onLoadSuccess:function(data){
				initInvAssetTypeSel(data.rows.length);
			},
			columns : [{
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			}, {
				field : 'Number',//查询有ID字段
				title : '序号',
				align : "center",
				formatter: function (value, row, index) {
					return index + 1;
				}
			},{
				field : 'ORG_NAME',
				title : '盘点部门名称',
				align : "center"
			}, {
				field : 'USER_NAME',
				title : MgrTitle,
				align : "center",
				formatter: function (value, row, index) {
					if(!value){
						return '<span style="color:red">未分配</span>';
					}else{
						return value;
					}
				}
			}, {
				field : 'ASSET_TYPE',
				title : '资产类型',
				align : "center",
				width : "400px",
				formatter: function (value, row, index) {
					var typeStr='<select multiple="multiple" style="width:220px" tp="type_'+index+'"></select>';
					return typeStr;
				}
			}]
		});
	 }
	 /**
		 * 
		 * @param obj=$("#input")
		 * @param treeId=树形下拉的ID
		 * @param url
		 * @param callback
		 */
		function openMuiltipleSelectTreeDiv(obj,objId,treeId,uuid,url,css,noShowId,callback){
			var btnId=Math.uuid();
			if(!$("#"+uuid)[0]){
				var marginleft=""; if(css["margin-left"]){marginleft="margin-left:"+css["margin-left"]+";";};
				var width=""; if(css.width){width="width:"+css.width+";";};
				var height="height:250px;"; if(css.height){height="height:"+css.height+";";};
				obj.after('<div id="'+uuid+'" style="'+marginleft+' overflow-y: scroll;z-index: 1000;background-color: white;border:1px solid #CDCDCD;'+height+'position:absolute;'+width+'"><div id="'+treeId+'" class="ztree"></div><div align="center"><button id="'+btnId+'" style="margin-bottom:3px" class="btns">确定</button></div></div>');
			}else{
				if(css.width){
					$("#"+uuid).css("width",css.width);
				}
				$("#"+uuid).show();
			}
			$("#body").mousedown(function(){
				$("#body").unbind("mousedown");
				$("#"+uuid).hide();
			});
			$("#"+uuid).mouseout(function(){
				$("#body").unbind("mousedown");
				$("#body").mousedown(function(){
					$("#"+uuid).hide();
					$("#body").unbind("mousedown");
				});
			});
			$("#"+uuid).mouseover(function(){
				$("#body").unbind("mousedown");
			});

				var setting = {
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
						}
					};
					setting.check= {
						enable: true,
						chkboxType:{ "Y" : "s", "N" : "s" }
					};
					$.getJSON(url, function(result){
						for(var key in result){
							if(!result[key].pid){
								result.splice(key, 1);
							}
						}
						var treeObj = $.fn.zTree.init($("#"+treeId), setting, result);
						var id=objId.val();
						if(id){
							var ids=id.split(',');
							for(var i=0;i<ids.length;i++){
								var selectObj=treeObj.getNodeByParam("id",ids[i]);
								treeObj.checkNode(selectObj, true, false);
							}
						}
						if(noShowId){
							var idArr = noShowId.split("&&");
							for(var j = 0; j < idArr.length; j++){
								var selectNoObj=treeObj.getNodeByParam("id",idArr[j]);
								treeObj.removeNode(selectNoObj);
							}
						}
						
						
					});
					$("#"+btnId).click(function(){
						var nodeName="";
						var nodeId="";
						var treeObj = $.fn.zTree.getZTreeObj(treeId);
						var nodes = treeObj.getCheckedNodes();
						for(var i=0;i<nodes.length;i++){
								nodeName=nodeName+nodes[i].name+',';
								nodeId=nodeId+nodes[i].id+',';
						}
						if(callback){
							var c=callback({name:nodeName.substring(0,nodeName.length-1),id:nodeId.substring(0,nodeId.length-1)});
							if(c==undefined||c==true){
								$("#"+uuid).hide();
							}
						}else{
							$("#"+treeId).hide();
						}
					});
		}
	 
}
 //加载资产类型下拉框
 function initInvAssetTypeSel(num){
	 var content_name=$("input[name='INVENP.INVEN_CONTENT_NAME']").val();
	 var content_id=$("input[name='INVENP.INVEN_CONTENT_ID']").val();
	 for(var j=0;j<num;j++){
			var content_names=content_name.split(",");
			var content_ids=content_id.split(",");
			var dataInfo=[];
			for(var i=0;i<content_names.length;i++){
				var params={"ITEM_CODE":content_ids[i],"ITEM_NAME":content_names[i]};
				dataInfo.push(params);
			}
			selectAppendByData($('select[tp="type_'+j+'"]'),{value:"ITEM_CODE",text:"ITEM_NAME"},dataInfo);
			$('select[tp="type_'+j+'"]').select2().val(content_id.split(",")).trigger("change");
		}
 }
 //删除方法
 function delete_invenSchemeList_newInvP(obj){
	 var index=parseInt($(obj).attr("num"));
	 $('#tb_newInventoryPlan').bootstrapTable('removeByUniqueId', index);
	 var data= $('#tb_newInventoryPlan').bootstrapTable('getData');
	 initInvAssetTypeSel(data.length);
 }