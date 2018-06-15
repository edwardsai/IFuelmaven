var param="";
function initAssignProperty(params){
	param=params.geter_org;
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$('#Table_AssignProperty').bootstrapTable('destroy').bootstrapTable({
	    url: 'propertyRecipients/queryAssetGetInfo.asp?apply_id='+params.apply_id,  
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : false, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams :queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		//pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
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
			align : "center"
		},{
			field : "ASSET_NUM",
			title : '资产编码',
			align : "center"
		}, {
			field : "ASSET_NAME",
			title : '资产名称',
			align : "center"
		}, {
			field : "ASSET_TYPE",
			title : "资产类型",
			align : "center"
		} , {
			field : "REAL_USER_NAME",
			title : "使用人",
			align : "center",
			formatter: function (value, row, index) {
				return '<input type="text" id="real_user_name'+index+'" readOnly="true" onclick="openPRPop('+index+')" placeholder="点击选择...">'
				+'<input type="hidden" id="real_user'+index+'" >';
			}
		} , {
			field : "REAL_USER_ORG",
			title : "使用人机构",
			align : "center",
			formatter: function (value, row, index) {
				return '<input type="text" id="real_user_org_name'+index+'" readOnly="true">'
				+'<input type="hidden" id="real_user_org'+index+'" >';
			}
		}, {
			field : "REAL_ADDRESS",
			title : "设备使用地址",
			align : "center",
			formatter: function (value, row, index) {
				return '<input type="text" id="real_address'+index+'" >';
			}
		} ]
	});	
	
}

function openPRPop(index){
	openPRUserPop("chooseUser",{Zuser_no:$("#real_user"+index),Zuser_name:$("#real_user_name"+index),Zuser_org:$("#real_user_org"+index),Zuser_org_name:$("#real_user_org_name"+index)},param);
}
//初始化按钮
function initPropertyRecipientsTab(){
	//保存
	$('#save_assetRecipients').click(function(){
		var records = $("#Table_AssignProperty").bootstrapTable('getData');
		var isComplete = true;
		var Messege = "";
		$.each(records, function(i){
			if($("#real_user_name"+ i).val()==""||$("#real_user_org"+ i).val()==""||
					$("#real_address"+ i).val()==""){
				Messege += "请将所有信息填写完整";
				isComplete = false;
				return false;
			}
			records[i].REAL_USER = $("#real_user"+ i).val();
			records[i].REAL_USER_ORG = $("#real_user_org"+ i).val();
			records[i].REAL_ADDRESS = $("#real_address"+ i).val();
		});	
		if(!isComplete){
			alert(Messege);
			return ;
		}
		var new_records = $("#Table_AssignProperty").bootstrapTable('getData');
		var m={new_records:JSON.stringify(new_records)};
		baseAjax("propertyRecipients/updateRecipientsUser.asp", m , function(data) {
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
	$('#back_assetRecipients').click(function(){
		newOpenTab("assetrecipients","返回","ppe/propertyManager/propertyRecipients/propertyRecipientsList.html");
	});
};

initPropertyRecipientsTab();	