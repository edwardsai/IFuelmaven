function initEditRecipients_users(params,p){
	for ( var k in params) { 
		  $("span[name='ZHO." + k + "']").html(params[k]);
	}
}
//初始化具体领用信息列表
function initRecipientsDetailsList(rowData,p){
	$('#tb_editPropertyRecipients_user').bootstrapTable('destroy').bootstrapTable({
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : false, //是否启用排序
		sortOrder : "asc", //排序方式
		//queryParams :queryParams,//传递参数（*）
		/*sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 5,//可供选择的每页的行数（*）
*/		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ASSET_NUM", //每一行的唯一标识，一般为主键列
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
		},{
			field : "APPLY_ID",
			title : '流水号',
			align : "center",
			visible:false
		},{
			field : "ASSET_NUM",
			title : '资产编码',
			align : "center"
		}, {
			field : "ASSET_NAME",
			title : '资产名称',
			align : "center"
		}, {
			field : "ASSET_TYPE_ID",
			title : "资产类型",
			align : "center"
		} , {
			field : "ASSET_TYPE",
			title : "资产类型",
			align : "center"
		} , {
			field : "GET_DATE",
			title : "时间",
			align : "center",
			visible:false
		}, {
			field : "opt",
			title : "操作",
			align : "center",
			formatter : function(value, row, index){
				var optStr = '<button overchange="false" flag="1" onclick="recipientsWriteEPC(this)" class="btns ilsh_left" rnum="' + index + '">写入条形码</button>';
				return optStr;
			}
			
		}]
	});	
}
//资产信息模态框
function initpropertyRecipientPop(asset_type){
	$("#PRRasset_num").val("");
	$("#PRRasset_name").val("");
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#Table_propertyRecipient").bootstrapTable('destroy').bootstrapTable({
      url: 'propertyRecipients/queryAllAssetInfo.asp?asset_type='+asset_type,     //请求后台的URL（*）
      method: 'get',           //请求方式（*）   
      striped: true,           //是否显示行间隔色
      cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）		       
      sortable: true,           //是否启用排序
      sortOrder: "asc",          //排序方式
      queryParams: queryParams,//传递参数（*）
      sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
      pagination: true,          //是否显示分页（*）
      pageList: [5],    //可供选择的每页的行数（*）
      pageNumber:1,            //初始化加载第一页，默认第一页
      pageSize: 5,            //每页的记录行数（*）		       
      clickToSelect: true,        //是否启用点击选中行
      uniqueId: "SERIALS_NUMBER",           //每一行的唯一标识，一般为主键列
      cardView: false,          //是否显示详细视图
      detailView: false,          //是否显示父子表	
      singleSelect: false,//复选框单选
      columns: [
		{	
			checkbox:true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
	        field: 'ASSET_NUM',
	        title: '资产编号',
	        align:"center"
	      }, {
	        field: 'ASSET_NAME',
	        title: '资产名称',
	        align:"center"
	      }, {
	      	field:"ASSET_TYPE",
	      	title:"资产类别",
	        align:"center"
	      },{
	      	field:"CREATE_DATE",
	      	title:"登记时间",
	        align:"center"
	      }, {
	      	field:"CREATE_USER",
	      	title:"登记人",
	        align:"center"
	      }, {
	    	field:"STATUS_NAME",
	      	title:"设备状态",
	        align:"center"
	      }]
    });
}
//模态框按钮
function initModalBtn(){
	//选择按钮
	$("#get_AssetInfo").click(function(e){
		//点击选择按钮，获取复选框中被选中的记录id
		if($("#Table_propertyRecipient").find("input[type='checkbox']").is(':checked')){
			var rol = $("#Table_propertyRecipient").bootstrapTable('getSelections');
			var select = $("#tb_editPropertyRecipients_user").bootstrapTable('getData');
			for(var i=0;i<rol.length;i++){
				for(var j=0;j<select.length;j++){
					if(rol[i].ASSET_NUM==select[j].ASSET_NUM){
						var id=select[j].ASSET_NUM;
						$('#tb_editPropertyRecipients_user').bootstrapTable("removeByUniqueId", id);
					}
				}
				$('#tb_editPropertyRecipients_user').bootstrapTable("append",rol[i]);
			}
			$("#propertyRecipientPop").modal("hide");
			initHoverWriteEPCChange();
		}else{
			e.preventDefault();
	        $.Zebra_Dialog('请选择一条或多条要添加的记录!', {
	            'type':     'close',
	            'title':    '提示',
	            'buttons':  ['是'],
	            'onClose':  function(caption) {
	            	if(caption=="是"){
	            	}
	            }
	        });
		}
	});
	//查询按钮
	$("#pop_Search_Recipient").click(function() {
		var asset_num=$("#PRRasset_num").val();
		var asset_name=$("#PRRasset_name").val();
		$('#Table_propertyRecipient').bootstrapTable('refresh',
			{url:'propertyRecipients/queryAllAssetInfo.asp?asset_num='+escape(encodeURIComponent(asset_num))+
			"&asset_name="+escape(encodeURIComponent(asset_name))+"&asset_type="+asset_type_val});
    });
	//重置按钮
	$("#pop_Reset_Recipient").click(function(){
		$("#PRRasset_num").val("");
		$("#PRRasset_name").val("");
	});
}
var asset_type_val;
//初始化按钮
function initTableTab(params,p){
	//新增按钮
	$('#EditpropertyRecipients_newadd').click(function(){
		//显示模态框
		$("#propertyRecipientPop").modal("show");
		initpropertyRecipientPop(params.category_id);
		asset_type_val=params.category_id;
	});
	//删除按钮
	$("#EditpropertyRecipients_delete").click(function(){
		var rol = $("#tb_editPropertyRecipients_user").bootstrapTable('getSelections');
		var id=rol[0].ASSET_NUM;
		$('#tb_editPropertyRecipients_user').bootstrapTable("removeByUniqueId", id);
	});
	//保存
	$('#save_editRecipientsUser').click(function(){
		var records = $("#tb_editPropertyRecipients_user").bootstrapTable('getData');
		var num=params.apply_num;
		if(records.length!=num){
			alert("资产数量不等于申请数量，请重新选择");
			return;
		}
		
		/*var execute_flag = false;//执行开关
		//验证是否都写入条形码
		$('button[overchange]').each(function(){
			if($(this).attr("overchange") == "false"){//未写入条形码
				var seles = $("#tb_editPropertyRecipients_user").bootstrapTable("getData");
				var index = parseInt($(this).attr("rnum"));
				var asset_num = seles[index].ASSET_NUM;
				execute_flag = true;
				alert("资产编码为：" + asset_num + " 的资产尚未写入条形码");
				return;
			}
		});
		if(execute_flag){
			return;
		}*/
		$.each(records, function(i){
			records[i].APPLY_ID = params.apply_id;
			records[i].GET_DATE = p.get_date;
			records[i].ASSET_TYPE = params.category_id;
		});	
		var new_records = $("#tb_editPropertyRecipients_user").bootstrapTable('getData');
		var m={new_records:JSON.stringify(new_records),get_user_no:p.get_user_no,get_user_org:p.get_user_org,
				get_date:p.get_date,record_user:p.record_user,apply_id:params.apply_id};
		baseAjax("propertyRecipients/saveRecipientsUser.asp", m , function(data) {
			if(data.result==true){
				alert("保存成功！");
				//关闭申请页并返回List主页面
				newOpenTab("assetrecipients","保存","ppe/propertyManager/propertyRecipients/propertyRecipientsList.html");
			}else{
				alert("保存失败！");
			}
		});
	});
	//返回
	$('#back_RecipientsList').click(function(){
		newOpenTab("assetrecipients","保存","ppe/propertyManager/propertyRecipients/propertyRecipientsList.html");
	});
}

