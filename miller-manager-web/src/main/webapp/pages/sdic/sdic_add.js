function pageDispatch_sdic_add() {
		
}
//状态下拉框
initSelect($("#dic_add_state"), {value : "ITEM_CODE",text : "ITEM_NAME"}, {dic_code : "S_DIC_OC"});
// 所属菜单
menuSdicAdd();
// 新增保存
sdicAdd();
function menuSdicAdd() {
	// 所属菜单
	$("#dic_add_menuname").click(
		function() {
			openSelectTreeDiv(
					$(this),
					"dic_menutree_id",
					"SMenu/queryAllmenu.asp", 
					{	"margin-left" : '154px',
						width : $("#dic_add_menuname").width()
					}, 
					function(node) {
						$("#dic_add_menuname").val(node.name);
						$("#dic_add_menucode").val(node.id);
					});
		});
	$("#dic_add_menuname").focus(function() {
		$("#dic_add_menuname").click();
	});
}

function sdicAdd() {
	$("#dic_add_save").on('click', function() {
		var dic_add_code = $("#dic_add_code").val();
		var dic_add_codename = $("#dic_add_codename").val();
		var dic_add_state = $("#dic_add_state").val();
		var dic_add_memo = $("#dic_add_memo").val();
		var dic_add_menucode = $("#dic_add_menucode").val();
		// 判断编码是否重复
		if (!vlidate($("#sdic_form_add"))) {
			return;
		}
		ok = true;
		if (ok) {
			$.ajax({
				url : "SDic/findById.asp",
				type : "post",
				async : false,
				data : {
					"dic_code" : dic_add_code
				},
				dataType : "json",
				success : function(msg) {
					if (msg.result) {
						alert("类别编码重复！请重新输入！");
						ok = false;
						return;
					}
				}
			});
		}
		// 新增
		if (ok) {
			$.ajax({
				url : "SDic/save.asp",
				type : "post",
				async : false,
				data : {
					"dic_code" : dic_add_code,
					"dic_name" : dic_add_codename,
					"state" : dic_add_state,
					"memo" : dic_add_memo,
					"menu_no" : dic_add_menucode
				},
				dataType : "json",
				success : function(msg) {
					alert("保存成功!");
					newOpenDicInfoTab("dic_info", "字典列表", "pages/sdic/sdic_queryInfo.html", function(){});
				}
			});
		}
	});
}

//返回
$("#backToDicList").click(function(){
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