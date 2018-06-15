var sortingTreeObj;
function initSortingTree(){
	var setting = {
			async : {
				enable : true,
				url : "sorting/queryAllSorting.asp",
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
					var treeObj = $.fn.zTree.getZTreeObj("treeDemoSorting");
					treeObj.expandNode(treeObj.getNodeByTId("treeDemoSorting_1"), true, false, true);
					var menus=treeObj.getNodes();
					if(menus!=undefined){
						initSortingTree["data"]={};
						for(var i=0;i<menus.length;i++){
							setConfigNodeTId(menus[i],initSortingTree);
						}
					}
				},
				onClick : function(event, treeId, treeNode) {
					path={};
					pathId="";
					pathName="";
					var parents = getAllCategoryParentNodeId(treeNode);
					$("input[name='EEC.category_id']").attr("readOnly",true);
					//$("#SortingListTitle")[0].innerHTML="当前类别："+changePath(parents).realPathName;
					if(treeNode.level<1){//0级节点不能删除样式
						$("#delSorting").css({"cursor":"not-allowed","background-color":"#62BFAC"});
					}else{
						$("#delSorting").css({"cursor":"pointer","background-color":"#1AB394"});
					}
					//加载类别对应的字段配置
					reloadPrivateFieldTableSorting(treeNode.id);
					baseAjax(
							"sorting/findOneSortingInfo.asp",
							{
								category_id : treeNode.id
							},
							function(data) {
								var supNode=initSortingTree["data"][data["pre_category_id"]];
								if(supNode!=undefined){
									$("input[name='EEC.pre_category_name']").val(supNode.name);
									$("input[name='EEC.pre_category_id']").val(supNode.id);
								}else{
									$("input[name='EEC.pre_category_name']").val("");
									$("input[name='EEC.pre_category_id']").val("");
								}
								for ( var k in data) {
									$("input[name='EEC." + k + "']").val(data[k]);
								}
								data['category_id'] != undefined ? $("input[name='EEC.old_category_id']").val(data['category_id']) : "";
								data['description'] != undefined ? $("textarea[name='EEC.description']").val(data['description']) : "";
							});
				}
			}
		};
		$.fn.zTree.init($("#treeDemoSorting"), setting);
		sortingTreeObj = $.fn.zTree.getZTreeObj("treeDemoSorting");
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

//增加或修改类别
function updateOrAddSorting(url, msg, haveId){
	if (!vlidate($("#addSubject"), null, true)) {
		return;
	}
	var inputs=$("input[name^='EEC.']");
	var params={"menu_level":"0"};
	for ( var int = 0; int < inputs.length; int++) {
		params[$(inputs[int]).attr("name").substr(4)]=$(inputs[int]).val();
	}
	params["description"]=$("textarea[name='EEC.description']").val();
	if (params["pre_category_id"]!=undefined&&$.trim(params["pre_category_id"])) {
		var treeNode=initSortingTree["data"][params["pre_category_id"]];
		if (treeNode!=undefined&&treeNode.level!=undefined) {
			params["menu_level"]=treeNode.level+1;
		}
	}
	if (undefined!=haveId) {
		params["haveId"]=haveId;
	}
	baseAjax(url, params, function(data){
		if (data!=undefined&&data!=null&&data.result==true) {
			alert(msg+"成功");
			initSortingTree();
		}else{
			alert(data.msg+","+msg+"失败");
		}
	});
}


