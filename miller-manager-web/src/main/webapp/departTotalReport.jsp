<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ taglib uri="/reportJsp/runqianReport4.tld" prefix="report" %>
<!-- <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> -->

<%
StringBuffer s=new StringBuffer();
String url="http://"+s.append(request.getServerName()).append(":").append(request.getServerPort()).append(request.getContextPath()).toString();
%>
<html>
<head>
<meta charset="UTF-8" />
<script type="text/javascript" src="js/jquery/jquery-1.9.1/jquery.min.js"></script>
<link rel="stylesheet" href="bootstrap/css/bootstrap.css" />
<link rel="stylesheet" href="bootstrap/css/matrix-style.css" />
<link rel="stylesheet" href="bootstrap/css/select2.css" />
<link href="bootstrap/css/bootstrap-table.min.css" rel="stylesheet">
<script src="bootstrap/js/bootstrap-table.min.js"></script>
<script src="bootstrap/js/select2.min.js"></script>
<script src="bootstrap/js/bootstrap-table-zh-CN.js"></script>
<link rel="stylesheet" type="text/css" href="css/style.css"/>
<link rel="stylesheet" type="text/css" href="css/zebra_dialog.css"/>

<script src="js/artTemplate/template.js"></script>
<script src="js/commons/commons.js"></script>
<link rel="stylesheet" type="text/css" href="css/public.css"/>
<script type="text/javascript" src="js/My97DatePicker/WdatePicker.js"></script>
<script language=javascript src="js/runqianReport_fy.js"></script>
<script src="bootstrap/js/bootstrap.min.js"></script>
<script src="pages/suser/suserPop.js"></script>
<script src="pages/sorg/sorgPop.js"></script>
 
</head>
<body>
<h3  class="header-h3">报表查询</h3>
<div id="test1" style="width:100%;height:auto;">
		<div class="row">
			<div class="span6 h50">
				<label class="pl45" style="float:left;">任务部门：</label> 
				<input type="text"  class="span3" style="height:30px;" name="T.execute_dept_name" id="execute_dept_name"   placeholder="点击选择机构"/>
				<input type="hidden"   name="T.execute_dept" id="execute_dept" >
			</div>
		</div>
		<div class="row">
				<div class="span6 h50">
					<label class="pl45" style="float:left;">任务开始时间：</label> 
					<input type="text" class="span3" style="height:30px;"  name="T.plan_starttime" id="plan_starttime"  />
				</div>
				<div class="span6 h50">
					<label class="pl45" style="float:left;">任务结束时间：</label>
					<input type="text"  class="span3" style="height:30px;" name="T.plan_endtime" id="plan_endtime"  />
				</div>
			</div>
		<div class="main_btn">
			<button type="button" id="query" class="btn-gray">查询</button>
			<button type="button" id="reset" class="btn-gray">重置</button>
		</div>
	<h3  class="header-h3"></h3>
	<div  id="test" style="width:100%; height:100% ">
			<script  language=javascript>
	             var report = new runqianReport( "100%", "100%" );
	             report.setBorder( "border:1px solid blue" );  //设置控件为兰色细边框
	             report.setServerURL('<%=url %>');
	   		</script>
	</div>
</div>
<div id="reportDivOrginfo"></div>

<script type="text/javascript">
	$(document).ready(function(){
		$("#query").click(function(){
			report.init(); //初始化报表控件
			report.setFile("depart_total_report.raq");//设置要显示的报表文件   
			report.setSaveAsName("部门维度汇总表");
			report.putParam("USER_ID","<%=request.getParameter("currentUserId")%>");
			report.putParam("ORG_CODE","<%=request.getParameter("currentOrgNo")%>");
			var execute_dept = $("#execute_dept").val();
			report.putParam("EXECUTE_DEPT",execute_dept);
			var plan_starttime = $("#plan_starttime").val();
			var plan_endtime = $("#plan_endtime").val();
			//时间格式兼容
			if(plan_starttime == null || plan_starttime ==""){
				plan_starttime="1970-01-01";
			}
			if(plan_endtime == null || plan_endtime ==""){
				plan_endtime="2099-01-01";
			}
			report.putParam("CREATE_TIME_S",plan_starttime);
			report.putParam("CREATE_TIME_E",plan_endtime);
			//alert('<%=request.getParameter("currentUserId")%>' + '----'+ $("#execute_dept").val() +'----'+plan_starttime+'----'+plan_endtime);
			report.display(); //显示报表
		});

		$("#reset").click(function() {
			$("input[name^='T.']").val("");
		});
	});

	//时间控件
	function initDate(){
		$("#plan_starttime").focus(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd',
				minDate : '1990-01-01',
				maxDate : '2050-12-01'
			});
		});
		$("#plan_endtime").focus(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd', 
				minDate : '1990-01-01',
				maxDate : '2050-12-01'
			});
		});
	}
	function initTaskReportPopEvent(){
		$("#execute_dept_name").click(function(){
			openSOrgPop("reportDivOrginfo",{name:$("#execute_dept_name"),no:$("#execute_dept")});
		});
	}
	initDate();
	initTaskReportPopEvent();
</script>
</body>
</html>
