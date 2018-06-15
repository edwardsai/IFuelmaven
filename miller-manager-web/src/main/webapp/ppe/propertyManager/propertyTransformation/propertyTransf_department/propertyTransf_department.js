initPropertyTransferDept();
function initPropertyTransferDept(){
	var currTab = getCurrentPageObj();//当前页
	autoInitSelect(currTab.find("#approve_dept_state"));
	initPropertyTransferDepartmentList();//初始化列表
	
	//查询
	currTab.find("#selectList").click(function(){
		initPropertyTransferDepartmentList();
	});
	//重置
	currTab.find("#reset_dept").click(function(e){
		currTab.find("#dept_div input,select").val("");
		currTab.find("#dept_div select").select2();
	});	
	//新增
	currTab.find("#propertyTransf_departmentTrf").click(function(){
		pageDispatchPersonalDpt("edit","");
	});
	//查看详情
	currTab.find("#propertyTransf_department_read").unbind();
	currTab.find("#propertyTransf_department_read").click(function(){
		var id = currTab.find("#dept_tableInfo").bootstrapTable("getSelections");
		if (id.length != 1) {
			alert("请选择一条数据进行查看");
			return;
		}
		var ids = JSON.stringify(id);
		var params = JSON.parse(ids);
		pageDispatchPersonalDpt("view",params[0]);
	});
	//修改
	currTab.find("#update_assetTransferDept").click(function(){
		var id = currTab.find("#dept_tableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var approve_state = id[0].APPROVE_STATE_NAME;
		if(approve_state!="待发起"){
			alert("该信息不是待发起状态，不能修改");
			return;
		}
		var ids = JSON.stringify(id);
		var params = JSON.parse(ids);
		pageDispatchPersonalDpt("edit",params[0]);
	});
	
	//删除 
	currTab.find("#delete_assetTransferDept").click(function(){
		var id = currTab.find("#dept_tableInfo").bootstrapTable('getSelections');
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
					newOpenTab("back_transferDept","返回","ppe/propertyManager/propertyTransformation/propertyTransf_department/propertyTransf_department.html");
				}else{
					alert("删除失败！");
				}
			},true);
		});
	});
	//查看审批
	currTab.find("#approve_assetTransferDept").click(function(){
		currTab.find("#propertyTransf_department_read").click();
	});
	//通过审批
	currTab.find("#pass_assetTransferDept").click(function(){
		var id=currTab.find("#dept_tableInfo").bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行操作");
			return;
		}
		var app_state=id[0].APPROVE_STATE_NAME;
		if(app_state!="审批中"){
			alert("该记录为非审批中状态！");
			return;
		}
		var transfer_id=id[0].TRANSFER_ID;
		var accept_dept=id[0].ACCEPT_DEPT;
		var approve_emp_id=$("#main_user_name").attr("user_no");
		nconfirm("确定通过审批吗？",function(){
			baseAjax("AssetTransferPer/passAppTransfer.asp", 
					{"transfer_id":transfer_id,"approve_emp_id":approve_emp_id,"accept_dept":accept_dept},
					function(data){
				if (data!=undefined&&data!=null&&data.result=="true") {
					alert("审批通过");
					currTab.find("#selectList").click();
				}else{
					alert("通过失败");
				}
			},true);
		});
	});
/***********************************************************************/
	//初始化列表
	function initPropertyTransferDepartmentList(){
		var transferasset_name=$.trim(currTab.find("#Dept_transferasset_name").val());
		var asset_state=$.trim(currTab.find("#approve_dept_state").val());
		var transfer_type="02";//资产调拨类型
		var userId=$("#main_user_name").attr("user_no");
		var orgId=$("#main_user_name").attr("org_no");
		var queryParams=function(params){
			var temp={
					limit:params.limit,
					offset:params.offset
			};
			return temp;
		};
		currTab.find("#dept_tableInfo").bootstrapTable('destroy').bootstrapTable({
			url:"AssetTransferPer/queryallPropertyTransf.asp?transfer_type="+transfer_type+'&asset_state='+asset_state
			+'&transferasset_name='+escape(encodeURIComponent(transferasset_name))+'&userId='+userId+'&orgId='+orgId,
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
				title : '资产调拨流水号'
			},{
				field: 'TRANSFERASSET_NAME',
				align: 'center',
				title : '资产调拨名称'
			},{
				field : 'ORG_NO',
				title : '转移部门编号',
				align : "center"
			}, {
				field : 'TRANSFER_DEPT_NAME',
				title : '转移部门名字',
				align : "center"
			}, {
				field : 'ACCEPT_DEPT',
				title : '接收部门编号',
				align : "center"
			}, {
				field : "ACCEPT_DEPT_NAME",
				title : "接收部门名字",
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
	function pageDispatchPersonalDpt(key,params){
		if ("edit"==key) {
			newOpenTab("propertyTransf_departmentTrf", "部门资产转移","ppe/propertyManager/propertyTransformation/propertyTransf_department/editPropertyTransf_department.html",function(){
				initEditAssetTransferDept(params);
			});
			return;
		}else if("view"==key){
			newOpenTab("propertyTransf_department_read","查看资产","ppe/propertyManager/propertyTransformation/propertyTransf_department/viewPropertyTransf_departmentDet.html",function(){
				initViewAssetTransferDept(params);
			});
		}
	}
}


