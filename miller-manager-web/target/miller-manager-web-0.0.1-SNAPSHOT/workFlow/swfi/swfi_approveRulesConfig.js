var mwf_name,mwf_sys_name,mwf_state,mwf_id,mm_rote_v,mm_id;

//初始化页面列表（参数依次：矩阵规则名，矩阵值，矩阵路由值，矩阵ID，流程名，业务系统，流程状态）
function initAppRulConfigTable(r_name,m_name,m_rote_v,m_id,wf_name,wf_sys_name,wf_state,wf_id){
	//console.info(r_name+"--"+m_name+"--"+m_rote_v+"--"+m_id+"--"+wf_name+"--"+wf_sys_name+"--"+wf_state+"--"+wf_id);
	mwf_name = wf_name;
	mwf_sys_name = wf_sys_name;
	mwf_state = wf_state;
	mwf_id = wf_id;
	mm_rote_v = m_rote_v;
	mm_id = m_id;
	//字段要素赋值
	$('#r_name').val(r_name);
	$('#wf_name').val(wf_name);
	$('#m_id').val(m_id);
	$('#wf_id').val(wf_id);
	initSelect($("#wf_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_STATE"},wf_state);
	initSelect($("#wf_sys_name"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_SYSTEM"},wf_sys_name);
	findMNodes(m_id,wf_id);
    addNoteButton(m_rote_v,m_id);    
	$(document).on("click","input[name='R_NAME']",function(){
		addProcessRule($(this));
	});
}
	/**
	 * 增加审批流节点 
	 */
	function addProcessRule(obj){
		var obj_t=obj;
		addWFRule(obj_t,function(r_id,r_name){
			obj.val(r_name);
			var index=obj.parents("tr[index]").attr("index");
			var data=$("#approRuleTableInfo").TaskMytable("getData").rows[index];
			data.R_ID=r_id;
		});
	}
	
	function addWFRule(obj_t,callback){
		$("#addApproveRoleModal").modal("show");
		if(obj_t.val()!=""){
		 var index=obj_t.parents("tr[index]").attr("index");
			var data=$("#approRuleTableInfo").TaskMytable("getData").rows[index];
			$("#pop_r_name").val(data.R_NAME);
			$("#pop_r_exp").val(data.R_EXP);
		}else{
			$("#pop_r_name").val("");
			$("#pop_r_exp").val("");
		}
		$("#saveRoleInfo").unbind("click");
		$("#saveRoleInfo").click(function(){
		var r_name=$("#pop_r_name").val();
		var r_exp=$("#pop_r_exp").val();
		baseAjax("SWfi/addWFRule.asp",{r_name:r_name,r_exp:r_exp},function(data){
				if(data&&data.result&&data.result=="true"){
					$("#addApproveRoleModal").modal("hide");
					if(callback){
						callback(data.r_id,r_name);
					}
				}else{
					alert("保存失败");
				}
			});
		});
	}
/**
**查询矩阵对应的 节点数据 
*/
function findMNodes(m_id,wf_id){
	baseAjax("SWfi/queryMNodeInfos.asp",{m_id:m_id,wf_id:wf_id},function(data){
		initTCfgAssessment(data,m_id,wf_id);
	});
}

//查询列表显示table
function initTCfgAssessment(data,m_id,wf_id) {
	var columns=[{
		field : 'R_NAME',
		title : '审批规则',
		align : "center",
		edit:{type:"text",width:130}
	}];
	for(var i=0;i<data.length;i++){
		columns[columns.length]={
			field : data[i]["N_ID"],
			title : data[i]["N_NAME"],
			align : "center",
			formatter:function(index,value,row,field){
				if(row["nids"]&&row["nids"].indexOf(","+field+",")!=-1){
					return "<input type='checkbox' checked='checked'>";
				}
				return "<input type='checkbox'>";
			}
		};
	}
	columns[columns.length]={
			field : "OPT_PERSON",
			title : "操作",
			align : "center",
			formatter:function(index,value,row){
				return '<a style="color:#0088cc; cursor:pointer;" onclick="saveMWFInfo('+index+')">保存</a>/'+
					   '<a style="color:#0088cc; cursor:pointer;" onclick="deleteMWFInfo('+index+')">删除</a>';
			}
		};
	
	var config={
			columns:columns,
			url:"SWfi/queryMatixProcessByMId.asp?m_id="+m_id+"&wf_id="+wf_id,
			pagesize:5,
			queryParams:{},
			dblclick:function(index,row){
			},
			click:function(index,row){
				$("#approRuleTableInfo").TaskMytable("beginEditor",index);
			},
			loadSuccess:function(data){
				
			}
	};
	$("#approRuleTableInfo").TaskMytable(config);
};
	
	function deleteMWFInfo(index){
		nconfirm("确定删除该审批流程?",function(){
		var data=$("#approRuleTableInfo").TaskMytable("getData").rows[index];
			if(!data["P_ID"]){
				$("#approRuleTableInfo").TaskMytable("delRow",index);
			}else{
				baseAjax("SWfi/deleteWFProcess.asp",{p_id:data["P_ID"]},function(){
					$("#approRuleTableInfo").TaskMytable("refresh");
				});
			}
		});
	}
	
	function saveMWFInfo(index){
		var tr=$("#approRuleTableInfo tr[index='"+index+"']");
		var params={};
		var inputs=tr.find("input[type='checkbox']:checked");
		var nids="";
		for(var i=0;i<inputs.length;i++){
			nids+=$(inputs[i]).parent().parent().attr("field")+",";
		}
		params["nids"]=nids;
		$("#approRuleTableInfo").TaskMytable("endEditor",index);
		var data=$("#approRuleTableInfo").TaskMytable("getData").rows[index];
		if(data&&data.P_ID){
			params["p_id"]=data.P_ID;
		}
		if(data&&data.M_ID){
			params["m_id"]=data.M_ID;
		}
		if(data&&data.R_ID){
			params["r_id"]=data.R_ID;
		}
		baseAjax("SWfi/addApproveRuleInfo.asp",params,function(data){
			if(data&&data.result){
				//alert("保存成功!");
			}else if(data.msg){
				alert(data.msg);		
			}else{
				alert("保存失败!");
			}
			$("#approRuleTableInfo").TaskMytable("refresh");
		});
	}

//点击列表中的删除按钮，删除该记录
function delRoteButton(r_id){
	// 删除表格中的一条数据
	nconfirm('是否删除?',function() {
		$.ajax({
			type : "post",
			url : "SWfi/deleteMatrixRoteById.asp?r_id="+r_id,
			async : true,
			data : "",
			dataType : "json",
			success : function(msg) {
				$('#approRuleTableInfo').bootstrapTable('refresh',{url : "SWfi/queryMatixRoteById.asp?m_id="+mm_id+"&m_rote_v="+mm_rote_v	});
			},
			error : function() {
				alert("删除失败！");
			}
		});
	});
}


//新增审批规则按钮（列表增加一行）
function addNoteButton(m_rote_v,m_id){
	////新增列表增加一行可编辑空记录
	$("#addApproveRules").click(function(){
		$("#approRuleTableInfo").TaskMytable("appenRowAndEditor",{M_ID:m_id});
	});
}

//摸态框表达式校验按钮
/*$("#expressionCheck").click(function(){
	$("#addMatrixModal").modal("hide");
});
*/
//页面返回按钮
$("#backMatrixList").click(function(){
	newOpenTab("matrix_config","流程矩阵配置","workFlow/swfi/swfi_proMatrixConfig.html",function(){
		//把数据赋值到矩阵页面中
		//console.info(mwf_name+"--"+mwf_sys_name+"--"+mwf_state+"--"+mwf_id);
		$("#Mwf_name").val(mwf_name);
		$("#Mwf_sys_name").val(mwf_sys_name);
		$("#Mwf_state").val(mwf_state);
		$("#Mwf_id").val(mwf_id);
		initSelect($("#Mwf_sys_name"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_SYSTEM"},mwf_sys_name);
		initSelect($("#Mwf_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_STATE"},mwf_state);
		//初始化矩阵页面列表
		initprocessMatInfo();
	});
});
//initAppRulConfigTable();