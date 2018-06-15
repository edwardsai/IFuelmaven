function initEditAssetTransferDept(params){//params新增修改的标识
	var currTab = getCurrentPageObj();//当前页
	var assetTable = currTab.find("#propertyTransf_department_table");//资产列表对象
	initVlidate(currTab.find("#editPropertyTransfer_dept"));
	if(params){//修改时初始化信息
		for ( var k in params) { 
			var k1=k.toLowerCase();
			if(k1=="approve_remark"){
				currTab.find("textarea[name='PTD." +k1+ "']").val(params[k]);
			}else{
				currTab.find("input[name='PTD." +k1+ "']").val(params[k]);
			}
		}
	}else{//新增时则初始化当前的登录人信息,转移编号,当前日期等
		currTab.find('[name="PTD.user_no"]').val($("#main_user_name").attr("user_no"));
		currTab.find('[name="PTD.transfer_emp_name"]').val($("#main_user_name").attr("user_name"));
		currTab.find('[name="PTD.transfer_dept_name"]').val($("#main_user_name").attr("org_name"));
		currTab.find('[name="PTD.org_no"]').val($("#main_user_name").attr("org_no"));
		currTab.find('[name="PTD.transfer_id"]').val(returnSerialNumber("DAS-", "ASS_ASSET_TRANSFER_PERS"));
		currTab.find('[name="PTD.transfer_date"]').val(returnTodayData());
	}
	var transfer_id = "";
	if(params){
		transfer_id = params.TRANSFER_ID;
	}
	initDeptAssetList(transfer_id);//初始化转移列表
	//点击选择转移人员
	currTab.find("[name='PTD.accept_emp_name']").unbind();
	currTab.find("[name='PTD.accept_emp_name']").click(function(){
		var url = "AssetTransferPer/queryUserPopDept.asp";
		openPTPUserPop("userDivPop_newTransferDeptModal",
				{Zuser_name:currTab.find("[name='PTD.accept_emp_name']"),
				Zuser_org:currTab.find("[name='PTD.accept_dept']"),
				Zuser_org_name:currTab.find("[name='PTD.accept_dept_name']"),
				Zuser_no:currTab.find("[name='PTD.accept_emp_id']")},null,url);
	});
	//新增按钮
	currTab.find("#editPropertyTransf_department_newadd").click(function(){
		var transfer_emp_id = currTab.find("[name='PTD.user_no']").val();
		var org_no=currTab.find("[name='PTD.org_no']").val();
		//org_no用于url中过滤是本部门的资产,
		//transfer_emp_id用于过滤掉那些已发起申请的资产,避免资产重复调添加转移
		var url = "AssetTransferPer/queryAllAssetInfo.asp?org_no=" + org_no
					+ "&transfer_emp_id=" +transfer_emp_id;
		openAssetPop(currTab.find("#assetPop_deptTransferModal"),assetTable,url);
	});
	//返回按钮
	currTab.find("#propertyTransf_department_back").click(function(){
		newOpenTab("departassettransfer", "返回","ppe/propertyManager/propertyTransformation/propertyTransf_department/propertyTransf_department.html");
	});
	//删除按钮
	currTab.find("#editPropertyTransf_department_delete").click(function(){
		var rol=assetTable.bootstrapTable("getSelections");
		var id=rol[0].ASSET_NUM;
		assetTable.bootstrapTable("removeByUniqueId", id);
		var data=assetTable.bootstrapTable("getData");
		assetTable.bootstrapTable("load", data);
	});
	//保存
	currTab.find("#propertyTransf_department_save").click(function(){
		saveOrSubmit("01"); //01待发起
	});
	//保存并提交
	currTab.find("#propertyTransf_department_commit").click(function(){
		saveOrSubmit("02"); //02审批中
	});
	
	
/**********************************************************************************/
	function saveOrSubmit(state){
		if (!vlidate(currTab.find("#editPropertyTransfer_dept"),"", true)) {
			return;
		}
		var inputs=currTab.find("input[name^='PTD.']");
		var texts=currTab.find("textarea[name^='PTD.']");
		var params={};
		for ( var int = 0; int <inputs.length; int++) {
			params[$(inputs[int]).attr("name").substr(4)]=$(inputs[int]).val();
		}
		for ( var int3 = 0; int3 < texts.length; int3++) {
			params[$(texts[int3]).attr("name").substr(4)]=$(texts[int3]).val();
		}
		params["approve_state"] = state;
		params["transfer_type"] = "02";//类型为部门资产调拨
		var assetInfo = assetTable.bootstrapTable("getData");
		var asset_nums = "";
		$.each(assetInfo,function(i){
			asset_nums += assetInfo[i].ASSET_NUM + "&&";
		});
		if(asset_nums==""){
			alert("请选择资产");
			return;
		}
		params["asset_nums"] = asset_nums.substring(0,asset_nums.length -2);
			baseAjax("AssetTransferPer/addOrUpdateTransferInfo.asp", params, function(data){
				if (data!=undefined && data!=null) {
					if(data.result=="true"){
						currTab.find("#propertyTransf_department_back").click();
					}
					alert(data.msg);
				}else {
					alert("保存失败");
			}
		});	
	}
	//初始化资产列表
	function initDeptAssetList(transfer_id){
		var queryParams=function(params){
			var temp={
					limit:params.limit,
					offset:params.offset
			};
			return temp;
		};
		assetTable.bootstrapTable('destroy').bootstrapTable({
			url : 'AssetTransferPer/queryAssetlistTransf.asp?transfer_id='+transfer_id,
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
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
			columns : [ {
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
				field : 'ASSET_NUM',
				title : '资产编码',
				align : "center"
			}, {
				field : "ASSET_NAME",
				title : "资产名称",
				align : "center"
			}, {
				field : "ASSET_TYPE",
				title : "资产类型",
				align : "center"
			}]
		});
	}
}