//初始化按钮
function initSortingButtonEvent(){
	$("#pre_category_name").focus(function(){
		openSelectTreeDiv($(this),"SortingTree", "sorting/queryAllSorting.asp",{width:$("#pre_category_name").width()+"px","margin-left": "0px"}, function(node){
			if ($("input[name='EEC.old_category_id']").val()==node.id) {
				return false;
			}
			$("input[name='EEC.pre_category_name']").val(node.name);
			$("input[name='EEC.pre_category_id']").val(node.id);
			return true;
		});
	});
	
	//添加资产
	$("#addMenuSorting").click(function(){
		$("input[name='EEC.category_id']").attr("readOnly",false);
		$("input[name^='EEC.']").val("");
		$("textarea[name='EEC.description']").val("");
		var selectsed=null;
		if (sortingTreeObj!=undefined) {
			selectsed=sortingTreeObj.getSelectedNodes();
		}
		if (selectsed!=undefined&&selectsed.length>0) {
			var selected=selectsed[0];
			$("input[name='EEC.pre_category_name']").val(selected.name);
			$("input[name='EEC.pre_category_id']").val(selected.id);
		}
		$("input[name='EEC.old_category_id']").val("");
		$("input[name='EEC.category_id']").focus();
	});
	//保存
	$("#saveSorting").click(function() {
		var old_category_id = $("#old_category_id").val();
		//如果没有旧的菜单编号则为创建
		if(""==$.trim(old_category_id)){
			updateOrAddSorting("sorting/addSortingConfig.asp", "添加");	
		}else{
			if($.trim($("#pre_category_id").val())!=""){
				var selectsed = sortingTreeObj.getSelectedNodes();
				if(selectsed==0){
					alert("请选择节点");
					return;
				}
				if(checkProChilderNodeHaveId(selectsed[0],$("#pre_category_id").val())){
					updateOrAddSorting("sorting/updateSortingConfig.asp", "修改",$("#pre_category_id").val());
				}else{
					updateOrAddSorting("sorting/updateSortingConfig.asp", "修改");
				}
			}else{
				updateOrAddSorting("sorting/updateSortingConfig.asp", "修改");
			}
		}
	});
	//删除
	$("#delSorting").click(function() {
		var selectsed = sortingTreeObj.getSelectedNodes();
		if(selectsed==0){
			alert("请选择节点");
			return;
		}
		if(selectsed[0].level<1){
			alert("该节点不能删除");
			return;
		}
		nconfirm("确定要删除该数据吗？",function(){
			var selected = sortingTreeObj.getSelectedNodes()[0];
			var nodeIds = getAllChilderNodeId(selected);
			baseAjax("sorting/delSortingConfig.asp", {
				category_ids : nodeIds
			}, function(data) {
				if (data != undefined && data != null && data.result == true) {
					initSortingTree();
				} else {
					alert("删除失败");
				}
			});
		});	
	});
	//重置
	$("#resetSorting").click(function(){
		$("#addSubject input").val("");
		$("#addSubject textarea").val("");
	});
	//新增类别字段
	$("#addFieldSorting").click(function(){
		$("#myModalField").modal("show");
		$("input[name^='EED.']").val("");
		$("textarea[name^='EED.']").val("");
		$("#UserworkSplace_img_element").attr("src","");
		initSelectPrivateField();
		$("input[name='EED.goods_id']").attr("readOnly",false);
		initUpload();
	});
	//修改类别字段
	$("#updateFieldSorting").click(function(){
		var param= $("#Sorting_table").bootstrapTable('getSelections');
		if (param.length!=1) {
			alert("请选择一条数据进行修改");
			return;
		}
		
		loadOneFieldInfo("修改",param[0]);
		initUpload();
	});
	//删除一条字段
	$("#delFieldSorting").click(function(){
		var selectedRow = $("#Sorting_table").bootstrapTable('getSelections');
		if(selectedRow.length != 1){
			alert("请选择一条数据进行删除！");
			return ;
		}
		
		var goods_id = $.map(selectedRow, function (row) {
			return row.GOODS_ID;                    
		});
	
		nconfirm("确定要删除该数据吗？",function(){
			baseAjax("sorting/deleteField.asp?goods_id="+goods_id, null, function(data){
				if(data!=undefined && data.result== true){
					var category_id = $("#old_category_id").val();
					reloadPrivateFieldTableSorting(category_id);
				}else{
					alert("删除失败!");
				}
			});
		});
	});
	//类别字段模态框保存
	$("#saveConfigureSorting").click(function(){
		var category_id = $("#old_category_id").val();
		if(category_id==undefined||category_id==""){
			alert("请先选择节点");
			return;
		}
		if(!vlidate($("#myModalField"),99999)){
			return;
		}
		var params={};
		params["category_id"] = category_id;
		var inputs = $("input[name^='EED.']");
		var selects = $("select[name^='EED.']");
		params["descr"]=$("textarea[name='EED.descr']").val();
		//取值
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(4)] = $(inputs[i]).val();	 
		}
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(4)] = $(selects[i]).val(); 
		}	
		//params["is_common"]="01";//非公共字段
		baseAjax("sorting/addOrUpdateField.asp",params,function(data){
			if(data != undefined && data != null && data.result == true ){
				alert("保存成功！");
				reloadPrivateFieldTableSorting(category_id);
				$("#myModalField").modal("hide");
			}else if(data != undefined && data != null && data.msg != undefined){
				alert(data.msg);
			}else{
				alert("网络错误!");
			}
		});
	});
	//类别字段重置按钮
	$("#resetConfigureSorting").click(function(){
		$("input[name^='EED.']").val("");
		$("textarea[name^='EED.']").val("");
		initSelectPrivateField();
	});
}

