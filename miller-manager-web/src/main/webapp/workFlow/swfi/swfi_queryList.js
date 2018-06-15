//radio初始化（新），说明：两个radio位于同一行
function autoInitRadio3(dic_code,RadioTdId,RadioName,params){
	baseAjax("SDic/findItemByDic.asp",dic_code,function(data){
		if(data!=undefined){
			for(var i=0;i<data.length;i++){
				if(params.type=="add"){
					if(data[i].IS_DEFAULT=='01'){
						RadioTdId.append("<label style='float:left;padding-left:5px' class="+params.labClass+"><input type='radio' name="+RadioName+" value="+data[i].ITEM_CODE+" checked>&nbsp;"+data[i].ITEM_NAME+"</label>");
					}else{
						RadioTdId.append("<label style='float:left;padding-left:5px' class="+params.labClass+"><input type='radio' name="+RadioName+" value="+data[i].ITEM_CODE+" >&nbsp;"+data[i].ITEM_NAME+"</label>");
					}					
				}else{
					if(data[i].ITEM_CODE==params.value){
						RadioTdId.append("<label style='float:left;padding-left:5px' class="+params.labClass+"><input type='radio' name="+RadioName+" value="+data[i].ITEM_CODE+" checked>&nbsp;"+data[i].ITEM_NAME+"</label>");
					}else{
						RadioTdId.append("<label style='float:left;padding-left:5px' class="+params.labClass+"><input type='radio' name="+RadioName+" value="+data[i].ITEM_CODE+" >&nbsp;"+data[i].ITEM_NAME+"</label>");
					}										
				}
			}
		}
	});				
}
//列表上面的按钮效果
$("#moreIlsh_swfiList").click(function() {
	$("#submenuList_swfiList ul li:not(.submenuList1,#moreIlsh_swfiList)").toggle();
	$("#moreIlsh_swfiList").toggleClass("moreIlshBg");
});

