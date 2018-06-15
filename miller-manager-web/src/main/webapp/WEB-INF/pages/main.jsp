<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%@ page import="com.yusys.common.SUser"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0;" name="viewport" />
<title>固定资产管理系统</title>
<link rel="stylesheet" href="bootstrap/css/bootstrap.css" />
<link rel="stylesheet" href="bootstrap/css/matrix-style.css" />
<link rel="stylesheet" href="bootstrap/css/select2.css" />
<link rel="stylesheet" type="text/css" href="css/zebra_dialog.css" />
<link rel="stylesheet" href="css/index.css" />
<link rel="stylesheet" type="text/css" href="css/public.css" />
<link rel="stylesheet" type="text/css" href="css/css_ppe/public_ppe.css" />
<script type="text/javascript" src="js/jquery/jquery.min.js"></script>
<script type="text/javascript" src="bootstrap/js/select2.js"></script>
<script type="text/javascript" src="js/commons/alertAndConfirm.js"></script>
<script type="text/javascript" src="js/zebra_dialog.js"></script>
<script type="text/javascript" src="js/artTemplate/template.js"></script>
<script type="text/javascript" src="js/commons/NumberFormat.js"></script>
<script type="text/javascript" src="js/commons/StringBuffer.js"></script>
<script type="text/javascript" src="js/commons/IllegalArgumentException.js"></script>
<script type="text/javascript" src="js/commons/placeholders.js"></script>

<style type="text/css">
.gundong li ul ul div {
	background: url(images/dot.png) no-repeat;
	background-position: 35px 14px;
}

.gundong li ul ul ul div {
	background: url(images/square.png) no-repeat;
	background-position: 42px 14px;
}
</style>
<!--[if IE 8]> 
<style type="text/css">
	.headerArea-otherSystemsBtn {width:80px;}
	.headerArea-help {width:50px;}
	.headerArea-exit {width:50px;}
</style>
<![endif]--> 
</head>

<body style="overflow-x: hidden; overflow-y: auto;" id="body">
	<div style="width: 0; height: 0;"><!-- 读写条形码插件 -->
      <object classid="clsid:A3C9B49F-490E-4F7A-AD6E-AC2BF6B411A3" standby="Waiting..." id="vlc" width="0" height="0" name="vlc"
         title="指令插件">
      </object>
	</div>
	<div class="wrap">
		<%
			SUser user = (SUser) request.getSession().getAttribute("userinfo");
			String user_no = user.getUser_no();
			String user_name = user.getUser_name();
			String org_no = user.getOrg_no();
			String org_name = user.getOrg_no_name();
		%>
		<!--主页头部部分公共-->
		<div class="main_header">
			<div class="headerArea">
				<img class="logo" src="images/logo1.png" />
				<div class="rightTopHelp right">
					<ul>
						<li class="otherSystemsBtn headerArea-otherSystemsBtn"><img src="images/mc.png"
							style="width: 13px; margin: -2px 5px 0 0px;">其他系统</li>|
						<li class="headerArea-help"><img src="images/help.png"
							style="margin: -2px 5px 0 0px;">帮助</li>|
						<li class="exit headerArea-exit"><img src="images/out.png"
							style="margin: -4px 3px 0 0px;">退出</li>
					</ul>
				</div>
				<!--主页头部部分公共-->
				<!-- 其他系统部分 -->
				<div class="otherSystemsDiv">
					<i></i>
					<ul class="otherSystems">
						<li><img src="images/1.png">
							<div class="systemName">任务管理系统</div></li>
						<li><img src="images/5.png">
							<div class="systemName">供应商管理系统</div></li>
						<li><img src="images/3.png">
							<div class="systemName">安保管理系统</div></li>
						<li><img src="images/4.png">
							<div class="systemName">纪检管理系统</div></li>
						<li><img src="images/5.png">
							<div class="systemName">资源管理系统</div></li>
						<li><img src="images/6.png">
							<div class="systemName">售前支持系统</div></li>
						<li><img src="images/7.png">
							<div class="systemName">报销管理系统</div></li>
						<li><img src="images/4.png">
							<div class="systemName">绩效考核系统</div></li>
						<li><img src="images/5.png">
							<div class="systemName">请销假管理系统</div></li>
						<li><img src="images/6.png">
							<div class="systemName">供应信息管理</div></li>
					</ul>
				</div>
			</div>
			<!-- 其他系统部分 -->
			<!--弹出部分的个人信息-->
			<div class="imf">
				<i></i>
				<div style="border-bottom: 1px solid #EBEBEB; padding-bottom: 10px;">
					<img src="images/q2.png" class="left">
					<h3>网络金融产品部</h3>
					<div>
						12654654945 <br />Zolsn@sina.com
					</div>
					<p id="rewriteyourInfo">
						<span href="#" class="left">修改密码</span> <span href="#"
							class="right">个人信息</span>
					<div style="clear: both;"></div>
					</p>
				</div>
				<div style="padding-top: 15px;">员工等级：三级</div>
				<div style="padding-top: 5px;">最近登录：2016/05/04&nbsp;&nbsp;11：20</div>
			</div>
			<!--弹出部分的个人信息-->
			<ul class="list_tree_nav">
				<li id="firsttit">首&nbsp;&nbsp;页</li>
				<li>
					<ul class="list_tree_1nav">
					</ul>
				</li>

				<li id="tree_last" title="全部关闭"></li>
			</ul>
			<div style="clear: both;"></div>
		</div>

		<!--主页列表部分公共-->

		<div class="main_container" id="sidebarMenu">

			<ul class="nui-tree">
				<li>
					<div class="TX-wrap">
						<img class="TX" src="images/q2.png" /> <span class="while"
							id="main_user_name" user_no="<%=user_no%>"
							user_name="<%=user_name%>" org_no="<%=org_no%>"
							org_name="<%=org_name%>">您好，尊敬的<%=user_name%> <a
							class="userMessage"></a>
							<div>登录状态：在线</div>
						</span>

					</div>

					<div style="clear: both;"></div> <!-- 动态加载菜单区域 -->
					<ul level="1" class="gundong" id="gundongNavWrap"
						style="padding-top: 66px;">

					</ul> <!-- 动态加载菜单区域 -->
				</li>
			</ul>
		</div>
		<a href="#" class="suo" id="sidebar-btn"></a>

		<!--主页右侧分公共-->
		<div class="main_iframe clearfix" id="contentHtml">
			<div class="yourLocation">
				<img src="images/zhuye.png"
					style="width: 13px; height: 13px; padding-bottom: 4px;" /> 您所在的位置：<span
					id="location">首页</span>
			</div>



			<div class="indexContent">
				<!-- 左侧tab -->
				<div id="tabs_index" class="index_leftArea">
					<ul id="tabs_indexT">
						<li class="tabs_indexTc current">资产管理</li>
						<li class="tabs_indexTc">权证管理</li>
					</ul>
