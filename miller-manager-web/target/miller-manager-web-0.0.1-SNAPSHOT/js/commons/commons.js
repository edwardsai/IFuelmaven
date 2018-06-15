
	//附件删除
	/*$(document).on('click','#file_del',function(){
		window.open('../../delete_fileL.html','附件删除','width=504,height=500');
	});
	//附件浏览
	$(document).on('click','#file_scan',function(){
		window.open('../../scan_fileL.html','附件浏览','width=504,height=500');
	});*/


//获取id对象
function getVLC(elementid) {
	    var vlc = document.getElementById(elementid);
	    return vlc;
}

/**
 * 转为规范的条形码数据（存tag_id,org_no,warr_type）
 * tag_id前缀转16进制,后面不转
 * 标准条形码长度60,前40存tag_id,41-50存org_no,51-60存warr_type
 */
function toStandarCode(tag_id,org_no,warr_type){
	debugger;
	var tagCode = "";
	var orgCode = org_no;
	var typeCode = warr_type;
	if(28 < tag_id.length < 34){
		var pre_tag_id=tag_id.substr(0, tag_id.length - 28);
    	var proTagCode=tag_id.substr(tag_id.length - 28);
		var preTagCode="";
		for(var i = 0; i < pre_tag_id.length; i++){
			var oneTagCode = pre_tag_id.charCodeAt(i).toString(16);
			if(oneTagCode.length != 2){
				alert("存在不合规前缀编码");
				return;
			}else{
				preTagCode += oneTagCode;
			}
		}
		tagCode = preTagCode + proTagCode;
    	//对转换出来的值判断是40位，不足前面补0
    	while(tagCode.length < 40){
    		tagCode = "0" + tagCode;
    	}
	}else{
		alert("标签不合规");
		return;
	}
	while(orgCode.length < 10){
		orgCode += "0";
	}
	while(typeCode.length < 10){
		typeCode += "0";
	}
	return tagCode + orgCode + typeCode;
}
/**
 * 16进制转为标签号
 * @param codeNum
 * @returns {String}
 */
function hexToTagId(codeNum){
	var val="";
	var preCode=codeNum.substr(0, 12);
	var proCode=codeNum.substr(12, 28);
	 if(preCode!=null&&preCode!=""){
		 for(var i = 0; i < preCode.length/2; i++){
			 var subStr=preCode.substr(2*i,2);
			 if(subStr!="00"){
				 val += String.fromCharCode(parseInt(subStr,16));
			 }
		 }
	 }
	 return val+proCode;
}
/**
 * 缩略语公共方法
 * @param data			bootstrapTable 中的的数据data
 * @param tableId		表的id值
 * @param abbrName		要使用缩略语的字段,要多个时可以用逗号隔开,例如'sup_name,remarks'
 * @param num			超过字数长度的值
 */
function abbrModalEvent(obj){
	//取消事件冒泡
	//如果提供了事件对象，则这是一个非IE浏览器 
	if ( event && event.stopPropagation ){
		event.stopPropagation(); 
	}else{
	    //否则，我们需要使用IE的方式来取消事件冒泡 
	    window.event.cancelBubble = true; 
	}
	var modObj = $("[mod='abbrMod']");
	modObj.modal("show");
	modObj.find('[mhtl="mhed"]').html($(obj).attr("hed"));
	var areaLis = $(obj).attr("title").split(",");
	var areaUl = '<ul class="abbr_ul">';
	for(var i = 0; i < areaLis.length; i++){
		areaUl += '<li class="abbr_li">' + areaLis[i] + "</li>";
	}
	areaUl += "</ul>";
	modObj.find('[mhtl="tarea"]').html(areaUl);
}
/**
 * 合并bootstrapTable单元格方法,方法要求:表格应按照orderByNum排序
 * @param tableId		所要合并表格的id
 * @param orderByNum	表格columns的field属性值,表格的合并规则----科目编号一样
 * @param combineName	表格columns的field属性值,表格合并的元素----科目名
 */
