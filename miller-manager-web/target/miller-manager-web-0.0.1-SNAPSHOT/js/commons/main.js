 $(document).ready(function() {
	    	initMenu();
	    	//单击弹出个人信息框
        	$("#userConcent").click(function(event){
        		 event.stopPropagation();
        		 $('#usershow').slideToggle('slow');
        	});
        	$("#main_list").click(function(event){
       			 event.stopPropagation();
       		 	$('.list_tree_tc').slideToggle('slow');
       		});
        	$(document).click(function (event) { 
        		$('#usershow').slideUp('slow');
        		$('.list_tree_tc').slideUp('slow');
        	});
	    	//单击修改密码，弹出新的选项卡
	    	$("#usernews").click(function(){
	    		if ($("#usernews_current").length != 0){
	    			$("#firsttit").removeClass("firstcurrend");
	        		$("#firsttit").addClass("tree_first");
	        		$(".list_tree_1nav li a").html("<img src='images/ltee_close.png'/>");
	        		$(".list_tree_1nav li").removeClass("current");
	        		$(".list_tree_1nav li").addClass("headtit");
	                $("#usernews_current a").html("<img src='images/ltee_close_h.png'/>");
	                $("#usernews_current").removeClass("headtit");
	                $("#usernews_current").addClass("current");
	                return;
	        	}
	    		//限制选项卡数量不得超过8个
	            var titlength=$(".list_tree_1nav li").length;
	            if(titlength==8){
	            	$(".list_tree_1nav li:first-child").remove();
	            }
	            //显示全部关闭按钮
	            if(titlength==1){
	            	$("#tree_last").addClass("tree_last");
	            	$("#tree_last").removeClass("tree_lastnone");
	            }
	            $("#firsttit").removeClass("firstcurrend");
	            $("#firsttit").addClass("tree_first");
	            $(".list_tree_1nav li a").html("<img src='images/ltee_close.png'/>");
	        	$(".list_tree_1nav li").removeClass("current");
	        	$(".list_tree_1nav li").addClass("headtit");
	    		$(".list_tree_1nav").append("<li class='current' id='usernews_current'>个人信息<a title='关闭'><img src='images/ltee_close_h.png'/></a></li>");
	    	});
	    	//初始化首页
			$("#firsttit").addClass("firstcurrend");
			//单击首页事件
			$("#firsttit").click(function() {
				//其他选项卡改变样式
				$(".main_iframe").css("overflowY","hidden");
				//$("#content iframe").hide();
				$("div[page^='menu_']").hide();
				$(".list_tree_1nav li").removeClass("current");
				$(".list_tree_1nav li").addClass("headtit");
				$(".list_tree_1nav li a").html("<img src='images/ltee_close_h.png'/>");
				//为首页选项卡添加样式
				$("#firsttit").removeClass("tree_first");
				$("#firsttit").addClass("firstcurrend");
				
				//显示首页内容容器
				$(".indexContent").show();
				$(".main_iframe").css('overflowY','auto');
			});
	    	
			/**
			 * 关闭X选项卡菜单事件
			 */
			$(document).on('click', '.list_tree_1nav li a', function(event) {
				 event.stopPropagation(); 	 //阻止事件冒泡，这个很重要。否则激活li 的click事件	 		 
				 var totalLiCount = $('.list_tree_1nav li').length; // li总数
				 var currentClickLiIndex = $(this).parent().index(); //点击的li 索引 
			 	
				var tabid = $(this).parent().attr("id");
		     	$("#"+ tabid).remove(); //移除li对应的菜单,同时删除 Content里的相应容器
		     	//$("#content #"+tabid+"_conter").remove();
		     	var menu_no= tabid.split("_tit")[0];
		     	//从新的容器集合里面获取当前对应的page
		     	menu_no=tabsAndPages[menu_no]["MENU_NO"];
		     	removePage(menu_no);
		     	$("div[page^='menu_']:last").show();
		     	//getCurrentPageObj().remove();
				/**
				 * 逻辑分析：如果是点击当前的关闭，1，如果后面有的话 ，显示后面的一个。 2，如果后面没有的话显示前面的一个。
				 */
				if($(".list_tree_1nav li.current").length == 0 )
				{
					//如果点击的当前li是最后一个,并且剩下的li 大于 0，则选择前一个	
					if($(".list_tree_1nav li").length > 0){ 
				          if(currentClickLiIndex == totalLiCount-1){ //点击最后一个
				          		//给最后一选项卡加样式
								var lastLi =  $(".list_tree_1nav li:last-child");
								var Closeiocn = $(lastLi).attr("id");
								var newMenu_no = Closeiocn.split("_tit")[0];
								$("#" + Closeiocn + "_tit a").html("<img src='images/ltee_close.png'/>");
				    				$(lastLi).removeClass("headtit").addClass("current");
				    				$("div[page='menu_"+newMenu_no+"']").show();
				         }else{//点击第一个至倒数第二个的情况		         	
								//给后一选项卡加样式
								var nextLi =  $(".list_tree_1nav li").eq(currentClickLiIndex);
								var Closeiocn = $(nextLi).attr("id");
								var newMenu_no = Closeiocn.split("_tit")[0];
								$("#" + Closeiocn + "_tit a").html("<img src='images/ltee_close.png'/>");
				    				$(nextLi).removeClass("headtit").addClass("current");
				    				$("div[page='menu_"+newMenu_no+"']").show();
					 	 }
					}else{  
						$(".indexContent").show();//剩下最后一项的时候，显示首页
					}
				}else{
					//如果点击的是其他的关闭，则不影响。不需要写代码。
				}
			});
			
			
			//单击当前项时事件
			/*$(document).on('click', '.list_tree_1nav li', function() {
	        	if("remove"==$(this).attr("remove")){
	        		if($(".list_tree_1nav li").length<=1){
	        			$("#tree_last").addClass("tree_lastnone");
	        		}
	        		$(this).remove();
	        		removePage($(this).attr("tabId"));
	        		 $(".list_tree_1nav li:last").click();
	        		 $(".indexContent").show();
	        		return;
	        	}
	        	//去除其他选项卡的样式
	        	$("#firsttit").removeClass("firstcurrend");
	            $("#firsttit").addClass("tree_first");
	            $(".list_tree_1nav li").removeClass("current");
	            $(".list_tree_1nav li").addClass("headtit");
	            $(".list_tree_1nav li a").html("<img src='images/ltee_close.png'/>");
	            //为当前选项卡添加样式
	            var Closeiocn=$(this).attr("id");
	            $("#"+Closeiocn+" a").html("<img src='images/ltee_close_h.png'/>");
	            $(this).removeClass("headtit");
	            $(this).addClass("current");
			});*/
	    	
			
	        
	       //首页的图表切换
			    $(".tab li.tabBtn").click(function(){
  				/* $(".tab li.tabBtn").eq($(this).index()).addClass("cur").siblings().removeClass('cur'); */
			    $(".tabContList").hide().eq($(this).index()).show();
			    $("i.arrow").removeClass('tabsArrow');
				$("i.arrow").eq($(this).index()).addClass('tabsArrow');;
			        });
			  
	        
	        //左侧导航栏操作
	        $(document).on('click','.nui-tree-item-label',function(){
	        	var classname=$(this).nextAll('ul').attr("class");
	        	if(classname=="nuinone"){
	        		$(this).nextAll('ul').removeClass("nuinone");
	        		$(this).find('b').addClass("nui-ico-rArr1");
	        	}else{
	        		$(this).nextAll('ul').addClass("nuinone");
	        		$(this).find('b').removeClass("nui-ico-rArr1");
	        	}
	        	//获取当前单击的ID
	        	var conid=$(this).attr("id");
	        	if(conid==null||conid==""){
	        	}else{
	        		$(".gundong").addClass("nuinone");
	        		$("#"+conid).nextAll('ul').removeClass("nuinone");
	        	}
	        });
	    });
	    //关闭所有选项卡
	    $("#tree_last").click(function(){
	    	$(".list_tree_1nav li").remove();
			$("#tree_last").addClass("tree_lastnone");
			$("#firsttit").removeClass("tree_first");
			$("#firsttit").addClass("firstcurrend");
			$("#content iframe").remove();
			$(".indexContent").show();
			$("div[page^='menu_']").remove();
	    });
	    
	  
	    $(function() {
			/**
		 	 * 手风琴效果
		 	 */
			var Accordion = function(clickItemElStr,el, multiple) {
				this.el = el || {};
				this.multiple = multiple || false;
				var links = this.el.find(clickItemElStr);
				links.on('click', {
					el: this.el,
					multiple: this.multiple
				}, this.dropdown);
			};

			Accordion.prototype.dropdown = function(e) {
				e.stopPropagation();  //防止事件冒泡
				var $el = e.data.el;
				$this = $(this);
				$next = $this.nextAll();
				var $sibling=$this.parent().parent().siblings(".nuinone");
				var $sibling3=$this.parent().parent().parent().parent().siblings(".nuinone");
				$parentUl = $this.parent().parent(); //父类ul展开的时候，点击子类显示子类菜单时候，父类菜单不合起来。
				$parentUl3 = $this.parent().parent().parent().parent();
				$next.slideToggle();
				$this.parent().toggleClass('open');
				if (!e.data.multiple) {
				    $el.find('ul').not($next).not($parentUl).not($parentUl3).not($sibling).not($sibling3) //排除当前，排除父类 排除同级
				    .slideUp().parent().removeClass('open');
				};
				var tree_label=$(".nui-tree-item-label");
				for(var i=0;i<tree_label.length;i++){
					var treeObj=$(tree_label[i]);
					var treeul=treeObj.siblings("ul");	
					if(treeul.length>0){
						treeObj.find("img").show();
					}else{
						treeObj.find("img").hide();
					}
				}
			};
			var accordion = new Accordion('.nui-tree-item-labelNav',$('#gundongNavWrap'), false); 
			var accordion2 =  new Accordion('.duojiMenu',$(".nuinone"), false);
			//var accordion3 =  new Accordion('.duojiMenu[name=viewMenuThird]',$(".nuinone[name='viewMenuThird']"), false);
			 
			
			/**
			 * ----------------------------附加效果------------------------------
			 */
				/* //初始化首页
				$("#firsttit").addClass("firstcurrend");
				//单击首页事件
				$("#firsttit").click(function() {
					//其他选项卡改变样式
					$(".main_iframe").css("overflowY","hidden");
					//$("#content iframe").hide();
					$("div[page^='menu_']").hide();
					$(".list_tree_1nav li").removeClass("current");
					$(".list_tree_1nav li").addClass("headtit");
					$(".list_tree_1nav li a").html("<img src='images/ltee_close_h.png'/>");
					//为首页选项卡添加样式
					$("#firsttit").removeClass("tree_first");
					$("#firsttit").addClass("firstcurrend");
					
					//显示首页内容容器
					$(".indexContent").show();
					$(".main_iframe").css('overflowY','auto');
				}); */
				
				//点击用户头像查看个人信息
				$(".userMessage").click(function() {
					$(".imf").slideDown(600);
					$("#opacityBg").slideDown(600);
				});
				$("#rewriteyourInfo span").click(function() {
					$(".imf").slideUp(600);
				});
				
				$("#opacityBg").click(function() {
					$(".imf").hide();
					$("#opacityBg").hide();
					$(".otherSystemsDiv").hide();
					$("#opacityBg").hide();
					$("#BackgroundCheckListSub").hide();
					$("#estimateManagerSub").hide();
					$("#empEvaluateConfigSub").hide();
					$(".EstimateManagerDet").hide();
					$(".backCheckConfigDet").hide();
					$(".backCheckModelConfigListDet").hide();
				});
				
				
				// 右上角其他系统
				$(".otherSystemsBtn").click(function() {
					$(".otherSystemsDiv").slideDown(600);
					$("#opacityBg").slideDown(600);
				});
				$(".otherSystems li").click(function() {
					$(".otherSystemsDiv").slideUp(600);
				});
				
				// 侧边栏收合
				$("#sidebar-btn").click(function() {
					$("#sidebarMenu").toggle();
					$(".main_iframe").toggleClass("marginLeft15");
					$(".suo").toggleClass("marginLeft0");
					$(".main_iframe").css("overflowY","auto");
					$(".main_iframe").toggleClass("main_iframeLarge");
				});
				/*资产申请审批*/
				$(".applyANDapproveList").click(function(){
					$(this).toggleClass("applyANDapproveListCheckBg");
				});
				$(".indexContentMain_Cont_Det .approveBtn .more").click(function(){
					$(".applyANDapprove").css({"overflow":"auto"});
				});
  
		});
	    
	   
/************************************************处理IE8支持indexOf属性-start*************************************/
if (!Array.prototype.indexOf){
	Array.prototype.indexOf = function(elt /*, from*/){
		var len = this.length >>> 0;
		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if(from < 0)
		from += len;
		for(; from < len; from++){
		if (from in this && this[from] === elt)
			return from;
		}
		return -1;
	};
}

/************************************************处理IE8支持indexOf属性-end*************************************/    

/************************************************处理IE8支持forEachf属性-start*************************************/  	    
	    
if ( !Array.prototype.forEach) {
	  Array.prototype.forEach = function forEach(callback) {
	      // 获取数组长度
	    var len = this.length;
	    if(typeof callback != "function") {
	        throw new TypeError();
	    }
	    // thisArg为callback 函数的执行上下文环境
	    var thisArg = arguments[1];
	    for(var i = 0; i < len; i++) {
	        if(i in this) {
	            // callback函数接收三个参数：当前项的值、当前项的索引和数组本身
	            callback.call(thisArg, this[i], i, this);
	        }
	    }
	  }
	}
/************************************************处理IE8支持forEachf属性-end*************************************/ 