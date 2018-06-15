/**
 * 主菜单数据
 */
var masterMenuData={};
/**
 * 按钮权限
 */
var buttonPermission={};

/**
 * 当前系统的菜单数据
 */
var menuData={};
/**
 * 所有活动的页签对应的page=menu_集合
 * */
var tabsAndPages={};

var start="";
var content="#contentHtml";
/**
 * 是否初始化页面
 * */
var initOrNot=true;
/**
 * 初始化主菜单
 * @param level1
 */
function initMasterMenu(level1){
	if(level1!=undefined&&level1.length>0){
		$("#mastMenu span").text(level1[0].MENU_NAME);
		var html = template('initMasterMenu', {list:level1});
		$(".list_tree_tc").html(html);
	}
}
/**
 * 切换菜单主菜单
 * @param masterMenu_no
 */
function switchLeftMenu(masterMenu_no,masterMenu_name){
	$("#mastMenu span").text(masterMenu_name);
	initLeftMenu(masterMenuData[masterMenu_no]);
}
/**
 * 初始化左侧菜单
 * @param rightMenu
 */
function initLeftMenu(leftMenu){
	
	if(leftMenu!=undefined&&leftMenu.length>0){
		$("ul[level='1']").empty();
		for(var i=0;i<leftMenu.length;i++){
			menuData[leftMenu[i].MENU_NO]=leftMenu[i];
			if(leftMenu[i].MENU_LEVEL==1){
				var html = template('initLeftMenu', leftMenu[i]);
				$("ul[level='1']").append(html);
			}else if(leftMenu[i].MENU_LEVEL==2){
				var parent=$("[menu_no='"+leftMenu[i].SUPMENU_NO+"']");
				if(parent.length==1){//存在父级
					$("#"+leftMenu[i].SUPMENU_NO).removeClass("tit");
					parent.find(".nui-tree-item-symbol:first").html('<b ></b>');//给父元素设置收缩按钮
					var parentUl=$("[menu_no='"+leftMenu[i].SUPMENU_NO+"']").find("ul:first-child");
					var level1=template('initLeftMenu2', leftMenu[i]);
					if(parentUl.length>0){
						parentUl.append(level1);
					}else{
						parent.append('<ul class="nuinone">'+level1+'</ul>');
					}
				}
			}else if(leftMenu[i].MENU_LEVEL>2){
				var parent=$("[menu_no='"+leftMenu[i].SUPMENU_NO+"']");
				if(parent.length==1){//存在父级
					$("#"+leftMenu[i].SUPMENU_NO).removeClass("tit");
					parent.find(".nui-tree-item-symbol:first").html('<b></b>');//给父元素设置收缩按钮
					var parentUl=$("[menu_no='"+leftMenu[i].SUPMENU_NO+"']").find("ul:first-child");
					var level1=template('initLeftMenu3', leftMenu[i]);
					if(parentUl.length>0){
						parentUl.append(level1);
					}else{
						parent.append('<ul class="nuinone">'+level1+'</ul>');
					}
				}
			}
		}
	}
	initButtonPermisData();
}

function initMenu(){
	$.ajax({
		type : "post",
		url : "user/usermenu.asp",
		data : {},
		async:false,
		dataType : "json",
		success : function(msg) {
			if(msg==undefined||msg.level1==undefined){
				alert("用户权限数据异常");
			}else{
				masterMenuData=msg;
				//initMasterMenu(msg.level1); //暂时考虑但系统菜单，所以先不需要修改菜单头
				initLeftMenu(msg[msg.level1[0]["MENU_NO"]]);
			}
		},
		error : function() {
			alert("用户权限数据异常");
		}
	});
}

$(".btn_close").click(function(){
	$.ajax({
		type : "post",
		url : "logout.asp",
		data : {},
		dataType : "json",
		success : function(msg) {
			window.location="login.html";
		},
		error : function() {
			window.location="login.html";
		}
	});
});

/**
 * 初始化页面按钮权限
 * @param url
 */
function initButtonPermisData(){
	$.ajax({
		type : "post",
		url : "user/usermenuopt.asp",
		dataType : "json",
		async:false,
		success : function(data) {
			buttonPermission=data;
		},
		error : function() {
		}
	});
}

