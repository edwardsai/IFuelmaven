$("#updatesRole").click(function(){
	if(!vlidate($("#update_from"))){
		return ;
	}
	var role_no=$("input[name='R.role_no']").val();
	var role_name=$("input[name='R.role_name']").val();
	var flag=$("select[name='R.flag']").val();
	//var flag=$("#flag").val();
	var order_no=$("#order_no").val();
	var memo=$("#memo").val();
	var params={"role_no":role_no,"role_name":role_name,"flag":flag,"memo":memo,"order_no":order_no};
	$.ajax({
		type:"post",
		url:"SRole/updateSRole.asp",
		async:true,
		data:params,
		dataType:"json",
		success:function(success){
			if(success.result=="true"){
//				$("#sRole_serch").click();
//				alert("保存成功");				
				//pageDispatch(this,'sRole');
//				closePageTab("update_srole"+role_no,function(){});
				newOpenSRoleTab("srole_list","角色列表","pages/srole/srole_queryList.html",function(){});	
			}else{
				alert("系统异常请稍后");		
			}
		}
	});		
});
function initSRoleFlag(flag){
	//初始化数据
	initSelect($("#Uflag"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"},flag);
}
$("#backToSRoleList").click(function(){
	newOpenSRoleTab("srole_list","角色列表","pages/srole/srole_queryList.html",function(){});
});

function newOpenSRoleTab(key,title,url,callback){
	var tabid =$(".list_tree_1nav li.current").attr("tabid");
	var oldMenu_no=tabsAndPages[tabid]["MENU_NO"];
	tabsAndPages[tabid]["MENU_NO"]=key;
	tabsAndPages[tabid]["MENU_NAME"]=title;
	tabsAndPages[tabid]["MENU_URL"]=url;
	removePage(oldMenu_no);
	startLoading();
	loadPage(start+url,function(data){
		endLoading();
		$(content).append("<div page='menu_"+key+"' style='height:90%;'>"+data+"</div>");
		if(callback!=undefined){
			callback();
		}
	});
}
