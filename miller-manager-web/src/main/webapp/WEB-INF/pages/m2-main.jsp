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
		<link rel="stylesheet" href="bootstrap/css/matrix-style.css"/>
		<link rel="stylesheet" href="bootstrap/css/select2.css" />
		<link rel="stylesheet" type="text/css" href="css/zebra_dialog.css"/>
		<link rel="stylesheet" href="css/index.css" />
		<link rel="stylesheet" type="text/css" href="css/public.css" />
		<link rel="stylesheet" type="text/css" href="css/css_ppe/public_ppe.css"/> 
		<script type="text/javascript" src="js/jquery/jquery1.7.1.min.js" ></script>
		<script type="text/javascript" src="bootstrap/js/select2.js"></script>
		<script type="text/javascript" src="js/commons/alertAndConfirm.js"></script>
		<script type="text/javascript" src="js/echarts-2.2.7/echarts-all.js"></script>
		<script type="text/javascript" src="js/zebra_dialog.js"></script>
		<script type="text/javascript" src="js/artTemplate/template.js"></script>
		<script type="text/javascript" src="js/commons/NumberFormat.js"></script>
		<script type="text/javascript" src="js/commons/StringBuffer.js"></script>
		<script type="text/javascript" src="js/commons/IllegalArgumentException.js"></script>
		
		
	
		
		<style type="text/css">
		.gundong li ul ul div{background: url(images/dot.png) no-repeat;background-position: 35px 14px;}
		.gundong li ul ul ul div{background: url(images/square.png) no-repeat;background-position: 42px 14px;}
		</style>
	</head>

	<body style="overflow-x: hidden;overflow-y: auto;" id="body">
		<div class="wrap">
			<%
				SUser user=(SUser)request.getSession().getAttribute("userinfo");
				String user_no=user.getUser_no();
				String user_name=user.getUser_name();
				String org_no=user.getOrg_no();
				String org_name=user.getOrg_no_name();
			%>
<!--主页头部部分公共-->
			<div class="main_header">
				<div class="headerArea">
					<img class="logo" src="images/logo1.png" />
					<div class="rightTopHelp right">
						<ul>
							<li class="otherSystemsBtn">其他系统
								<i></i>
							</li>|
							<li><img src="images/help.png" style="margin: -5px 5px 0 0px;">帮助
							</li>|
							<li class="exit"><img src="images/out.png" style="margin: -5px 3px 0 0px;">退出</li>
						</ul>
					</div>
<!--主页头部部分公共-->
<!-- 其他系统部分 -->								
					<div class="otherSystemsDiv">
						<i></i>
						<ul class="otherSystems">
							<li>
								<img src="images/1.png">
								<div class="systemName">任务管理系统</div>
							</li>
							<li>
								<img src="images/5.png">
								<div class="systemName">供应商管理系统</div>
							</li>
							<li>
								<img src="images/3.png">
								<div class="systemName">安保管理系统</div>
							</li>
							<li>
								<img src="images/4.png">
								<div class="systemName">纪检管理系统</div>
							</li>
							<li>
								<img src="images/5.png">
								<div class="systemName">资源管理系统</div>
							</li>
							<li>
								<img src="images/6.png">
								<div class="systemName">售前支持系统</div>
							</li>
							<li>
								<img src="images/7.png">
								<div class="systemName">报销管理系统</div>
							</li>
							<li>
								<img src="images/8.png">
								<div class="systemName">绩效考核系统</div>
							</li>
							<li>
								<img src="images/8.png">
								<div class="systemName">请销假管理系统</div>
							</li>
							<li>
								<img src="images/8.png">
								<div class="systemName">供应信息管理</div>
							</li>
						</ul>
					</div>
				</div>
<!-- 其他系统部分 -->	
<!--弹出部分的个人信息-->
			<div class="imf"><i></i>
				<div style="border-bottom: 1px solid #EBEBEB;padding-bottom: 10px;">
					<img src="images/q2.png" class="left">
					<h3>网络金融产品部</h3>
					<div>12654654945
						<br/>Zolsn@sina.com</div>
					<p id="rewriteyourInfo">
						<span href="#" class="left">修改密码</span>
						<span href="#" class="right">个人信息</span>
						<div style="clear: both;"></div>
					</p>
				</div>
				<div style="padding-top: 10px;">员工等级：三级</div>
				<div>最近登录：2016/05/04&nbsp;11：20</div>
			</div>