/**
 * 加载页面
 * @param url
 */
function loadPage(url,callback,param){
	$.ajax({
		type : "post",
		url : url,
		data : param,
		dataType : "html",
		async:false,
		success : function(data) {
			callback(data);
		},
		error : function() {
		}
	});
}
/**
 * 显示当前页面
 * @param key
 */
function showCurrentPage(key){
	var oldobj=$(".list_tree_1nav li.current");
	oldobj.removeClass("current");
	oldobj.addClass("headtit");
	var obj=$("li[tabid='"+key+"']");
    obj.removeClass("headtit");
    obj.addClass("current");
    obj.find("img").attr("src",'images/ltee_close_h.png');
  //去除其他选项卡的样式
	$(".indexContent").hide();
	 //$("#contentHtml iframe").show(); 
	 //$(".main_iframe").css("overflowY","hidden");
	$("#firsttit").removeClass("firstcurrend");
	$("#firsttit").addClass("tree_first");
}

/**
 * index页面数据分配
 * 
 */

function pageDispatch(key){
	var page=$("div[page='menu_"+key+"']");
	if(page.length>0){
		$("div[page^='menu_']").hide();
		$("div[page='menu_"+key+"']").show();
		showCurrentPage(key);
		return;
	}
	//openInnerPageTab(key,"供应商信息",start+"supplier/supplierManager/supplierInfoManager.html"+"?menu_no="+key);
	if(menuData[key]!=undefined){
		var menu_url=menuData[key]["MENU_URL"];
		if(menu_url!=undefined&&$.trim(menu_url)!=""){
			$("div[page^='menu_']").hide();
			openInnerPageTab(key,menuData[key]["MENU_NAME"],start+menu_url+"?menu_no="+key);
			showButton(key,buttonPermission[key]);
			return;
		}
	}
}

/**
 * 显示操作按钮
 * @param button
 */
function showButton(key,button){
	if(button!=undefined&&button.length>0){
		for(var i=0;i<button.length;i++){
			$("div[page='menu_"+key+"']").find("#"+button[i]).remove();
		}
	}
} 
/**
 * 隐藏页面
 * @param key
 */
function hidePage(key){
	$("div[page='menu_"+key+"']").hide();
}
/**
 * 移除页面
 * @param key
 */
function removePage(key){
	$("div[page='menu_"+key+"']").remove();
}

/**
 * 关闭页签
 * @param tabNo
 */
function closePageTab(tabNo,callback){
	$(".list_tree_1nav li[tabid='"+tabNo+"'] a").click();
	if(callback!=undefined){
		callback();
	}
}
/**
 * 打开内部页面的页签
 * @param tabNo 页签编号
 * @param title
 * @param url
 */
