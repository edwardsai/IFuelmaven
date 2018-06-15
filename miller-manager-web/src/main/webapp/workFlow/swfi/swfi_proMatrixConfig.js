//加载模态框节点列表
function initeNodeModlTable(Mwf_id){
	//初始化table
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#up_MatrixModalTab").bootstrapTable("destroy").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'SWfi/queryAllNode4WF.asp?Mwf_id='+Mwf_id,
				method : 'get', //请求方式（*）   
				striped : true, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				//pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "N_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: false,
				columns : [ {
					field: 'ORDER_ID',
					title : '排序号',
					align: 'center'
				},{
					field : 'N_NAME',
					title : '节点名称',
					align : "center"
				}, {
					field : "NOTE_TYPE",
					title : "节点类型",
					align : "center"
				}, {
					field : "NOTE_V_TYPE",
					title : "节点取值类型",
					align : "center"
				}, {
					checkbox:true,
					title:"选择",
					align: 'center',
					valign: 'middle'
				}]
			});
	
}
//加载模态框节点列表
function initeNodeModlTable_u(Mwf_id){
	//初始化table
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#up_MatrixModalTab").bootstrapTable("destroy").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'SWfi/queryAllNode4WF.asp?Mwf_id='+Mwf_id,
				method : 'get', //请求方式（*）   
				striped : true, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				//pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "N_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: false,
				columns : [ {
					field: 'ORDER_ID',
					title : '排序号',
					align: 'center'
				},{
					field : 'N_NAME',
					title : '节点名称',
					align : "center"
				}, {
					field : "NOTE_TYPE",
					title : "节点类型",
					align : "center"
				}, {
					field : "NOTE_V_TYPE",
					title : "节点取值类型",
					align : "center"
				}, {
					checkbox:true,
					title:"选择",
					align: 'center',
					valign: 'middle',
					formatter:checkedFormatter
				}]
			});
	
}
function checkedFormatter(value, row, index) {
	var rote_vs=rote_v.split(",");
	for(var i=0;i<=index;i++){
		if(row.N_ID===rote_vs[i]){
			return {
                checked: true
			};
		}
	}
	return value;
}
//点击列表中的修改按钮，弹出修改摸态框
var rote_v ="";
function updButton(index){
	var data = $("#matixTableInfo").bootstrapTable("getData");
	var r_name = data[index].R_NAME;
	var r_exp = data[index].R_EXP;
	var r_id = data[index].R_ID;
	var m_rote_v = data[index].M_ROTE_V;
	var m_id = data[index].M_ID;
	var m_state = data[index].M_STATE;
	rote_v =m_rote_v;
	//显示摸态框
	$("#updateMatrixModal").modal("show");
	$("#up_submitModlMatrix").unbind("click");
	//显示不同的保存对象
	$("#up_submitModlMatrix").show();
	$("#submitModlMatrix").hide();
	//初始化必填项
	initVlidate($("#update_modl"));
	//获取流程id
	var Mwf_id = $("#Mwf_id").val();
	//赋值输入框
	$("#up_modl_r_name").val(r_name);
	$("#up_modl_r_exp").val(r_exp);
	initSelect($("#up_modl_m_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_STATE"},m_state);
	//初始化列表
	initeNodeModlTable_u(Mwf_id);
	//保存
	update_saveButton(Mwf_id,r_id,m_id);

}
//修改摸态框关闭按钮
$("#up_closeModl").click(function(){
	$("#updateMatrixModal").modal("hide");
});
function update_saveButton(Mwf_id,r_id,m_id){
	//修改摸态框保存按钮
	$('#up_submitModlMatrix').one('click', function(e) {
		if($("input[type='checkbox']").is(':checked')){
			//必填项校验
			if(!vlidate($("#update_modl"),999999)){
				  return ;
			  }
			//获取输入框数据
			var modl_r_name = $.trim($("#up_modl_r_name").val());
			var modl_r_exp = $.trim($("#up_modl_r_exp").val());
			var modl_m_state = $.trim($("#up_modl_m_state").val());
			$("#up_submitModlMatrix").unbind("click");
			//获取选中节点数据
			var records = $("#up_MatrixModalTab").bootstrapTable('getSelections');
			var params={"records":JSON.stringify(records),"wf_id":Mwf_id,"r_name":modl_r_name,"r_exp":modl_r_exp,"r_id":r_id,"m_state":modl_m_state};
			//ajax请求发送参数到后台插入数据库表
			baseAjax("SWfi/updateOneMatrixInfo.asp?m_id="+escape(encodeURIComponent(m_id)),params, function(data) {
	        	if (data != undefined&&data!=null&&data.result=="true") {
					//alert("修改成功");
					//刷新矩阵页面table
					$("#matixTableInfo").bootstrapTable('refresh',{url:'SWfi/queryAllMatrixById.asp?Mwf_id='+Mwf_id});
					$("#updateMatrixModal").modal("hide");
				}else{
					//alert("修改失败");
				}
			});
			
			
		}else{
			e.preventDefault();
	        $.Zebra_Dialog('请选择一条或多条节点记录进行修改!', {
	            'type':     'close',
	            'title':    '提示',
	            'buttons':  ['是'],
	            'onClose':  function(caption) {
	            	if(caption=="是"){
	            	}
	            }
	        });
		}
	});
}