function autoCombineCells(tableId,orderByNum,combineName){
	//合并单元格需要的两个计步器
	var combineTimes=0;
	var combineStep=0;
	//数据对应的下标
	var indexx=0;
	var combineAllData = $(tableId).bootstrapTable('getData');
	$.each(combineAllData, function(i, item2){
		if(combineTimes==0&&combineStep==0){
			$.each(combineAllData, function(i, item){
				if(item[orderByNum]==item2[orderByNum]){//item.subject_name==item2.subject_name
					combineTimes+=1;
				}
			});
			$(tableId).bootstrapTable('mergeCells', {index: indexx, field: combineName, rowspan:combineTimes});
		}
			combineStep+=1;
			indexx+=1;
		if(combineStep==combineTimes&&combineTimes>0){
			combineTimes=0;
			combineStep=0;
		}
	});
}
//高级查询
function showMore(showMoreButtonId,showMoreDiv){
	if($(showMoreDiv).is(":hidden")){
		$(showMoreButtonId).find("i").attr("class","icon-zoom-out");
	}else{
		$(showMoreButtonId).find("i").attr("class","icon-zoom-in");
	}
	$(showMoreDiv).toggle("normal hide");
}
//更多按钮
function moreIlsh(moreIlshButtonId,allButtonIlshDiv){
	$(allButtonIlshDiv).find("ul li:not(.submenuList1)").toggle();
	$(moreIlshButtonId).toggle();
	$(moreIlshButtonId).toggleClass("moreIlshBg");
}
/**
 * 生成类型编号
 * params seq 序列名称
 */
function returnTypeId(seq){
	var code = "";
    baseAjax("Util/getSerialNumberSeq.asp",{seq:seq},function(data){
    	if(data&&data.result=="true"){
    		code=data.seqCode;
    	}else{
    		alert("序列获取失败！");
    	}
    },false);
    var endstr=code.charAt(code.length-1);
    if(endstr=="0"){
	   baseAjax("Util/getSerialNumberSeq.asp",{seq:seq},function(data){
	    	if(data&&data.result=="true"){
	    		code=data.seqCode;
	    	}else{
	    		alert("序列获取失败！");
	    	}
	    },false);
    }
    return code;
}
/**
 * 生成流水号
 * params pre 前缀
 * params seq 序列名称
 */
function returnSerialNumber(pre,seq){
	var todayDate=new Date();
    var year=todayDate.getFullYear();
    var month=todayDate.getMonth()+1+'';
    if(month.length==1){
    	month="0"+month;
    }
    var date=todayDate.getDate()+'';
    if(date.length==1){
    	date="0"+date;
    }
    var code="000000000";
    baseAjax("Util/getSerialNumberSeq.asp",{seq:seq},function(data){
    	if(data&&data.result=="true"){
    		code+=data.seqCode;
    	}else{
    		alert("流水号获取失败！");
    	}
    },false);
    code=code.substring(code.length-9,code.length);
    var codeNum=pre+year+month+date+code;
    return codeNum;
}
/**
 * 生成流水号
 * params pre 前缀
 * params seq 序列名称
 */
function returnSerialNumber2(pre,org,seq){
	//机构名称为长度小于10且不以0结束的数字
	if(!isNaN(org) && org.length <= 10 && !org.substring(org.length - 1) == "0"){
		while(org.length < 10){
			org += "0";
		}
	}else{
		alert("您的机构编号不合规，请联系相关人员进行修改");
		return;
	}
	var todayDate=new Date();
    var year=todayDate.getFullYear();
    var month=todayDate.getMonth()+1+'';
    if(month.length==1){
    	month="0"+month;
    }
    var date=todayDate.getDate()+'';
    if(date.length==1){
    	date="0"+date;
    }
    var code="0000000000";
    baseAjax("Util/getSerialNumberSeq.asp",{seq:seq},function(data){
    	if(data&&data.result=="true"){
    		code+=data.seqCode;
    	}else{
    		alert("流水号获取失败！");
    	}
    },false);
    code=code.substring(code.length-10,code.length);
    var codeNum=pre + year + month + date + org + code;
    return codeNum;
}
/**
 * 获取当前日期
 */
function returnTodayData(){
	var today=new Date();
    var year=today.getFullYear();
    var month=today.getMonth()+1+'';
    if(month.length==1){
    	month="0"+month;
    }
    var date=today.getDate()+'';
    if(date.length==1){
    	date="0"+date;
    }
    var tDate=year+'-'+month+'-'+date;
    return tDate;
}
 
// --子项复选框被单击---
function ChkSonClick(sonName, cbAllId) {
 var arrSon = document.getElementsByName(sonName);
 var cbAll = document.getElementById(cbAllId);
 for(var i=0; i<arrSon.length; i++) {
     if(!arrSon[i].checked) {
     cbAll.checked = false;
     return;
     }
 }
 cbAll.checked = true;
}


/**
 * 全局的下拉缓存
 */
