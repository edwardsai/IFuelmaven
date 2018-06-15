/**
 *	发起流程
 *  bizId=业务数据(多个数据用逗号隔开)
 *  wf_id流程ID
 *  callback 回调函数 
 */
function startWorkFlow(bizId,wf_id,callback){
	startLoading();
	checkWFNode("start",bizId,wf_id,function(ps){
		startLoading();
		baseAjax("WFApp/startWFApp.asp",{bizId:bizId,wf_id:wf_id,ps:ps},function(data){
			endLoading();
			insertNextAppPerson(bizId,ps,wf_id);
			if(data&&data.result=="true"){
				//增加一个异步方法，插入选中的下一个审批人数据到相应的信息表中
				if(callback){
					callback();
				}
			}else if(data&&data.msg){
				alert(data.msg);
			}else{
				alert("流程发起异常!");
			}
		});
	});
}
function insertNextAppPerson(bizId,ps,wf_id){
	baseAjax("WFApp/insertNextAppPerson.asp",{bizId:bizId,wf_id:wf_id,ps:ps},function(){});
}
/**
 * 合并单元格
 * @selectExp 选择器 表达式 
 * @attr      选择的属性
 * @callback(val,l)  回调函数(属性的值,长度)
 */
function mergeTD(selectExp,attr,callback){
	var keys={};
	var rids=$(selectExp);
	for(var i=0;i<rids.length;i++){
		var rid=$(rids[i]).attr(attr);
		if(keys[rid]){continue;}
		keys[rid]="1";
	    var ls=$("["+attr+"='"+rid+"']");
	  	if(ls.length>1){
	  		callback(rid,ls.length);
	  	}
	}
}

/**
 *
 *审批流程
 **/
function appWorkFlow(param,callback){
	startLoading();
	if(param["app_state"]=="00"){
		checkWFNode("process",param["bizId"],undefined,function(ps){
			endLoading();
			param["ps"]=ps;
			appWorkFlowUtil(param,callback);
		});
	}else{
		endLoading();
		appWorkFlowUtil(param,callback);	
	}
}

/**流程审批的公用函数**/
function appWorkFlowUtil(param,callback){
	baseAjax("WFApp/appWorkFlow.asp",param,function(data){
		if($.trim(data.result)==""){
			alert("审批成功");
		}else{
			alert(data.result);
		}
		if(callback){
			callback();
		}
	});
}

/**
 * 检查流程节点
 * @param type start发起 process审批
 * @param bizId
 * @param wf_id
 * @param callback
 */
function checkWFNode(type,bizId,wf_id,callback){
	baseAjax("WFApp/checkNodeInfo.asp",{bizId:bizId,wf_id:wf_id,type:type},function(data){
		endLoading();
		if(!data&&"start"==type){
			alert("流程发起异常!");
		}else if(!data&&"process"==type){
			alert("流程审批异常!");
		}else if(data&&!data.rows){
			callback();
		}else{
			data.rows.sort(function(a,b){
				if(!a.role_id&&!b.role_id){
					return 0;
				}else if(!a.role_id&&b.role_id){
					return 1;
				}else if(a.role_id&&!b.role_id){
					return -1;
				}else if(a.role_id>b.role_id){
					return 1;
				}else if(a.role_id<b.role_id){
					return -1;
				}
			});
			selectNodeAppPerson(data,callback);
		}
	});
}
/**
 * 选择节点审批人
 * @param type start发起 process审批
 * @data bizId
 * @param callback
 */
function selectNodeAppPerson(data,callback){
	if($("#selectNodePerson").length==0){
		var selectNodeApp='<div id="selectNodePerson" class="modal hide fade" tabindex="-1" role="dialog"'
		  +'aria-labelledby="myModalLabel" aria-hidden="true" style="left:50%;margin-left:-170px;top:30%;width:340px;">'
		  +'<div class="modal-header">'
		  +'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'
		  + '<h3>请选择下一节点的审批人</h3>'
		  +'</div>'
		  +'<div class="modal-body">'
		  +'<table id="selectTable" style="width:310px;"></table>'
		  +'</div>'
		  +'<div class="modal-footer" style="text-align: center;">'
		  +'<button type="button" id="sureStartWF" class="btns">确定</button>&nbsp;'
		  +'<button class="btns"  data-dismiss="modal" aria-hidden="true">关闭</button>'
		  +'</div>'
		  +'</div>';
		  $("body").append(selectNodeApp);
	}
    $("#selectNodePerson").modal("show");
	var itype="checkbox";
	if("00"==data.ntype){itype="radio";}
	$("#selectNodePerson #selectTable").empty();
	for(var i=0;i<data.rows.length;i++){
		$("#selectNodePerson #selectTable").append('<tr><td role_id="'+(data.rows[i]['role_id']||"noid")+'">'+data.rows[i]['role_name']+'</td><td>'+data.rows[i]['uname']+'</td>'+
		'<td><input name="selectName" value="'+data.rows[i]["userid"]+'" type="'+itype+'"></td></tr>');
	}
	mergeTD("td[role_id!='noid']","role_id",function(v,l){
		$("td[role_id='"+v+"']:eq(0)").attr("rowspan",l);
		$("td[role_id='"+v+"']:gt(0)").remove();
	});
	$("#selectNodePerson #sureStartWF").unbind();
	$("#selectNodePerson #sureStartWF").click(function(){
		var persons=$("#selectNodePerson input:checked");
		if(persons.length<=0){
			alert("您还没有选择下一节点的审批人!");
			return;
		}
		var ps=$(persons[0]).val();
		for(var i=1;i<persons.length;i++){
			ps+=","+$(persons[i]).val();
		}
		$("#selectNodePerson").modal("hide");
		callback(ps);
	});
}

function getPersonRole(role_name){
	if(!role_name){
		return "";
	}
	return "("+role_name+")";
}

