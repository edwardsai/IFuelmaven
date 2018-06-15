
function openRolePop(id,callparams){
	$('#myModal_role').remove();
	$("#"+id).load("pages/srole/srolePop.html",{},function(){
		$("#myModal_role").modal("show");
		autoInitSelect($("#pop_roleState"));
		rolePop("#pop_roleTable","SRole/findAllRoleById.asp",callparams);
	});
}


/**
	 * 用户POP框
	 */
	function rolePop(roleTable,roleUrl,roleParam){
		//查询所有用户POP框
		$(roleTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url : roleUrl,
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
					uniqueId : "ROLE_NO", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: true,
					onDblClickRow:function(row){
						$('#myModal_role').modal('hide');
						roleParam.name.val(row.ROLE_NAME);
						roleParam.no.val(row.ROLE_NO);
					},
					columns :[
						{
				          field: 'ROLE_NO',
				          title: '角色编号',
				          align:"center"
				        }, {
				        	field:"ROLE_NAME",
				        	title:"角色名称",
				            align:"center"
				        }, {
				        	field:"FLAG",
				        	title:"标记",
				            align:"center",
							formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
				        }, {
				        	field:"UPDATE_NO",
				        	title:"修改人",
				            align:"center"
				        }, {
				        	field:"UPDATE_TIME",
				        	title:"修改时间",
				            align:"center"
				        }]
				});
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset, //页码
			};
			return temp;
		};		
		
		//用户POP重置
		$("#pop_roleReset").click(function(){
			$(".modal-body input").each(function(){
				$(this).val("");
			});
			$("#pop_roleState").val("");
			$("#pop_roleState").select2();
		});
		//多条件查询用户
		$("#pop_roleSearch").click(function(){
			var PopRoleName = $("#pop_roleName").val();
			var PopRoleNo =  $("#pop_roleNo").val();
			var PopRoleState =  $.trim($("#pop_roleState").val());
			$(roleTable).bootstrapTable('refresh',	{url:"SRole/findAllRoleById.asp?PopRoleName="+escape(encodeURIComponent(PopRoleName))+"&PopRoleNo="+PopRoleNo+"&PopRoleState="+PopRoleState});
		});
	}