var globalSelectCache={};
globalSelectCache["count"]=0;
/**
 * 获取url后面的参数
 * @param name
 * @returns
 */
function getParamString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
}
	function baseAjax(url, param, callback, async) {
		$.ajax({
			type : "post",
			url : url,
			async : async == undefined ? true : false,
			data : param,
			dataType : "json",
			success : function(msg) {
				callback(msg);
			},
			error : function() {
				callback();
			}
		});
	}
/**
 * 根据URl设置下拉框数据
 * @param obj $("#id")
 * @param show {"value":"enname","text":"cnname"}
 * @param url 
 * @param arr 数组为需要过滤掉的数据，用于过滤部分字典项 如：["01","02"]
 */
function initSelect(obj,show,param,default_v, url,arr){
		globalSelectCache["count"]=globalSelectCache["count"]+1;
		if(globalSelectCache[param.dic_code]!=undefined&&globalSelectCache[param.dic_code]["data"]!=undefined){
			initSelectByData(obj,show,globalSelectCache[param.dic_code]["data"],default_v,arr);
			if(new Date().getTime()-globalSelectCache[param.dic_code]["startDate"]>50000){
				globalSelectCache[param.dic_code]={};
			}
			return;
		}
		if(globalSelectCache["count"]>7){
			globalSelectCache={};
			globalSelectCache["count"]=1;
		}
		if(url == undefined || url == "") {
			url = "SDic/findItemByDic.asp";
		}
		baseAjax(url,param,function(data){
			if(data!=undefined){
				globalSelectCache[param.dic_code]={};
				globalSelectCache[param.dic_code]["data"]=data;
				globalSelectCache[param.dic_code]["startDate"]=new Date().getTime();
				initSelectByData(obj,show,data,default_v,arr);
			}
		},false);
}
/**
 * 追加下拉数据
 * @param obj
 * @param show
 * @param param
 * @param default_v
 */
