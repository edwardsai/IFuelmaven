function openPTPUserPop(id,callparams,org_no,url){
	$('#myModalUserInfoPer').remove();
	$("#"+id).load("ppe/propertyManager/propertyTransformation/propertyTransf_personal/userPop.html",{},function(){
	$("#myModalUserInfoPer").modal("show");
	//获取input里面的值
	var user_no = $("#Muser_no").val();
	var user_name =  $("#Muser_name").val();
	PRUserPop("#Table_userInfoModalPer",url + "?user_no="
			+user_no+"&user_name="+escape(encodeURIComponent(user_name))+"&org_no="+escape(encodeURIComponent(org_no)),callparams);
	});

	/**
	 * 人员信息模态框
	 */
	function PRUserPop(UserTable,UserUrl,UserParam){
		//分页
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};	
		//查询所有POP框
		$(UserTable).bootstrapTable("destroy").bootstrapTable({
			//请求后台的URL（*）
			url : UserUrl,
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10,15],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "USER_NO", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			onDblClickRow:function(row){
				$('#myModalUserInfoPer').modal('hide');
				UserParam.Zuser_no.val(row.USER_NO);
				UserParam.Zuser_name.val(row.USER_NAME);
				UserParam.Zuser_org.val(row.ORG_NO);
				if(UserParam.Zuser_org_name){
					UserParam.Zuser_org_name.val(row.ORG_NAME);
				}
			},
			columns :[{
					field : 'Number',
					title : '序号',
					align : "center",
					formatter: function (value, row, index) {
						return index+1;
					}
				}, {
		        	field : 'USER_NO',
					title : '用户编号',
					align : "center"
		        }, {
		        	field : "USER_NAME",
					title : "用户姓名",
					align : "center"
		        }, {
		        	field : "USER_POST",
					title : "用户岗位",
					align : "center",
		        }, {
		        	field : "STATE",
					title : "用户状态",
					align : "center"
		        },  {
		        	field : "USER_LEVEL",
					title : "用户等级",
					align : "center"
		        }, {
		        	field : "ORG_NO",
					title : "所属部门编号",
					align : "center",
					visible:false
		        }, {
		        	field : "ORG_NAME",
					title : "所属部门名称",
					align : "center"
		        }]
		});
		//POP重置
		$("#reset_ModaluserPer").click(function(){
			$("#Muser_no").val("");
			$("#Muser_name").val("");
		});
		//多条件查询人员
		$("#search_ModaluserPer").click(function(){
			var user_no = $("#Muser_no").val();
			var user_name =  $("#Muser_name").val();
			$("#Table_userInfoModalPer").bootstrapTable('refresh',{url:url + "?user_no="
					+user_no+"&user_name="+escape(encodeURIComponent(user_name))+"&org_no="+org_no});
		});
	}
}