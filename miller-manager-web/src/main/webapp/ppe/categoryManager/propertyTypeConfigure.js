var proTypeCofigZTreeObj;
function initProTypeConfigTree() {
	var currTab = getCurrentPageObj();//当前页
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
				onAsyncSuccess: function(){
					var treeObj = $.fn.zTree.getZTreeObj("propertyTypeTreeManager");
					treeObj.expandNode(treeObj.getNodeByTId("propertyTypeTreeManager_1"), true, false, true);
					var menus=treeObj.getNodes();
					if(menus!=undefined){
						initProTypeConfigTree["data"]={};
						for(var i=0;i<menus.length;i++){
							setConfigNodeTId(menus[i],initProTypeConfigTree);
						}
					}
				},
				onClick : function(event, treeId, treeNode) {
					path={};
					pathId="";
					pathName="";
					var parents = getAllCategoryParentNodeId(treeNode);
					$("input[name='PC.category_id']").attr("readOnly",true);
					$("#privateFieldListTitle")[0].innerHTML="当前类别："+changePath(parents).realPathName;
					if(treeNode.level<2){//0,1级节点不能删除样式
						$("#delProTypeConfig").css({"cursor":"not-allowed","background-color":"#62BFAC"});
					}else{
						$("#delProTypeConfig").css({"cursor":"pointer","background-color":"#1AB394"});
						
					}
					var areaType = treeNode.id == "0104" || treeNode.id == "01"? "0104" : getAreaType(proTypeCofigZTreeObj, treeNode.id);
					if(areaType == "0104"){//权证类型没有字段配置页签,对节点是01,0104的不做递归
						currTab.find("a[tabli='1']").click();
						currTab.find("li[tabli='2']").hide();
					}else{
						currTab.find("li[tabli='2']").show();
						//加载类别对应的字段配置
						reloadPrivateFieldTable(treeNode.id);
					}
					baseAjax(
							"propertyTypeConfig/findOneConfigInfo.asp",
							{
								category_id : treeNode.id
							},
							function(data) {
								var supNode=initProTypeConfigTree["data"][data["pre_category_id"]];
								if(supNode!=undefined){
									$("input[name='PC.pre_category_name']").val(supNode.name);
									$("input[name='PC.pre_category_id']").val(supNode.id);
								}else{
									$("input[name='PC.pre_category_name']").val("");
									$("input[name='PC.pre_category_id']").val("");
								}
								for ( var k in data) {
									$("input[name='PC." + k + "']").val(data[k]);
								}
								data['category_id'] != undefined ? $("input[name='PC.old_category_id']").val(data['category_id']) : "";
								data['description'] != undefined ? $("textarea[name='PC.description']").val(data['description']) : "";
							});
				}
			}
		};
		$.fn.zTree.init($("#propertyTypeTreeManager"), setting);
		proTypeCofigZTreeObj = $.fn.zTree.getZTreeObj("propertyTypeTreeManager");
		
		//递归获取父级id
		function getAreaType(treeObj, key){
			var nodes = treeObj.getNodesByParam("id", key, null);
			if(nodes[0].id == "0102" || nodes[0].id == "0103" || nodes[0].id == "0104" || nodes[0].id == "01"){
				return nodes[0].id;	
			} else {
				return getAreaType(treeObj,nodes[0].pid);
			}
		}
	}

	//新增或修改类别配置
	function updateOraddForCategory(url, msg, haveId,event) {
		//event.stopPropagation(); 	 //阻止事件冒泡，这个很重要。否则激活li 的click事件
		if(!vlidate($("#categoryConfigInfo"),"",true)){
			return;
		}
		var inputs = $("input[name^='PC.']");
		var params = {"menu_level":'0'};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(3)] = obj.val();
		}
		params["description"] = $("textarea[name='PC.description']").val();
		if(params["pre_category_id"] != undefined && $.trim(params["pre_category_id"])){
			var treeNode=initProTypeConfigTree["data"][params["pre_category_id"]];
			if(treeNode != undefined && treeNode.level != undefined){
				params["menu_level"]=treeNode.level+1;
			}
		}

		if(undefined != haveId){
			params["haveId"] = haveId;
		}
		baseAjax(url, params, function(data) {
			if (data != undefined && data != null && data.result == true) {
				alert(msg + "成功");
				initProTypeConfigTree();
			} else {
				alert(data.msg);
			}
		});
		
	}
	
	/**
	 * 判断节点的子节点是否有某个id
	 * @param node
	 * @returns {String}
	 */
	function checkProChilderNodeHaveId(node,id) {
		var nid = node.id;
		if(nid==id){
			return true;
		}
		if (node.children == undefined || node.children.length == undefined
				|| node.id == undefined) {
			return false;
		}
		for (var i = 0; i < node.children.length; i++) {
			if(checkProChilderNodeHaveId(node.children[i],id)){
				return true;
			}
		}
		return false;
	}
	
	
	/**
	 * 获取树的子节点
	 * @param node
	 * @returns {String}
	 */

	function getAllCategoryParentNodeId(node) {
		var nid = node.id;
		var name = node.name;
		if(node.pid!=undefined && node.pid!=""){
			var parentNode =node.getParentNode();
			pathId =pathId+node.id +"->";
			pathName = pathName+node.name +"->";
			getAllCategoryParentNodeId(parentNode);
			path.pathId=pathId;
			path.pathName=pathName;
		}else{
			pathId=pathId+nid;
			pathName=pathName+name;
			path.pathId=pathId;
			path.pathName=pathName;
		}
		return path;
	}