//写入条形码
function recipientsWriteEPC(obj){
	var seles = $("#tb_editPropertyRecipients_user").bootstrapTable("getData");
	var index = parseInt($(obj).attr("rnum"));
	var asset_num = seles[index].ASSET_NUM;
	var asset_type = seles[index].ASSET_TYPE_ID;
	var org_no = $("span[name='ZHO.org_no']").html();
	var codeNum = toStandarCode(asset_num,org_no,asset_type);//转为条形码规范数据
	if(!codeNum){//没返回标准条形码，结束方法
		return;
	}
	var vlc = getVLC("vlc");
    if (vlc) {
    	var resultInfo = vlc.WriteTag(3, 0, 15, 0, codeNum);
    	 var res=resultInfo.substring(resultInfo.indexOf("<Success>")+9,resultInfo.indexOf("</Success>"));
		 //1--成功;0--失败;2--无标签;3--无法连接到设备;4--设备被占用
    	 res=parseInt(res);
        switch(res){
        	case 1:
        		alert("写入成功！条形码为："+codeNum);
        		$(obj).html("写入成功");
        		$(obj).attr("overchange", "true");

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

//写入按钮改变事件
function initHoverWriteEPCChange(){
	$("#tb_editPropertyRecipients_user").find('button[overchange]').mouseover(function(){
		if($(this).attr("overchange") == "true"){//已写入才改变
			$(this).html("重新写入");
		}
	});
	$("#tb_editPropertyRecipients_user").find('[overchange]').mouseout(function(){
		if($(this).attr("overchange") == "true"){//已写入才改变
			$(this).html("写入成功");
		}
	});
}

initModalBtn();