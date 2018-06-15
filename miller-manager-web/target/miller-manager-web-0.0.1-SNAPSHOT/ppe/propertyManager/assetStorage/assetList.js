initAssetApplyListLayout();

function initButtonShowMore(){
	$("#showMore_assetlist").click(function(){
		showMore($(this),"#moreSearch_assetList,#moreSearch_assetList2");
	});
}
initButtonShowMore();
autoInitSelect($("#moreSearch_assetList,#moreSearch_assetList2"));
function initAssetApplyListLayout(){
	//高级查询
	var page = $("#assetListPart");

	var query = page.find("div[sel=query]");
	query.click(function(){
		initTable();
	});
	
	//重置
	var reset = page.find("div[sel=reset]");
	reset.click(function(){
		page.find("input[name=assetName]").val("");
		page.find("input[name=assetType]").val("");
		page.find("input[name=assetTypeTree]").val("");
		page.find("input[name=assetStroageNum]").val('');
		page.find("select[name=assetStroage_state]").val(' ');
		page.find("select[name=assetStroage_state]").select2();
		page.find("input[name=assetStroageDate]").val('');
		page.find("input[name=assetStroageRegisterName]").val('');
		page.find("input[name=assetStroageManageName]").val('');
		page.find("input[name=assetStroageScrapDate]").val('');
	});
	
	//更多按钮
	var showMore = page.find("li[sel=moreIlsh]");
	showMore.click(function(){
		page.find("div[class=submenuList]").find("ul li:not(.submenuList1)").toggle();
		showMore.toggle();
		showMore.toggleClass("moreIlshBg");
	});
	
	//新增
	var add = page.find("li[sel=add]");
	add.click(function(){
		newOpenTab("newAssetApply","操作计划","ppe/propertyManager/assetStorage/assetEdit.html",function(){
			initAssetEditLayout(null);
		});
	});
	
	//资产类型下拉树
	var assetTypeTree = page.find("input[name=assetTypeTree]");
	initTree("assetTypeTree");
	assetTypeTree.click(function(){
		var treeObj = page.find("div[sel=assetTypeTree]");
		//树形之外隐藏树
		$("#body").mousedown(function(){
			$("#body").unbind("mousedown");
			treeObj.hide();
		});
		treeObj.mouseout(function(){
			$("#body").unbind("mousedown");
			$("#body").mousedown(function(){
				treeObj.hide();
				$("#body").unbind("mousedown");
			});
		});
		treeObj.mouseover(function(){
			$("#body").unbind("mousedown");
		});
		treeObj.show();
	});
	
	//更新
	var update = page.find("li[sel=edit]");
	update.click(function(){
		var seles = $('#tb_assetList').bootstrapTable("getSelections");
		if(seles&&seles.length==1){
			newOpenTab("newAssetApply","操作计划","ppe/propertyManager/assetStorage/assetEdit.html",function(){
				initAssetEditLayout(seles[0]);
			});
		} else {
			alert("请选择一条数据进行操作");
		}
	});
	
	//删除
	var del = page.find("li[sel=del]");
	del.click(function(){
		var seles = $("#tb_assetList").bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		nconfirm("是否删除本条资产记录",function(){
			var serialsNumber = seles[0].serialsNumber;                    
			baseAjax("inventoryManager/assetStorage/delAssetStorage.asp",{"serialsNumber":serialsNumber}, function(data) {
				if (data != undefined && data != null) {
					if(data.result==true){
						alert("删除成功！")
						initTable();
					}
				}else{
					alert("删除失败！");
				}
			},true);
		});
	});
	
	var copy = page.find("li[sel=copy]");
	copy.click(function(){
		alert("undefine function");
	});
	
	//查看资产信息
	var view = page.find("li[sel=view]");
	view.click(function(){
		var seles = $('#tb_assetList').bootstrapTable("getSelections");
		if(seles&&seles.length==1){
			newOpenTab("viewAssetPlan","操作计划","ppe/propertyManager/assetStorage/assetV.html",function(){
				initPersonalAssetEditLayout(seles[0]);
			});
		} else {
			alert("请选择一条数据进行操作");
		}
	});
	
	//打印条形码
	var printCode = page.find("li[sel=printCode]");
	printCode.click(function(){
		var seles = page.find("#tb_assetList").bootstrapTable("getSelections");
		if(seles&&seles.length==1){
			var assetNum = seles[0].assetNum;
			var assetType = seles[0].assetType;
			var org_no = $("#main_user_name").attr("org_no");
			var codeNum = toStandarCode(assetNum,org_no,assetType);//转为条形码规范数据
			if(!codeNum){//没返回标准条形码，结束方法
				return;
			}
			writeEPC(codeNum);
		}else{
			alert("请选择一条数据进行打印");
		}
	});
	//读取条形码
	var readCode = page.find("li[sel=readCode]");
	readCode.click(function(){
		var code=readEPC();
		if(code){
			var tag_id = hexToTagId(code);//转为Tag_id
			alert('资产编码为：\"'+tag_id + '\"');
		}
	});
	
	//打印二维码
	var printQRCode = page.find("li[sel=printQRCode]");
	printQRCode.click(function(){
		var seles = $('#tb_assetList').bootstrapTable("getSelections");
		if(seles&&seles.length==1){
			var isSelfInven=seles[0].isSelfInven;
			if(isSelfInven=="01"){//否,不支持自助盘点
				alert("该资产不支持自助盘点");
				return;
			}
			var codeNum =seles[0].assetNum;
			printQRCodeEvent(codeNum);
		}else{
			alert("请选择一条数据");
		}
	});
	
	initTable();
	function initTable(){
		var assetName = $.trim(page.find("input[name=assetName]").val());
		var assetType = $.trim(page.find("input[name=assetType]").val());
		var serialsNumber=$.trim(page.find("input[name=assetStroageNum]").val());
		var status=$.trim(page.find("select[name=assetStroage_state]").val());
		var entryTime=$.trim(page.find("input[name=assetStroageDate]").val());
		var createUserName=$.trim(page.find("input[name=assetStroageRegisterName]").val());
		var assetManagerName=$.trim(page.find("input[name=assetStroageManageName]").val());
		var scrapDate=$.trim(page.find("input[name=assetStroageScrapDate]").val());
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		$('#tb_assetList').bootstrapTable('destroy').bootstrapTable({
			url:'inventoryManager/assetStorage/queryAssetStorage.asp?assetName='+escape(encodeURIComponent(assetName))+'&assetType='+assetType
			+'&serialsNumber='+escape(encodeURIComponent(serialsNumber))
			+'&status='+status
			+'&entryTime='+entryTime
			+'&createUserName='+escape(encodeURIComponent(createUserName))
			+'&assetManagerName='+escape(encodeURIComponent(assetManagerName))
			+'&scrapDate='+scrapDate,//请求后台的URL（*）
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
			uniqueId : "applyId", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			columns : [{
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			}, {
				field : 'Number',
				title : '序号',
				align : "center",
				sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field: 'serialsNumber',
				align: 'center',
				title : '入库流水号'
			},{
				field : 'assetTypeName',
				title : '资产类别',
				align : "center"
			}, {
				field : 'assetName',
				title : '资产名称',
				align : "center"
			}, {
				field : 'entryTime',
				title : '入库时间',
				align : "center"
			}, {
				field : "createUserName",
				title : "登记人",
				align : "center"
			} , {
				field : "scrapDate",
				title : "预计报废时间",
				align : "center"
			},{
				field : "assetManagerName",
				title : "管理人",
				align : "center"
			},{
				field : "statusName",
				title : "资产状态",
				align : "center",
				formatter : function(value, row, idnex){
					return value?value:"";
				}
			}]
		});
	}
	
	//初始化树的方法
	function initTree(treeId){
		//z-index: 1000; margin: 0px 126px; border: 1px solid rgb(205, 205, 205); height: 200px; width: 23%; overflow: auto; position: absolute; display: block; background-color: white;
		var Y = assetTypeTree.position().left;
		var y = assetTypeTree.offset().left;
		assetTypeTree.after('<div sel="'+treeId+'" id="assTypeTree" class="ztree" style="display:none;overflow-y: scroll;z-index: 1000;margin:0px 126px;background-color: white;border:1px solid #CDCDCD;height:200px;width:'+(assetTypeTree[0].scrollWidth-10)+'px;overflow:auto;position:absolute;">&nbsp;&nbsp;</div>');
		var treeObj = page.find("div[sel="+treeId+"]");
		treeObj.position().left = Y;
		//树形之外隐藏树
		$("#body").mousedown(function(){
			$("#body").unbind("mousedown");
			treeObj.hide();
		});
		treeObj.mouseout(function(){
			$("#body").unbind("mousedown");
			$("#body").mousedown(function(){
				treeObj.hide();
				$("#body").unbind("mousedown");
			});
		});
		treeObj.mouseover(function(){
			$("#body").unbind("mousedown");
		});
		
		var setting = {
				view : {
					dblClickExpand : false,
					showLine : true,
					selectedMulti : false
				},
				data : {
					simpleData : {
						enable : true,
						idKey : "id",
						pIdKey : "pid",
						rootPId : ""
					}
				},
				callback : {
					onClick : function(event, treeId, treeNode) {
						page.find("input[name=assetType]").val(treeNode.id);
						page.find("input[name=assetTypeTree]").val(treeNode.name);
						treeObj.hide();
					}
				}
			};
		$.getJSON("propertyTypeConfig/queryAllAssetCategroy.asp", function(result){
			var zTreeObj = $.fn.zTree.init(treeObj, setting, result);
			zTreeObj.expandNode(zTreeObj.getNodeByTId("assTypeTree_1"), true, false, true);
		});
	}
	
	/**
	 * BSTR WriteTag (ULONG ulMemBank, USHORT offset, USHORT length, LPCTSTR strAccessPWD, LPCTSTR strWriteInfo)
	 * ulMemBank  操作区域  0--Reserved;1--EPC;2--TID;3--USER
	 * offset   偏移地址(起始地址)
	 * length   数据长度(以WORD为单位)
	 * strAccessPWD   访问密码(16进制数字符串,8个字符)
	 * strWriteInfo   要写入的内容(16进制数字符串,长度必须是4的整数倍)
	 * */
	function writeEPC(code){
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
	function readEPC(){
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
	
	//打印二维码方法
	function printQRCodeEvent(codeNum){
		/*解码
		 * var gg = "434322243243";
		var val = "";
		for(var i = 0; i < gg.length/2; i++){
			val+=String.fromCharCode(parseInt(subStr,16));
		}*/
		var preAssetNum = "g7:你说";
		var preCode="";
		if(preAssetNum!=null&&preAssetNum!=""){
			for(var i = 0; i < preAssetNum.length; i++){
				if(preCode == "")
					preCode = preAssetNum.charCodeAt(i).toString(16);
				else
					preCode += preAssetNum.charCodeAt(i).toString(16);
			}
		}
		
		alert(preCode);
	}
	
}
