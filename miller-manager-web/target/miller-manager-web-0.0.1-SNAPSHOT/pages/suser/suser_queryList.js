/**
 * 初始化角色数据
 * @param orgcode
 * @param actorno
 * @param actorname
 */
function initRoleSelect(orgcode,actorno,actorname){
	$("#selected").empty();
	$("#unselected").empty();
	baseAjax("SRole/findUserNoRole.asp",{actorno:actorno,org_code:orgcode},function(data){
		if(data!=undefined){
			for(var i=0;i<data.length;i++){
				$("#unselected").append('<option value="'+data[i].role_no+'">'+data[i].role_name+'</option>');
			}
		}
	},false);
	
	baseAjax("SRole/findUserRole.asp",{actorno:actorno,org_code:orgcode},function(data){
		if(data!=undefined){
			for(var i=0;i<data.length;i++){
				$("#selected").append('<option value="'+data[i].role_no+'">'+data[i].role_name+'</option>');
			}
		}
	},false);
	
	$("#addUserRole").unbind("click");
	$("#addUserRole").click(function(){
		var options=$("#selected option");
		var param={org_code:orgcode,user_no:actorno,role_nos:""};
		if(options!=undefined){
			var role_no=$(options[0]).val();
			for(var i=1;i<options.length;i++){
				role_no=role_no+","+$(options[i]).val();
			}
			param["role_nos"]=role_no;
		}
		baseAjax("SRole/addUserRole.asp",param,function(data){
			if(data!=undefined&&data.result=="true"){
				alert("保存成功");
			}else{
				alert("保存失败");
			}
		},false);
	});
}

function move(type){
	if("rmselected"==type){//移除
		var val=$("#selected").val();
		if(val&&val!=""){
			if(val instanceof Array){
				for(var i=0;i<val.length;i++){
					var html=$("#selected option[value='"+val[i]+"']");
					$("#unselected").append('<option value="'+val[i]+'">'+html.text()+'</option>');
					html.remove();
				}
			}else{
				var html=$("#selected option[value='"+val+"']");
				$("#unselected").append('<option value="'+val+'">'+html.text()+'</option>');
				html.remove();
			}
		}
	}else if("addselected"==type){//新增
		var val=$("#unselected").val();
		if(val&&val!=""){
			if(val instanceof Array){
				for(var i=0;i<val.length;i++){
					var html=$("#unselected option[value='"+val[i]+"']");
					$("#selected").append('<option value="'+val[i]+'">'+html.text()+'</option>');
					html.remove();
				}
			}else{
				var html=$("#unselected option[value='"+val+"']");
				$("#selected").append('<option value="'+val+'">'+html.text()+'</option>');
				html.remove();
			}
		}
	}
}
//按钮方法
function initQueryUserButtonEvent(){
	$("#moreIlsh_backUserList").click(function(){
		$("#submenuList_backUserList ul li:not(.submenuList1,#moreIlsh_backUserList)").toggle();
		$("#moreIlsh_backUserList").toggleClass("moreIlshBg");
	});
	$("#setUserRule").click(function(){
		var id = $("#SUserTableInfo").bootstrapTable('getSelections');
		if(id&&id.length==1){
			initOrgUserTree(function(org_code){
				initRoleSelect(org_code,id[0].user_no,id[0].user_name);
			});
			
			$("#setRoleUser").text(id[0].user_name);
			$("#setRoleUser_no").text(id[0].user_no);
			$("#setUserRuleModal").modal("show");
		}else{
			alert("请选择一条数据进行角色设置!");
		}
	});
	/**高级查询按钮 */
	$("#showMore_suserList").click(function() {
		showMore($(this),"#moreSearch_suserList");
		showMore($(this),"#moreSearch2_suserList");
	});
	$("#queryUser").click(
			function() {
				var user_no = $("#user_no").val();
				var user_name = $("#user_name").val();
				var login_name = $("#login_name").val();
				var state = $.trim($("#SQuser_state").val());
				var user_belong = $.trim($("#SQuser_belong").val());
				$('#SUserTableInfo').bootstrapTable('refresh',{url:'SUser/queryalluser.asp?user_no='+user_no+
					'&user_name='+escape(encodeURIComponent(user_name))+'&login_name='+login_name+'&state='+state+'&user_belong='+user_belong});
			});
	//onclick="openInnerPageTab('add_user','创建用户','pages/suser/suser_add.html')"
	$("#addUser").click(function(){
		pageDispatchUser(this,"addUser","");
	});
	$("#reset").click(function() {
		$("input[name^='SUSER.']").val("");
		$("select[name^='SUSER.']").val("");
		$("#SQuser_state").val("");
		$("#SQuser_state").select2();
		$("#SQuser_belong").val("");
		$("#SQuser_belong").select2();
	});
	$("#delteUser").click(function(){
		var id = $("#SUserTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.user_no;                  
		});
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		nconfirm("确定要删除该数据吗?",function(){
			var url="SUser/delteuser.asp?user_no="+ids;
			$.ajax({
				type : "post",
				url : url,
				async :  false,
				data : "",
				dataType : "json",
				success : function(msg) {
					alert("删除成功！");
						var user_no = $("#user_no").val();
						var user_name = $("#user_name").val();
						var login_name = $("#login_name").val();
						var state = $.trim($("#SQuser_state").val());
						var user_belong = $.trim($("#SQuser_belong").val());
						$('#SUserTableInfo').bootstrapTable('refresh',{url:'SUser/queryalluser.asp', query: {user_no: user_no, user_name: user_name, login_name:login_name, state:state, user_belong:user_belong}});
				},
				error : function() {	
					alert("删除失败！");
					var user_no = $("#user_no").val();
					var user_name = $("#user_name").val();
					var login_name = $("#login_name").val();
					var state = $.trim($("#SQuser_state").val());
					var user_belong = $.trim($("#SQuser_belong").val());
					$('#SUserTableInfo').bootstrapTable('refresh',{url:'SUser/queryalluser.asp', query: {user_no: user_no, user_name: user_name, login_name:login_name, state:state, user_belong:user_belong}});
				}
			});
		});
	});

	//修改按钮功能
	$("#updateUser").click(function(){
		var id = $("#SUserTableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.user_no;                    
		});
		pageDispatchUser(this,"updateUser",ids);
	});
	//查看详情按钮功能
	$("#viewUserInfo").click(function(){
		var id = $("#SUserTableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.user_no;                    
		});
		pageDispatchUser(this,"viewUserInfo",ids);
	});
	//生成用户权限
	$("#permissionUser").click(function(){
		var id = $("#SUserTableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.user_no;                    
		});
		baseAjax("SPerm/addUserPerm.asp",{crtype:"byuser",crobj:ids[0]},function(data){
			if(data==undefined||data.result=="false"){
				alert("权限生成失败!");
			}else{
				alert("权限生成成功!");
			}
		});
	});
	
