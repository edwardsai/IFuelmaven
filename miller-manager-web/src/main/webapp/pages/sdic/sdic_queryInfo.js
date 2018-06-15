	//初始化
	initSdic();
	//查询，清空
	searchAndReset();
	//删除
	deleteSdic();
	//所属菜单
	menuSdic();
	
	//列表上面的按钮效果
	$("#moreIlsh_sdicList").click(function() {
		$("#submenuList_sdicList ul li:not(.submenuList1,#moreIlsh_sdicList)").toggle();
		$("#moreIlsh_sdicList").toggleClass("moreIlshBg");
	});
	
	function initSdic(){
		//初始化查询所有
		$('#table_sdic').bootstrapTable("destroy").bootstrapTable({
		    url: "SDic/findAllSDic.asp",       //请求后台的URL（*） 
		    method: 'get',			    //请求方式（*）   
		    striped: true,              //是否显示行间隔色
		    cache: false,               //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		    pagination: true,           //是否显示分页（*）
		    sortable: false,            //是否启用排序
		    sortOrder: "asc",           //排序方式
		    queryParams: queryParams,            //传递参数（*）
		    sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
		    pageNumber:1,               //初始化加载第一页，默认第一页
		    pageSize: 5,               //每页的记录行数（*）
		    pageList: [5,10],           //可供选择的每页的行数（*）
		    strictSearch: false,
		    clickToSelect: true,        //是否启用点击选中行
		    uniqueId: "DIC_CODE",             //每一行的唯一标识，一般为主键列
		    cardView: false,            //是否显示详细视图
		    detailView: false,          //是否显示父子表
			singleSelect: true,
		    columns: [
		     {
		    	    field: 'state',
		    	    checkbox: true,
		    	    rowspan: 2,
		    	    align: 'center',
		    	    valign: 'middle'
		     },
			{
		      field: 'DIC_CODE',
		      title: '类别编码' 
		    }, {
		      field: 'DIC_NAME',
		      title: '类别名称'
		    }, {
		       field: 'STATE',
		       title: '状态',
			   formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
		    }, {
		       field: 'MEMO',
		       title: '说明'
		      },{
			      field: 'MENU_NAME',
			      title: '所属菜单'
			    }]
		  });
		var queryParams=function(params){
			if(params==null||params==undefined){
				return {
					limit: 5,offset: 1
				};
			}
			return {
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
		};			
		//状态下拉框
		initSelect($("#dic_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"});		
	}

	function searchAndReset(){
		 //重置查询
	 	$("#dic_search").click(function(){
			var dic_code_search = $("#dic_code").val();
			var dic_name_search = $("#dic_name").val();
			var dic_state_search = $.trim($("#dic_state").val());
			var menu_no = $("#dic_query_menucode").val();
			$('#table_sdic').bootstrapTable('refresh',{url:'SDic/findAllSDic.asp?dic_code='+dic_code_search+"&dic_name="+escape(encodeURIComponent(dic_name_search))+"&state="+dic_state_search+"&menu_no="+menu_no});
		});
	 	//清空
		$("#dic_reset").click(function(){
			$("#dic_code").val("");
			$("#dic_name").val("");
			$("#dic_state").val(" ");
			$("#dic_state").select2();
			$("#dic_query_menucode").val("");
			$("#dic_query_menuname").val("");
		});	
		//高级查询
		$("#showMore_sdic").click(function() {
			showMore($(this),"#moreSearch_sdic");
		});
	}
	function deleteSdic(){
		//删除表格中的一条数据
		$("#del_sdic").click(function(){
			var id = $("#table_sdic").bootstrapTable('getSelections');
			var ids = $.map(id, function (row) {
				return row.DIC_CODE;                    
			});
			if(id.length!=1){
				alert("请选择一条数据进行修改!");
				return ;
			}
			nconfirm("是否删除?",function(){
				var url="SDic/delete.asp?dic_code="+ids;
				$.ajax({
					type : "post",
					url : url,
					async :  true,
					data : "",
					dataType : "json",
					success : function(msg) {
						alert("删除成功！");
						$('#table_sdic').bootstrapTable('refresh',{url:'SDic/findAllSDic.asp'});
					},
					error : function() {	
						alert("删除失败！");
					}
				});
			});
		});
	}
	
	function menuSdic(){
		//所属菜单
		$("#dic_query_menuname").click(function(){
			openSelectTreeDiv($(this),"dicquery_menutree_id","SMenu/queryAllmenu.asp",{"margin-left":'131px',width:$("#dic_query_menuname").width()},function(node){
				$("#dic_query_menuname").val(node.name);
				$("#dic_query_menucode").val(node.id);
			});
		});
		$("#dic_query_menuname").focus(function(){
			$("#dic_query_menuname").click();
		});
		/*$("#dic_query_menuname").blur(function(){
			$("#dicquery_menutree_id").hide();
		});*/
		
		
	}
	
	$("#add_sdic_info").click(function(){
		newOpenDicInfoTab("add_dic_info", "新增字典项", "pages/sdic/sdic_add.html", function(){});
	});

	$("#update_sdic_info").click(function(){
		var id = $("#table_sdic").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenDicInfoTab("upate_dic_info", "更新字典项", "pages/sdic/sdic_update.html", function(){
			initSdicUpdataLayout(id);
		});
	});

	$("#sdic_info_config").click(function(){
		var id = $("#table_sdic").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据进行配置!");
			return;
		}
		newOpenDicInfoTab("dic_info_config", "配置字典项", "pages/sdic/sdicItem_queryInfo.html", function(){
			initSdicItem_config(id);
		});
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