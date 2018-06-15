// 基础信息 -->> 机构
function basiOrg() {
	var str=$('#jt').attr('class');
	if(str=='jts'){
		$("#jt").removeClass("jts");
		$("#jt").addClass("jt");
	}
	$(".list_tree_nav div").hide();
	$(".main_container").show();
	$("#content").addClass("main_iframe");
	$("#content").removeClass("main_iframes");
	var html = "";
	var list = document.getElementById("list");
	html += "<div class='nui-tree-item-label nui-ico-xt'>"
			+ "<span class='black'>基础信息</span></div><ul>"
			+ "<li><div class='nui-tree-item-label pl15 tit' onclick='chebox(this)'>"
			+ "<span class='nui-tree-item-symbol'><i class='icon-chevron-down'></i>"
			+ "</span><span>机构管理</span></div>"
			+ "<ul style='display:none;'><li>" 
			+"<div class='nui-tree-item-label pl30' onclick='bank_org2(this)'>"
			+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
			+"</span><span>机构部门维护</span></div></li><li>"
			+"<div class='nui-tree-item-label pl30' onclick='toBasiOrgList(this)'>"
			+ "<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
			+ "</span><span>机构列表</span></div></li><li>"
			+ "<ul><li><div class='nui-tree-item-label pl30' onclick='toDeptList(this)'>"
			+ "<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
			+ "</span><span>部门列表</span></div></li><li>"			
			+"<div class='nui-tree-item-label pl30' onclick='toOrgScreen(this)'>"
			+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
			+"</span><span>按机构查询</span></div></li><li>"
			+"<div class='nui-tree-item-label pl30' onclick='toOrgScreenByDept(this)'>"
			+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
			+"</span><span>按部门查询</span></div></li><li>"
			+"<div class='nui-tree-item-label pl35' onclick='chebox(this)'>"
			+"<span class='nui-tree-item-symbol'><i class='icon-chevron-down'></i>"
			+"</span><span>机构同步信息</span></div><ul style='display:none;'><li><div class='nui-tree-item-label pl45' onclick='newOrgList(this)'>"
			+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right' ></i>"
			+"</span><span>新增机构列表</span></li><li><div class='nui-tree-item-label pl45' onclick='cancelOrgList(this)'>"
			+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
			+"</span><span>撤销机构列表</span></li><li><div class='nui-tree-item-label pl45' onclick='togetherOrgList(this)'>"
			+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
			+"</span><span>合并机构列表</span></li><li><div class='nui-tree-item-label pl45' onclick='updateOrgList(this)'>"
			+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
			+"</span><span>修改机构列表</span></li>"
			+"</ul></li><li>"
			+"<div class='nui-tree-item-label pl35' onclick='chebox(this)'>"
			+"<span class='nui-tree-item-symbol'><i class='icon-chevron-down'></i>"
			+"</span><span>部门同步信息</span></div><ul style='display:none;'><li><div class='nui-tree-item-label pl45' onclick='newDeptList(this)'>"
			+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right' ></i>"
			+"</span><span>新增部门列表</span></li><li><div class='nui-tree-item-label pl45' onclick='cancelDeptList(this)'>"
			+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
			+"</span><span>撤销部门列表</span></li><li><div class='nui-tree-item-label pl45' onclick='togetherDeptList(this)'>"
			+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
			+"</span><span>合并部门列表</span></li><li><div class='nui-tree-item-label pl45' onclick='updateDeptList(this)'>"
			+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
			+"</span><span>修改部门列表</span></li>"
			+"</ul></li></ul></li></ul>";
	list.innerHTML = html;
}
function baseAction(){
	
}
function toBasiOrgList(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='basicInfo/orgManager/orgList.html'></iframe>");
}
function toOrgScreen(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='basicInfo/orgManager/orgScreen.html'></iframe>");
}
function toOrgScreenByDept(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='basicInfo/orgManager/orgScreenByDept.html'></iframe>");
}
//新增机构列表
function newOrgList(val) {
	$('.pl45').find("span").removeClass("fontcol");
	$('.pl45').find("i").removeClass("iconbgf");
	$('.pl45').find("i").addClass("iconbgb");
	$('.pl45').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='system/org/OrgSynchronization/bank_orgnew.html'></iframe>");
}
//新增部门列表
function newDeptList(val) {
	$('.pl45').find("span").removeClass("fontcol");
	$('.pl45').find("i").removeClass("iconbgf");
	$('.pl45').find("i").addClass("iconbgb");
	$('.pl45').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='system/org/DepartmentSynchronization/addDepartmentList.html'></iframe>");
}
//撤销机构列表
function cancelOrgList(val) {
	$('.pl45').find("span").removeClass("fontcol");
	$('.pl45').find("i").removeClass("iconbgf");
	$('.pl45').find("i").addClass("iconbgb");
	$('.pl45').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='system/org/OrgSynchronization/bank_orgdel.html'></iframe>");
}
//撤销部门列表
function cancelDeptList(val) {
	$('.pl45').find("span").removeClass("fontcol");
	$('.pl45').find("i").removeClass("iconbgf");
	$('.pl45').find("i").addClass("iconbgb");
	$('.pl45').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='system/org/DepartmentSynchronization/RevokeDepartment.html'></iframe>");
}
//合并机构列表
function togetherOrgList(val) {
	$('.pl45').find("span").removeClass("fontcol");
	$('.pl45').find("i").removeClass("iconbgf");
	$('.pl45').find("i").addClass("iconbgb");
	$('.pl45').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='system/org/OrgSynchronization/bank_orghblist.html'></iframe>");
}
//合并部门列表
function togetherDeptList(val) {
	$('.pl45').find("span").removeClass("fontcol");
	$('.pl45').find("i").removeClass("iconbgf");
	$('.pl45').find("i").addClass("iconbgb");
	$('.pl45').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='system/org/DepartmentSynchronization/CombineDepartment.html'></iframe>");
}
//修改机构列表
function updateOrgList(val) {
	$('.pl45').find("span").removeClass("fontcol");
	$('.pl45').find("i").removeClass("iconbgf");
	$('.pl45').find("i").addClass("iconbgb");
	$('.pl45').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='system/org/OrgSynchronization/bank_orgupd.html'></iframe>");
}
//修改部门列表
function updateDeptList(val) {
	$('.pl45').find("span").removeClass("fontcol");
	$('.pl45').find("i").removeClass("iconbgf");
	$('.pl45').find("i").addClass("iconbgb");
	$('.pl45').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='system/org/DepartmentSynchronization/UpdateDepartment.html'></iframe>");
}
// 基础信息 -->> 部门管理
function basicDept(){
	var str=$('#jt').attr('class');
	if(str=='jts'){
		$("#jt").removeClass("jts");
		$("#jt").addClass("jt");
	}
	$(".list_tree_nav div").hide();
	$(".main_container").show();
	$("#content").addClass("main_iframe");
	$("#content").removeClass("main_iframes");
	var html="";
	var list=document.getElementById("list");
	html+="<div class='nui-tree-item-label nui-ico-xt'>"
		+"<span class='black'>基础信息</span></div><ul>"
		+"<li><div class='nui-tree-item-label pl15 tit'>"
		+"<span class='nui-tree-item-symbol'><i class='icon-chevron-down'></i>"
		+"</span><span>部门管理</span></div>"
		+"<ul><li><div class='nui-tree-item-label pl30' onclick='toDeptList(this)'>"
		+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
		+"</span><span>列表</span></div></li><li>";
	list.innerHTML=html;
}
function toDeptList(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='basicInfo/deptManager/deptList.html'></iframe>");
}
//预案管理新建
function toAddPlan(val){
	window.open('riskPrevention/planManagement/addPlan.html','_blank','width='+(window.screen.availWidth-15)+',height='+(window.screen.availHeight-60)+ ',top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes,location=no');
}
/*function toAddPlan(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='riskPrevention/planManagement/addPlan.html'></iframe>");
}*/
function toPlanList(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='riskPrevention/planManagement/planList.html'></iframe>");
}
function toPlanScreen(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='riskPrevention/planManagement/planScreen.html'></iframe>");
}
//应急演练管理新建
function toAddEmergency(val){
	window.open('riskPrevention/emergencyManagement/addEmergency.html','_blank','width='+(window.screen.availWidth-15)+',height='+(window.screen.availHeight-60)+ ',top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes,location=no');
}
/*function toAddEmergency(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='riskPrevention/emergencyManagement/addEmergency.html'></iframe>");
}*/
function toEmergencyList(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='riskPrevention/emergencyManagement/emergencyList.html'></iframe>");
}
function toEmergencyScreen(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='riskPrevention/emergencyManagement/emergencyScreen.html'></iframe>");
}
//安全教育管理新建
function toAddSafetyEducation(val){
	window.open('riskPrevention/safetyEducationManagement/addSafetyEducation.html','_blank','width='+(window.screen.availWidth-15)+',height='+(window.screen.availHeight-60)+ ',top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes,location=no');
}
/*function toAddSafetyEducation(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='riskPrevention/safetyEducationManagement/addSafetyEducation.html'></iframe>");
}*/
function toSafetyEducationList(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='riskPrevention/safetyEducationManagement/safetyEducationList.html'></iframe>");
}
function toSafetyEducationScreen(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='riskPrevention/safetyEducationManagement/safetyEducationScreen.html'></iframe>");
}
function toSafetyEducation_printing(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='riskPrevention/safetyEducationManagement/safetyEducation_printing.html'></iframe>");
}
function toStatisticsByHiddenDanger(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='safeCheck/Statistics/statisticsByHiddenDanger/statisticsByHiddenDanger.html'></iframe>");
}
function toStatisticsByRectification(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='safeCheck/Statistics/statisticsByRectification/statisticsByRectification.html'></iframe>");
}
function toStatisticalInterface(val) {
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='safeCheck/Statistics/statisticsByMatter/statisticalInterface.html'></iframe>");
}
function toStatisticsPart(val){
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("<iframe class='centent_main' src='safeCheck/Statistics/statisticsByMatter/statisticsPart.html'></iframe>");
}
function basicPerson(){
	var str=$('#jt').attr('class');
	if(str=='jts'){
		$("#jt").removeClass("jts");
		$("#jt").addClass("jt");
	}
	$(".list_tree_nav div").hide();
	$(".main_container").show();
	$("#content").addClass("main_iframe");
	$("#content").removeClass("main_iframes");
	var html="";
	var list=document.getElementById("list");
	html+="<div class='nui-tree-item-label nui-ico-xt'>"
		+"<span class='black'>基础信息</span></div><ul>"
		+"<li><div class='nui-tree-item-label pl15 tit'>"
		+"<span class='nui-tree-item-symbol'><i class='icon-chevron-down'></i>"
		+"</span><span>人员管理</span></div>"						
		+"<ul><li><div class='nui-tree-item-label pl30' onclick='toPersonList(this)'>"
		+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
		+"</span><span>人员信息列表</span></li><li><div class='nui-tree-item-label pl30' onclick='toSecurityPersonList(this)'>"
		+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
		+"</span><span>辖区保卫人员列表</span></li></ul></li></ul></li></ul>"
	
	+"<ul><li><div class='nui-tree-item-label pl30' onclick='toPersonScreen(this)'>"
	+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
	+"</span><span>查询</span></div></li></ul>"
	+"<ul><li><div class='nui-tree-item-label pl30' onclick='bank_user3(this)'>"
	+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
	+"</span><span>未同步人员列表</span></div></li></ul>"
	+"<ul><li><div class='nui-tree-item-label pl30' onclick='bank_user2(this)'>"
	+"<span class='nui-tree-item-symbol'><i class='icon-arrow-right'></i>"
	+"</span><span>人员维护</span></div></li></ul>";
	list.innerHTML=html;
	$("#content").html("");
	$("#content").html("<iframe class='centent_main' src='basicInfo/personManager/personList.html'></iframe>");
}
//机构管理详细跳转
function bank_org2(val){
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("");
	$("#content").html("<iframe class='centent_main' src='system/org/BankOrg.html'></iframe>");
}
function toPersonList(val){
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("");
	$("#content").html("<iframe class='centent_main' src='basicInfo/personManager/personList.html'></iframe>");
}
function toSecurityPersonList(val){
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("");
	$("#content").html("<iframe class='centent_main' src='basicInfo/personManager/securityPersonList.html'></iframe>");
}
//机构管理详细跳转
function bank_user2(val){
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("");
	$("#content").html("<iframe class='centent_main' src='system/user/bank_userlist.html'></iframe>");
}
//机构管理详细跳转
function bank_user3(val){
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("");
	$("#content").html("<iframe class='centent_main' src='system/user/bank_userlistadd.html'></iframe>");
}

function toPersonScreen(val){
	$('.pl30').find("span").removeClass("fontcol");
	$('.pl30').find("i").removeClass("iconbgf");
	$('.pl30').find("i").addClass("iconbgb");
	$('.pl30').removeClass("leftmainbg");
	$(val).addClass("leftmainbg");
	$(val).find("i").removeClass("iconbgb");
	$(val).find("i").addClass("iconbgf");
	$(val).find("span").addClass("fontcol");
	$("#content").html("");
	$("#content").html("<iframe class='centent_main' src='basicInfo/personManager/personScreen.html'></iframe>");
}
