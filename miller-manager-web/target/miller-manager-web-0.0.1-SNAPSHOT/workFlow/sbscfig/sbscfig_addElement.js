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
//页面保存按钮
$("#saveElement").click(function(){
	//必填项判断
	if(!vlidate($("#addSbscfig_from"),999999)){
		  return ;
	  }
	//获取输入值
	var inputs = $("input[name^='add.']");
	var selects = $("select[name^='add.']");
	var textareas = $("textarea[name^='add.']");
	var params = {};
	for(var i=0;i<inputs.length;i++){
		if($(inputs[i]).attr("name").substr(4)=="rule_type"){
			params[$(inputs[i]).attr("name").substr(4)] = $("input[name='add.rule_type']:checked").val();
		}else{
			params[$(inputs[i]).attr("name").substr(4)] = $(inputs[i]).val();
		}	 
	}
	for(var i=0;i<selects.length;i++){
		params[$(selects[i]).attr("name").substr(4)] = $(selects[i]).val(); 
	}		
	for(var i=0;i<textareas.length;i++){
		params[$(textareas[i]).attr("name").substr(4)] = $.trim($(textareas[i]).val()); 
	}
	//发送数据到后台保存到数据库
	baseAjax("SFact/addOneFactInfo.asp",params, function(data) {
    	if (data != undefined&&data!=null&&data.result=="true") {
			alert("增加成功");
			newOpenTab("businessconfig","业务要素配置","workFlow/sbscfig/sbscfig_queryList.html",function(){});
		}else{
			alert("增加失败");
		}
	});
	
});
//页面返回按钮
$("#goBackSbscfigList").click(function(){
	newOpenTab("businessconfig","业务要素配置","workFlow/sbscfig/sbscfig_queryList.html",function(){});
});
//初始化必填项
initVlidate($("#addSbscfig_from"));
//初始化下拉框
initSelect($("#Fsystem_code"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_SYSTEM"});
initSelect($("#Fb_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_STATE"});
initSelect($("#Ffactor_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_FAC_TYPE"});
autoInitRadio3("dic_code=WF_DIC_RULE_TYPE",$("#Frule_type"),"add.rule_type",{type:"add"});