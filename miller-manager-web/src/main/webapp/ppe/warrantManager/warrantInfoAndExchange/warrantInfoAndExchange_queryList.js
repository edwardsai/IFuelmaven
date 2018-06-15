warrantListButtonEvent();
function warrantListButtonEvent(){
	var currTab = getCurrentPageObj();//当前页
	autoInitSelect(currTab.find("#searchDiv_wrt_warrantList"));
	//查询按钮
	currTab.find("#search_wrt_warrantList").click(function(){
		var warrant_no = $.trim(currTab.find("#WARRANT_NO").val());
		var tag_id = $.trim(currTab.find("#TAG_ID").val());
		var warrant_state = $.trim(currTab.find("#warrant_state").val());
		var warr_classify_o = $.trim(currTab.find("#warr_typeId").val());
		currTab.find('#tb_wrt_warrantList').bootstrapTable('refresh',{
			url:'warrantInfoAndExchange/queryAllWarrant.asp?warrant_no='+escape(encodeURIComponent(warrant_no))
			+'&tag_id='+escape(encodeURIComponent(tag_id))
			+'&warrant_state='+warrant_state
			+'&warr_classify_o='+(encodeURIComponent(warr_classify_o))
			});
		});
	//权证类型
	currTab.find('#warr_classify_o').bind('click', function() {
		var pre_category_id="0104";
		openSelectTreeDivWar($(this),"warrantListSelectTreeType_invPL","warrantInfoAndExchange/queryAllWarrantCategroy.asp?pre_category_id="+pre_category_id,{width:$(this).width()+"px","margin-left": "127px"},function(node){
			currTab.find("#warr_classify_o").val(node.NAME);
			currTab.find("#warr_typeId").val(node.ID);
			return true;
		});
	});
	//打印条形码
	var printCode = currTab.find("li[sel=printWarCode]");
	printCode.click(function(){
		var seles = currTab.find("#tb_wrt_warrantList").bootstrapTable("getSelections");
		if(seles&&seles.length==1){
			var tag_id = seles[0].TAG_ID;
			var warr_type = seles[0].WARR_TYPE;
			var org_no = seles[0].JG_ORG_NO;
			var codeNum = toStandarCode(tag_id,org_no,warr_type);//转为条形码规范数据
			if(!codeNum){//没返回标准条形码，结束方法
				return;
			}
			writeEPC2(codeNum);
		}else{
			alert("请选择一条数据进行打印");
		}
	});
	//读取条形码
	var readCode = currTab.find("li[sel=readWarCode]");
	readCode.click(function(){
		var code=readEPC2();
		if(code){
			var tag_id = hexToTagId(code);//转为Tag_id
			alert('标签编码为：\"'+tag_id + '\"');
		}
	});
	/**
	 * BSTR WriteTag (ULONG ulMemBank, USHORT offset, USHORT length, LPCTSTR strAccessPWD, LPCTSTR strWriteInfo)
	 * ulMemBank  操作区域  0--Reserved;1--EPC;2--TID;3--USER
	 * offset   偏移地址(起始地址)
	 * length   数据长度(以WORD为单位)
	 * strAccessPWD   访问密码(16进制数字符串,8个字符)
	 * strWriteInfo   要写入的内容(16进制数字符串,长度必须是4的整数倍)
	 * */
	function writeEPC2(code){
		var vlc = getVLC("vlc");
	    if (vlc) {
	    	var resultInfo = vlc.WriteTag(3, 0, 15, 0, code);
	    	 var res=resultInfo.substring(resultInfo.indexOf("<Success>")+9,resultInfo.indexOf("</Success>"));
			 //1--成功;0--失败;2--无标签;3--无法连接到设备;4--设备被占用
	    	 res=parseInt(res);
	        switch(res){
	        	case 1:
	        		alert("写入成功！条形码为："+code);
	        		break;
	        	case 2:
	        		alert("请放入标签！");
	        		break;
	        	case 3:
	        		alert("设备未连接！");
	        		break;
	        	case 4:
	        		alert("设备被占用！");
	        		break;
	        	default:
	        		alert("写入失败！");
	        }
	    }
	}
	
	/**
	 * BSTR ReadTag (ULONG ulMemBank, USHORT offset, USHORT length, LPCTSTR strAccessPWD)
	 * ulMemBank 操作区域 0--Reserved;1--EPC;2--TID;3--USER
	 * offset  偏移地址(起始地址)
	 * length  数据长度(以WORD为单位)
	 * strAccessPWD  访问密码(16进制数字符串,8个字符)
	 * */
	function readEPC2(){
		 var vlc = getVLC("vlc");
		 if(vlc){
			 var resultInfo = vlc.ReadTag(3,0,15,0);//读取USER区信息
			 var res=resultInfo.substring(resultInfo.indexOf("<Success>")+9,resultInfo.indexOf("</Success>"));
			 //1--成功;0--失败;2--无标签;3--无法连接到设备;4--设备被占用
			 if(res==1){
				 var epc_val =resultInfo.substring(resultInfo.indexOf("<DATA>")+6,resultInfo.indexOf("</DATA>"));
				 return epc_val;
			 }else if(res==2){
				 alert("无标签");
			 }else if(res==3){
				 alert("无法连接到设备");
			 }else{
				 alert("设备被占用");
			 }
		 }
	}
	
	
	
	function openSelectTreeDivWar(obj,treeId,url,css,callback){
		if(!$("#"+treeId)[0]){
			var marginleft=""; if(css["margin-left"]){marginleft="margin-left:"+css["margin-left"]+";";};
			var margintop=""; if(css["margin-top"]){margintop="margin-top:"+css["margin-top"]+";";};
			var width=""; if(css.width){width="width:"+css.width+";";};
			var height="height:300px;"; if(css.height){height="height:"+css.height+";";};
			obj.after('<div id="'+treeId+'" class="ztree" style="'+marginleft+margintop+' overflow-y: scroll;z-index: 1000;background-color: white;border:1px solid #CDCDCD;'+height+'position:absolute;'+width+'">&nbsp;aaa&nbsp;</div>');
			openSelectTreeDiv[treeId]="11";
		}else{
			if(css.width){
				$("#"+treeId).css("width",css.width);
			}
			$("#"+treeId).show();
		}
		$("#body").mousedown(function(){
			$("#body").unbind("mousedown");
			$("#"+treeId).hide();
		});
		$("#"+treeId).mouseout(function(){
			$("#body").unbind("mousedown");
			$("#body").mousedown(function(){
				$("#"+treeId).hide();
				$("#body").unbind("mousedown");
			});
		});
		$("#"+treeId).mouseover(function(){
			$("#body").unbind("mousedown");
		});
			var setting = {
					async : {
						enable : true,
						url : url,
						contentType : "application/json",
						type : "get"
					},
					view : {
						dblClickExpand : false,
						showLine : true,
						selectedMulti : false
					},
					data : {
						key : {
							name : "NAME",
						},
						simpleData : {
							enable : true,
							idKey : "ID",
							pIdKey : "PID",
							rootPId : "0104"
						}
					},
					callback : {
						onAsyncSuccess: function(){
							var treeObj = $.fn.zTree.getZTreeObj(treeId);
							treeObj.expandNode(treeObj.getNodeByTId(treeId+"_1"), true, false, true);
						},
						onClick : function(event, treeId, treeNode) {
							treeNode.allname=getAllSelectTreeDivName(treeNode,treeNode.NAME);
							if(callback){
								var c=callback(treeNode);
								if(c==undefined||c==true){
									$("#"+treeId).hide();
								}
							}else{
								$("#"+treeId).hide();
							}
						}
					}
				};
				$.fn.zTree.init($("#"+treeId), setting);
	}
	//查阅权证卡片
	currTab.find('#query_wrt_warrantList').bind('click', function(e) {
		var id = currTab.find("#tb_wrt_warrantList").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请选择一条数据进行查阅!");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		pageDispatchWarrantList("queryWarrant",params[0]);
	});
	//权证估价
	currTab.find('#estimate_wrt_area').unbind();
	currTab.find('#estimate_wrt_area').bind('click', function() {
		newOpenTab("newWarrantWagIdDL","权证估价","ppe/warrantManager/warrantInfoAndExchange/warrant_estimate.html");
	});
	//权证标签变更
	currTab.find('#update_wrt_tagId').bind('click', function(e) {
		var id = currTab.find("#tb_wrt_warrantList").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		pageDispatchWarrantList("updateWarrantWagId",params[0]);
	});
	//权证存放位置变更
	currTab.find("#update_wrt_area").bind('click',function(){
		var id = currTab.find("#tb_wrt_warrantList").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		pageDispatchWarrantList("updateWarrantArea",params[0]);
	});
	//重置按钮
	$('#reset_wrt_warrantList').bind('click', function(e) {
		currTab.find("#searchDiv_wrt_warrantList input,select").val(" ");
		currTab.find("#searchDiv_wrt_warrantList select").select2();
	});
	//高级查询按钮 
	currTab.find("#showMore_wrt_warrantList").click(function() {
		showMore($(this),"#moreSearch_wrt_warrantList");
	});
	//初始化列表
	initWarrantList();
	function initWarrantList(){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		currTab.find('#tb_wrt_warrantList').bootstrapTable({
			url : 'warrantInfoAndExchange/queryAllWarrant.asp',//请求后台的URL（*）
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			columns : [{
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle',
			}, {
				field : 'Number',
				title : '序号',
				align : "center",
				sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field: 'WARRANT_NO',
				align: 'center',
				title : '权证编号',
			}, {
				field : 'TAG_ID',
				title : '标签编号',
				align : "center",
			}, {
				field : 'PROPERTY_OWNER_NAME',
				title : '权属人名称',
				align : "center",
			}, {
				field : "WARR_TYPE_NAME",
				title : "权证类型",
				align : "center",
			}, {
				field : "WARR_STATUS_NAME",
				title : "权证状态",
				align : "center" ,
			}, {
				field : "CABINETNUM",
				title : "存放柜号",
				align : "center",
			}, {
				field : "LAYER",
				title : "柜位",
				align : "center",
			},{
				field : "STORY_MGR_NAME",
				title : "权证管理员",
				align : "center",
			}]
		});
	}
}
//页面跳转
function pageDispatchWarrantList(key,params){
	if(key=="queryWarrant"){
		newOpenTab("newQueryWarrant","查询权证卡片","ppe/warrantManager/warrantInfoAndExchange/warrant_queryInfo.html",function(){
			initnewQueryWarrantEvent(params);
		});
		return;
	}else if(key=="updateWarrantWagId"){
		newOpenTab("newUpdateWarrantWagId","权证标签变更","ppe/warrantManager/warrantInfoAndExchange/warrantWagId_update.html",function(){
			initnewUpdateWarrantWagIdEvent(params);
		});
		return;
	}else if(key=="updateWarrantArea"){
		newOpenTab("newUpdateWarrantArea","权证存放位置变更","ppe/warrantManager/warrantInfoAndExchange/warrantArea_update.html",function(){
			initnewUpdateWarrantAreaEvent(params);
		});
		return;
	}
 }