<!-- 资产管理=------------------------------------------------------ -->
					<div id="tabs_index_content">
						<ul class="tabs_index_contentDet" style="display: block;">
							<li style="background: #f9f9f9;padding: 15px;border-bottom: 1px solid #eee;">
								<ul class="indexContent_statistics_Cont assetM">
									<!-- 资产总数 -->
									<li class="firstCont">
									<div class="det" cot="Asset_allNum">共 0 件</div>
										<div class="contT" style="margin-top: 1px;">
										<img class="indexCT-2" alt="" src="images/index/zczs.png">
										资产总数</div>
										
										</li>
									<!-- 闲置资产-->
									<li class="secondCont">
									<div class="det" cot="Asset_inNum">共0 件</div>
										<div class="contT contT2">
										<img alt="" src="images/index/xianzhi.png">
										闲置资产 </div>
										</li>
									<!-- 正常在用资产 -->
									<li class="thirdCont">
									<div class="det" cot="Asset_useNum">共 0 件</div>
										<div class="contT contT3">
										<img alt="" src="images/index/indexCT-3.png">
										在用资产</div>
										</li>
									<!-- 报废资产 -->
									<li class="fourCont">
									<div class="det" cot="Asset_breakNum">共 0 件</div>
										<div class="contT contT4">
										<img alt="" src="images/index/indexCT-4.png">
										报废资产</div>
										</li>


									<div style="clear: both;"></div>

								</ul>

							</li>

							<li>
								<!-- 资产使用情况 -->
								<div class="indexContentMain_Cont1_left">
									<div class="indexContentMain_Cont_Title">
										资产使用情况：<img alt="" src="images/21.png">
									</div>
									<div class="indexContentMain_Cont_Det" id="main_echarts1W" style="width:100%;padding-top:20px;height:245px;">
										<!-- <img alt="" src="images/main_echarts1.jpg"> -->
									</div>
								</div>
							</li>
							<li>
								<!-- 资产分类占比 -->
								<div class="indexContentMain_Cont1_left assetClassificationAcc">
									<div class="indexContentMain_Cont_Title">
										资产分类占比：<img alt="" src="images/21.png">
									</div>
									<div class="indexContentMain_Cont_Det" id="main_echarts2W" style="width: 100%; padding-top: 20px; height: 300px;">
										<!-- <img alt="" src="images/main-echarts2.jpg"> -->
									</div>
								</div>

							</li>
						</ul>
						
