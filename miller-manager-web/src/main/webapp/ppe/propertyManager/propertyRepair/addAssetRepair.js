function initAssetRepairUpdate(data){
	for ( var k in data) { 
		if(k=="repair_remark"){
			$("textarea[name='AK." + k + "']").val(data[k]);
		}else if(k=="repair_method"){
			 $("select[name='AK." + k + "']").val(data[k]);
		}else{
			 $("input[name='AK." + k + "']").val(data[k]);
		}
	}
	initSelect($("select[name='AK.repair_method']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"ASS_DIC_REPAIR_METHOD"},data.repair_method);
	baseAjax("sfile/findFileInfo.asp",{file_id:$("#AKfiled_idId").val()},function(data){
		defaultShowFileInfo($("#AKfiled_idId").val(),$("#AKfiled_id").parent(),data,true);
	});
}
//初始化按钮
function initaddAssetRepairEvent(){
	//获取当前申请人，机构和时间
	$("#AKapply_user").val($("#main_user_name").attr("user_no"));
	$("#AKapply_user_name").val($("#main_user_name").attr("user_name"));
	$("#AKapply_org").val($("#main_user_name").attr("org_no"));
	$("#AKapply_org_name").val($("#main_user_name").attr("org_name"));
	$("#AKapply_date").val(returnTodayData());
	
	$("#AKrep_id").val(returnSerialNumber("RP","ASS_SEQ_REPAIR_APPLY"));
	//保存按钮
	$("#save_addassetRepair").click(function(){
	   if(!vlidate($("#assetRepair_add"),"",true)){
			 return;
		 }
		var inputs = $("input[name^='AK.']");
		var selects = $("tr").find("select[name^='AK.']");
		var textareas = $("textarea[name^='AK.']");
		var params = {};
		// 必填项验证
		// 取值
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(3)] = $(selects[i]).val(); 
		}		
		for(var i=0;i<textareas.length;i++){
			params[$(textareas[i]).attr("name").substr(3)] = $(textareas[i]).val(); 
		}
		var p = params;
	    p["repair_status"]="04";
        baseAjax("AssetRepair/addOrupdateRepair.asp", p, function(data) {
       	if (data != undefined && data != null&&data.result=="true" ) {
       		alert("----保存成功----");
       			newOpenTab("assetrepairlist","返回","ppe/propertyManager/propertyRepair/assetRepairList.html");
			}else{
				alert("----保存失败----");
			}
		});
	});
	//返回按钮
	$("#back_addassetRepair").click(function(){
		newOpenTab("assetrepairlist","返回列表","ppe/propertyManager/propertyRepair/assetRepairList.html");
	 });
	//资产模态框
	$("#AKasset_name").click(function(){
		openassetPop({Zasset_name:$("#AKasset_name"),Zasset_num:$("#AKasset_num"),Zasset_type:$("#AKasset_type"),Zasset_type_name:$("#AKasset_type_name")});
	});	
	//资产POP重置
	$("#reset_addPropertyDiscard").click(function(){
		$("#AARasset_name").val("");
		$("#AARasset_num").val("");
		$("#AARreal_address").val("");
		
	});
	//多条件查询资产
	$("#searchModal_addPropertyDiscard").click(function(){
		var asset_name = $("#AARasset_name").val();
		var asset_num =  $("#AARasset_num").val();
		var real_address =  $("#AARreal_address").val();
		$("#Table_addPropertyRepair").bootstrapTable('refresh',{url:"AssetRepair/queryAssetPop.asp?asset_num="
			+asset_num+"&asset_name="+escape(encodeURIComponent(asset_name))
			+"&real_address="+escape(encodeURIComponent(real_address))});
	});
}
//维修地址
function repairWay(){
	var repairWay=$("#AKrepair_method").val();
	if(repairWay=="01"){
		$("#repairAddress").html("维修地址：");
	}else if(repairWay=="02"){
		$("#repairAddress").html("维修点地址：");
	}
}

function openassetPop(callparams){
    $("#reset_addPropertyDiscard").click();
	$("#myModal_addPropertyRepair").modal("show");
	//获取input里面的值
	var asset_name = $("#AARasset_name").val();
	var asset_num =  $("#AARasset_num").val();
	var real_address =  $("#AARreal_address").val();
	AssetPop("#Table_addPropertyRepair","AssetRepair/queryAssetPop.asp?asset_num="
			+asset_num+"&asset_name="+escape(encodeURIComponent(asset_name))
			+"&real_address="+escape(encodeURIComponent(real_address)),callparams);
}
/**
 * 资产模态框
 */
function AssetPop(ReportTable,ReportUrl,ReportParam){
	//分页
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	//查询所有盘点计划POP框
	$(ReportTable).bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : ReportUrl,
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
		onDblClickRow:function(row){
			$('#myModal_addPropertyRepair').modal('hide');
			ReportParam.Zasset_name.val(row.ASSET_NAME);
			ReportParam.Zasset_num.val(row.ASSET_NUM);
			ReportParam.Zasset_type.val(row.ASSET_TYPE);
			ReportParam.Zasset_type_name.val(row.ASSET_TYPE_NAME);
			getnum(row.PLAN_NUM);
		},
		columns :[{
				field : 'Number',
				title : '序号',
				align : "center",
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
	        	field : 'ASSET_NUM',
				title : '资产编号',
				align : "center"
	        }, {
	        	field : "ASSET_NAME",
				title : "资产名称",
				align : "center"
	        }, {
	        	field : "ASSET_TYPE",
				title : "资产类别id",
				align : "center",
				visible:false
	        },  {
	        	field : "ASSET_TYPE_NAME",
				title : "资产类别",
				align : "center"
	        },{
	        	field : "STATUS",
				title : "资产状态",
				align : "center"
	        }, {
	        	field : "REAL_USER",
				title : "使用人",
				align : "center"
	        }, {
	        	field : "REAL_ADDRESS",
				title : "使用地址",
				align : "center"
	        }]
	});
}

initaddAssetRepairEvent();
autoInitSelect($("#assetRepair_add"));
initVlidate($("#assetRepair_add"));
initARepairUploadModal();

//附件
function initARepairUploadModal(){
	$("#AKfiled_id").click(function(){
		$("#fileUpload"+"AKfiled_id").remove();
		if(!$("#AKfiled_idId").val()){
			$("#AKfiled_idId").val(Math.uuid());
		}
		openFileUploadInfo('AKfiled_id','PROPERTY_REPAIR',$("#AKfiled_idId").val(),function(data){
			defaultShowFileInfo($("#AKfiled_idId").val(),$("#AKfiled_id").parent(),data,true);
		});
	});
}