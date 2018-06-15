//页面返回按钮
$("#backToSwfiList").click(function(){
	newOpenTab("processconfig","流程配置","workFlow/swfi/swfi_queryList.html",function(){});
});
//新增节点按钮（弹出摸态框）
function addNoteButton(){
	initVlidate($("#addNode_form"));
	//表单必填项
	$("input").focus(function() {
		$(this).siblings("div").remove();
	});
	$("select").change(function() {
		$(this).siblings("div[class^='tag-position']").remove();
	});
	$("textarea").focus(function() {
		$(this).siblings("div[class^='tag-position']").remove();
	});
	
	////新增模态框
	$("#addNote").click(function(){
		//清空模态框的值
		//var inputs =$("input[name^='ANO.']");
		
		$("input[name^='ANO.']").val('');
		$("select[name^='ANO.']").val('');
		$("textarea[name^='ANO.']").val('');
		//显示不同的保存按钮
		$("#addSaveNote").show();
		$("#updateSaveNote").hide();
		//显示模态框
		$("#noteInfoModal").modal("show");
		$("#n_wf_id").val($("#wf_id").val());
		//状态下拉框
		$("#Ais_start").empty();
	    $("#Ais_auto").empty();
		autoInitSelect($("#addNodeInfo"));
		autoInitRadio2("dic_code=WF_DIC_NODE_FLAG",$("#Ais_start"),"ANO.is_start",{type:"add"});
		autoInitRadio2("dic_code=WF_DIC_AUTO",$("#Ais_auto"),"ANO.is_auto",{type:"add"});
		onModalCloseEvent("noteInfoModal");
	});
	//保存
	$("#addSaveNote").click(function(){
		
	    //验证是否为空
		  if(!vlidate($("#addNode_form"),999999)){
			  return ;
		  }
		  var n_name =  $.trim($("#n_name").val());
	      var wf_id = $.trim($("#n_wf_id").val());
	      var is_start =  $.trim($("input[name='ANO.is_start']:checked").val());
	      var n_type =  $.trim($("#n_type").val());
	      var is_auto =  $.trim($("input[name='ANO.is_auto']:checked").val());
	      var n_v_type =  $.trim($("#n_v_type").val());
	      var r_name =  $.trim($("#r_name").val());
	      var r_exp =  $.trim($("#r_exp").val());
	      var order_id =  $.trim($("#order_id").val());
	      var n_state =  $.trim($("#n_state").val());
	      var memo =  $.trim($("#memo").val());
	      //判断序号是否重复
	      //console.info(n_id+"--"+n_name+"--"+wf_id+"--"+is_start+"--"+n_type+"--"+is_auto+"--"+n_v_type+"--"+n_value+"--"+order_id+"--"+n_state+"--"+memo);
	      var ok = true;
	      if(ok){
		        $.ajax({
		           url:"WFNode/queryOneNodeInfo.asp",
		           type:"post",
	    		   async :  false,
		           data:{"wf_id":wf_id,"order_id":order_id,"flag":"add"},
		           dataType:"json",
		           success:function(msg){
		        	   if(msg.result!="" && msg.result =="true"){
		        		   ok = false;
		        		   alert("排序号重复！请重新输入！");
		        	   }
		           }
		        });
		     }
	      if(ok){
  	        //发送Ajax请求save
  	        $.ajax({
  	           url:"WFNode/addNodeInfo.asp",
  	           type:"post",
	    	   async :  false,
  	           data:{"n_name":n_name,
  	        	  	    "wf_id":wf_id,
  	        	   		"is_start":is_start,
  	        	   		"n_type":n_type,
  	        	   		"is_auto":is_auto,
  	        	   		"n_v_type":n_v_type,
  	        	   		"r_name":r_name,
  	        	   		"r_exp":r_exp,
  	        	   		"order_id":order_id,
  	        	   		"n_state":n_state,
  	        	   		"memo":memo
  	        	},
  	           dataType:"json",
  	           success:function(msg){
  	        		if(msg.result!="" && msg.result == "true"){
  	        			alert("保存成功!");
  	        			$("#noteInfoModal").modal("hide");
  	        			$('#noteInfoTable')	.bootstrapTable('refresh',{url : "WFNode/queryAllNode4WF.asp?wf_id=" + wf_id	});
  	        		}else{
  	        			alert("保存失败!");
  	        		}
  	           }
  	        });
  	     }	 
	});
	//关闭
	$("#node_close").click(function(){
		onModalCloseEvent("noteInfoModal");
		$("#noteInfoModal").modal("hide");
	});
	
}
//修改按钮
function updNodeButton(ids){
		$("#updateSaveNote").show();
		$("#addSaveNote").hide();
		//弹出模态框
		$("#noteInfoModal").modal("show");
		//添加必填项星星
		initVlidate($("#addNode_form"));
		//表单必填项
		$("input").focus(function() {
			$(this).siblings("div").remove();
		});
		$("select").change(function() {
			$(this).siblings("div[class^='tag-position']").remove();
		});
		$("textarea").focus(function() {
			$(this).siblings("div[class^='tag-position']").remove();
		});
		//查询初始化赋值
        $.ajax({
	           url:"WFNode/queryOneNodeById.asp?n_id="+ids,
	           type:"post",
    		   async :  true,
	           data:{},
	           dataType:"json",
	           success:function(result){
	        	   	  $("#n_id").val(result.N_ID);
	        	   	  $("#r_id").val(result.R_ID);
		     	      $("#n_name").val(result.N_NAME);
		     	      $("#n_wf_id").val(result.WF_ID);
		     	      $("#r_name").val(result.R_NAME);
		     	      $("#r_exp").val(result.R_EXP);
		     	      $("#order_id").val(result.ORDER_ID);
		     	      $("#memo").val(result.MEMO);
		     	      $("#n_state").val(result.N_STATE);
		     	      $("#Ais_start").empty();
		     	      $("#Ais_auto").empty();
		    	      autoInitRadio2("dic_code=WF_DIC_NODE_FLAG",$("#Ais_start"),"ANO.is_start",{type:"update",value:result.IS_START});
		    	  	  autoInitRadio2("dic_code=WF_DIC_AUTO",$("#Ais_auto"),"ANO.is_auto",{type:"update",value:result.IS_AUTO});
		    	      initSelect($("#n_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_NODE_TYPE"},result.N_TYPE);
		    	      initSelect($("#n_v_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_NODE_VALUE"},result.N_V_TYPE);
		    	      initSelect($("#n_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_STATE"},result.N_STATE);
	           }
	        });	    	
}
//修改保存
function updateNode(){
	
	
	//保存
	$("#updateSaveNote").click(function(){
	    //验证是否为空
		  if(!vlidate($("#addNode_form"),999999)){
			  return ;
		  }
		  var n_id =  $.trim($("#n_id").val());
		  var r_id =  $.trim($("#r_id").val());
		  var n_name =  $.trim($("#n_name").val());
	      var wf_id = $.trim($("#n_wf_id").val());
	      var is_start =  $.trim($("input[name='ANO.is_start']:checked").val());
	      var n_type =  $.trim($("#n_type").val());
	      var is_auto =  $.trim($("input[name='ANO.is_auto']:checked").val());
	      var n_v_type =  $.trim($("#n_v_type").val());
	      var r_exp =  $.trim($("#r_exp").val());
	      var r_name =  $.trim($("#r_name").val());
	      var order_id =  $.trim($("#order_id").val());
	      var n_state =  $.trim($("#n_state").val());
	      var memo =  $.trim($("#memo").val());
//	      console.info(n_id+"--"+n_name+"--"+wf_id+"--"+is_start+"--"+n_type+"--"+is_auto+"--"+n_v_type+"--"+n_value+"--"+order_id+"--"+n_state+"--"+memo);
	      //判断序号是否重复
	      var ok = true;
	      if(ok){
		        $.ajax({
		           url:"WFNode/queryOneNodeInfo.asp",
		           type:"post",
	    		   async :  false,
		           data:{"wf_id":wf_id,"order_id":order_id,"flag":"update"},
		           dataType:"json",
		           success:function(msg){
		        	   if(msg.result!="" && msg.result =="true"){
		        		   ok = false;
		        		   alert("排序号重复！请重新输入！");
		        	   }
		           }
		        });
		     }
	      if(ok){
  	        //发送Ajax请求save
  	        $.ajax({
  	           url:"WFNode/updateNodeInfo.asp",
  	           type:"post",
	    	   async :  false,
  	           data:{"n_name":n_name,
		  	        	"n_id":n_id,
  	        	  	    "wf_id":wf_id,
  	        	  	    "r_id":r_id,
  	        	   		"is_start":is_start,
  	        	   		"n_type":n_type,
  	        	   		"is_auto":is_auto,
  	        	   		"n_v_type":n_v_type,
  	        	   		"r_exp":r_exp,
  	        	   		"r_name":r_name,
  	        	   		"order_id":order_id,
  	        	   		"n_state":n_state,
  	        	   		"memo":memo
  	        	},
  	           dataType:"json",
  	           success:function(msg){
  	        		if(msg.result!="" && msg.result == "true"){
  	        			alert("保存成功!");
  	        			$("#noteInfoModal").modal("hide");
  	        			$('#noteInfoTable')	.bootstrapTable('refresh',{url : "WFNode/queryAllNode4WF.asp?wf_id=" + wf_id	});
  	        		}else{
  	        			alert("保存失败!");
  	        		}
  	           }
  	        });
  	     }	 
	});
	//关闭
	$("#node_close").click(function(){
		onModalCloseEvent("noteInfoModal");
		$("#noteInfoModal").modal("hide");
	});
}

