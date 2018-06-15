//初始化按钮事件
function inituncomplianceManage(){
		$("#select_uncompliance").click(function(){
		var qualification = $.trim($("#Bqualification").val());
		var use_grade = $.trim($("#Buse_grade").val());
		var emp_post = $.trim($("#Bemp_post").val());
		$('#uncomplianceTable').bootstrapTable('refresh',
			{url:'SUncompliance/queryalluncompliance.asp?qualification='+qualification+
			'&use_grade='+use_grade+'&emp_post='+emp_post});
	});
		//重置按钮
		$("#reset_uncompliance").click(function() {
			initSUncompliance();
		});
		//新增功能跳转
		$("#add_uncompliance").click(function(){						
			pageDispatchCompliance(this,"add_uncompliance","");
			
		});	
			//修改功能跳转
		$("#update_uncompliance").click(function(){
			var id = $("#uncomplianceTable").bootstrapTable('getSelections');
			if(id.length!=1){
				alert("请选择一条数据进行修改!");
				return ;
			}
			var ids = $.map(id, function (row) {
				return row.ID;                    
			});
			pageDispatchCompliance(this,"update_uncompliance",ids);
		});
		//删除不合格配置
		$("#delete_uncompliance").click(function(e){
			if($("input[type='checkbox']").is(':checked')){			
				var num = $("#uncomplianceTable").bootstrapTable('getSelections');				
				var nums = $.map(num, function (row) {
					return row.ID;       
				});
				nconfirm("确定要删除该数据吗？",function(){
					$("#uncomplianceTable").bootstrapTable('remove', {
						field: 'ID',
						values: nums
					});	
					var url="SUncompliance/UncomplianceDelete.asp?id="+nums;
					$.ajax({
						type : "post",
						url : url,
						async :  true,
						data : "",
						dataType : "json",
						success : function(map) {
							$('#uncomplianceTable').bootstrapTable('refresh',{url:'SUncompliance/queryalluncompliance.asp'});
						},
						error : function() {	
							alert("删除失败！");
						}
					});
				});
			}else{
				e.preventDefault();
		        $.Zebra_Dialog('请选择一条数据进行删除!', {
		            'type':     'close',
		            'title':    '提示',
		            'buttons':  ['是'],
		            'onClose':  function(caption) {
		            	if(caption=="是"){
		            	}
		            }
		        });
			}
		});
}	
//查询列表显示table
function inituncompliance() {
	var qualification = $.trim($("#Bqualification").val());
	var use_grade = $.trim($("#Buse_grade").val());
	var emp_post = $.trim($("#Bemp_post").val());
			
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
				};
		return temp;
	};
			$("#uncomplianceTable").bootstrapTable(
					{
						//请求后台的URL（*）
						url : 'SUncompliance/queryalluncompliance.asp?qualification='+qualification+"&use_grade="+use_grade+"&emp_post="+emp_post,
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
						uniqueId : "id", //每一行的唯一标识，一般为主键列
						cardView : false, //是否显示详细视图
						detailView : false, //是否显示父子表
						singleSelect: true,
						onLoadSuccess:function(data){
							
						},
						columns : [ {
							field: 'middle',
							checkbox: true,
							rowspan: 2,
							align: 'center',
							valign: 'middle'
						},
					
						{
							field : 'ID',
							title : '序号',
							align : "center",
							formatter: function (value, row, index) {
								return index+1;
							}
						}, {
							field : "EMP_POST",
							title : "人员岗位",
							align : "center"
						},{
							field : 'USE_GRADE',
							title : '级别',
							align : "center"
						}, {
							field : "QUALIFICATION",
							title : "学历",
							align : "center",
							
						},{
							field : "MIN_YEARS",
							title : "最小工作年限",
							align : "center"
						} ,{
							field : "MAX_YEARS",
							title : "最大工作年限",
							align : "center"
						},{
							field : "FLAG",
							title : "启用标识",
							align : "center"
						}]
					});
}
			
 //跳转方法(新增或修改)
	function pageDispatchCompliance(obj,key,params){
		var p = params;
		if("add_uncompliance"==key){
			newOpenTab("adduncompliance","新增不合格配置","pages/susermanage/suncompliance/uncompliance_add.html");
			return;
		}else if("update_uncompliance"==key){
			newOpenTab("update_uncompliance","修改不合格配置","pages/susermanage/suncompliance/uncompliance_update.html",function(){
				baseAjax("SUncompliance/queryoneUncompliance.asp?id="+p, null , function(data) {
					for ( var k in data) {
						if(k==''){
							$("textarea[name='HG." + k + "']").val(data[k]);
						}else if(k=='flag'||k=='use_grade'||k=='qualification'||k=='emp_post'){
							$("select[name^='HG.']").val(data[k]);
						}else{
							$("input[name='HG." + k + "']").val(data[k]);
						}
					}
					initUpdateuncompliance();
					initupuncomplianceType(data.emp_post,data.use_grade,data.qualification,data.flag);
				});
			});
		}
	}
	//初始化下拉列表数据
	function initSUncompliance(){
		initSelect($("#Bqualification"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"E_DIC_QUALIFICATION"});
		initSelect($("#Buse_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"EST_USE_GRADE"});
		initSelect($("#Bemp_post"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"E_DIC_EMP_POST"});
	}			
		
inituncomplianceManage();
inituncompliance();
initSUncompliance();