/**
 * 初始化按钮事件
 */
function initConfigButtonEventForCategory() {
//-----------------------------------配别配置中的按钮-------------------------------------------	
	//鼠标聚焦上一级类别编号输入框
	$("#pre_category_nameproperty").focus(function(){
		openSelectTreeDiv($(this),"proConfigSelectTree","propertyTypeConfig/queryAllCategroy.asp",{width:$("#pre_category_nameproperty").width()+"px","margin-left": "0px"},function(node){
			if($("input[name='PC.old_category_id']").val()==node.id){
				return false;
			}
			$("input[name='PC.pre_category_name']").val(node.name);
			$("input[name='PC.pre_category_id']").val(node.id);
			return true;
		});
	});
	
	//添加资产类别按钮
	$("#addCategoryConfig").click(function(){
		$("input[name ^='PC.']").val("");
		$("input[name ='PC.category_id']").val(returnTypeId("CAT_SEQ_TYPE_ID"));
		$("textarea[name='PC.description']").val("");
		var selectsed = null;
		if(proTypeCofigZTreeObj != undefined){
			selectsed = proTypeCofigZTreeObj.getSelectedNodes();
		}
		if(selectsed != undefined && selectsed.length>0){
			var selected = selectsed[0];
			$("input[name='PC.pre_category_id']").val(selected.id);
			$("input[name='PC.pre_category_name']").val(selected.name);
		}
		$("#old_category_idproperty").val("");
//		$("input[name='PC.category_id']").focus();
		$("input[name='PC.category_id']").attr("readOnly",false);
	});
	
	//保存类别配置按钮
	$("#saveProTypeConfig").click(function() {
		var old_category_idproperty = $("#old_category_idproperty").val();
		//如果没有旧的菜单编号则为创建
		if(""==$.trim(old_category_idproperty)){
			updateOraddForCategory("propertyTypeConfig/addProTypeConfig.asp", "添加");
		}else{
			if($.trim($("#pre_category_id").val())!=""){
				var selectsed = proTypeCofigZTreeObj.getSelectedNodes();
				if(selectsed==0){
					alert("请选择节点");
					return;
				}
				if(checkProChilderNodeHaveId(selectsed[0],$("#pre_category_id").val())){
					updateOraddForCategory("propertyTypeConfig/updateProTypeConfig.asp", "修改",$("#pre_category_id").val());
				}else{
					updateOraddForCategory("propertyTypeConfig/updateProTypeConfig.asp", "修改");
				}
			}else{
				updateOraddForCategory("propertyTypeConfig/updateProTypeConfig.asp", "修改");
			}
		}
	});
	
	//删除类别配置按钮
	$("#delProTypeConfig").click(function() {
		var selectsed = proTypeCofigZTreeObj.getSelectedNodes();
		if(selectsed==0){
			alert("请选择节点");
			return;
		}
		if(selectsed[0].level<2){
			alert("该节点不能删除");
			return;
		}
		nconfirm("确定要删除该数据吗？",function(){
			var selected = proTypeCofigZTreeObj.getSelectedNodes()[0];
			var nodeIds = getAllChilderNodeId(selected);
			baseAjax("propertyTypeConfig/delProTypeConfig.asp", {
				category_ids : nodeIds
			}, function(data) {
				if (data != undefined && data != null && data.result == true) {
					initProTypeConfigTree();
				} else {
					alert("删除失败");
				}
			});
		});	
	});
	//重置类别配置按钮
	$("#resetProTypeConfig").click(function(){
		$("#categoryConfigInfo input").val("");
		$("#categoryConfigInfo textarea").val("");
	});
	
//-------------------------------------字段配置按钮----------------------------------------------	
	
	//新增类别字段按钮
	$("#addPrivateField").click(function(){	
		//显示模态框
		$("#modalPrivateField").modal("show");
		$("tr[sel=tableColumnNameHide]").hide();
		$("input[name^='PF.']").val("");
		initSelectPrivateFieldproperty();
		$("#modalPrivateFieldTitle").text("新增字段信息");
	});
	//修改类别字段按钮
	$("#updatePrivateField").click(function(){
		loadOneFieldInfoproperty("修改");
	});
	//删除一条字段信息
	$("#delPrivateField").click(function(){
		var selectedRow = $("#privateFieldTable").bootstrapTable('getSelections');
		if(selectedRow.length != 1){
			alert("请选择一条数据进行删除！");
			return ;
		}
		var col_id = $.map(selectedRow, function (row) {
			return row.COL_ID;                    
		});
		nconfirm("确定要删除该数据吗？",function(){
			baseAjax("propertyFieldConfig/deleteField.asp?col_id="+col_id, null, function(data){
				if(data!=undefined && data.result== true){
					var category_id = $("#old_category_idproperty").val();
					reloadPrivateFieldTable(category_id);
				}else{
					alert("删除失败!");
				}
			});
		});
	});
	
//--------------------------------------模态框中按钮-------------------------------------------------------	
	//类别字段模态框的保存按钮
	$("#savePrivateField").click(function(){
		var category_id = $("#old_category_idproperty").val();
		if(category_id==undefined||category_id==""){
			alert("请先选择节点");
			return;
		}
		if(!vlidate($("#modalPrivateField"),99999)){
			return;
		}
		$("#modalPrivateField").modal("hide");
		var params={};
		params["category_id"] = category_id;
		var inputs = $("input[name^='PF.']");
		var selects = $("select[name^='PF.']");
		//取值
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val();	 
		}
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(3)] = $(selects[i]).val(); 
		}	
		params["is_common"]="01";//非公共字段
		baseAjax("propertyFieldConfig/addOrUpdateField.asp",params,function(data){
			if(data != undefined && data != null && data.result == true ){
				alert("保存成功！");
				reloadPrivateFieldTable(category_id);
			}else if(data != undefined && data != null && data.msg != undefined){
				alert(data.msg);
			}else if(data != undefined && data != null && data.result == false){
				alert("标签ID不能相同");
			}else{
				alert("网络错误!");
			}
		});
	});
	
	//类别字段重置按钮
	$("#resetPrivateField").click(function(){
		$("input[name^='PF.']").val("");
		initSelectPrivateFieldproperty();
	});
	
	//需要字典项时显示字典项输入框
	$("#M_tag_type").change(function() {
		var value = $("#M_tag_type").val();
		if(value == '02' || value =='03') {
			$("tr[sel=tableColumnNameHide]").show();
		} else {
			$("tr[sel=tableColumnNameHide]").hide();
		}
	});
}