<!-- 权证管理=------------------------------------------------------ -->
						<ul class="tabs_index_contentDet">
							<li style="background: #f9f9f9;padding: 15px;border-bottom: 1px solid #eee;">
								<ul class="indexContent_statistics_Cont assetM">
									<!-- 权证总数 -->
									<li class="firstCont">
									<div class="det" cot="allNum">共 0 件</div>
										<div class="contT" style="margin-top: 1px;">
										<img class="indexCT-2" alt="" src="images/index/zczs.png">
										权证总数</div>
										
										</li>
									<!-- 在库权证 -->
									<li class="secondCont">
									<div class="det" cot="useNum">共 0 件</div>
										<div class="contT contT2">
										<img alt="" style="margin-right:5px;" src="images/index/zkqz.png">在库权证
										</div>
										</li>
									<!-- 借出权证资产 -->
									<li class="thirdCont">
									<div class="det" cot="inNum">共 0 件</div>
										<div class="contT contT3">
										<img alt="" src="images/index/jcqzzc.png">
										借出权证资产</div>
										</li>
									<!-- 借阅权证 -->
									<li class="fourCont">
									<div class="det" cot="breakNum">共 0 件</div>
										<div class="contT contT4">
											<img class="indexCT-4" alt=""  src="images/index/jyqz.png">
										借阅权证</div>
										</li>


									<div style="clear: both;"></div>

								</ul>

							</li>

							<li>
								<!-- 权证出入情况-->
								<div class="indexContentMain_Cont1_left">
									<div class="indexContentMain_Cont_Title">
										权证出入情况：<img alt="" src="images/21.png">
									</div>
									<div class="indexContentMain_Cont_Det" id="index_qzcr" style="width:100%; padding-top: 20px; height: 245px;">
										<img alt="" src="images/main_echarts1.jpg">
									</div>
								</div>
							</li>

							<li>
								<!-- 权证占比 -->
								<div class="indexContentMain_Cont1_left assetClassificationAcc">
									<div class="indexContentMain_Cont_Title">
										权证占比：<img alt="" src="images/21.png">
									</div>
									<div class="indexContentMain_Cont_Det" id="main_echarts2Warrant" style="width:100%; padding-top: 20px; height: 300px;">
										
									</div>
								</div>

							</li>
						</ul>
					</div>
				</div>

<!-- 右侧内容区域------------------------------------------ -->
				<div class="index_rightArea">
					<!-- 预警 -->
					<div class="warning">
						<div class="warningT">预警管理：</div>
						<div class="IT">
							机柜预警：<span cot="computerRoom">0</span>条
							<p class="warningImg_w">
								<img alt="" src="images/index/warning.png">
							</p>
						</div>
						
						<div class="common">
							权证预警：<span cot="warrant">0</span>条
							<p class="warningImg_w">
								<img alt="" src="images/index/warning.png">
							</p>
						</div>
						
						<div class="common asset">
							资产预警：<span cot="asset_warning">0</span>条
							<p class="warningImg_w">
								<img alt="" src="images/index/warning.png">
							</p>
						</div>
					</div>
					<!-- 待办 -->
					<div class="indexContentMain_Cont1_right applyANDapproveWrap" style="min-height: 75px;max-height: 313px;">
						<div class="indexContentMain_Cont_Title">
							待办事项 <span class="num" spn="totalDeal">（0）</span>：<img alt=""
								src="images/21.png">
						</div>
						<div class="indexContentMain_Cont_Det">
							<ul class="applyANDapprove">
								<!-- <li class="applyANDapproveList">
					<span><span style="color:#fff;background:orange;padding: 2px 4px;margin-right: 10px;">待</span>待制定方案 
					<span style="position: absolute;left: 135px;">2016/12/12</span></span>
					<span class="date">10条</span>
					</li> -->
							</ul>
						</div>
					</div>
					<!-- 快捷入口 -->
					<div class="indexContentMain_Cont1_right">
						<div class="indexContentMain_Cont_Title">
							<i></i>快捷入口：<img alt="" src="images/21.png">
						</div>
						<div class="indexContentMain_Cont_Det">
							<ul class="shortcutArea">
								<li mbtn="assetApply">资产申请</li>
								<li mbtn="deptTransfer">资产调拨</li>
								<li mbtn="assetRepair">资产维修</li>
								<li mbtn="personlTransfer">个人资产转移</li>
								<li mbtn="assetStorage">资产入库</li>
								<li mbtn="warrantStorage">权证入库</li>
								<li mbtn="warrantOut">权证出库</li>
								<li class="more"><img style="width: 18px;" alt=""
									src="images/index/add.png"></li>
							</ul>
						</div>
					</div>
					
				</div>


			</div>







		</div>
		<div style="clear: both;"></div>
		<!--bg-->
		<div id="opacityBg"
			style="display: none; position: fixed; background: rgba(0, 0, 0, 0); width: 100%; height: 100%; top: 0;"></div>
	</div>
