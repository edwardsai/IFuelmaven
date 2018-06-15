initPropertyTransf_personalButtonEvent() ;

function initPropertyTransf_personalButtonEvent() {
	var currTab = getCurrentPageObj();//当前页
	autoInitSelect(currTab.find("#searchList"));
	initPropertyTransf_personalList();//初始化列表
	//查询按钮
	currTab.find("#queryList").click(function(){
		initPropertyTransf_personalList();
	});
	//重置按钮
	currTab.find("#resetList").bind("click",function(e){
		currTab.find("#searchList input,select").val("");
		currTab.find("#searchList select").select2();
	});
	//新增
	currTab.find("#propertyTransf_personalTrf").click(function(){
		pageDispatchPersonal("edit","");
	});
	//查看
	currTab.find("#propertyTransf_personal_read").click(function(){
		var id=currTab.find("#propertyTransf_personalInfo").bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行查看");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		pageDispatchPersonal("view",params[0]);
	});
	
	//删除
	currTab.find("#delete_assetTransfer").click(function(){
		var id = currTab.find("#propertyTransf_personalInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		var ids = id[0].TRANSFER_ID;  
		approve_state = id[0].APPROVE_STATE_NAME;
		if(approve_state!="待发起"){
			alert("该信息不是待发起状态，不能删除");
			return;
		}
		nconfirm("确定删除该数据吗？",function(){
			baseAjax("AssetTransferPer/deleteTransfer.asp",{"ids":ids}, function(data) {
				if (data != undefined && data != null&& data.result == "true") {
					alert("删除成功！");
					newOpenTab("back_transfer","返回","ppe/propertyManager/propertyTransformation/propertyTransf_personal/propertyTransf_personal.html");
				}else{
					alert("删除失败！");
				}
			},true);
		});
	});
	
	//修改
	currTab.find("#update_assetTransfer").click(function(){
		var id = currTab.find("#propertyTransf_personalInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var approve_state = id[0].APPROVE_STATE_NAME;
		if(approve_state!="待发起"){
			alert("该信息不是待发起状态，不能修改");
			return;
		}
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		pageDispatchPersonal("edit",params[0]);
	});
	//查看审批
	currTab.find("#approve_assetTransfer").click(function(){
		var id = currTab.find("#propertyTransf_personalInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看审批!");
			return ;
		}
		/*var approve_state = id[0].APPROVE_STATE_NAME;
		if(approve_state!="待发起"){
			alert("该信息不是待发起状态，不能查看审批");
			return;
		}*/
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		pageDispatchPersonal("view_approve", params[0]);
	});
	//审批通过
	currTab.find("#pass_assetTransfer").click(function(){
		var id = currTab.find("#propertyTransf_personalInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行通过审批!");
			return ;
		}
		var approve_state = id[0].APPROVE_STATE_NAME;
		if(approve_state=="待发起"){
			alert("该信息是待发起状态，不能查看审批");
			return;
		}
		var transfer_id=id[0].TRANSFER_ID;
		var approve_emp_id=$("#main_user_name").attr("user_no");
		var real_user = id[0].ACCEPT_EMP_ID;
		nconfirm("确定通过审批吗？",function(){
			baseAjax("AssetTransferPer/passAppTransfer.asp", {"transfer_id":transfer_id,"approve_emp_id":approve_emp_id,"real_user":real_user}, function(data){
				if (data!=undefined&&data!=null&&data.result=="true") {
					alert("审批通过");
					currTab.find("#queryList").click();
				}else{
					alert("通过失败");
				}
			},true);
		});
	});
/****************************************************************************************/	
	//初始化列表
	function initPropertyTransf_personalList(){
		var transferasset_name=$.trim(currTab.find("#transferasset_name").val());
		var approve_state=$.trim(currTab.find("#approve_state").val());
		var transfer_type="01";    //个人资产转移
		var userId=$("#main_user_name").attr("user_no");//数据级权限需要这两个参数
		var orgId=$("#main_user_name").attr("org_no");//数据级权限需要这两个参数
		var queryParams=function(params){
			var temp={
					limit:params.limit,
					offset:params.offset
			};
			return temp;
		};
		currTab.find("#propertyTransf_personalInfo").bootstrapTable('destroy').bootstrapTable({
			url:"AssetTransferPer/queryallPropertyTransf.asp?transfer_type="+transfer_type+'&approve_state='+approve_state
			+'&transferasset_name='+escape(encodeURIComponent(transferasset_name))+'&userId='+userId+'&orgId='+orgId,
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : false, //是否启用排序
			sortOrder : "desc", //排序方式
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
				field: 'TRANSFER_ID',
				align: 'center',
				title : '资产转移流水号'
			},{
				field: 'TRANSFERASSET_NAME',
				align: 'center',
				title : '资产转移名称'
			},{
				field : 'USER_NO',
				title : '转移人工号',
				align : "center"
			}, {
				field : 'TRANSFER_EMP_NAME',
				title : '转移人名字',
				align : "center"
			},{
				field : 'ACCEPT_EMP_ID',
				title : '接收人工号',
				align : "center"
			}, {
				field : "ACCEPT_EMP_NAME",
				title : "接收人名字",
				align : "center"
			} , {
				field : "TRANSFER_DATE",
				title : "转移发起日期",
				align : "center"
			},{
				field : "APPROVE_EMP_NAME",
				title : "审批人",
				align : "center"
			},{
				field : "TRANSFER_COMPLETED_DATE",
				title : "转移时间",
				align : "center"
			},{
				field : "APPROVE_STATE_NAME",
				title : "审批状态",
				align : "center"
			}]
		});
	}
	
	//页面跳转
	function pageDispatchPersonal(key,params){
		if ("edit"==key) {
			newOpenTab("editPersonalAsset", "个人资产转移","ppe/propertyManager/propertyTransformation/propertyTransf_personal/editPropertyTransf_personal.html",function(){
				initEditPersonalAssetTransfer(params);
			});
			return;
		}else if("view"==key||"view_approve"==key){
			newOpenTab("viewPersonalAsset","查看资产","ppe/propertyManager/propertyTransformation/propertyTransf_personal/viewPropertyTransf_personal.html",function(){
				initViewPersonalAssetTransfer(params);
			});
		}
	}	
}

