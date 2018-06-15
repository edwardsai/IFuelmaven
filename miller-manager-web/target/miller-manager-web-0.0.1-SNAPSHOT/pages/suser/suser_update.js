//保存按钮
function initUpdateUserInfoEvent(){
	$("#updateSUser").click(function(){
		if(!vlidate($("#updateuser_from"))){
			return ;
		}
		var inputs = $("input[name^='UDUS.']");
		var texts = $("textarea[name^='UDUS.']");
		var select = $("select[name^='UDUS.']");
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
		baseAjax("SUser/updateuser.asp",params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				//$("#queryUser").click();    div方式打开页面可用
				alert("修改成功");
				newOpenTab("user_manger","用户管理","pages/suser/suser_queryList.html");
			}else{
				alert("修改失败");
			}
		});
	});
	$("#update_backToUserList").click(function(){
		newOpenTab("user_manger","用户管理","pages/suser/suser_queryList.html");
	});
	//授权机构模态框
	$("#Uorg_no_name").click(function(){
		openSOrgPop("orgDivPopU",{name:$("#Uorg_no_name"),no:$("#Uorg_no_code")});
		/*$('#myModal_org').modal('show');
		var userParam = {"name":$("#Uorg_no_name"),"no":$("#Uorg_no_code")};
		orgPop("#pop_orgTable",'SOrg/findAllOrgById.asp',userParam);*/
	});
}

//下拉框方法
function initSUserType(state,post,level,belong){
	//初始化数据,用户状态
	initSelect($("#Ustate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERSTATE"},state);
	//初始化数据,用户岗位
	initSelect($("#Uuser_post"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERPOST"},post);
	//初始化数据,用户等级
	initSelect($("#Uuser_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERLEVEL"},level);
	//初始化数据,用户等级
	initSelect($("#Uuser_belong"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USER_BELONG"},belong);
}