function openInnerPageTab(tabNo,title,url,callback){
	$("div[page^='menu_']").hide();
	if ($("#" + tabNo+"_tit").length != 0){
    	$(".list_tree_1nav li").removeClass("current");
        $(".list_tree_1nav li").addClass("headtit");
        $(".list_tree_1nav li a").html("<img src='images/ltee_close.png'/>");
        $("#"+tabNo+"_tit a").html("<img src='images/ltee_close_h.png'/>");
        $("#"+tabNo+"_tit").removeClass("headtit");
        $("#"+tabNo+"_tit").addClass("current");
        $("div[page='menu_"+tabNo+"']").show();
        return;
    }
    //限制选项卡数量不得超过8个
    var titlength=$(".list_tree_1nav li").length;
    if(titlength==8){
    	var pageTab=$(".list_tree_1nav li:first-child");
    	removePage(pageTab.attr("tabId"));
    	pageTab.remove();
    }
    //显示全部关闭按钮
    if(titlength==1){
    	$("#tree_last").addClass("tree_last");
    	$("#tree_last").removeClass("tree_lastnone");
    }
    //改变其他选项卡的样式
    $("#firsttit").removeClass("firstcurrend");
    $(".main_iframe").css("bottom","0");
	$(".indexContent").hide();
    $("#firsttit").addClass("tree_first");
    $(".list_tree_1nav li a").html("<img src='images/ltee_close_h.png'/>");
    $(".list_tree_1nav li").removeClass("current");
    $(".list_tree_1nav li").addClass("headtit");
	$(".list_tree_1nav").append("<li class='current' onclick='pageDispatch(\""+tabNo+"\")' tabId='"+tabNo+"' id='"+tabNo+"_tit'>"+title+"<a title='关闭'><img src='images/ltee_close_h.png'/></a></li>");
	startLoading();
	loadPage(start+url,function(data){
		endLoading();
		$(content).append("<div page='menu_"+tabNo+"' style='height:90%;'>"+data+"</div>");
		getCurrentPageObj().find("select:not([id$='selected'])").select2();
		if(callback!=undefined){
			callback();
		}
	});
}
//个人信息及修改密码
function pageJump(obj,key,param){
	var p=param;	
	if("queryUser"==key){
		openInnerPageTab("user_info"+p,"个人信息","pages/suser/suser_queryUser.html",function(){
			$.ajax({
				type : "post",
				url : "SUser/queryoneuser.asp?",
				async :  true,
				data : {"user_no":p},
				dataType : "json",
				success : function(data) {
					for ( var k in data) {
						if(k=='memo'){
							$("textarea[name='Q." + k + "']").val(data[k]);
						}else if(k=='state'||k=='user_post'){
							$("select[name^='Q.']").val(data[k]);
						}else{
							$("input[name='Q." + k + "']").val(data[k]);
						}
					}
				},
				error : function() {
					alert("系统异常！");
				}
			});
		});
	}else if("updatePass"==key){
		openInnerPageTab("update_pw","修改密码","pages/suser/suser_updatePass.html",function(){			
			$("#user_no").val(p.user_no);
			$("#user_name").val(p.user_name);
		});
	}
}
/**
 * $_("update","#id")
 * @param no
 */
function $_(no,c){
	return $("div[page='menu_"+no+"']").find(c);
}
function $_find(no){
	return $("div[page='menu_"+no+"']");
}

//内部切换页面一套方法
function clone(obj){  
    var o, obj;  
    if (obj.constructor == Object){  
        o = new obj.constructor();   
    }else{  
        o = new obj.constructor(obj.valueOf());   
    }  
    for(var key in obj){  
        if ( o[key] != obj[key] ){   
            if ( typeof(obj[key]) == 'object' ){   
                o[key] = clone2(obj[key]);  
            }else{  
                o[key] = obj[key];  
            }  
        }  
    }  
    o.toString = obj.toString;  
    o.valueOf = obj.valueOf;  
    return o;  
}


/**
 * 切换页签的方法，适用于页签内部切换
 * */
function newOpenTab(key,title,url,callback,param){
	//获取当前活动页签
	key=key.toLowerCase();
	var currentobj=$(".list_tree_1nav li.current");
	var tabid =currentobj.attr("tabid");
	//先获取旧的menu_no
	var oldMenu_no=tabsAndPages[tabid]["MENU_NO"];
	//重置当前活动的实际menu_no
	menuData[tabid];
	tabsAndPages[tabid]["MENU_NO"]=key;
	tabsAndPages[tabid]["MENU_NAME"]=title;
	tabsAndPages[tabid]["MENU_URL"]=url;
	removePage(oldMenu_no);
	startLoading();
	loadPage(start+url,function(data){
		endLoading();
		$(content).append("<div page='menu_"+key+"' style='height:90%;'>"+data+"</div>");
		getCurrentPageObj().find("select:not([id$='selected'])").select2();
		showButton(key,buttonPermission[key]);
		if(callback!=undefined){
			callback();
		}
	},param);
	
}

/**
 * 内部切换页面的tab页签事件
 * flag:true表示重新加载菜单对应的页面，false表示保持当前页签对应的页面
 * 
 */

