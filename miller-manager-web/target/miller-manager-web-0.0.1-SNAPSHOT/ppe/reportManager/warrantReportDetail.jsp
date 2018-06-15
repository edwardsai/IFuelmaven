<%@ page contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8" import="java.util.*,com.runqian.report4.model.ReportDefine"%>
<%@ taglib uri="/reportJsp/runqianReport4.tld" prefix="report" %>
<%@ page import="java.net.URLDecoder"%>

<html>
<body leftMargin=0 topMargin=0 rightMargin=0 bottomMargin=0>

<%
	request.setCharacterEncoding( "UTF-8");
	String file = request.getParameter( "file");
	String params = request.getParameter( "params");	
	params = java.net.URLDecoder.decode(params,"UTF-8");
	String[] paramArr = params.split(";");
	String querySql = "query(\"SELECT count(*) FROM wrt_warrant_stock where 1=1 ";
	for(String arg : paramArr){
		String[] param = arg.split("=");
		if(param.length>1){
			querySql += "and "+ param[0] +" like '%" + param[1] + "%' ";
		}
	}
	querySql +="\")";
	/* String pdfImage = "<img src='" + appmap + "/images/rq_pdf.gif' border=no style='vertical-align:middle' alt='存为Pdf'>"; */
%>
<!-- 增加分页按钮 -->

<!--<input name='print_btn' type='button' class='btn001' value='打印' onClick="report1_print();return false;"> -->
<%-- <report:html name="report1" reportFileName="<%=file%>"
	params="<%=params%>"
	excelPageStyle="0"
	needScroll="no"
	needPageMark="yes"
	selectText="yes"
	promptAfterSave="yes"
	funcBarLocation=""
	backAndRefresh="no"
	height="-1"
	needPrint="yes"
/> --%>
<report:extHtml totalCountExp="<%=querySql %>"
name="report_warrant"
reportFileName="<%=file%>"
params="<%=params%>"
pageCount="10"
/>
</body>
</html>
