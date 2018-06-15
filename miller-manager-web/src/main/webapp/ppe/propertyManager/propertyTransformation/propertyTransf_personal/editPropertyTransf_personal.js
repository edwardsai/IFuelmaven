function initEditPersonalAssetTransfer(params){//params新增修改的标识
	var currTab = getCurrentPageObj();//当前页
	var assetTable = currTab.find("#editPropertyTransf_personal_info");//资产列表对象
	initVlidate(currTab.find("#editPropertyTransfer"));
	if(params){//修改时初始化信息
		for ( var k in params) { 
			var k1=k.toLowerCase();
			if(k1=="approve_remark"){
				currTab.find("textarea[name='PTP." +k1+ "']").val(params[k]);
			}else{
				currTab.find("input[name='PTP." +k1+ "']").val(params[k]);
			}
		}
	}else{//新增时则初始化当前的登录人信息,转移编号,当前日期
		currTab.find('[name="PTP.user_no"]').val($("#main_user_name").attr("user_no"));
		currTab.find('[name="PTP.transfer_emp_name"]').val($("#main_user_name").attr("user_name"));
		currTab.find('[name="PTP.org_no"]').val($("#main_user_name").attr("org_no"));
		currTab.find('[name="PTP.transfer_id"]').val(returnSerialNumber("RP-","ASS_ASSET_TRANSFER_PERS"));
		currTab.find('[name="PTP.transfer_date"]').val(returnTodayData());
	}
	var transfer_id = "";
	if(params){
		transfer_id = params.TRANSFER_ID;
	}
	initPersonalAssetList(transfer_id);//初始化转移列表
	
	//点击选择人员
	var org_no =$("#main_user_name").attr("org_no");
	currTab.find("[name='PTP.accept_emp_name']").unbind();
	currTab.find("[name='PTP.accept_emp_name']").click(function(){
		var url = "AssetTransferPer/queryUserPop.asp";
		openPTPUserPop("userDivPop_newTransferModal",
				{Zuser_name:currTab.find("[name='PTP.accept_emp_name']"),
				Zuser_no:currTab.find("[name='PTP.accept_emp_id']")},org_no, url);
	});
	//新增按钮
	currTab.find("#editPropertyTransf_personal_newadd").unbind();
	currTab.find("#editPropertyTransf_personal_newadd").click(function(){
		var real_user = currTab.find("input[name='PTP.user_no']").val();
		//real_user用于url中过滤是本人的资产,
		//transfer_emp_id用于过滤掉那些已发起申请的资产,避免资产重复调添加转移
		var url = "AssetTransferPer/queryAllAssetInfo.asp?real_user=" + real_user
					+ "&transfer_emp_id=" +real_user;
		openAssetPop(currTab.find("#assetPop_newTransferModal"),assetTable,url);
	});	
	//删除按钮
	$("#editPropertyTransf_personal_delete").click(function(){
		var rol=assetTable.bootstrapTable("getSelections");
		var id=rol[0].ASSET_NUM;
		assetTable.bootstrapTable("removeByUniqueId", id);
		var data=assetTable.bootstrapTable("getData");
		assetTable.bootstrapTable("load", data);
	});
	//保存
	currTab.find("#save_addAssetApprove").click(function(){
		saveOrSubmit("01"); //01待发起
	});	
	//保存并提交
	currTab.find("#save_submit_addAssetApprove").click(function(e){
		saveOrSubmit("02"); //02审批中
	});
	//返回
	currTab.find("#back_assetApprove").click(function(){
		newOpenTab("employeeassettransfer", "返回", "ppe/propertyManager/propertyTransformation/propertyTransf_personal/propertyTransf_personal.html");
	});
	
/**************************************************************************************/	
	//保存方法
	function saveOrSubmit(state){
		if (!vlidate(currTab.find("#editPropertyTransfer"),"",true)) {
			return;
		}
		var inputs=currTab.find("input[name^='PTP.']");
		var texts=currTab.find("textarea[name^='PTP.']");
		var params={};
		for ( var int = 0; int <inputs.length; int++) {
			params[$(inputs[int]).attr("name").substr(4)]=$(inputs[int]).val();
		}
		for ( var int3 = 0; int3 < texts.length; int3++) {
			params[$(texts[int3]).attr("name").substr(4)]=$(texts[int3]).val();
		}
		params["approve_state"] = state;
		params["transfer_type"] = "01";//类型为个人转移
		var assetInfo = assetTable.bootstrapTable("getData");
		var asset_nums = "";
		$.each(assetInfo,function(i){
			asset_nums += assetInfo[i].ASSET_NUM + "&&";
		});
		if(asset_nums ==""){
			alert("请选择资产");
			return;
		}
		params["asset_nums"] = asset_nums.substring(0,asset_nums.length -2);
			baseAjax("AssetTransferPer/addOrUpdateTransferInfo.asp", params, function(data){
				if (data!=undefined && data!=null) {
					if(data.result=="true"){
						currTab.find("#back_assetApprove").click();
					}
					alert(data.msg);
				}else {
					alert("保存失败");
			}
		});	
	}
	//初始化转移清单列表
	function initPersonalAssetList(transfer_id){
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
	};
}
