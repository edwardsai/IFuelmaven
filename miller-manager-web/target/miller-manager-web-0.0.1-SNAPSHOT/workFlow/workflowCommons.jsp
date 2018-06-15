<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=request.getAttribute("title") %></title>
<link  href="bootstrap/css/bootstrap-table.min.css" rel="stylesheet">
<link rel="stylesheet" href="bootstrap/css/matrix-style.css" />
<link rel="stylesheet" type="text/css" href="css/public.css"/>
<link rel="stylesheet" type="text/css" href="css/jquery.datetimepicker.css"/>
<link rel="stylesheet" type="text/css" href="task_mytable/task_mytable.css" />

<style type="text/css">
	.search-btn{
		margin:10px;
	}
	.flowChart ul.flowChartImg{margin:15px auto;text-align:center;}
	.det{margin:15px auto;text-align:center;}
	
	.det li{width:166px;list-style:none;font-weight:bold;font-size: 15px;display: inline-block;}
	.flowChart ul.flowChartImg li{position: relative;
    height: 60px;
    width: 60px;
    border: 1px solid #272636;
    background: url(images/touxiang.png) no-repeat;
    background-size: 35px;
    background-position: 50%;
    display: inline-block;
    border-radius: 50%;}
	.flowChart ul.flowChartImg li img{position: absolute;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    bottom: 12px;
    right: 8px;
    display: inline-block;
    background: #fff;}
	
	/* .flowChart ul li:hover img{width:40px;height:40px;} */
	
	.flowChart ul.flowChartImg li img{cursor: pointer;transition: all 0.6s;  }
    .flowChart ul.flowChartImg li:hover img{transform: scale(1.5); }  
    .jiantouTit{width:100px;height:64px;background:url(images/jiantou.png) no-repeat;background-size:30px;display:inline-block;background-position: 50%;background-size: 25px;}
</style>
</head>
<body>
<div style="margin-bottom:50px">
	<h3  class="header-h3"><%=request.getAttribute("title")%></h3>
	<div class="flowChart">
		<ul class="flowChartImg" id="wf_headerPic">
			<li><img alt="" src="images/gou.png"></li>
				<div class="jiantouTit"></div>
			<li><img alt="" src="images/gou.png"></li>
				<div class="jiantouTit"></div>
			<li><img alt="" src="images/close.png"></li>
		</ul>
		<ul class="det" id="wf_headerTitle" >
			<li style="width: 170px;">项目经理</li>
			<li style="width: 179px;">部门经理</li>
			<li style="width: 154px;">综合管理部</li>
		</ul>
		<div style="clear:both;">
			
		</div>
	</div>
	<iframe src="<%=request.getAttribute("url")%>" width="100%" frameBorder="no" height="<%=request.getAttribute("height")%>">
	
	</iframe>
	
<h3  class="header-h3">流程审批</h3>
<!-- table开始 -->
<table class="table-list table-striped table-hover " style="margin-bottom: 0px;margin-left:10px;font-size:14px;">
			<tbody id="wfTableBody">
				<tr>
					<td class="newStyle" style="font-weight:700;">
						<span>审批岗位</span>
					</td>
					<td class="newStyle" style="font-weight:700;">
						<span>审批人</span>
					</td>
					<td class="newStyle" style="font-weight:700;">
						<span>审批情况</span>
					</td>
					<td class="newStyle" style="font-weight:700;">
						<span>审批操作</span>
					</td>
					<td class="newStyle" style="font-weight:700;">
						<span>审批意见</span>
					</td>
					<td class="newStyle" style="font-weight:700;">
						<span>审批时间</span>
					</td>
				</tr>
			</tbody>
		</table>
<!-- table结束 -->
		<div id="historyRecordOpt"><a onclick="javascript:$page().find('#wf_history_record').modal('show');" style="cursor: pointer;color: red;">查看历史审批记录</a></div>
	<br>
	<div  align="center">
		<button class="btns" type="button"  id="backToAtherList"  >返回</button>
	</div>
	
	<!-- 审批 -->	
	<div id="wf_app_pop_window" class="modal hide fade" tabindex="-1" role="dialog" 
	  aria-labelledby="myModalLabel" aria-hidden="true" style="top:30%;">
	  <div class="modal-header">
	    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	    <h3>审批处理</h3>
	  </div>
	  <div class="modal-body">
		  <div class="tabbable"> <!-- Only required for left/right tabs -->
			<table class="table table-striped table-hover tablesty" >
				<tbody>
					<tr>
						<td class="tableColumnName" style="width:20%">
							<span>审批意见：<i class="red">*</i></span>
						</td>
						<td>
					        <select id="wf_app_state" style="width:40%"  id="list" onchange="changeStatus(this.value)">
					        	<option>请选择</option>
								<option value="00">同意</option>
								<option value="01">打回</option>
					        </select>
						</td>
					</tr>
					<tr>
						<td class="tableColumnName">
							<span>审批说明：</span>
						</td>
						<td colspan="5">
							<textarea rows="3" id="wf_app_content"style="width:80%;resize: none;" ></textarea>
						</td>
					</tr>
				</tbody>
			</table>
		  </div>
	  </div>
	<div style="text-align:center;">
			<button type="button" id="wf_app_pop_submit"data-dismiss="modal" aria-hidden="true" class="btns">提交</button>
			<button class="btns"  data-dismiss="modal" aria-hidden="true">关闭</button>
	</div>
	<div class="modal-footer"></div>
	</div>
	<!-- 历史审批记录 -->	
	<div id="wf_history_record" class="modal hide fade" tabindex="-1" role="dialog" 
					aria-labelledby="myModalLabel" aria-hidden="true" style="top:28%;left:50%;margin-left:-400px;width:800px;">
	  <div class="modal-header">
	    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	    <h3>历史审批记录</h3>
	  </div>
	  <div class="modal-body">
		 <div id="historyRecordTable"></div>
	  </div>
	<div class="modal-footer">
		<div style="text-align:center;">
				<button class="btns"  data-dismiss="modal" aria-hidden="true">关闭</button>
		</div>
	</div>
	</div>
</div>
<script src="task_mytable/task_mytable.js"></script>

<script type="text/javascript">
/**显示历史记录**/
function showHisoryRecord(){
	var columns=[{
		field : 'N_NAME',
		title : '审批岗位',
		align : "center",
		formatter:function(index,column,row,field){
			return "<span rid='"+row["INSTANCE_ID"]+row["N_ID"]+"'>"+row[field]+"</span>";
		}},
		{
		field : 'USER_NAME',
		title : '审批人',
		align : "center",
		formatter:function(index,column,row,field){
			return getPersonRole(row['role_name'])+row[field];
		}},
		{
		field : 'APP_STATE_NAME',
		title : '审批情况',
		align : "center"},
		{
		field : 'APP_CONTENT',
		title : '审批意见',
		align : "center"},
		{
		field : 'OPT_TIME',
		title : '审批时间',
		align : "center"},
		{
		field : 'WF_NAME',
		title : '审批流程',
		align : "center"}
	];
	var config={
			columns:columns,
			url:"WFApp/findWFHistoryAppRecord.asp?bizId="+"<%=request.getAttribute("bizId")%>",
			pagesize:5,
			queryParams:{},
			dblclick:function(index,row){
			},
			click:function(index,row){},
			loadSuccess:function(data){
				if(!data||!data.total||data.total=="0"){
					$page().find("#historyRecordOpt").hide();
					return;
				}
				mergeTD("span[rid]","rid",function(v,l){
					$page().find("span[rid='"+v+"']:eq(0)").parents("td").attr("rowspan",l);
			  		$page().find("span[rid='"+v+"']:gt(0)").parents("td").remove();
				});
			}
	};
	$page().find("#historyRecordTable").TaskMytable(config);
}
showHisoryRecord();

/**审批通过**/
$(document).on("click","span[class='pass']",function(){
	$page().find("#wf_app_state").val("00");//默认同意
	$page().find("#wf_app_state").select2();
	$page().find("#wf_app_pop_window").modal("show");
});
/**审批打回**/
$(document).on("click","span[class='reject']",function(){
	$page().find("#wf_app_state").val("01");//默认打回
	$page().find("#wf_app_state").select2();
	$page().find("#wf_app_pop_window").modal("show");
});

(function(){
	$page().find("#wf_app_pop_submit").unbind("click");
	$page().find("#wf_app_pop_submit").click(function(){
		var param={bizId:"<%=request.getAttribute("bizId")%>"};
		param["app_state"]=$page().find("#wf_app_state").val();
		param["app_content"]=$page().find("#wf_app_content").val();
		appWorkFlow(param,function(){
			initWFData();
		});
	});
})();

</script>
<script type="text/javascript" src="bootstrap/js/select2.js"></script>
<script type="text/javascript" src="workFlow/startWorkFlowApp.js"></script>
<script type="text/javascript">
	/*初始化流程数据到页面*/
	function initWFData(){
		baseAjax("WFApp/queryWFAppRecord.asp",{bizId:"<%=request.getAttribute("bizId")%>",instanceid:"<%=request.getAttribute("instanceid")%>"},function(data){
			wf_header(data);
			wf_dataTable(data);
		});
	}
	initWFData();
	/**初始化头部**/
	function wf_header(data){
		if(data&&data.length&&data.length>0){
			var wf_headerTitle=$page().find("#wf_headerTitle");
			wf_headerTitle.empty();
			wf_headerTitle.append('<li style="width: 170px;">'+data[0]["N_NAME"]+'</li>');
			
			var wf_headerPic=$page().find("#wf_headerPic");
			wf_headerPic.empty();
			wf_headerPic.append('<li><img alt="" src="'+getPic(data[0]["APP_STATE"])+'"></li>');
			var nids={};
			for(var i=1;i<data.length;i++){
				if(!nids[data[i]["N_NAME"]]){
					nids[data[i]["N_NAME"]]="1";
					wf_headerTitle.append('<li style="width: 165px;">'+data[i]["N_NAME"]+'</li>');		
					wf_headerPic.append('<div class="jiantouTit"></div>');
					wf_headerPic.append('<li><img alt="" src="'+getPic(data[i]["APP_STATE"])+'"></li>');
				}
			}
		}
	}
	var currentUserId="<%=request.getAttribute("userId")%>";
	/**初始化头部表格**/
	function getPic(state){
		if(state){
			return "images/gou.png";
		}
		return "images/close.png";
	}
	
	var appTableNIDS={};
	/**
	 *初始化审批列表 
	 **/
	function wf_dataTable(data){
		if(data&&data.length&&data.length>0){
			$page().find("#wfTableBody tr:gt(0)").remove();
			var wfTableBody=$page().find("#wfTableBody");
			for(var i=0;i<data.length;i++){
				appTableNIDS[data[i]["N_ID"]]=data[i]["N_ID"];
				var tr='<tr class="tit" id="toSee" app_state='+(data[i]["APP_STATE"]||"")+'>'
						+'<td n_id='+data[i]["N_ID"]+'><span>'+data[i]["N_NAME"]+'</span></td>'
						+'<td><span>'+getPersonRole(data[i]["role_name"])+data[i]["PERSON_NAME"]+'</span></td>'
						+'<td><span>'+(data[i]["STATE_NAME"]||"--")+'</span></td>'
						+'<td class=app_wf>'+getWFAppOptHtml(data[i]["APPING"],data[i]["APP_PERSON"])+'</td>'
						+'<td><span>'+(data[i]["APP_CONTENT"]||"--")+'</span></td>'
						+'<td><span>'+(data[i]["OPT_TIME"]||"--")+'</span></td>'
						+'</tr>';
				wfTableBody.append(tr);
			}
			mergeTD("td[n_id]","n_id",function(v,l){
				$page().find("td[n_id='"+v+"']:eq(0)").attr("rowspan",l);
				$page().find("td[n_id='"+v+"']:gt(0)").remove();
			});
		}
	}
	/**
	 *生成审批操作
	 **/
	function getWFAppOptHtml(apping,app_person){
		if("apping"==apping&&currentUserId==app_person){
			return '<span style="color:#0088cc;" class=pass>批准</span> | <span style="color:#0088cc;" class=reject>拒绝</span>';
		}
		return '--';
	}
	/**
		返回按钮
	*/
	function backToEntranceList(){
		var backurl = "<%=request.getAttribute("backurl")%>";
		var tabnum = "<%=request.getAttribute("tabnum")%>";
		var title_list = "<%=request.getAttribute("title_list")%>";
		//页面返回按钮
		$page().find("#backToAtherList").click(function(){
			newOpenTab(tabnum,title_list,backurl,function(){});
		});
	}
	backToEntranceList();
</script>
</body>
</html>