<!-- 预警管理弹出框 -->
		<div mpop="warningPop" class="modal hide fade" tabindex="-1"  style="width: 700px;left: 50%;margin-left: -350px;top: 15%;">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" title="点击关闭">×</button>
				<h5 id="myModalLabel">预警管理-IT资产预警：</h5>
			</div>
			<div class="modal-body">
				<table mtb="warningTable"></table>
			</div>
			<div class="modal-footer"></div>
		</div>
		<!-- 缩略语公共模态框 -->
		<div mod="abbrMod" class="modal hide fade" tabindex="-1" role="dialog" 
			  aria-labelledby="myModalLabel" aria-hidden="true">
			  <div class="modal-header">
			    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
			    <h5 mhtl="mhed">内容</h5>
			  </div>
			  <div class="modal-body">
				  <table class="table">
					  <tr class="bgNone">
					  	<td mhtl="tarea"></td>
					  </tr>
				  </table>
			  </div>
			<div class="modal-footer">
				<div style="text-align:center;">
					<button class="btns ilsh_left"  data-dismiss="modal" aria-hidden="true">关闭</button>
				</div>
			</div>
		</div>

	<!-- 暂时没有用，只考虑但系统菜单 -->
	<script id="initMasterMenu" type="text/html">
<ul>
    {{each list as value i}}
        <li onclick="switchLeftMenu('{{value.MENU_NO}}','{{value.MENU_NAME}}')">
			<img src=images/{{value.MENU_ICON}} />
			<span>{{value.MENU_NAME}}</span>
		</li>
    {{/each}}
</ul>
</script>
	<!-- 暂时没有用，只考虑但系统菜单 -->
	<!-- 初始化主菜单 -->
	<!-- 一级菜单模板 -->
	<script id="initLeftMenu" type="text/html">
<li menu_no={{MENU_NO}} class="gundongNav">
	<div class="nui-tree-item-label nui-tree-item-labelNav pl{{15*MENU_LEVEL}}">
		<span class="nui-tree-item-symbol" style="background: url(images/{{MENU_ICON}}) no-repeat;background-size: 18px 18px;"></span>
		<span class="tit" id="{{MENU_NO}}" >{{MENU_NAME}}</span><img src="images/21.png" class="arrowNav" />
	</div>
</li>
</script>
	<!-- 二级菜单模板 -->
	<script id="initLeftMenu2" type="text/html">
<li menu_no={{MENU_NO}} class="">
	<div class="nui-tree-item-label nui-tree-item-labelList pl{{15*MENU_LEVEL}} duojiMenu">
		<span class="nui-tree-item-symbol" ></span>
		<span class="tit" id="{{MENU_NO}}" onclick=pageDispatch2('{{MENU_NO}}',true)>{{MENU_NAME}}</span><img src="images/21.png" class="arrowNav" />
	</div>
</li>
</script>
	<!-- 三级菜单模板 -->
	<script id="initLeftMenu3" type="text/html">
<li menu_no={{MENU_NO}} class="">
	<div class="nui-tree-item-label pl{{15*MENU_LEVEL}} duojiMenu">
		<span class="nui-tree-item-symbol" ></span>
		<span class="tit" id="{{MENU_NO}}" onclick=pageDispatch2('{{MENU_NO}}',true)>{{MENU_NAME}}</span><img src="images/21.png" class="arrowNav" />
	</div>
</li>
</script>
	<script type="text/javascript" src="bootstrap/js/bootstrap.min.js"></script>
	<script src="js/commons/index_dispatch.js"></script>
	<script src="js/commons/main.js"></script>
	<script type="text/javascript" src="js/commons/commons.js"></script>
	<link type="text/css" href="bootstrap/css/bootstrap-table.min.css"
		rel="stylesheet" />
	<script src="bootstrap/js/bootstrap-table.min.js"></script>
	<script src="bootstrap/js/bootstrap-table-zh-CN.js"></script>
</body>
<script type="text/javascript" src="js/echarts-2.2.7/echarts-all.js"></script>
<!-- <script type="text/javascript" src="js/main_echarts.js"></script>  -->
<script type="text/javascript" charset="utf-8" src="js/homePage.js"></script>
</html>