// 初始化节点配置页面
function pageDispatch_node(obj, key) {
	var id = $("#SWfiTableInfo").bootstrapTable('getSelections');
	if (id.length != 1) {
		alert("请选择一条数据进行配置!");
		return;
	}
	newOpenTab("note_config","节点配置","workFlow/swfi/swfi_noteConfig.html",function(){
		// 页面数据加载
		var wf_id = $.map(id, function(row) {
			return (row.WF_ID);
		});
		var wf_name = $.map(id, function(row) {
			return (row.WF_NAME);
		});
		var wf_state = $.map(id, function(row) {
			return (row.WF_STATE);
		});
		var wf_sys_name = $.map(id, function(row) {
			return (row.WF_SYS_NAME);
		});
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		$("#wf_id").val(wf_id);
		$("#wf_name").val(wf_name);
		$("#wf_state").val(wf_state);
		$("#wf_sys_name").val(wf_sys_name);
		initSelect($("#wf_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_STATE"},wf_state);
		initSelect($("#wf_sys_name"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_SYSTEM"},wf_sys_name);
		// 初始化字典项
		$('#noteInfoTable').bootstrapTable("destroy").bootstrapTable({
			url : "WFNode/queryAllNode4WF.asp?wf_id=" + wf_id, // 请求后台的URL（*）
			method : 'get', // 请求方式（*）
			striped : true, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination : true, // 是否显示分页（*）
			sortable : false, // 是否启用排序
			sortOrder : "asc", // 排序方式
			queryParams : queryParams, // 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 5, // 每页的记录行数（*）
			pageList : [ 5, 10 ], // 可供选择的每页的行数（*）
			strictSearch : true,
			clickToSelect : true, // 是否启用点击选中行
			uniqueId : "N_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,
			radio : true,
			columns : [ {
				field : 'state',
				checkbox : true,
				rowspan : 2,
				align : 'center',
				valign : 'middle'
			}, {
				field : 'N_ID',
				title : '节点ID',
				align : "center",
				visible:!1
			}, {
				field : 'ORDER_ID',
				title : '序号',
				align : "center"
			}, {
				field : 'N_NAME',
				title : '节点名称',
				align : "center"
			}, {
				field : "NODE_STATE",
				title : "节点状态",
				align : "center"
			}, {
				field : "NOTE_TYPE",
				title : "节点类型",
				align : "center"
			}, {
				field : "N_V_TYPE",
				title : "节点取值类型",
				align : "center",
				visible:!1
			}, {
				field : "NOTE_V_TYPE",
				title : "节点取值类型",
				align : "center"
			}, {
				field : "operation",
				title : "操作",
				align : "center",
				formatter:function(value,row,index){
					 var u_edit="<a style='color:#0088cc; cursor:pointer;' onclick=updNodeButton('"
						 +$.trim(row.N_ID)+"');>编辑</a>";
					 var d_edit="<a style='color:#0088cc; cursor:pointer;' onclick=delNodeButton('"
						 +$.trim(row.N_ID)+"');>删除</a>";
					 return u_edit+" / "+d_edit;
				 }
			}]
		});		
		
		//新增
		addNoteButton();
		//修改
		updateNode();
		//返回
		//Node_return();
	});
}

//模态框重置按钮
function resetNoteButton(){
	$("#resetNote").click(function(){
	      $("#n_name").val("");
	      $("#r_name").val("");
	      $("#r_exp").val("");
	      $("#order_id").val("");
	      $("#memo").val("");
	      $("#n_state").val("");
	      $("#Ais_start").empty();
	      $("#Ais_auto").empty();
	      autoInitRadio2("dic_code=WF_DIC_NODE_FLAG",$("#Ais_start"),"ANO.is_start",{type:"update"});
	  	  autoInitRadio2("dic_code=WF_DIC_AUTO",$("#Ais_auto"),"ANO.is_auto",{type:"update"});
	      initSelect($("#n_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_NODE_TYPE"});
	      initSelect($("#n_v_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_NODE_VALUE"});
	      initSelect($("#n_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_STATE"});
	});
}
//删除
function delNodeButton(n_id) {
	var wf_id = $('#wf_id').val();
	// 删除表格中的一条数据
		nconfirm('是否删除?',function() {
			$.ajax({
				type : "post",
				url : "WFNode/deleteNodeInfo.asp?n_id="+ n_id,
				async : true,
				dataType : "json",
				success : function(msg) {
					$('#noteInfoTable')	.bootstrapTable('refresh',{url : "WFNode/queryAllNode4WF.asp?wf_id=" + wf_id	});
				},
				error : function() {
					alert("删除失败！");
				}
			});
		});
}
//初始化重置按钮
resetNoteButton();
