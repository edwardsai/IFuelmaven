initWarrantReport();

function initWarrantReport(){
	//加载字典项
	autoInitSelect($("#warr_status_warrantReportDetail"));
	getWarrantReport(getWarrantParams());
	$("#query_warrantReportDetail").click(function(){
		var params = getWarrantParams();
		getWarrantReport(params);
	});
	$("#reset_warrantReportDetail").click(function(){
		$("#warrant_no_warrantReportDetail").val("");
		$("#warr_status_warrantReportDetail").val("");
		$("#tag_id_warrantReportDetail").val("");
		$("#contract_no_warrantReportDetail").val("");
		$("#machine_room_warrantReportDetail").val("");
		$("#cab_num_warrantReportDetail").val("");
	});
}

function getWarrantParams(){
	var params = "";
	params += "warrant_no="+ $("#warrant_no_warrantReportDetail").val();
	params += ";warr_status=" + $.trim($("#warr_status_warrantReportDetail").val());
	params += ";tag_id=" + $("#tag_id_warrantReportDetail").val();
	params += ";contract_no=" + $("#contract_no_warrantReportDetail").val();
	params += ";tag_id=" + $("#tag_id_warrantReportDetail").val();
	params += ";cab_num=" + $("#cab_num_warrantReportDetail").val();
	return {file:"ppe_detail.raq", params:params, needFunctionBar :0 };
}
function getWarrantReport(params){
	startLoading();
	$.post("ppe/reportManager/warrantReportDetail.jsp", params, function(data){
		endLoading();
		$("#reportWarrantDetail").html(data);
		//隐藏分页数据
		$($("#reportWarrantDetail").find("table").get(0)).hide();
		$($("#reportWarrantDetail").find("table").get(1)).addClass("table");
		//总页数为一时隐藏分页
		if(report_warrant_getTotalPage()==1){
			$("#e_c_pageInfo").hide();
		}
		//回显页数
		$("#e_c_page_span").text(report_warrant_getCurrPage());
		$("#e_t_page_span").text(report_warrant_getTotalPage());
		//消除显示
		$("#reportWarrantDetail").find("div[class=report_warrant]").hide();
	});
}

function warrant_toPage(pageNum){
	if(pageNum<1){
		pageNum = 1;
	} else if(pageNum>report_warrant_getTotalPage()){
		pageNum = report_warrant_getTotalPage();
	}
	var params = getWarrantParams();
	var totalCount = $($("#reportWarrantDetail").find("input[name=_total_count_]").get(0)).val();
	var reportParamsId = $($("#reportWarrantDetail").find("input[name=reportParamsId]").get(0)).val();
	params.report_warrant_currPage = pageNum;
	params._total_count_ = totalCount;
	params.reportParamsId = reportParamsId;
	getWarrantReport(params);
}