//加载一条字段信息
function loadOneFieldInfoproperty(optMsg){
	var selectedRow = $("#privateFieldTable").bootstrapTable('getSelections');
	if(selectedRow.length != 1){
		alert("请选择一条数据进行"+optMsg+"！");
		return ;
	}
	var col_id = $.map(selectedRow, function (row) {
		return row.COL_ID;                    
	});
	$("#modalPrivateField").modal("show");
	$("#modalPrivateFieldTitle").text(optMsg+"类别字段");
	baseAjax("propertyFieldConfig/queryOneFieldInfo.asp?col_id="+col_id, null , function(data) {
		if(data["tag_type"] == "02"||data["tag_type"] == "03") {
			$("tr[sel=tableColumnNameHide]").show();
		} else {
			$("tr[sel=tableColumnNameHide]").hide();
		}
		for(var k in data){
			$("input[name='PF." + k + "']").val(data[k]);
			$("select[name='PF." + k + "']").val(data[k]);
		}
		//查询后，初始化下拉选的值
		initSelect($("#M_col_required"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"CAT_DIC_COL_REQUIRED"},data.col_required);
		initSelect($("#M_tag_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"CAT_DIC_TAG_TYPE"},data.tag_type);
	});
}


//重新加载类别字段列表	
function reloadPrivateFieldTable(category_id){
	  $('#privateFieldTable').bootstrapTable('refresh',{url : 'propertyFieldConfig/queryAllPrivateField.asp?category_id='+category_id});
  }
//初始化类别字段列表
function initPrivateFieldTable(category_id) {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#privateFieldTable").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'propertyFieldConfig/queryAllPrivateField.asp?category_id=' +category_id,
				method : 'get', //请求方式（*）   
				striped : true, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable :false, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "COL_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'Number',
					title : '序号',
					align : "center",
					//sortable: true,
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : 'COL_ID',
					title : '主键',
					align : "center",
					visible: false
				},{
					field : 'TAG_ID',
					title : '标签ID',
					align : "center"
				}, {
					field : "TAG_NAME",
					title : "标签名",
					align : "center"
				}, {
					field : "COL_REQUIRED",
					title : "是否必填",
					align : "center",
				}, {
					field : "TAG_TYPE",
					title : "标签类型",
					align : "center"
				}, {
					field : "MAX_LENGTH",
					title : "最大长度",
					align : "center"
				}, {
					field : "DIC_CODE",
					title : "字典项编号",
					align : "center"
				}, {
					field : "ORDER_ID",
					title : "排序序号",
					align : "center"
				}, {
					field : "DEFAULT_VALUE",
					title : "默认值",
					align : "center"
				}, {
					field : "INIT_TEMPLATE",
					title : "初始化模版",
					align : "center"
				}, {
					field : "CATEGORY_ID",
					title : "类别编号",
					align : "center",
					visible: false	
				}, {
					field : "CATEGORY_NAME",
					title : "所属类别",
					align : "center",
				}]
			});
	
}
	
//新增时初始化下拉选
function initSelectPrivateFieldproperty(){
	initSelect($("#M_col_required"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"CAT_DIC_COL_REQUIRED"});
	initSelect($("#M_tag_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"CAT_DIC_TAG_TYPE"});
}	
	
	initPrivateFieldTable("ertw");
	initVlidate($("#categoryConfigInfo"));
	initVlidate($("#modalPrivateField"));
	initProTypeConfigTree();
	initConfigButtonEventForCategory();