function pageDispatch2(key,flag,callback){
	if(flag){
		//判断当前页签是否已存在，存在则去容器集合获取当前对应的page，去掉page，重新加载新的page
		var tab=$("#"+key+"_tit");
		if(tab.length<=0){
			if(menuData[key]!=undefined){
				var menu_url=menuData[key]["MENU_URL"];
				if(menu_url!=undefined&&$.trim(menu_url)!=""){
					$("div[page^='menu_']").hide();
					openInnerPageTab2(key,menuData[key]["MENU_NAME"],start+menu_url+"?menu_no="+key);
					//加入到当前tab页签集合
					tabsAndPages[key]=clone(menuData[key]);
					//tabsAndPages[menuData[key]["MENU_NO"]]=menuData[key]["MENU_NO"];
					showButton(key,buttonPermission[key]);
				}
			}
		}else{
			//去掉当前对应的page，重新加载列表
			removePage(tabsAndPages[key]["MENU_NO"]);
			startLoading();
			var url=menuData[key]["MENU_URL"];
			$("div[page^='menu_']").hide();
			loadPage(start+url,function(data){
				endLoading();
				$(content).append("<div page='menu_"+key+"' style='height:90%;'>"+data+"</div>");
				getCurrentPageObj().find("select:not([id$='selected'])").select2();
			});
			//重新加载新的内容到容器
			tabsAndPages[key]=clone(menuData[key]);
			showCurrentPage(key);
			showButton(key,buttonPermission[key]);
		}
	}else{
		//从容器获取对应的page，展示已存在的page
		var real_Menu_no=tabsAndPages[key]["MENU_NO"];
		var page=$("div[page='menu_"+real_Menu_no+"']");
		if(page.length>0){
			$("div[page^='menu_']").hide();
			$("div[page='menu_"+real_Menu_no+"']").show();
			showCurrentPage(key);
			return;
		}else{
			//不可能出现
		}
	}
	if(callback!=undefined){
		callback();
	}
	
}


/**
 * 打开内部页面的页签
 * @param tabNo 页签编号
 * @param title
 * @param url
 */
function openInnerPageTab2(tabNo,title,url,callback){
	$("div[page^='menu_']").hide();
	if ($("#" + tabNo+"_tit").length != 0){
    	$(".list_tree_1nav li").removeClass("current");
        $(".list_tree_1nav li").addClass("headtit");
        $(".list_tree_1nav li a").html("<img src='images/ltee_close.png'/>");
        $("#"+tabNo+"_tit a").html("<img src='images/ltee_close_h.png'/>");
        $("#"+tabNo+"_tit").removeClass("headtit");
        $("#"+tabNo+"_tit").addClass("current");
        $("div[page='menu_"+tabNo+"']").show();
        return;
    }
    //限制选项卡数量不得超过8个
    var titlength=$(".list_tree_1nav li").length;
    if(titlength==8){
    	var pageTab=$(".list_tree_1nav li:first-child");
    	//去内部跳转容器获取当前对应的page
    	var firstPage=tabsAndPages[pageTab.attr("tabId")]["MENU_NO"];
    	removePage(firstPage);
    	pageTab.remove();
    }
    //显示全部关闭按钮
    if(titlength==1){
    	$("#tree_last").addClass("tree_last");
    	$("#tree_last").removeClass("tree_lastnone");
    }
    //改变其他选项卡的样式
    $("#firsttit").removeClass("firstcurrend");
    $(".main_iframe").css("bottom","0");
	$(".indexContent").hide();
    $("#firsttit").addClass("tree_first");
    $(".list_tree_1nav li a").html("<img src='images/ltee_close_h.png'/>");
    $(".list_tree_1nav li").removeClass("current");
    $(".list_tree_1nav li").addClass("headtit");
	$(".list_tree_1nav").append("<li class='current' onclick='pageDispatch2(\""+tabNo+"\",false)' tabId='"+tabNo+"' id='"+tabNo+"_tit'>"+title+"<a title='关闭'><img src='images/ltee_close_h.png'/></a></li>");
	startLoading();
	loadPage(start+url,function(data){
		endLoading();
		$(content).append("<div page='menu_"+tabNo+"' style='height:90%;'>"+data+"</div>");
		//getCurrentPageObj().find("select:not([id$='selected'])").select2();
		if(callback!=undefined){
			callback();
		}
	});
}

/**
 * 获取当前活动页面的方法
 * */

function getCurrentPageMenuNo(){
	var oldobj=$(".list_tree_1nav li.current");
	var tabid=oldobj.attr("id");
	return tabsAndPages[tabid.split("_tit")[0]]["MENU_NO"];
}
//内部切换页面一套方法