//点击列表中的删除按钮，删除该记录
function delButton(r_id,m_id){
	//获取流程id
	var Mwf_id = $("#Mwf_id").val();
	// 删除表格中的一条数据
	nconfirm('是否删除?',function() {
		$.ajax({
			type : "post",
			url : "SWfi/deleteOneMatInfo.asp?r_id="+r_id+"&m_id="+m_id,
			async : true,
			data : "",
			dataType : "json",
			success : function(msg) {
				//alert("删除成功！");
				$('#matixTableInfo').bootstrapTable('refresh',{url : 'SWfi/queryAllMatrixById.asp?Mwf_id='+Mwf_id	});
			},
			error : function() {
				alert("删除失败！");
			}
		});
	});
}
//点击列表中的流程配置按钮，跳转到流程配置页面
function cfiButton(index){
	var data = $("#matixTableInfo").bootstrapTable("getData");
	var r_name = data[index].R_NAME;
	var m_name = data[index].M_NAME;
	var m_rote_v = data[index].M_ROTE_V;
	var m_id = data[index].M_ID;
	var wf_name = data[index].WF_NAME;
	var wf_sys_name = data[index].WF_SYS_NAME;
	var wf_state = data[index].WF_STATE;
	var wf_id = data[index].WF_ID;
	newOpenTab("swfi_approveRulesConfig","流程配置","workFlow/swfi/swfi_approveRulesConfig.html",function(){
		initAppRulConfigTable(r_name,m_name,m_rote_v,m_id,wf_name,wf_sys_name,wf_state,wf_id);
	});
}
//页面返回按钮
$("#backToSwfiList").click(function(){
	newOpenTab("processconfig","流程配置","workFlow/swfi/swfi_queryList.html",function(){});
});
//页面增加矩阵按钮（弹出摸态框）
$("#addMatix").click(function(){
	//显示摸态框
	$("#updateMatrixModal").modal("show");
	//显示不同的保存对象
	$("#submitModlMatrix").show();
	$("#up_submitModlMatrix").hide();
	//初始化输入框
	$("#up_modl_r_name").val("");
	$("#up_modl_r_exp").val("");
	initSelect($("#up_modl_m_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_STATE"});
	//初始化必填项
	initVlidate($("#update_modl"));
	//获取流程id
	var Mwf_id = $("#Mwf_id").val();
	//初始化table
	initeNodeModlTable(Mwf_id);
});
//新增摸态框保存按钮
$('#submitModlMatrix').bind('click', function(e) {
	if($("input[type='checkbox']").is(':checked')){
		//必填项校验
		if(!vlidate($("#update_modl"),999999)){
			  return ;
		  }
		//获取流程id
		var Mwf_id = $("#Mwf_id").val();
		//获取输入框数据
		var modl_r_name = $.trim($("#up_modl_r_name").val());
		var modl_r_exp = $.trim($("#up_modl_r_exp").val());
		var modl_m_state = $.trim($("#up_modl_m_state").val());
		//获取选中节点数据
		var records = $("#up_MatrixModalTab").bootstrapTable('getSelections');
		//获取选中记录的所有节点名称
		var modl_n_name = $.map(records, function (row) {
			return row.N_NAME;                  
		});
		//获取选中记录的所有节点id
		var modl_n_id = $.map(records, function (row) {
			return row.N_ID;                  
		});
		var params={"records":JSON.stringify(records),"wf_id":Mwf_id,"r_name":modl_r_name,"r_exp":modl_r_exp,"m_state":modl_m_state};
		//ajax请求发送参数到后台插入数据库表
		baseAjax("SWfi/addOneMatrixInfo.asp?n_id="+escape(encodeURIComponent(modl_n_id))+"&n_name="+escape(encodeURIComponent(modl_n_name)),params, function(data) {
        	if (data != undefined&&data!=null&&data.result=="true") {
				alert("保存成功");
				//刷新矩阵页面table
				$("#updateMatrixModal").modal("hide");
				$("#matixTableInfo").bootstrapTable('refresh',{url:'SWfi/queryAllMatrixById.asp?Mwf_id='+Mwf_id});
			}else{
				alert("保存失败");
			}
		});
		
		
	}else{
		e.preventDefault();
        $.Zebra_Dialog('请选择一条或多条节点记录进行添加!', {
            'type':     'close',
            'title':    '提示',
            'buttons':  ['是'],
            'onClose':  function(caption) {
            	if(caption=="是"){
            	}
            }
        });
	}
});
//初始化页面table
function initprocessMatInfo() {
	var Mwf_id = $("#Mwf_id").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#matixTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'SWfi/queryAllMatrixById.asp?Mwf_id='+Mwf_id,
				method : 'get', //请求方式（*）   
				striped : true, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "N_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				columns : [ {
					field: 'M_ID',
					title : '矩阵ID',
					align: 'center',
					visible:!1
				},{
					field: 'WF_ID',
					title : '流程ID',
					align: 'center',
					visible:!1
				},{
					field: 'R_NAME',
					title : '矩阵规则',
					align: 'center'
				},{
					field : 'M_NAME',
					title : '矩阵值',
					align : "center"
				}, {
					field : 'MAT_STATE',
					title : '矩阵状态',
					align : "center" 
				}, {
					field : "operation",
					title : "操作",
					align : "center",
					formatter:function(value,row,index){
						 var u_edit="<a style='color:#0088cc; cursor:pointer;' onclick=updButton('"+index+"');>修改</a>";
						 var d_edit="<a style='color:#0088cc; cursor:pointer;' onclick=delButton('"
							 +$.trim(row.R_ID)+"','"+$.trim(row.M_ID)
							 +"');>删除</a>";
						 var cfi_edit="<a style='color:#0088cc; cursor:pointer;' onclick=cfiButton('"+index+"');>配置流程</a>";
						 return u_edit+" / "+d_edit+" / "+cfi_edit;
					 }
				}]
			});
};

