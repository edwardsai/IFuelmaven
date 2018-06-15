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
$("#addSProcess").click(function(){
	//必填项校验
	if(vlidate($("#addSwfi_form"))){
		//获取表单数据
		var inputs = $("input[name^='Awf.']");
		var selects = $("select[name^='Awf.']");
		var textareas = $("textarea[name^='Awf.']");
		var params = {};
		for(var i=0;i<inputs.length;i++){
			if($(inputs[i]).attr("name").substr(4)=="wf_state"){
				params[$(inputs[i]).attr("name").substr(4)] = $("input[name='Awf.wf_state']:checked").val();
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
		baseAjax("SWfi/addOneProcessInfo.asp",params, function(data) {
        	if (data != undefined&&data!=null&&data.result=="true") {
        		$("#addSProcess").unbind("click");
				alert("增加成功");
				newOpenTab("processconfig","流程配置","workFlow/swfi/swfi_queryList.html",function(){});
			}else{
				alert("增加失败");
			}
		});
	}
});
//页面返回按钮
$("#goBackSwfiList").click(function(){
	newOpenTab("processconfig","流程配置","workFlow/swfi/swfi_queryList.html",function(){});
});
//状态下拉框
initSelect($("#Awf_sys_name"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"WF_DIC_SYSTEM"});
autoInitRadio3("dic_code=WF_DIC_STATE",$("#Awf_state"),"Awf.wf_state",{type:"add"});
//初始化必填项
initVlidate($("#addSwfi_form"));