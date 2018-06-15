 function initviewtassetAssignInfo(params){
	 if(params.ASSIGN_STATUS_NAME=="未分配"){
		 $("#Table_TransfAssign").hide();
	 }
	 for ( var k in params) {
		 var v1=k.toLowerCase();
		if (v1=="approve_remark") {
			$("textarea[name='VTA."+v1+"']").val(params[k]);
		}else {
			$("span[name='VTA."+v1+"']").html(params[k]);
		}
	}
	 initviewtassetAssignList(params["TRANSFER_ID"]);//初始化列表
	 //返回
	 $("#back_propertyTransfAssignInfo").click(function(){
		 newOpenTab("assettransf_assign","返回","ppe/propertyManager/propertyTransformation/propertyTransf_Assign/propertyTransf_AssignList.html");
	 });
 }
 
 function initviewtassetAssignList(transfer_id){
		 var queryParams=function(params){
				var temp={
						limit: params.limit, //页面大小
						offset: params.offset //页码
				};
				return temp;
		};
		$("#Table_propertyTransfAssignInfo").bootstrapTable('destroy').bootstrapTable({
			url:'AssetTransferPer/queryAssetlistTransf.asp?transfer_id='+transfer_id,//请求后台的URL（*）
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
			columns : [ {
				field : 'Number',
				title : '序号',
				align : "center",
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field : "ASSET_NUM",
				title : '资产编码',
				align : "center"
			}, {
				field : "ASSET_NAME",
				title : '资产名称',
				align : "center"
			}, {
				field : "ASSET_TYPE",
				title : '资产类型',
				align : "center"
			},{
				field : "REAL_USER_NAME",
				title : "使用人",
				align : "center"
			} , {
				field : "REAL_ADDRESS",
				title : "设备使用地址",
				align : "center"
			}]
		});
 }