//初始化页面按钮
function initQueryListButton(){
	//新增流程按钮
	$("#addProcess").click(function() {
		newOpenTab("add_process","新增流程","workFlow/swfi/swfi_addProcess.html",function(){});
	});
	//修改按钮
	$('#updateProcess').bind('click', function(e) {
		if($("input[type='checkbox']").is(':checked')){
			var record = $("#SWfiTableInfo").bootstrapTable('getSelections');
			newOpenTab("update_process","修改流程","workFlow/swfi/swfi_updateProcess.html",function(){
				autoInitRadio3("dic_code=WF_DIC_STATE",$("#Uwf_state"),"Swfi.wf_state",{type:"update",value:record[0].WF_STATE});
				$("#Uwf_name").val(record[0].WF_NAME);
				$("#Uwf_sys_name").val(record[0].WF_SYS_NAME);
				$("#Uwf_memo").val(record[0].WF_MEMO);
				$("#Uwf_state").val(record[0].WF_STATE);
				$("#Uwf_id").val(record[0].WF_ID);
				initSelect($("#Uwf_sys_name"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_SYSTEM"},record[0].WF_SYS_NAME);
			});
		}else{
			e.preventDefault();
	        $.Zebra_Dialog('请选择一条数据进行修改!', {
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
	//删除流程按钮
	$('#deleteProcess').bind('click', function(e) {
		if($("input[type='checkbox']").is(':checked')){
			var records = $("#SWfiTableInfo").bootstrapTable('getSelections');
			var ids = $.map(records, function (row) {
				return row.WF_ID;                  
			});
			e.preventDefault();
	        $.Zebra_Dialog('是否进行删除?', {
	            'type':     'close',
	            'title':    '提示',
	            'buttons':  ['是', '否'],
	            'onClose':  function(caption) {
	            	if(caption=="是"){
	            		$("#SWfiTableInfo").bootstrapTable('remove', {
	    					field: 'wf_id',
	    					values: ids
	    				});
	    				var url="SWfi/deleteOneProcessInfo.asp?wf_id="+ids;
	    				$.ajax({
	    					type : "post",
	    					url : url,
	    					async :  true,
	    					data : "",
	    					dataType : "json",
	    					success : function(map) {
	    						$('#SWfiTableInfo').bootstrapTable('refresh',{url:'SWfi/queryAllProcessInfo.asp'});
	    					},
	    					error : function() {	
	    						alert("删除失败！");
	    					}
	    				});
	            	}
	            }
	        });
		}else{
			e.preventDefault();
	        $.Zebra_Dialog('请选择一条要删除的记录!', {
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
	//节点配置按钮
	/*$("#noteConfig").click(function() {
		newOpenTab("note_config","节点配置","workFlow/swfi/swfi_noteConfig.html",function(){});
	});*/
	//流程矩阵配置按钮
	$('#matrixConfig').bind('click', function(e) {
		if($("input[type='checkbox']").is(':checked')){
			var record = $("#SWfiTableInfo").bootstrapTable('getSelections');
			newOpenTab("matrix_config","流程矩阵配置","workFlow/swfi/swfi_proMatrixConfig.html",function(){
				//把数据赋值到矩阵页面中
				$("#Mwf_name").val(record[0].WF_NAME);
				$("#Mwf_sys_name").val(record[0].WF_SYS_NAME);
				$("#Mwf_state").val(record[0].WF_STATE);
				$("#Mwf_id").val(record[0].WF_ID);
				initSelect($("#Mwf_sys_name"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_SYSTEM"},record[0].WF_SYS_NAME);
				initSelect($("#Mwf_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_STATE"},record[0].WF_STATE);
				//初始化矩阵页面列表
				initprocessMatInfo();
			});
		}else{
			e.preventDefault();
	        $.Zebra_Dialog('请选择一条流程数据进行矩阵配置!', {
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
	//查询按钮
	$("#queryProcess").click(function() {
		var wf_name = $.trim($("#wf_name").val());
		var wf_sys_name = $.trim($("#wf_sys_name").val());
		var wf_state = $.trim($("#wf_state").val());
		$('#SWfiTableInfo').bootstrapTable('refresh',{url:'SWfi/queryAllProcessInfo.asp?wf_name='+escape(encodeURIComponent(wf_name))+'&wf_sys_name='+escape(encodeURIComponent(wf_sys_name))+'&wf_state='+escape(encodeURIComponent(wf_state))});
	});
	//重置按钮
	$("#resetProcess").click(function() {
		$("#wf_name").val("");
		$("#wf_sys_name").val("");
		$("#wf_state").val("");
	});
}
//初始化页面
function initSWfiInfo() {
	var wf_name = $.trim($("#wf_name").val());
	var wf_sys_name = $.trim($("#wf_sys_name").val());
	var wf_state = $.trim($("#wf_state").val());
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#SWfiTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'SWfi/queryAllProcessInfo.asp?wf_name='+escape(encodeURIComponent(wf_name))+'&wf_sys_name='+escape(encodeURIComponent(wf_sys_name))+'&wf_state='+escape(encodeURIComponent(wf_state)),
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
				uniqueId : "WF_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				columns : [ {	
					checkbox:true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				}, {
					field: 'WF_ID',
					title : '序号',
					align: 'center'
				},{
					field : 'WF_NAME',
					title : '流程名称',
					align : "center"
				},{
					field : "WF_STATE",
					title : "流程状态",
					align : "center",
					visible:!1
				}, {
					field : "W_STATE",
					title : "流程状态",
					align : "center"
				}, {
					field : "WF_SYS_NAME",
					title : "业务系统",
					align : "center",
					visible:!1
				}, {
					field : "W_SYS_NAME",
					title : "业务系统",
					align : "center"
				}, {
					field : "OPT_PERSON",
					title : "操作人",
					align : "center"
				}, {
					field : "OPT_TIME",
					title : "操作时间",
					align : "center"
				}]
			});
};
//状态下拉框
autoInitRadio3("dic_code=WF_DIC_STATE",$("#Uwf_state"),"Swfi.wf_state",{type:"update"});
initSelect($("#wf_sys_name"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_SYSTEM"});
initSelect($("#wf_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_STATE"});
initQueryListButton();
initSWfiInfo();