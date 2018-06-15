	function initSdicUpdataLayout(id){
		//状态下拉框
		var ids = $.map(id, function (row) {
			return row.DIC_CODE;                    
		});		
		//修改功能
		sdicUpdate(ids);
		//所属菜单
		menuSdicUpdate();
	}
	
	function initSdicUpdate(){
		return ids;
	}
	
	function sdicUpdate(ids){
		//查询数据并回填
        $.ajax({
	           url:"SDic/findById.asp?dic_code="+ids,
	           type:"post",
	           data:"",
	           dataType:"json",
	           success:function(msg){
	        	   if(msg!=undefined&&msg.result!=false){
	        		   $("#dic_update_code").val(msg.list[0].DIC_CODE);
	        		   $("#dic_update_codename").val(msg.list[0].DIC_NAME);
	        		   $("#dic_update_state").val(msg.list[0].STATE);
	   				   initSelect($("#dic_update_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"},msg.list[0].STATE);	
	        		   $("#dic_update_menuname").val(msg.list[0].MENU_NAME);
	        		   $("#dic_update_menucode").val(msg.list[0].MENU_NO);
	        		   $("#dic_update_memo").val(msg.list[0].MEMO);
	        	   }
	           }
	        });
	}
	
	function menuSdicUpdate(){
		$("#dic_update_menuname").click(function(){
			openSelectTreeDiv($(this),"dicUpdate_menutree_id","SMenu/queryAllmenu.asp",{"margin-left":'154px',width:$("#dic_update_menuname").width()},function(node){
				$("#dic_update_menuname").val(node.name);
				$("#dic_update_menucode").val(node.id);
			});
		});
		$("#dic_update_menuname").focus(function(){
			$("#dic_update_menuname").click();
		});		
	}

//修改保存功能
$("#dic_update_save").click(function(){
	var dic_update_code =  $("#dic_update_code").val();
	var dic_update_codename = $("#dic_update_codename").val();
	var dic_update_state =  $("#dic_update_state").val();
	var dic_update_memo =  $("#dic_update_memo").val();
	var dic_update_menucode = $("#dic_update_menucode").val();
	//判断是否为空
	if(!vlidate($("#sdic_form_update"))){
		return ;
	}
	//发送Ajax请求save
	$.ajax({
		url:"SDic/update.asp",
		type:"post",
		data:{"dic_code":dic_update_code,"dic_name":dic_update_codename,"state":dic_update_state,"memo":dic_update_memo,"menu_no":dic_update_menucode},
		dataType:"json",
		success:function(msg){
			alert("修改成功！");
			newOpenDicInfoTab("dic_info", "字典列表", "pages/sdic/sdic_queryInfo.html", function(){});
		}
	});
});

	
//返回
$("#dic_update_return").click(function(){
	newOpenDicInfoTab("dic_info", "字典列表", "pages/sdic/sdic_queryInfo.html", function(){});
});

function newOpenDicInfoTab(key,title,url,callback){
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