function appendSelect(obj,show,param,default_v){
	baseAjax("SDic/findItemByDic.asp",param,function(data){
		if(data!=undefined){
			selectAppendByData(obj,show,data,default_v);
		}
	});
}
	
	/**
	 * 根据data设置下拉  
	 * @param obj
	 * @param show
	 * @param data
	 */
	function initSelectByData(obj,show,data,default_v,arr){
		if(obj!=undefined&&show!=undefined&&data!=undefined){
			obj.empty();
			if(arr==undefined){
				obj.append('<option id="removeOption" value=" " >请选择</option>');	
			}else if(arr.indexOf(" ")==-1){
				obj.append('<option id="removeOption" value=" " >请选择</option>');
			}
			for(var i=0;i<data.length;i++){
				if(arr!=undefined&&arr.indexOf(data[i][show.value])!=-1){
					continue;
				}
				if(default_v==undefined||default_v==""){
					default_v=data[i]["IS_DEFAULT"]=="00"?data[i][show.value]:"";
				}
				obj.append('<option value="'+data[i][show.value]+'">'+data[i][show.text]+'</option>');	
			}
			if(default_v!=undefined&&default_v!=""){
				obj.val(default_v);
			}else{
				obj.val(" ");
			}
			obj.select2();
			//$("#removeOption").remove();//神奇的将select 设置为空
			//alert(obj.val());
		}
	}
	/**
	 * 根据data设置下拉    
	 * @param obj         下拉框元素
	 * @param show      显示的字段
	 * @param data       字典类的值
	 */
	function selectAppendByData(obj,show,data,default_v){
		if(obj!=undefined&&show!=undefined&&data!=undefined){
			obj.empty();
			for(var i=0;i<data.length;i++){
				obj.append('<option value="'+data[i][show.value]+'">'+data[i][show.text]+'</option>');	
			}
			if(default_v!=undefined&&default_v!=""){
				obj.val(default_v);
			}
			obj.select2();
		}
	}
	/**
	 * 设置选中值
	 */
	function setSelected(obj,value){
		obj.val(value);
		obj.select2();
	}
	/**
	 * 根据diccode标签初始化下拉框
	 * @param parentObj jquery obj
	 */
	function autoInitSelect(parentObj){
		var code=parentObj.attr("diccode");
		if(code!=""&&code!=undefined){
			var defaultV=parentObj.attr("val");
			initSelect(parentObj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:code},(defaultV==""?undefined:defaultV));
			return;
		}
		var objs=parentObj.find("[diccode]");
		for(var i=0;i<objs.length;i++){
			var obj=$(objs[i]);
			var diccode=obj.attr("diccode");
			var defaultV=obj.attr("val");
			initSelect(obj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:diccode},(defaultV==""?undefined:defaultV));
		}
		
	}
	
	/**
	 * 
	 * @param obj=$("#input")
	 * @param treeId=树形下拉的ID
	 * @param url
	 * @param callback
	 */
	function openSelectTreeDiv(obj,treeId,url,css,callback){
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
						simpleData : {
							enable : true,
							idKey : "id",
							pIdKey : "pid",
							rootPId : ""
						}
					},
					callback : {
						onAsyncSuccess: function(){
							var treeObj = $.fn.zTree.getZTreeObj(treeId);
							treeObj.expandNode(treeObj.getNodeByTId(treeId+"_1"), true, false, true);
						},
						onClick : function(event, treeId, treeNode) {
							treeNode.allname=getAllSelectTreeDivName(treeNode,treeNode.name);
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
	
	/**
	 * 
	 * @param obj=$("#input")
	 * @param treeId=树形下拉的ID
	 * @param url
	 * @param callback
	 */
	function openSelectTreeDivAllName(obj,treeId,url,css,callback,updateId){
		if(!$("#"+treeId)[0]){
			var marginleft=""; if(css["margin-left"]){marginleft="margin-left:"+css["margin-left"]+";";};
			var width=""; if(css.width){width="width:"+css.width+";";};
			var height="height:300px;"; if(css.height){height="height:"+css.height+";";};
			obj.after('<div id="'+treeId+'" class="ztree" style="'+marginleft+' overflow-y: scroll;z-index: 1000;display:none;background-color: white;border:1px solid #CDCDCD;'+height+'position:absolute;'+width+'">&nbsp;aaa&nbsp;</div>');
			openSelectTreeDiv[treeId]="11";
		}else{
			if(css.width){
				$("#"+treeId).css("width",css.width);
			}
			$("#"+treeId).show();
		}
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
						simpleData : {
							enable : true,
							idKey : "id",
							pIdKey : "pid",
							rootPId : ""
						}
					},
					callback : {
						onAsyncSuccess: function(){
							var treeObj = $.fn.zTree.getZTreeObj(treeId);
							treeObj.expandNode(treeObj.getNodeByTId(treeId+"_1"), true, false, true);
							if(updateId){
								var nodes = treeObj.getNodesByParam("id", updateId, null);
								obj.val(getAllSelectTreeDivName(nodes[0],nodes[0].name));
							}
						},
						onClick : function(event, treeId, treeNode) {
							treeNode.allname=getAllSelectTreeDivName(treeNode,treeNode.name);
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
	function getAllSelectTreeDivName(node,name){
		var pNode=node.getParentNode();
		if(pNode&&pNode.level!=0){
			name=pNode.name+'->'+name;
			return getAllSelectTreeDivName(pNode,name)
		}else{
			return name;
		}
	}
	function showSelectTreeDiv(treeObj){
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
	}
	
	/**
	 * 初始化验证
	 * @param obj
	 * <input type="text" validate="v.required" valititle="该项为必填123" name="M.menu_no" class="span11" placeholder="菜单编号 "> 
	 * initVlidate($("#menu_form")); vlidate($("#menu_form"));
	 */
	function initVlidate(obj){
		obj.find("[validate^='v.']").each(function(){
			$(this).siblings("strong[class^='high']").remove();
		});
		obj.find("[validate^='v.']").each(function(){
			 $(this).parent().append($("<strong class='high'>*</strong>")); //然后将它追加到文档中
		});
		hideVlidate();
	}
	var ttop=0;
	/**
	 * 计算并返回tip提示的css样式
	 * @param t
	 * @returns {String}
	 */
	function getTipCSS(t){
		if(t.length==0){
			return "";
		}
		var left=t.offset().left;
		var top=t.offset().top;
		left+=t.outerWidth()-10;
		return "left:"+left+"px;top:"+(top+24)+"px;";
	}
	function getTipCSSAbsolute(t){
		if(t.length==0){
			return "";
		}
		var left=t.offset().left;
		var top=t.offset().top+getCurrentPageObj().scrollTop();
		left+=t.outerWidth()-$("div.main_container").outerWidth()-10;
		return "left:"+left+"px;top:"+(top-9-ttop-65)+"px;";
	}
	$(document).on("click","a[data-toggle='tab']",function(){
		$(".tag-position").remove();
	});
	/**
	 * 清空验证 提示信息
	 */
	function clearVlidateTag(){
		$(".tag-position[id]").remove();
		$(".tag-position-absolute[id]").remove();
	}
	$(document).on("click",".nav-tabs,.modal-backdrop,[data-dismiss='modal']",function(){
		clearVlidateTag();
	});
	/**
	 * 获取当前页面jquery对象
	 * @returns
	 */
	function getCurrentPageObj(){
		var obj=$("div[page^='menu']:visible");
		if(obj.length==0){
			return $(content);
		}
		return obj;
	}
	function $page(){
		return $("div[page]:visible");
	}
	/**
	 * 给一个对象增加提示
	 * @param obj
	 * @param title
	 * @param zindex
	 * @param isAbsolute
	 */
	function oneObjTip(tobj,title,style){
		var sstyle="";
		if(style){
			sstyle=style;
		}
		tobj.parent().append('<div class="tag-position" style="'+sstyle+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'
				+title+'</div></div>'); //然后将它追加到文档中
	}
	function removeOneTip(tobj){
		tobj.siblings(".tag-position").remove();
	}
	/**
	 * 隐藏表单验证信息
	 */
	function hideVlidate(){
		$("input").focus(function(){
			$("#"+$(this).attr("validateId")).remove();
			//$(this).siblings("div[class^='tag-position']").remove();
		});
		$("select").change(function(){
			$("#"+$(this).attr("validateId")).remove();
			//$(this).siblings("div[class^='tag-position']").remove();
		});
		$("textarea").focus(function(){
			$("#"+$(this).attr("validateId")).remove();
			//$(this).siblings("div[class^='tag-position']").remove();
		});
	}
	//radio初始化（旧），说明：两个radio位于不同的行
function autoInitRadio(dic_code,RadioTdId,RadioName,params){
		baseAjax("SDic/findItemByDic.asp",dic_code,function(data){
			if(data!=undefined){
				for(var i=0;i<data.length;i++){
					if(params.type=="add"){
						if(data[i].IS_DEFAULT=='00'){
							RadioTdId.append("<label class="+params.labClass+"><input type='radio' name="+RadioName+" value="+data[i].ITEM_CODE+" checked>&nbsp;"+data[i].ITEM_NAME+"</label>");
						}else{
							RadioTdId.append("<label class="+params.labClass+"><input type='radio' name="+RadioName+" value="+data[i].ITEM_CODE+">&nbsp;"+data[i].ITEM_NAME+"</label>");
						}					
					}else{
						if(data[i].ITEM_CODE==params.value){
							RadioTdId.append("<label class="+params.labClass+"><input type='radio' name="+RadioName+" value="+data[i].ITEM_CODE+" checked>&nbsp;"+data[i].ITEM_NAME+"</label>");
						}else{
							RadioTdId.append("<label class="+params.labClass+"><input type='radio' name="+RadioName+" value="+data[i].ITEM_CODE+">&nbsp;"+data[i].ITEM_NAME+"</label>");
						}										
					}
				}
			}
		});				
	}

//radio初始化（新），说明：两个radio位于同一行
function autoInitRadio2(dic_code,RadioTdId,RadioName,params){
	baseAjax("SDic/findItemByDic.asp",dic_code,function(data){
		if(data!=undefined){
			for(var i=0;i<data.length;i++){
				if(params.type=="add"){
					if(data[i].IS_DEFAULT=='01'){
						RadioTdId.append("<label style='float:left;margin:0px 5px;' class="+params.labClass+"><input type='radio' name="+RadioName+" value="+data[i].ITEM_CODE+" checked>&nbsp;"+data[i].ITEM_NAME+"</label>");
					}else{
						RadioTdId.append("<label style='float:left;margin:0px 5px;' class="+params.labClass+"><input type='radio' name="+RadioName+" value="+data[i].ITEM_CODE+" >&nbsp;"+data[i].ITEM_NAME+"</label>");
					}					
				}else{
					if(data[i].ITEM_CODE==params.value){
						RadioTdId.append("<label style='float:left;margin:0px 5px;' class="+params.labClass+"><input type='radio' name="+RadioName+" value="+data[i].ITEM_CODE+" checked>&nbsp;"+data[i].ITEM_NAME+"</label>");
					}else{
						RadioTdId.append("<label style='float:left;margin:0px 5px;' class="+params.labClass+"><input type='radio' name="+RadioName+" value="+data[i].ITEM_CODE+" >&nbsp;"+data[i].ITEM_NAME+"</label>");
					}										
				}
			}
		}
	});				
}
/**
 * valititle=提示信息
 * validate=验证标记
 * 验证
 * @param obj
 */
function vlidate(obj,zindex,isAbsolute){
	clearVlidateTag();
	var zzindex="";
	if(zzindex!=undefined){
		zzindex="z-index:"+zindex+";";
	}
	var result=true;
	var parent=$("div[page^='menu']:visible");
	ttop=0;
	if(parent.length==0){
		ttop=40;
		parent=$("[menu_page]:visible");
	}
	parent.find(".tag-position[id]").remove();
	obj.find("[validate^='v.']").each(function(){
		var tobj=$(this);
		if(tobj.parent("td:hidden").length>0 || tobj.parent("span:hidden").length>0){
			return;
		}
		$(this).parent().find("br").remove();
		var form=$(this);
		var tipCSS;
		var absoluteClass="";
		if(!isAbsolute){
			tipCSS=getTipCSS(form.siblings(".high"))+zzindex;
		}else{
			tipCSS=getTipCSSAbsolute(form.siblings(".high"))+zzindex;
			absoluteClass="-absolute";
		}
		var uuid=form.attr("validateId");
		if(uuid==undefined||uuid==""){
			uuid=Math.uuid();
		}
		form.attr("validateId",uuid);
		//$("#"+uuid).remove();
		var formVal=$.trim(form.val());
		if(form.attr("validate")=="v.required"&&(formVal==""||formVal==form.attr("placeholder"))){
			parent.append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+$(this).attr("valititle")+'</div></div>'); //然后将它追加到文档中
			result=false;
		}//验证密码
		else if(form.attr("validate")=="v.password"&&(formVal==""||(formVal!=""&&!/^[a-zA-Z]\w{5,30}$/.test(formVal)))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'密码以字母开头,只能有数字、英文、下划线且长度不得小于6位'+'</span>');
			result=false;
		}//验证邮箱
		else if(form.attr("validate")=="v.email"&&(formVal==""||(formVal!=""&&!/.+@.+\.[a-zA-Z]{2,4}$/.test(formVal)))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入有效的电子邮件账号(例：abc@126.com)'+'</span>');
				result=false;
		}//验证手机号码
		/*else if(form.attr("validate")=="v.mobile"&&(formVal==""||(formVal!=""&&!/^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/.test(formVal)))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请填入手机或电话号码,如13688888888或020-8888888'+'</span>');
			result=false;
		}*/
		//验证手机号或固定电话
		else if(form.attr("validate")=="v.mobile"&&(formVal==""||(formVal!=""&&!/(^(\d{3,4}-)?\d{7,8})$|(1[3578][0-9]{9})/.test(formVal)))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请填入手机或电话号码,如13688888888'+'</span>');
			result=false;	
		}//验证身份证
		else if(form.attr("validate")=="v.idcard"&&(formVal==""||(formVal!=""&&!/^\d{15}(\d{2}[A-Za-z0-9])?$/.test(formVal)))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'身份证号码格式不正确'+'</span>');
			result=false;
		}//验证年份(19/20开头的四位数字)
		else if(form.attr("validate")=="v.year"&&(formVal!=""&&!/^(19|20)\d{2}$/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入正确的年份，如：2016'+'</span>');
			result=false;
		}//验证货币
		else if(form.attr("validate")=="v.currency"&&(formVal!=""&&!/^d{0,}(\.\d+)?$/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'货币格式不正确'+'</span>');
			result=false;
		}//验证金钱，double类型的数字格式
		else if(form.attr("validate")=="v.double"&&(formVal!=""&&!/^([1-9]\d*|0)(\.\d+)?$/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'金钱格式不正确'+'</span>');
			result=false;
		}//验证qq
		else if(form.attr("validate")=="v.qq"&&(formVal!=""&&!/^[1-9]\d{4,9}$/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'QQ号码格式不正确(正确如：453384319)'+'</span>');
			result=false;
		}//验证中文
		else if(form.attr("validate")=="v.chinese"&&(formVal!=""&&!/^[\u0391-\uFFE5]+$/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入中文'+'</span>');
			result=false;
		}//验证英文
		else if(form.attr("validate")=="v.english"&&(formVal!=""&&!/^[A-Za-z]+$/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入英文'+'</span>');
			result=false;
		}//验证用户名
		else if(form.attr("validate")=="v.username"&&(formVal!=""&&!/^[a-zA-Z][a-zA-Z0-9_]{5,15}$/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'+'</span>');
			result=false;
		}//验证传真
		else if(form.attr("validate")=="v.faxno"&&(formVal!=""&&!/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'传真号码不正确'+'</span>');
			result=false;
		}//验证邮政编码
		else if(form.attr("validate")=="v.zip"&&(formVal!=""&&!/^[0-9]\d{5}$/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'邮政编码格式不正确'+'</span>');
			result=false;
		}//验证验证IP地址
		else if(form.attr("validate")=="v.ip"&&(formVal!=""&&!/d+.d+.d+.d+/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'IP地址格式不正确'+'</span>');
			result=false;
		}//验证姓名,可以是中文或英文
		else if(form.attr("validate")=="v.name"&&(formVal!=""&&!/d+.d+.d+.d+/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入姓名'+'</span>');
			result=false;
		}//验证车牌号码
		else if(form.attr("validate")=="v.carNo"&&(formVal!=""&&!/d+.d+.d+.d+/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'车牌号码无效（例：粤J12350）'+'</span>');
			result=false;
		}//验证发动机型号
		else if(form.attr("validate")=="v.carenergin"&&(formVal!=""&&!/d+.d+.d+.d+/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'发动机型号无效(例：FG6H012345654584)'+'</span>');
			result=false;
		}//验证msn
		else if(form.attr("validate")=="v.msn"&&(formVal!=""&&!/d+.d+.d+.d+/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入有效的msn账号(例：abc@hotnail(msn/live).com)'+'</span>');
			result=false;
		}//验证1~100的数字
		else if(form.attr("validate")=="v.number100"&&(formVal==""||(formVal!=""&&!/^([1-9]\d?|100)$/.test(formVal)))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请填写1~100的数字'+'</span>');
			result=false;
		}//验证为必填项且字符数小于500;
		else if(form.attr("validate")=="v.charCountLimit"&&formVal==""||(form.val().length>500)){
			parent.append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'描述信息为必填项且字数不可大于500!<br>当前字数：'+form.val().length+'</div></div>'); //然后将它追加到文档中
			result=false;
		}//验证1~50的数字
		else if(form.attr("validate")=="v.number50"&&(formVal==""||(formVal!=""&&!/^([0-4]?\d{1}|50)$/g.test(formVal)))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请填写1~50的数字'+'</span>');
			result=false;
		}//验证一个正整树
		else if(form.attr("validate")=="v.number"&&(formVal==""||(formVal!=""&&!/^\d+$/.test(formVal)))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请填写一个正整数数字'+'</span>');
			result=false;
		}//验证编数字是否少于10位 最后不为0
		else if(form.attr("validate")=="v.number10"&&(formVal==""||!/^\d{0,9}[1-9]$/.test(formVal))){
			$(this).parent().append('<div class="tag-position'+absoluteClass+'" id="'+uuid+'" style="'+tipCSS+'"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请填写长度为1-10且不以0结尾的数字'+'</span>');
			result=false;
		}
	});	
	return result;
}

//开始等待
function startLoading() {
	$("<div class=\"datagrid-mask\" style='z-index:100000'></div>").css({
		display : "block", 
		width : "100%",
		height : $(document.body).height()
	}).appendTo("body");
	$("<div class=\"datagrid-mask-msg\" style='z-index:100002;margin-left:-80px;'></div>").html("正在处理，请稍等...").appendTo("body").css({
		display : "block",
		left : "50%",
		top : ($(document.body).height() - 45) / 2
	});
}
// 结束等待
function endLoading() {
	$("div.datagrid-mask-msg").remove();
	$("div.datagrid-mask").remove();
}

/**
 * 模态框关闭事件
 */
function onModalCloseEvent(id,callback){
	$("#"+id).on("hidden.bs.modal",function(){
		$(".tag-position").remove();
		if(callback){
			callback();
		}
	});
}


/** 
 * 将数值四舍五入(保留2位小数)后格式化成金额形式 
 * 
 * @param num 数值(Number或者String) 
 * @return 金额格式的字符串,如'1,234,567.45' 
 * @type String 
 */  
function formatCurrency(num) {
    num = num.toString().replace(/\$|\,/g,'');  
    if(isNaN(num))  
        num = "0";  
    sign = (num == (num = Math.abs(num)));  
    num = Math.floor(num*100+0.50000000001);  
    cents = num%100;  
    num = Math.floor(num/100).toString();  
    if(cents<10)  
    cents = "0" + cents;  
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)  
    num = num.substring(0,num.length-(4*i+3))+','+  
    num.substring(num.length-(4*i+3));  
    return (((sign)?'':'-') + num + '.' + cents);  
}  

function changeValue(curr){
	var result=formatCurrency(curr.val());
	$('#'+curr[0].id).val(result);
}

/**
 * 把金额类型的值转化为正常不带,的值.传到后台
 * */
function changeBack(value){
	value = value.toString().replace(/\$|\,/g,'');  
    if(isNaN(value))  
    	value = "0";
	var arr=$.trim(value).split(",");
	var realVal="";
	for(var i=0;i<arr.length;i++){
		realVal += arr[i];
	}
	return realVal;
}
/**
 * 设置评价树的tid
 * @param node
 */
function setConfigNodeTId(node,initTree) {
	var nid = node.id;
	initTree["data"][nid]=node;
	if (node==undefined||node.children == undefined) {
		return;
	}
	for (var i = 0; i < node.children.length; i++) {
		setConfigNodeTId(node.children[i],initTree);
	}
}
/**
 * 
 * */
function changePath(parents){
	var realParents={};
	var pathId=parents.pathId;
	var pathName=parents.pathName;
	var realPathId="";
	var realPathName="";
	var ids=pathId.split("->");
	var names =pathName.split("->");
	for(var k =ids.length-1;k>=0;k--){
		realPathId=realPathId+ids[k]+"->";
	}
	for(var k =names.length-1;k>=0;k--){
		realPathName=realPathName+names[k]+"->";
	}
	realPathId=realPathId.substr(0,realPathId.length-2);
	realParents.realPathId=realPathId;
	realPathName=realPathName.substr(0,realPathName.length-2);
	realParents.realPathName=realPathName;
	return realParents;
}
/**
 * 获取树的子节点
 * @param node
 * @returns {String}
 */
function getAllChilderNodeId(node) {
	var nid = node.id;
	if (node.children == undefined || node.children.length == undefined
			|| node.id == undefined) {
		return nid;
	}
	for (var i = 0; i < node.children.length; i++) {
		nid = nid + "," + getAllChilderNodeId(node.children[i]);
	}
	return nid;
}
/**
 * 获取树的父节点
 * @param node
 * @returns {String}
 */

function getAllParentNodeId(node) {
	var nid = node.id;
	var name = node.name;
	if(node.pid!=undefined && node.pid!=""){
		var parentNode =node.getParentNode();
		pathId =pathId+node.id +"->";
		pathName = pathName+node.name +"->";
		getAllParentNodeId(parentNode);
		path.pathId=pathId;
		path.pathName=pathName;
	}else{
		pathId=pathId+nid;
		pathName=pathName+name;
		path.pathId=pathId;
		path.pathName=pathName;
	}
	return path;
}

/**
 * 提示输入数字
 */
function inputNumberTip(value) {
	if(isNaN(value)) {
		alert("请输入一个数字");
		return "";
	}
	return value;
}

/**
 * 用于把数字转化为百分号的函数
 * */
function formateRate(obj){
	if(obj==undefined){
		return;
	}
	if(obj.val()==""){
		return "";
	}
	if(isNaN(obj.val())){
		alert("请输入数字！");
		obj.val("");
		return;
	}
	var val=obj.val();
	var nf=new NumberFormat();
	nf.applyPattern("000.000%");
	var res=nf.format(val);
	obj.val(res);
}

/**
 * 用于把百分号转换为实际数字的函数
 * */
function returnNumber(obj){
	if(obj==undefined||obj.val()==""){
		return;
	}
	if(obj.val().indexOf("%")){
		var newstr=obj.val().replace(/%/, "");
		if(isNaN(newstr)){
			return;
		}
		var s=accDiv(newstr,100);
		obj.val(s);
	}
}

/**
 * 用于把数字转化为百分号的函数,参数为一个值
 * @param value 一个值，Number或String
 * @returns  带"%"的字符串
 */
function formateRate2(value){
	if(value==undefined){
		return;
	}
	if(value==""){
		return "";
	}
	var nf=new NumberFormat();
	nf.applyPattern("000.000%");
	var res=nf.format(value);
	return res;
}

//返回值：arg1加上arg2的精确结果
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
}
//减法函数，用来得到精确的减法结果
function Subtr(arg1, arg2) {
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    //last modify by deeka
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
//返回值：arg1乘以arg2的精确结果
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
//返回值：arg1除以arg2的精确结果
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
    try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return (r1 / r2) * pow(10, t2 - t1);
    }
}