//	$("#userReport").click(function(){
//		openInnerPageTab("userReport","用户报表","report/userReport.asp",function(){
//			
//		});
//	});
}

//查询列表显示table
function initSUserInfo() {
/*	var user_no = $("#user_no").val();
	var user_name = $("#user_name").val();
	var login_name = $("#login_name").val();
	var state = $.trim($("#SQuser_state").val());
	var user_belong = $.trim($("#SQuser_belong").val());*/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#SUserTableInfo").bootstrapTable({
		//请求后台的URL（*）
		url : 'SUser/queryalluser.asp',
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "user_no", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [ {
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'user_no',
			title : '用户编号',
			align : "center"
		}, {
			field : "user_name",
			title : "用户名称",
			align : "center"
		}, {
			field : "login_name",
			title : "登陆名",
			align : "center"
		}, {
			field : "state",
			title : "用户状态",
			align : "center"
		}, {
			field : "user_belong",
			title : "用户属性",
			align : "center"
		}, {
			field : "org_no_name",
			title : "所属部门",
			align : "center"
		}, {
			field : "user_mail",
			title : "用户邮箱",
			align : "center"
		}, {
			field : "user_level",
			title : "用户等级",
			align : "center"
		} ]
	});
};
	
//下拉框方法
function initSUserType(){
	//初始化数据
	initSelect($("#SQuser_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERSTATE"});
	initSelect($("#SQuser_belong"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USER_BELONG"});
	initSelect($("#Aflag"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"});
}
//跳转方法
function pageDispatchUser(obj,key,params){
	var p = params;
	if("addUser"==key){
		newOpenTab("add_user","创建用户","pages/suser/suser_add.html");
		return;
	}else { 
		baseAjax("SUser/queryoneuser.asp?user_no="+p, null , function(data) {
		if("updateUser"==key){
		newOpenTab("updage_user","修改用户","pages/suser/suser_update.html",function(){
				for ( var k in data) {
					if(k=='memo'){
						$("textarea[name='UDUS." + k + "']").val(data[k]);
					}else if(k=='state'||k=='user_post'){
						$("select[name^='UDUS.']").val(data[k]);
					}else{
						$("input[name='UDUS." + k + "']").val(data[k]);
					}
				}
				initUpdateUserInfoEvent();
				initSUserType(data.state,data.user_post,data.user_level,data.user_belong);
			});
		}else if("viewUserInfo"==key){
			newOpenTab("suser_view","查看用户","pages/suser/suser_view.html");
			initviewUserInfo(data);
		}
	});
	}
}

function initOrgUserTree(clickCallback) {
	$("#selected").empty();
	$("#unselected").empty();
	var setting = {
			async : {
				enable : true,
				url : "SOrg/queryorgtreelist.asp",
				contentType : "application/json",
				type : "get"
			},
			view : {
				dblClickExpand : false,
				showLine : true,
				selectedMulti : false
			},
			data : {
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "pid",
					rootPId : ""
				}
			},
			callback : {
				onClick : function(event, treeId, treeNode) {//点击后查询数据方法
					clickCallback(treeNode.id);
				}
			}
	};
	$.fn.zTree.init($("#treeOrgRole"), setting);
	
}

initQueryUserButtonEvent();
initSUserInfo();
initSUserType();
