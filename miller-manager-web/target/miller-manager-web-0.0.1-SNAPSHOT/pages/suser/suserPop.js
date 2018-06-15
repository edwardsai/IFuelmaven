

function openUserPop(id,callparams){
	$('#myModal_user').remove();
	$("#"+id).load("pages/suser/suserPop.html",{},function(){
		$("#myModal_user").modal("show");
		autoInitSelect($("#pop_userState"));
		userPop("#pop_userTable","SUser/popFindAllUser.asp",callparams);
	});
}

/**
	 * 用户POP框
	 */
	function userPop(userTable,userUrl,userParam){
		//查询所有用户POP框
		$(userTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url : userUrl,
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
					uniqueId : "user_no", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: true,
					onDblClickRow:function(row){
						$('#myModal_user').modal('hide');
						if(userParam.type=="appendPersons"){
							if(userParam.name.val()==""){
								userParam.name.val(row.USER_NAME);
								userParam.no.val(row.USER_NO);	
							}else{
								var names = userParam.name.val();
								var codes = userParam.no.val();
								var code = codes.split(",");
								for(var i=0;i<code.length;i++){
									if(code[i]==row.USER_NO){
										alert("参会人员不可重复选择");
										return;
									}
								}
								userParam.name.val(names+","+row.USER_NAME);
								userParam.no.val(codes+","+row.USER_NO);
							}
	
						}else{
							userParam.name.val(row.USER_NAME);
							userParam.no.val(row.USER_NO);			
							userParam.dept.val(row.ORG_NAME);		
						}
						//根据用户编号查询关联角色
						if(userParam.role=="auth"){
					        $.ajax({
						           url:"SRole/findAllRoleById.asp",
						           type:"post",
						           async: false,
						           data:{"user_no":row.USER_NO},
						           dataType:"json",
						           success:function(msg){
						        	   userParam.cascade.role_no.text("");
						        	   userParam.cascade.role_no.append("<option value=''  selected>-- 请选择 --</option>");
						        	   for(var i=0;i<msg.total;i++){
						        		   if(msg.rows[i].ROLE_NAME==undefined)break;
						        		   var option = "<option value="+msg.rows[i].ROLE_NO+">"+msg.rows[i].ROLE_NAME+"</option>";
						        		   userParam.cascade.role_no.append(option);
						        	   }
						        	   userParam.cascade.role_no.select2();
						           }
						      });
						}
						//根据用户编号查询关联机构 
						if(userParam.role=="auth"){
					        $.ajax({
						           url:"SOrg/findAllOrgById.asp",
						           type:"post",
						           async: false,
						           data:{"user_no":row.USER_NO},
						           dataType:"json",
						           success:function(msg){
						        	   userParam.cascade.org_no.text("");
						        	   userParam.cascade.org_no.append("<option value=''  selected>-- 请选择 --</option>");
						        	   for(var i=0;i<msg.total;i++){
						        		   if(msg.rows[i].ORG_NAME==undefined)return;
						        		   var option = "<option value="+msg.rows[i].ORG_CODE+">"+msg.rows[i].ORG_NAME+"</option>";
						        		   userParam.cascade.org_no.append(option);
						        	   }
						        	   userParam.cascade.org_no.select2();
						           }
						      });
						}
					},
					columns : [ 
					{
						field : 'USER_NO',
						title : '用户编号',
						align : "center"
					}, {
						field : "USER_NAME",
						title : "用户名称",
						align : "center"
					}, {
						field : "LOGIN_NAME",
						title : "登陆名",
						align : "center"
					}, {
						field : "STATE",
						title : "用户状态",
						align : "center",
						 formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
							
					}, {
						field : "ORG_NAME",
						title : "所属部门",
						align : "center"
					}, {
						field : "USER_MAIL",
						title : "用户邮箱",
						align : "center"
					}, {
						field : "USER_LEVEL",
						title : "用户等级",
						align : "center"
					} ]
				});
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};		
		
		//用户POP重置
		$("#pop_userReset").click(function(){
			$(".modal-body input").each(function(){
				$(this).val("");
			});
			$("#pop_userState").val("");
			$("#pop_userState").select2();
		});
		//多条件查询用户
		$("#pop_userSearch").click(function(){
			var PopUserName = $("#pop_username").val();
			var PopUserNo =  $("#pop_userCode").val();
			var PopUserLoginName = $("#pop_userLoginName").val();
			var PopUserState =  $.trim($("#pop_userState").val());
			$(userTable).bootstrapTable('refresh',{url:"SUser/popFindAllUser.asp?PopUserName="+escape(encodeURIComponent(PopUserName))+"&PopUserNo="+PopUserNo+"&PopUserLoginName="+PopUserLoginName+"&PopUserState="+PopUserState});
		});
	}