//添加获取当前位置的方法

//当前位置显示
	    $(function(){
	    	$("#third").on("click","li",function(){
	    		var tid = $(this).find("span").eq(1).attr("id");
	    		if(tid=="estimateManager"){
	    			 var span =" 评价管理 >现场评价 >人员评价管理 >人员评价管理 ";
	    			 alert(span);
	    			 $("#location").html(span);
	    		}
	    	});
	    	
	    	//二级菜单
	    	$("#gundongNavWrap").on("click",".gundongNav li",function(){
	    		 var titid = $(this).attr("class");
	    		 if(titid=="two1"){
	    			 var span =" 名录管理 >"+$(this).text();
	    			 $("#location").html(span);
	    		 }
				 else if(titid=="two4"){
	    			 var span =" 合同管理 >"+$(this).text();
	    			 $("#location").html(span);
	    		 }
				 else if(titid=="two7"){
	    			 var span =" 报表管理 >"+$(this).text();
	    			 $("#location").html(span);
	    		 }
				 else if(titid=="two5"){
	    			 var span =" 投诉建议 >"+$(this).text();
	    			 $("#location").html(span);
	    		 }
	    		 else if(titid=="two6"){
	    			 var span =" 等级管理 >"+$(this).text();
	    			 $("#location").html(span);
	    		 }
	    		 else if(titid=="two2"){
	    			 var span =" 人员管理 >"+$(this).text();
	    			 $("#location").html(span);
	    		 }
	    		 else if(titid=="secondM"){
	    			 var span =$(this).parent().prev().parent().parent().prev().find("span").eq(1).text()+" >"+$(this).parent().prev().find("span").eq(1).text()+" >"+$(this).text();
	    			 $("#location").html(span);
	    		 }  
	    		 else if(titid=="two8"){
	    			 var span =" 后台管理 >"+$(this).text();
	    			 $("#location").html(span);
	    		 }
	    		 /* else{
	    			 var span ="首页";
	    			 $("#location").html(span);
	    		 } */
		   }); 
	    	
		    	
	    	$('.exit').bind('click', function(e) {
				e.preventDefault();
	            $.Zebra_Dialog('是否退出？', {
	                'type':     'close',
	                'title':    '提示',
	                'buttons':  ['确定', '取消'],
	                'onClose':  function(caption) {
	                    if (caption=="确定") {
	                    	$.post("logout.asp",function(data){
	                    		if(data.result=="true"){
	                    			window.location.href="login.html";
	                    		} else {
	                    			alert("退出失败");
	                    		}
	                    	},"json");
		        		}else{
		        		}
	                }
	            });
			});	
		    	
	    });
//添加获取当前位置的方法
//登入超时验证，跳回首页
var isloginTip=false;
(function(jq){  
    var _ajax=jq.ajax;  
      
    jq.ajax=function(opt){
        var fn = {  
            error:function(XMLHttpRequest, textStatus, errorThrown){},  
            success:function(data, textStatus){}  
        };
        if(opt.error){  
            fn.error=opt.error;  
        }  
        if(opt.success){  
            fn.success=opt.success;  
        }  
        //扩展增强处理  
        var _opt = jq.extend(opt,{
            error:function(XMLHttpRequest, textStatus, errorThrown){  
                fn.error(XMLHttpRequest, textStatus, errorThrown);  
            },  
            success:function(data, textStatus){
            	if(("object"== typeof data&&data["logintimeout"]==true&&isloginTip==false)){
            		isloginTip=true;
//            		if(confirm("登录超时,请重新登录!")){
//            			window.location="login.html";
//            		}
            		$.Zebra_Dialog('登录超时,请重新登录!', {
    	                'type':     'close',
    	                'title':    '提示',
    	                'buttons':  ['确定', '取消'],
    	                'onClose':  function(caption) {
    	                    if (caption=="确定") {
    	                    	window.location.href="login.html";
    		        		}else{
    		        			window.location.href="login.html";
    		        		}
    	                }
    	            });
            		return;
            	}
                fn.success(data, textStatus);  
            }  
        });  
        return _ajax(_opt);  
    };  
})(jQuery);
	    
	    
	   