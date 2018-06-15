$("#saveSRolePower").click(function(){
	if(!vlidate($("#sRole_from"))){
		return ;
	}
	var role_no=$("input[name='SROLE.role_no']").val();
	var role_name=$("input[name='SROLE.role_name']").val();
	var flag=$("select[name='SROLE.flag']").val();
	var order_no=$("#order_no").val();
	var memo=$("#memo").val();
	var url="SRole/saveSRole.asp";
	var param={"role_no":role_no,"role_name":role_name,"flag":flag,"order_no":order_no,"memo":memo};
	$.ajax({
		type : "post",
		url : url,
		async :  true,
		data : param,
		dataType : "json",
		success : function(msg) {
			if(msg.result=="true"){				
				alert("保存成功");				
				/*closePageTab("add_srole",function(){
					$('#SRoleTableInfo').bootstrapTable('refresh',{url:'SRole/findSRoleAll.asp?role_no=&role_name='});
				});*/
				newOpenSRoleTab("auth_srole","权限设置","pages/srole/srole_queryList.html",function(){});	
			}else{
				alert("系统异常，请稍后！");
			}
		},
		error : function() {						
		}
	});    			    			
});
$("#backToSRoleList").click(function(){
	newOpenSRoleTab("srole_list","角色列表","pages/srole/srole_queryList.html",function(){});
});
//下拉列表数据
function initSRoleFlag(){
	//初始化数据
	initSelect($("#Aflag"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"});
}

initSRoleFlag();	

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