//加载一条字段信息
function loadOneFieldInfo(optMsg,param){
	$("#myModalField").modal("show");
	$("#myaddModalSorting").text(optMsg+"耗材资产");
	$("input[name='EED.goods_id']").attr("readOnly",true);
		for(var k in param){
			var k1=k.toLowerCase();		
			if(k1=="descr"){
				$("textarea[name='EED." +k1+ "']").val(param[k]);
			}else if(k1=="status"){
				$("select[name='EED." +k1+ "']").val(param[k]);
			}else{
				$("input[name='EED." + k1+ "']").val(param[k]);
			}
		}
		initSelect($("#EEDstatus"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"},param.STATUS);
		getCurrentPageObj().find("#UserworkSplace_img_element").attr("src","sorting/findImg.asp?path_id=UPLOAD_IMG&fid="+param.PIC);
}
//重新加载类别字段列表	
function reloadPrivateFieldTableSorting(category_id){
	  $('#Sorting_table').bootstrapTable('refresh',{url : 'sorting/queryAllPrivateField.asp?category_id='+category_id});
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
	$("#Sorting_table").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'sorting/queryAllPrivateField.asp?category_id=' +category_id,
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
					field : 'GOODS_ID',
					title : '物品编码',
					align : "center"
				}, {
					field : "GOODS_NAME",
					title : "物品名称",
					align : "center"
				}, {
					field : "BRAND",
					title : "品牌商标",
					align : "center"
				}, {
					field : "STANDARD",
					title : "规格型号",
					align : "center"
				}, {
					field : "QUANTITY",
					title : "单位",
					align : "center"
				}, {
					field : "STATUS_NAME",
					title : "状态",
					align : "center"
				}]
			});
	
}
//附件
function initUpload(){
	var ptObj=getCurrentPageObj().find("#UserworkSplace_img_file");
	
	ptObj.unbind("click");
	ptObj.click(function(){
		ptObj.unbind("click");
		var bef=$(this).val();
		var int=setInterval(function(){
			if (bef!=getCurrentPageObj().find("#UserworkSplace_img_file").val()) {
				startLoading();
				clearInterval(int);		
				
				$.ajaxFileUpload({
					url:"sorting/uploadImg.asp?path_id=UPLOAD_IMG&goods_id="+getCurrentPageObj().find("#EEDgoods_id").val(),
					type:"post",
					secureuri:false,
					fileElementId:'UserworkSplace_img_file',
					data:"",
					dataType:'json',
					success:function(msg){
						endLoading();
						initUpload();
						showWorkSplaceImg(msg.file_id);
					},
					error:function(msg){
						endLoading();
						initUpload();
					}
				});			
			}
		}, 300);
	});
	var pt_det=getCurrentPageObj().find(".img_delete");
	pt_det.unbind("click");
	pt_det.click(function(){
		nconfirm("是否删除？",function(){
			baseAjax("sorting/deleteImage.asp",{path_id:"UPLOAD_IMG",goods_id:getCurrentPageObj().find("#EEDgoods_id").val()},function(data){
				if (data&&data.result=="true") {
					removeImgSuccess();
				}else{
					alert("删除失败");
				}
			});
		});
	});
}
function loadWorkSplaceImg(i,ths){
	if(i==0){//加载成功
		getCurrentPageObj().find("#UserworkSplace_img_element").removeClass("whide");
		getCurrentPageObj().find(".editTabContListD").find(".uploadImg").addClass("whide");
		getCurrentPageObj().find(".img_delete").removeClass("whide");
	}else if(i==1){//加载失败
		removeImgSuccess();
	}
}
function showWorkSplaceImg(file_id){
	getCurrentPageObj().find("#UserworkSplace_img_element").attr("src","sorting/findImg.asp?path_id=UPLOAD_IMG&fid="+file_id);
}
function removeImgSuccess(){
	getCurrentPageObj().find("#UserworkSplace_img_element").addClass("whide");
	getCurrentPageObj().find(".editTabContListD").find(".uploadImg").removeClass("whide");
	getCurrentPageObj().find(".img_delete").addClass("whide");
}
function initSelectPrivateField(){
	//初始化数据
	initSelect($("#EEDstatus"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"});
}


initPrivateFieldTable("ertw");
initVlidate($("#addSubject"));
initVlidate($("#myModalField"));
initSortingTree();
initSortingButtonEvent();

	