<!--弹出部分的个人信息-->
				<ul class="list_tree_nav">
					<li id="firsttit">首&nbsp;&nbsp;页</li>
					<li>
						<ul class="list_tree_1nav">
						</ul>
					</li>

					<li id="tree_last" title="全部关闭">
					</li>
				</ul>
				<div style="clear: both;"></div>
			</div>

			<!--主页列表部分公共-->
			
			<div class="main_container" id="sidebarMenu">

				<ul class="nui-tree">
					<li>
						<div class="TX-wrap">
							<img class="TX" src="images/q2.png" />
							<span class="while" id="main_user_name" user_no="<%=user_no %>" user_name="<%=user_name %>" org_no="<%=org_no%>" org_name="<%=org_name%>">您好，尊敬的<%=user_name %>
							<a class="userMessage"></a>
									<div>登录状态：在线</div>
						</span>

						</div>
						
						<div style="clear: both;"></div>
	<!-- 动态加载菜单区域 -->
						<ul level="1" class="gundong" id="gundongNavWrap" style="padding-top: 66px;">
							
						</ul>
	<!-- 动态加载菜单区域 -->			
					</li>
				</ul>
			</div>
			<a href="#" class="suo" id="sidebar-btn"></a>		
			 
			<!--主页右侧分公共-->
							<div class="main_iframe clearfix" id="contentHtml">
								<div class="yourLocation">
									<img src="images/zhuye.png" style="width: 13px;height: 13px;padding-bottom: 4px;"/>
									您所在的位置：<span id="location">首页</span></div>
								<div class="indexContent">	
									<div class="indexContent_statistics">
										<ul class="indexContent_statistics_Cont">
											<!-- 资产总数 -->
											<li class="firstCont">
											<img class="indexCT-2" alt="" src="images/index/indexCT-2.png">
											<div class="contT">资产总数</div>
											<div class="det">12/12367
											<span class="plus">增加总数</span></div>
											</li>
											<!-- 资产总额 -->
											<li class="secondCont">
											<img alt="" src="images/index/indexCT-1.png">
											<div class="contT">资产总额</div>
											<div class="det">￥ 2,223.00</div>
											</li>
											<!-- 正常在用资产 -->
											<li class="thirdCont">
											<img alt="" src="images/index/indexCT-3.png">
											<div class="contT">正常在用资产</div>
											<div class="det">数目 2230</div>
											</li>
											<!-- 资产总额 -->
											<li class="fourCont">
											<img class="indexCT-4" alt="" src="images/index/indexCT-4.png">
											<div class="contT">异动资产</div>
											<div class="det">数目 12</div>
											</li>
										</ul>
									</div>				
									<div class="indexContentMain">
										<ul>
										<!-- 资产使用情况 -->
											<li class="indexContentMain_Cont1">
											<!-- 资产使用情况 -->
												<div class="indexContentMain_Cont1_left">
													<div class="indexContentMain_Cont_Title">
														资产使用情况：<img alt="" src="images/21.png">
													</div>
													<div class="indexContentMain_Cont_Det">
														<img alt="" src="images/main_echarts1.jpg">
													</div>
												</div>
											<!-- 快捷入口 -->
												<div class="indexContentMain_Cont1_right">
													<div class="indexContentMain_Cont_Title">
														快捷入口：<img alt="" src="images/21.png">
													</div>
													<div class="indexContentMain_Cont_Det">
														<ul class="shortcutArea">
															<li>资产调拨</li>
															<li>清理报废</li>
															<li>资产归还</li>
															<li>资产维修</li>
															<li>供应商报表明细</li>
															<li>个人资产转移</li>
															<li>供应商报表明细</li>
															<li>个人资产转移</li>
														</ul>
													</div>
												</div>
											</li>
											
											<li class="indexContentMain_Cont1">
											<!-- 资产分类占比 -->
												<div class="indexContentMain_Cont1_left assetClassificationAcc">
													<div class="indexContentMain_Cont_Title">
														资产分类占比：<img alt="" src="images/21.png">
													</div>
													<div class="indexContentMain_Cont_Det">
													<img alt="" src="images/main-echarts2.jpg">
													</div>
												</div>
											<!-- 资产申请审批 -->
												<div class="indexContentMain_Cont1_right applyANDapproveWrap">
													<div class="indexContentMain_Cont_Title">
														资产申请审批<span class="num">（11）</span>：<img alt="" src="images/21.png">
													</div>
													<div class="indexContentMain_Cont_Det">
														<ul class="applyANDapprove">
															<li class="applyANDapproveList">
															<i>1、</i>
															<span>运营管理部-秋明明-申请笔记本-1台</span>
															<span class="date">2016/12/12</span>
															</li>
															<li class="applyANDapproveList">
															<i>2、</i>
															<span>运营管理部-秋明明-申请笔记本-1台</span>
															<span class="date">2016/12/12</span>
															</li>
															<li class="applyANDapproveList">
															<i>3、</i>
															<span>运营管理部-秋明明-申请笔记本-1台</span>
															<span class="date">2016/12/12</span>
															</li>
															<li class="applyANDapproveList">
															<i>4、</i>
															<span>运营管理部-秋明明-申请笔记本-1台</span>
															<span class="date">2016/12/12</span>
															</li>
															<li class="applyANDapproveList">
															<i>5、</i>
															<span>运营管理部-秋明明-申请笔记本-1台</span>
															<span class="date">2016/12/12</span>
															</li>
															<li class="applyANDapproveList">
															<i>6、</i>
															<span>运营管理部-秋明明-申请笔记本-1台</span>
															<span class="date">2016/12/12</span>
															</li>
															<li class="applyANDapproveList">
															<i>7、</i>
															<span>运营管理部-秋明明-申请笔记本-1台</span>
															<span class="date">2016/12/12</span>
															</li>
														</ul>
														<!-- 审批按钮 -->
														<div class="approveBtn">
															<button class="btns failed">打回</button>
															<button class="btns passed">通过</button>
															<button class="btns more">更多</button>
														</div>
													</div>
												</div>
											</li>
										</ul>
									</div>
				</div>
				
			</div>
			<div style="clear: both;"></div>
			<!--bg-->
			<div id="opacityBg" style="display:none;position: fixed;background: rgba(0,0,0,0);width: 100%;height: 100%;top: 0;"></div>
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
		<!-- <script type="text/javascript" charset="utf-8" src="js/homePage.js"></script> -->
	</body>
</html>