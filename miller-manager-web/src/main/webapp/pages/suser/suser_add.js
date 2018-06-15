

//按钮方法
function initAddUserButtonEvent(){
	$("#addSUser").click(function(){
		if(!vlidate($("#adduser_from"))){
			return ;
		}
		var inputs = $("input[name^='USAD.']");
		var texts = $("textarea[name^='USAD.']");
		var select = $("select[name^='USAD.']");
		var params = {};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(5)] = obj.val();
		}
		for (var i = 0; i < texts.length; i++) {
			var obj = $(texts[i]);
			params[obj.attr("name").substr(5)] = obj.val();
		}
		for(var i = 0; i < select.length; i++){
			var obj = $(select[i]);
			params[obj.attr("name").substr(5)] = obj.val();
		}
		baseAjax("SUser/insertnewuser.asp",params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				//$("#queryUser").click();
				alert("添加成功");
				newOpenTab("user_manger","用户管理","pages/suser/suser_queryList.html");
			}else{
				alert("添加失败");
			}
		});
	});
	$("#add_backToUserList").click(function(){
		newOpenTab("user_manger","用户管理","pages/suser/suser_queryList.html");
	});
	//授权机构模态框
	$("#Aorg_no_name").click(function(){
		openSOrgPop("addUserOrg",{name:$("#Aorg_no_name"),no:$("#Aorg_no_code")});
		//openSOrgPop("addUserOrg",{name:$("#Aorg_no_name"),no:$("#Aorg_no_code")});
		/*$('#myModal_org').modal('show');
		var userParam = {"name":$("#Aorg_no_name"),"no":$("#Aorg_no_code")};
		orgPop("#pop_orgTable",'SOrg/findAllOrgById.asp',userParam);*/
	});	
}

//下拉框方法
function initSUserType(){
	//初始化数据,用户状态
	initSelect($("#Astate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERSTATE"});
	//初始化数据,用户岗位
	initSelect($("#Auser_post"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERPOST"});
	//初始化数据,用户等级
	initSelect($("#Auser_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERLEVEL"});
	//初始化数据,用户属性
	initSelect($("#Auser_belong"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USER_BELONG"});
}

//$("#orgDivPop").load("pages/sorg/sorgPop.html");
initAddUserButtonEvent();
initSUserType();
