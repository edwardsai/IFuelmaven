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
//初始化页面按钮
function initSbscifListButton(){
	//查询按钮
	$("#queryBusConfig").click(function() {
		var system_code =$.trim($("#system_code").val());
		var b_state = $.trim($("#b_state").val());
		var rule_type =$.trim($("#rule_type").val());
		var factor_name =$.trim($("#factor_name").val());
		$('#SBsCfigTableInfo').bootstrapTable('refresh',{url:'SFact/queryAllFactorsInfo.asp?system_code='+escape(encodeURIComponent(system_code))+'&b_state='+escape(encodeURIComponent(b_state))+'&rule_type='+escape(encodeURIComponent(rule_type))+'&factor_name='+escape(encodeURIComponent(factor_name))});
	});
	//重置按钮
	$("#resetBusConfig").click(function() {
		initSelect($("#system_code"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_SYSTEM"});
		initSelect($("#b_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_STATE"});
		initSelect($("#rule_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_RULE_TYPE"});
		$("#factor_name").val("");
	});
	//查看按钮
	$('#viewBusConfig').bind('click', function(e) {
		if($("input[type='checkbox']").is(':checked')){
			var record = $("#SBsCfigTableInfo").bootstrapTable('getSelections');
			newOpenTab("view_BusConfig","查看业务要素","workFlow/sbscfig/sbscfig_checkElement.html",function(){
				$("#CFsystem_code").text(record[0].W_SYS_NAME);
				$("#CFb_state").text(record[0].W_STATE);
				$("#CFrule_type").text(record[0].RULE_TYPE_V);
				$("#CFfactor_code").text(record[0].FACTOR_CODE);
				$("#CFfactor_name").text(record[0].FACTOR_NAME);
				$("#CFfactor_type").text(record[0].FACTOR_TYPE_V);
				$("#CFopt_person").text(record[0].OPT_PERSON);
				$("#CFopt_time").text(record[0].OPT_TIME);
				$("#CFmemo").text(record[0].MEMO);
			});
		}else{
			e.preventDefault();
	        $.Zebra_Dialog('请选择一条要查看的记录!', {
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
	//删除按钮
	$('#deleteBusConfig').bind('click', function(e) {
		if($("input[type='checkbox']").is(':checked')){
			var records = $("#SBsCfigTableInfo").bootstrapTable('getSelections');
			var ids = $.map(records, function (row) {
				return row.B_ID;                  
			});
			e.preventDefault();
	        $.Zebra_Dialog('是否进行删除?', {
	            'type':     'close',
	            'title':    '提示',
	            'buttons':  ['是', '否'],
	            'onClose':  function(caption) {
	            	if(caption=="是"){
	            		$("#SBsCfigTableInfo").bootstrapTable('remove', {
	    					field: 'b_id',
	    					values: ids
	    				});
	    				var url="SFact/deleteOneFactorsInfo.asp?b_id="+ids;
	    				$.ajax({
	    					type : "post",
	    					url : url,
	    					async :  true,
	    					data : "",
	    					dataType : "json",
	    					success : function(map) {
	    						$('#SBsCfigTableInfo').bootstrapTable('refresh',{url:'SFact/queryAllFactorsInfo.asp'});
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
	//修改按钮
	$('#updateBusConfig').bind('click', function(e) {
		if($("input[type='checkbox']").is(':checked')){
			var record = $("#SBsCfigTableInfo").bootstrapTable('getSelections');
			newOpenTab("update_BusConfig","修改业务要素","workFlow/sbscfig/sbscfig_updateElement.html",function(){
				autoInitRadio3("dic_code=WF_DIC_RULE_TYPE",$("#UFrule_type"),"UF.rule_type",{type:"update",value:record[0].RULE_TYPE});
				$("#UFsystem_code").val(record[0].SYSTEM_CODE);
				$("#UFb_state").val(record[0].B_STATE);
				$("#UFrule_type").val(record[0].RULE_TYPE);
				$("#UFfactor_code").val(record[0].FACTOR_CODE);
				$("#UFfactor_name").val(record[0].FACTOR_NAME);
				$("#UFfactor_type").val(record[0].FACTOR_TYPE);
				$("#UFmemo").val(record[0].MEMO);
				$("#UFb_id").val(record[0].B_ID);
				initSelect($("#UFsystem_code"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_SYSTEM"},record[0].SYSTEM_CODE);
				initSelect($("#UFb_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_STATE"},record[0].B_STATE);
				initSelect($("#UFfactor_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_FAC_TYPE"},record[0].FACTOR_TYPE);
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
	//新增按钮
	$("#addBusConfig").click(function() {
		newOpenTab("add_BusConfig","新增业务要素","workFlow/sbscfig/sbscfig_addElement.html",function(){});
	});
}
//初始化页面table
function initSBsCfigInfo() {
	var system_code =$.trim($("#system_code").val());
	var b_state = $.trim($("#b_state").val());
	var rule_type =$.trim($("#rule_type").val());
	var factor_name =$.trim($("#factor_name").val());
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#SBsCfigTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'SFact/queryAllFactorsInfo.asp?system_code=' + system_code+'&b_state='+b_state+'&rule_type='+rule_type+'&factor_name='+factor_name,
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
				uniqueId : "B_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				columns : [ {	
					checkbox:true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field: 'B_ID',
					title : '序号',
					align: 'center'
				},{
					field : 'W_SYS_NAME',
					title : '业务系统',
					align : "center"
				}, {
					field : "W_STATE",
					title : "状态",
					align : "center"
				}, {
					field : "RULE_TYPE_V",
					title : "要素类别",
					align : "center"
				}, {
					field : "FACTOR_NAME",
					title : "业务要素",
					align : "center"
				},{
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
//初始化下拉框
initSelect($("#system_code"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_SYSTEM"});
initSelect($("#b_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_STATE"});
initSelect($("#rule_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_RULE_TYPE"});
initSbscifListButton();
initSBsCfigInfo();