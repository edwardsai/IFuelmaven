initHomePageLayOut();
//初始化首页事件	
function initHomePageLayOut(){
	var warrantInt=0;
	var assetInt=0;
	$(function() {
		window.onload = function() {
			var $tabs_indexTc = $('#tabs_indexT li.tabs_indexTc');
			var $tabs_index_contentDet = $('#tabs_index_content ul.tabs_index_contentDet');

			$tabs_indexTc.click(function() {
				var $this = $(this);
				var $t = $this.index();
				$tabs_indexTc.removeClass();
				$this.addClass('current');
				$tabs_index_contentDet.css('display', 'none');
				$tabs_index_contentDet.eq($t).css('display', 'block');
				if(warrantInt==0){
					queryWarrantCount();//统计资产数量
					initWarrantUseCondition();//初始化权证使用情况曲线图
					initWarrantProportion();//初始化权证占比饼状图图
					warrantInt=1;
				}
			})
		}
	});
	var currTab = getCurrentPageObj();//当前页
	//获取登录人编号(考虑权限问题需要)
	var user_no = currTab.find("#main_user_name").attr("user_no");
	//数量
	
	queryAssetCount();//统计资产数量
	//曲线  饼图
	initAssetUseCondition();//初始化资产使用情况曲线图
	initAssetProportion();//初始化资产占比饼状图图
	
	//预警
	queryWarningCount();//统计预警数量
	initWarningButtonEvent();//初始化预警按钮事件
	//快捷按钮事件
	initHomePageButtonEvent();//初始化按钮快捷键事件
	initWarrantNeedToDealEvent();//初始化待办事项

	
	
//-- 资产管理=--js---------------------------------------------------- -->
	//统计资产数量
	function queryAssetCount(){
		baseAjax("HomePage/queryAssetCount.asp",{user_no:user_no}, function(data) {
			if(data && data.result == "true"){
				if(data.countData){//初始化各状态的资产数量及总数
					var allNum = 0;
					for(var i = 0; i<data.countData.length; i++){
						var count = data.countData[i];
						if(count.STATUS == "01"){//01已领用
							currTab.find("[cot='Asset_useNum']").html("共 "+count.COUNT_NUM+" 件");
						}
						if(count.STATUS == "02"){//02在库
							currTab.find("[cot='Asset_inNum']").html("共 "+count.COUNT_NUM+" 件");
						}
						if(count.STATUS == "03"){//03已报废
							currTab.find("[cot='Asset_breakNum']").html("共 "+count.COUNT_NUM+" 件");
						}
						allNum += count.COUNT_NUM;
					}
					currTab.find("[cot='Asset_allNum']").html("共 "+allNum+" 件");
				}
			}
		});
	}
//初始化资产使用情况曲线图
	function initAssetUseCondition(){
		var main_echarts1W = echarts.init(document.getElementById('main_echarts1W'));
		var monthArr = new Array();//最近n个月
		var useDataArr = new Array();//领用数据
		var inDataArr = new Array();//入库数据
		var maxCont = 0;//统计的最大值
		var maxTitle = 0; //纵坐标的最大值
		var monthNumber = 6;//取最近多少个月的数据
		//monthArr = ['2016-01','2016-02','2016-04','2016-08','2016-10','2016-10','2016-12'];
		//useDataArr = [6000, 15500, 20500, 5600, 12000, 29000, 23000];
		//inDataArr = [10000,22000,30000, 15000, 23000, 26000, 21000];
		baseAjax("HomePage/queryAssetUseCondition.asp",{monthNumber : monthNumber}, function(data) {
	    	if (data != undefined&&data!=null&&data.result==true) {
	    		var countList = data.countList;
	    		if(countList != null && countList.length > 0) {
	    			for(var i = countList.length-1; i >= 0; i--) {
	    				var month = countList[i].month;
	    				var useCont = countList[i].useCont;
	    				var inCont = countList[i].inCont;
	    				maxCont = maxCont > useCont ? maxCont : useCont;
	    				maxCont = maxCont > inCont ? maxCont : inCont;// maxCont取所有值的最大值
	    				monthArr.push(month);
	    				useDataArr.push(useCont);
	    				inDataArr.push(inCont);
	    			}
	    		}
	    		//为y轴数据展示好看，对其最大值进行处理
	    		if(maxCont < 10){
					maxTitle = 10;
				}else{
					maxTitle = returnBeautifulFullNumber(maxCont);
				}
	    	}
	    	  var option1 = {
	          	    title : {
	          	        text: '',
	          	        subtext: ''
	          	    },
	          	    tooltip : {
	          	        trigger: 'axis'
	          	    },
	          	    legend: {
	          	        data:['领用资产','入库资产']
	          	    },
	          	    toolbox: {
	          	        show : false,
	          	        feature : {
	          	            mark : {show: true},
	          	            dataView : {show: true, readOnly: false},
	          	            magicType : {show: true, type: ['line', 'bar']},
	          	            restore : {show: true},
	          	            saveAsImage : {show: true}
	          	        }
	          	    },
	          	    calculable : true,
	          	    xAxis : [
	          	        {
	          	            type : 'category',
	          	            boundaryGap : false,
	          	            data : monthArr
	          	        }
	          	    ],
	          	    yAxis : [
	          	         {
	          	          type : 'value',
	          	          axisLabel : {
	          	            	formatter: '{value}'
	          	            	},
	          	          min:0,
	          	          max:maxTitle,
	          	          calculable: false,
	          	          splitNumber:5
	          	          
	          	        }
	          	    ],
	          	    series : [
	          	        {
	          	            name:'领用资产',
	          	            type:'line',
	          	            data:useDataArr,
	          	            markPoint : {
	          	                data : [
	          	                    {type : 'max', name: '最大值'},
	          	                    {type : 'min', name: '最小值'}
	          	                ]
	          	            },
	          	            markLine : {
	          	                data : [
	          	                    {type : 'average', name: '平均值'}
	          	                ]
	          	            }
	          	        },
	          	        {
	          	            name:'入库资产',
	          	            type:'line',
	          	            data:inDataArr,
	          	            markPoint : {
	          	                data : [
	  								{type : 'max', name: '最大值'},
	  								{type : 'min', name: '最小值'}
	          	                ]
	          	            },
	          	            markLine : {
	          	                data : [
	          	                    {type : 'average', name : '平均值'}
	          	                ]
	          	            }
	          	        }
	          	    ]
	          	};
	          // 为echarts对象加载数据 
	          main_echarts1W.setOption(option1); 
		});
	}
	//初始化资产占比饼状图图
	function initAssetProportion(){
		debugger;
		var main_echarts2W = echarts.init(document.getElementById('main_echarts2W'));
		var colorArr = ['#FFC000','#C6E584','#B0DC00','#9BC300','#84A600','#66aaff'];
		var typeNum = colorArr.length - 1;//给多少种颜色就查询前多少名的占比的数据
		baseAjax("HomePage/queryAssetProportion.asp",{typeNum : typeNum}, function(data) {
			if (data != undefined&&data!=null&&data.result==true) {
				var allDataRecord = new Array();//近一年的资产类型的所有数据
				var monthArr = new Array();//最近12个月
				var kindName = new Array();//类别名称
				var typeJsonStr = data.typeJsonStr;//类别名字json
				$.each( typeJsonStr, function( type_num, type_name ) { 
					kindName.push(type_name);//前几名的名称
				});
				kindName.push("其他");//补上其他类
				/*
				 var monthArr = [
			                    '2016-01-01', '2016-02-01', '2016-03-01', '2016-04-01', '2016-05-01',
			                    { name:'2016-06-01', symbol:'emptyStar6', symbolSize:8 },
			                    '2016-07-01', '2016-08-01', '2016-09-01', '2016-10-01', '2016-11-01',
			                    { name:'2016-12-01', symbol:'star6', symbolSize:8 }
			                ];
				var kindName = ['设备分类一','设备分类二','设备分类三','设备分类四','其他'];
				*/
	    		var countList = data.countList;//近一年所有的数据
	    		if(countList != null && countList.length > 0) {
	    			//for(var i = countList.length-1; i >= 0; i--) {//顺序
	    			for(var i = 0; i < countList.length; i++) {//倒序
	    				var month;
	    				if(i == 11){
	    					month = { name:countList[i].month, symbol:'emptyStar6', symbolSize:8 };
	    				}else if(i == countList.length/2 - 1){
	    					month = { name:countList[i].month, symbol:'star6', symbolSize:8 };
	    				}else{
	    					month = countList[i].month;
	    				}
	    				monthArr.push(month);//最近12个月
	    				var topAssetNum = countList[i].topAssetNum;//单月前几名的数据
	    				var otherAssetNum = countList[i].otherAssetNum;//单月其他类总和数据
	    				var oneRecord = [{value:otherAssetNum, name:'其他'}];//单月一个饼状图数据
	    				$.each( typeJsonStr, function( type_num, type_name ) { 
	    					var num = 0;//默认该月该类型的数量都为0
	    					var name = type_name;//
	    					for( var k = 0; k < topAssetNum.length; k++){
	    						var oneTopAsset = topAssetNum[k];
	    						if(oneTopAsset.ASSET_TYPE == type_num){//若该月中该类型存在数据，则初始化该数据
	    							num = oneTopAsset.NUM == undefined ? "0" : oneTopAsset.NUM;
	    							//var jType = oneTopAsset.ASSET_TYPE;
	    							//name = data.typeJsonStr[jType];
	    						}
	    					}
	    					var detail = {value:num,name:name};
	    					oneRecord.push(detail);
	    				});
	    				var standardRecorderSeries = //把该月的数据转为echarts标准数据格式
	                        {
	                            name:'',
	                            type:'pie',
	                            center: ['50%', '45%'],
	                            radius: '50%',
	                            data:oneRecord
	                        };
	    				allDataRecord.push(standardRecorderSeries);
	    			}
	    		}
		     var option2 = {
		            timeline : {
		                data : monthArr,
		             
		                label : {
		                    formatter : function(s) {
		                        return s.slice(0, 7);
		                    }
		                }
		            },
		            options : [
		                {
		                    title : {
		                        text: '',
		                        subtext: ''
		                    },
		                    tooltip : {
		                        trigger: 'item',
		                        formatter: "{a} <br/>{b} : {c} ({d}%)"
		                    },
		                   color: colorArr,
		                    legend: {
		                       data:kindName
		                    },
		                    toolbox: {
		                        show :false,
		                        feature : {
		                            mark : {show: true},
		                            dataView : {show: true, readOnly: false},
		                            magicType : {
		                                show: true, 
		                                type: ['pie', 'funnel'],
		                                option: {
		                                    funnel: {
		                                        x: '25%',
		                                        width: '50%',
		                                        funnelAlign: 'left',
		                                        max: 1700
		                                    }
		                                }
		                            },
		                            restore : {show: true},
		                            saveAsImage : {show: true}
		                        }
		                    },
		                    series : [allDataRecord[0]]//默认显示的月份数据在这里初始化
		                }
		            ]
		       };
		     for(var i = 1; i < 12; i++){//其余第2到12月的数据
			       option2.options.push(
		    		   {
			            series : [allDataRecord[i]]
				        }
			       );
		      }                    
		      // 为echarts对象加载数据 
		     debugger;
		      main_echarts2W.setOption(option2);	
		  }else if(data && data.result == false){
	    	alert( data.msg);
	      }
		});
	}
	
	
//-- 权证管理=--js---------------------------------------------------- -->
	//统计权证数量
	function queryWarrantCount(){
		baseAjax("WarrantHomePage/queryAssetCount.asp",{user_no:user_no}, function(data) {
			if(data && data.result == "true"){
				if(data.countData){//初始化各状态的资产数量及总数
					var allNum = 0;
					for(var i = 0; i<data.countData.length; i++){
						var count = data.countData[i];
						if(count.WARR_STATUS == "01"){//01在库
							currTab.find("[cot='useNum']").html("共 "+count.COUNT_NUM+" 件");
						}
						if(count.WARR_STATUS == "02"){//02借出
							currTab.find("[cot='inNum']").html("共 "+count.COUNT_NUM+" 件");
						}
						if(count.WARR_STATUS == "03"){//03借阅
							currTab.find("[cot='breakNum']").html("共 "+count.COUNT_NUM+" 件");
						}
						allNum += count.COUNT_NUM;
					}
					currTab.find("[cot='allNum']").html("共 "+allNum+" 件");
				}
			}
		});
	}

	
	
	
//统计预警数量-----------------------------------------------------统计数量----预警的开始
	function queryWarningCount(){
		warningTotalByTypeComputer(currTab.find("[cot='computerRoom']"));//机柜预警总数
		warningTotalByTypeWarrant(currTab.find("[cot='warrant']"));//权证预警总数
		warningTotalByTypeAsset(currTab.find("[cot='asset_warning']"));//资产预警总数
	}
	//根据类型统计资产预警条数
	function warningTotalByTypeAsset(obj){
		baseAjax("EarlyWarning/queryAllWarning.asp?",null, function(data) {
			if(data && data.rows){
				var total = 0;
				var exceptionTypeNum = "";//异常资产类型编号组
				for(var i = 0; i < data.rows.length; i++){
					var row = data.rows[i];
					var warningFlag = false;
					if(row.EXCEPTION_NUM){//存在维保异常的资产
						warningFlag = true;
					}
					var unuse_rate=row.UNUSE_NUM/row.ALL_NUM*100;
					if(unuse_rate>row.UNUSE_WARN){//闲置率异常
						warningFlag = true;
					}
					if(row.ALL_NUM<row.DOWN_WARN){//下限异常
						warningFlag = true;
					}else if(row.ALL_NUM>row.UP_WARN){//上限异常
						warningFlag = true;
					}
					if(row.IS_USE=="2"){//没有启用,则不计算异常
						warningFlag = false;
					}
					if(warningFlag){//存在异常，数量加1
						total ++;
						exceptionTypeNum += row.ASSET_TYPE + ",";
					}
				}
				obj.html(total);
				if(exceptionTypeNum){
					obj.attr("num",exceptionTypeNum.substring(0, exceptionTypeNum.length - 1));//异常资产类型绑定到该对象中
				}
			}
			
		});
	}
	//机柜的----预警条数
	function warningTotalByTypeComputer(obj){
		baseAjax("ComputerroomWarning/queryAllWarning.asp?",null, function(data) {
			if(data && data.rows){
				var total = 0;
				var exceptionTypeNum = "";//异常资产类型编号组
				for(var i = 0; i < data.rows.length; i++){
					var row = data.rows[i];
					var warningFlag = false;
					if(row.EXCPTION_NUMBER){//存在维保异常的资产
						warningFlag = true;
					}
					if(row.IS_USE=="01"){//没有启用,则不计算异常
						warningFlag = false;
					}
					if(warningFlag){//存在异常，数量加1
						total ++;
						exceptionTypeNum += row.WARNING_ID + ",";
					}
				}
				obj.html(total);
				if(exceptionTypeNum){
					obj.attr("num",exceptionTypeNum.substring(0, exceptionTypeNum.length - 1));//异常资产类型绑定到该对象中
				}
			}
			
		});
	}
	//权证的----预警条数
	function warningTotalByTypeWarrant(obj){
		baseAjax("WarrantWarning/queryAllWarning.asp?",null, function(data) {
			if(data && data.rows){
				var total = 0;
				var exceptionTypeNumWarrant = "";//异常资产类型编号组
				for(var i = 0; i < data.rows.length; i++){
					var row = data.rows[i];
					var warningFlag = false;
					if(row.EXCEPTION_NUM){//存在期限异常
						warningFlag = true;
					}
					if(row.EXCEPTION_NUM_BORROW){//存在借出异常
						warningFlag = true;
					}
					if(row.IS_USE=="01"){//没有启用,则不计算异常
						warningFlag = false;
					}
					
					if(warningFlag){//存在异常，数量加1
						total ++;
						exceptionTypeNumWarrant += row.WARNING_ID + ",";
					}
				}
				obj.html(total);
				if(exceptionTypeNumWarrant){
					obj.attr("num",exceptionTypeNumWarrant.substring(0, exceptionTypeNumWarrant.length - 1));//异常资产类型绑定到该对象中
				}
			}
			
		});
	}
//初始化预警按钮事件---------------------------------------------------
	function initWarningButtonEvent(){
		currTab.find(".IT").click(function(){
			$("div[mpop='warningPop']").modal("show");
			var asset_type_arr = $(this).find("span").attr("num");
			initWarningComputerTable(asset_type_arr);
		});
		currTab.find(".common").click(function(){
			$("div[mpop='warningPop']").modal("show");
			var asset_type_arr = $(this).find("span").attr("num");
			initWarningWArrantTable(asset_type_arr);
		});
		currTab.find(".asset").click(function(){
			$("div[mpop='warningPop']").modal("show");
			var asset_type_arr = $(this).find("span").attr("num");
			initWarningAssetTable(asset_type_arr);
		});
	}
	//初始化预警模态框列表
	function initWarningAssetTable(asset_type_arr){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		$('table[mtb="warningTable"]').bootstrapTable('destroy').bootstrapTable({
			url:'EarlyWarning/queryAllWarning.asp?asset_type_arr='+asset_type_arr,//请求后台的URL
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "ASSET_TYPE", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			columns : [{
				field : 'Number',title : '序号',align : "center",sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field : 'ASSET_TYPE_NAME',title : '类型名称',align : "center"
			}, {
				field : 'ALL_NUM',title : '上限异常',align : "center",
				formatter: function (value, row, index) {
					var strInfo = '<span style="color:green">正常</span>';
					if(value>row.UP_WARN){
						strInfo = '<p style="color:red">异常：该资产已有<span style="font-size:20px;" class="viewDetail" >'+
						+row.ALL_NUM+'</span>条； </p>';
					}
					return strInfo;
				}
			}, {
				field : 'ALL_NUM',title : '下限异常',align : "center",
				formatter: function (value, row, index) {
					var strInfo = '<span style="color:green">正常</span>';
					if(value < row.DOWN_WARN){
						strInfo = '<p style="color:red">异常：<span style="font-size:20px;" class="viewDetail" >'+
						+row.ALL_NUM+'</span>条； </p>';
					}
					return strInfo;
				}
			}, {
				field : "UNUSE_WARN",title : "闲置异常",align : "center",
				formatter: function (value, row, index) {
					var strInfo = '<span style="color:green">正常</span>';
					var unuse_rate=row.UNUSE_NUM/row.ALL_NUM*100;
					if(unuse_rate>value){
						strInfo = '<p style="color:red">异常：<span style="font-size:20px;" class="viewDetail" >'+
						unuse_rate.toFixed(2)+'%；</span> </p>';
					}
					return strInfo;
				}
			} , {
				field : "EXCEPTION_NUM",title : "维保异常",align : "center",
				formatter: function (value, row, index) {
					var strInfo = '<span style="color:green">正常</span>';
					if(value){
						//var nums=value.split(",").length;
						strInfo='<p style="color:red">异常：<span style="font-size:20px;" class="viewDetail">'+
						value+'</span> 条资产；</p>';
					}
					return strInfo;
				}
			}]
		});
	}
	//初始化权证预警模态框列表
	function initWarningWArrantTable(asset_type_arr){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		$('table[mtb="warningTable"]').bootstrapTable('destroy').bootstrapTable({
			url : 'WarrantWarning/queryAllWarning.asp?AREA_TYPE_ARR='+asset_type_arr,//请求后台的URL（*）
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			columns : [ {
				field : 'Number',title : '序号',align : "center",sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field: 'WARR_CATEGORY_NAME',align: 'center',title : '权证类别'
				
			}, {
				field : 'WARR_TYPE_NAME',title : '权证类型',align : "center"
			}, /*{
				field : 'IS_USE',title : '是否启用',align : "center",
				formatter: function(value,row,index){
					if(value=="00"){
						return "启用";
					}else{
						return "启用";
					}
				}
			}, */{
				field : 'ADVANCE_NOTICE_TIME',title : '到期通知',align : "center",
				formatter: function(value,row,index){
					return value+"天";
				}
			}, {
				field : "BORROW_TIME",title : "借用通知",align : "center",
				formatter: function(value,row,index){
					return value+"天";
				}
			},{
				field : "CREATE_TIME",title : "设置时间",align : "center"
			},{
				field : "EXCEPTION_NUM",title : "预警信息",align : "center",
				formatter: function(value,row,index){
					var strInfo="";
					var key2="1";//有效期异常信息 与 借阅异常信息  区分
					if(value){//有效期异常信息
						//var nums=value.split(",").length;
					strInfo=strInfo+'<p style="color:red">有效期超时：<span style="font-size:20px;" class="viewDetail" >'+
					value+'</span> 条；</p>';
					}
					if(row.EXCEPTION_NUM_BORROW){//借阅异常信息
						key2="2";
						//var nums_borrow=row.EXCEPTION_NUM_BORROW.split(",").length;
						strInfo=strInfo+'<p style="color:red">借用超时：<span style="font-size:20px;" class="viewDetail" >'+
						row.EXCEPTION_NUM_BORROW+'</span> 条；</p>';
					}
					if(!strInfo){
						strInfo='<p style="color:green">正常</p>';
					}
					return strInfo;
				}
			}]
		});
	}
	//初始化机柜预警模态框列表
	function initWarningComputerTable(asset_type_arr){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		$('table[mtb="warningTable"]').bootstrapTable('destroy').bootstrapTable({
			url:'ComputerroomWarning/queryAllWarning.asp?AREA_TYPE_ARR='+asset_type_arr,//请求后台的URL
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			columns : [{
				field : 'Number',title : '序号',align : "center",sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			},{
				field : 'IS_USE',title : '是否启用',align : "center",
				formatter: function(value,row,index){
					if(value=="00"){
						return "启用";
					}else{
						return "启用";
					}
				}
			}, {
				field: 'ROOM_NAME',align: 'center',title : '仓库位置',
				formatter: function (value, row, index) {
					return "<p style='float:left'>"+value+"</p>";
				 }
				
			}, {
				field: 'AREA_TYPENAME',align: 'center',title : '仓库类型'
			},{
				field: 'WARNING_LINE',align: 'center',title : '预警线',
				formatter: function(value,row,index){
					return value+"%";
				}
				
			},{
				field : "CREATE_TIME",title : "设置时间",align : "center"
			},{
				field : "EXCPTION_NUMBER",title : "预警信息",align : "center",
				formatter: function(value,row,index){
					var strInfo="";
					if(value){
						//var nums=value.split(",").length;
					strInfo=strInfo+'<p style="color:red">仓库容量预警异常：<span style="font-size:20px;" <span style="font-size:20px;" class="viewDetail" >'+value+'</span> 个；</p>';
					}
					if(!strInfo){
						strInfo='<p style="color:green">正常</p>';
					}
					return strInfo;
				}
			}]
		});
	}
	
	//初始化按钮快捷键事件
	function initHomePageButtonEvent(){
		//资产调拨
		currTab.find("[mbtn='deptTransfer']").click(function(){
			pageDispatch2("departassettransfer",true);
		});
		//资产维修
		currTab.find("[mbtn='assetRepair']").click(function(){
			pageDispatch2("assetrepairlist",true);
		});
		//个人资产转移
		currTab.find("[mbtn='personlTransfer']").click(function(){
			pageDispatch2("employeeassettransfer",true);
		});
		//资产入库
		currTab.find("[mbtn='assetStorage']").click(function(){
			pageDispatch2("assetstorage",true);
		});
		//资产申请
		currTab.find("[mbtn='assetApply']").click(function(){
			pageDispatch2("assetapply",true);
		});
		//权证入库
		currTab.find("[mbtn='warrantStorage']").click(function(){
			pageDispatch2("warrantstorage",true);
		});
		//权证出库
		currTab.find("[mbtn='warrantOut']").click(function(){
			pageDispatch2("warrantout",true);
		});	
	}
	//初始化资产使用情况曲线图
	function initWarrantUseCondition(){
		var index_qzcr = echarts.init(document.getElementById('index_qzcr'));
		var monthArr = new Array();//最近n个月
		var useDataArr = new Array();//领用数据
		var inDataArr = new Array();//入库数据
		var maxCont = 0;//统计的最大值
		var maxTitle = 0; //纵坐标的最大值
		var monthNumber = 6;//取最近多少个月的数据
		//monthArr = ['2016-01','2016-02','2016-04','2016-08','2016-10','2016-10','2016-12'];
		//useDataArr = [6000, 15500, 20500, 5600, 12000, 29000, 23000];
		//inDataArr = [10000,22000,30000, 15000, 23000, 26000, 21000];
		baseAjax("WarrantHomePage/queryAssetUseCondition.asp",{monthNumber : monthNumber}, function(data) {
			if (data != undefined&&data!=null&&data.result==true) {
	    		var countList = data.countList;
	    		if(countList != null && countList.length > 0) {
	    			for(var i = countList.length-1; i >= 0; i--) {
	    				var month = countList[i].month;
	    				var outCont = countList[i].outCont;
	    				var inCont = countList[i].inCont;
	    				maxCont = maxCont > outCont ? maxCont : outCont;
	    				maxCont = maxCont > inCont ? maxCont : inCont;// maxCont取所有值的最大值
	    				monthArr.push(month);
	    				useDataArr.push(outCont);
	    				inDataArr.push(inCont);
	    			}
	    		}
	    		//为y轴数据展示好看，对其最大值进行处理
	    		if(maxCont < 10){
					maxTitle = 10;
				}else{
					maxTitle = returnBeautifulFullNumber(maxCont);
				}
	    	}
	    	  var option = {

	    	    	    tooltip : {
	    	    	        trigger: 'axis'
	    	    	    },
	    	    	    legend: {
	    	    	        data:['入库权证','出库权证']
	    	    	    },
	    	    	    toolbox: {
	    	    	        show : false,
	    	    	        feature : {
	    	    	            mark : {show: true},
	    	    	            dataView : {show: true, readOnly: false},
	    	    	            magicType : {show: true, type: ['line', 'bar']},
	    	    	            restore : {show: true},
	    	    	            saveAsImage : {show: true}
	    	    	        }
	    	    	    },
	    	    	    calculable : true,
	    	    	    xAxis : [
	    	    	        {
	    	    	            type : 'category',
	    	    	            data :	monthArr
	    	    	        }
	    	    	    ],
	    	    	    yAxis : [
	    	    	        {
	    	    	            type : 'value'
	    	    	        }
	    	    	    ],
	    	    	    series : [
	    	    	        {
	          	            name:'入库权证',
	          	            type:'bar',
	          	            data:inDataArr,
	          	            markPoint : {
	          	                data : [
	          	                    {type : 'max', name: '最大值'},
	          	                    {type : 'min', name: '最小值'}
	          	                ]
	          	            },
	          	            markLine : {
	          	                data : [
	          	                    {type : 'average', name: '平均值'}
	          	                ]
	          	            }
	          	        },
	          	        {
	          	            name:'出库权证',
	          	            type:'bar',
	          	            data:useDataArr,
	          	            markPoint : {
	          	                data : [
	  								{type : 'max', name: '最大值'},
	  								{type : 'min', name: '最小值'}
	          	                ]
	          	            },
	          	            markLine : {
	          	                data : [
	          	                    {type : 'average', name : '平均值'}
	          	                ]
	          	            }
	          	        }
	          	    ]
	          	};
	          // 为echarts对象加载数据 
	    	  index_qzcr.setOption(option); 
		});
	}
	//第二排完成--------------------------------------------
	//初始化权证占比饼状图图
	function initWarrantProportion(){
		var main_echarts2W2 = echarts.init(document.getElementById('main_echarts2Warrant'));
		var colorArr = ['#FFC000','#C6E584','#B0DC00','#9BC300','#84A600','#66aaff'];
		var typeNum = colorArr.length - 1;//给多少种颜色就查询前多少名的占比的数据
		baseAjax("WarrantHomePage/queryAssetProportion.asp",{typeNum : typeNum}, function(data) {
			if (data != undefined&&data!=null&&data.result==true) {
				var allDataRecord = new Array();//近一年的资产类型的所有数据
				var monthArr = new Array();//最近12个月
				var kindName = new Array();//类别名称
				var typeJsonStr = data.typeJsonStr;//类别名字json
				$.each( typeJsonStr, function( type_num, type_name ) { 
					kindName.push(type_name);//前几名的名称
				});
				kindName.push("其他");//补上其他类
	    		var countList = data.countList;//近一年所有的数据
	    		if(countList != null && countList.length > 0) {
	    			//for(var i = countList.length-1; i >= 0; i--) {//顺序
	    			for(var i = 0; i < countList.length; i++) {//倒序
	    				var month;
	    				if(i == 11){
	    					month = { name:countList[i].month, symbol:'emptyStar6', symbolSize:8 };
	    				}else if(i == countList.length/2 - 1){
	    					month = { name:countList[i].month, symbol:'star6', symbolSize:8 };
	    				}else{
	    					month = countList[i].month;
	    				}
	    				monthArr.push(month);//最近12个月
	    				var topAssetNum = countList[i].topAssetNum;//单月前几名的数据
	    				var otherAssetNum = countList[i].otherAssetNum;//单月其他类总和数据
	    				var oneRecord = [{value:otherAssetNum, name:'其他'}];//单月一个饼状图数据
	    				$.each( typeJsonStr, function( type_num, type_name ) { 
	    					var num = 0;//默认该月该类型的数量都为0
	    					var name = type_name;//
	    					for( var k = 0; k < topAssetNum.length; k++){
	    						var oneTopAsset = topAssetNum[k];
	    						if(oneTopAsset.WARR_TYPE == type_num){//若该月中该类型存在数据，则初始化该数据
	    							num = oneTopAsset.NUMX == undefined ? "0" : oneTopAsset.NUMX;
	    							//var jType = oneTopAsset.ASSET_TYPE;
	    							//name = data.typeJsonStr[jType];
	    						}
	    					}
	    					var detail = {value:num,name:name};
	    					oneRecord.push(detail);
	    				});
	    				var standardRecorderSeries = //把该月的数据转为echarts标准数据格式
	                        {
	                            name:'',
	                            type:'pie',
	                            center: ['50%', '45%'],
	                            radius: '50%',
	                            data:oneRecord
	                        };
	    				allDataRecord.push(standardRecorderSeries);
	    			}
	    		}
		     var option3 = {
		            timeline : {
		                data : monthArr,
		             
		                label : {
		                    formatter : function(s) {
		                        return s.slice(0, 7);
		                    }
		                }
		            },
		            options : [
		                {
		                    title : {
		                        text: '',
		                        subtext: ''
		                    },
		                    tooltip : {
		                        trigger: 'item',
		                        formatter: "{a} <br/>{b} : {c} ({d}%)"
		                    },
		                   color: colorArr,
		                    legend: {
		                       data:kindName
		                    },
		                    toolbox: {
		                        show :false,
		                        feature : {
		                            mark : {show: true},
		                            dataView : {show: true, readOnly: false},
		                            magicType : {
		                                show: true, 
		                                type: ['pie', 'funnel'],
		                                option: {
		                                    funnel: {
		                                        x: '25%',
		                                        width: '50%',
		                                        funnelAlign: 'left',
		                                        max: 1700
		                                    }
		                                }
		                            },
		                            restore : {show: true},
		                            saveAsImage : {show: true}
		                        }
		                    },
		                    series : [allDataRecord[0]]//默认显示的月份数据在这里初始化
		                }
		            ]
		       };
		     for(var i = 1; i < 12; i++){//其余第2到12月的数据
			       option3.options.push(
		    		   {
			            series : [allDataRecord[i]]
				        }
			       );
		      }                    
		      // 为echarts对象加载数据 
		      main_echarts2W2.setOption(option3);	
		  }else if(data && data.result == false){
	    	alert( data.msg);
	      }
		});
	}
	
	//为y轴数据展示好看，对其最大值进行处理
	function returnBeautifulFullNumber(maxCont){
		var maxContStr = maxCont+ "";
		var length = maxContStr.length;//获取最大值的长度
		var firstNum = maxContStr.substring(0, 1);//获取最大位数的值
		var finallyFirstNum;
		if(firstNum < 8){
			finallyFirstNum = parseInt(firstNum) + 1;//数值加1
		}else{
			finallyFirstNum = 10;
		}
		var finallyZero = "";
		var zeroNum = 0;
		while(zeroNum < length - 1){
			finallyZero += "0";
			zeroNum ++;
		}
		return parseInt(finallyFirstNum + finallyZero);
	}
	
	//初始化待办事项--------------------------------------------------最后的晚餐
	function initWarrantNeedToDealEvent(){
		baseAjax("WarrantHomePage/queryNeedToDeal.asp",null, function(data) {
			var ul = currTab.find("ul[class='applyANDapprove']");
			var index = 0;//待办事项统计
			if(data && data.result == "true"){
				//资产的待办
				if(data.applyNum){
					var li = '<li class="applyANDapproveList" page="assetapply" selObj="app_state" selVal="02"><span style="color:#fff;background:#9344FF;padding: 2px 4px;margin-right: 10px;">申</span>资产申请：'+
					data.applyNum+' 条</li>';
					ul.append(li);
					index += data.applyNum;
				}
				if(data.resignNum){
					var li = '<li class="applyANDapproveList" page="assetrecipients" selObj="receive_state" selVal="01"><span style="color:#fff;background:#28B779;padding: 2px 4px;margin-right: 10px;">领</span>资产领用登记：'+
					data.resignNum+' 条</li>';
					ul.append(li);
					index += data.resignNum;
				}
				var TranNum = data.TranNum;
				if(TranNum != null && TranNum.length > 0) {
					if(TranNum[i].TRANSFER_TYPE == "01"){//个人资产转移
						var li = '<li class="applyANDapproveList" page="employeeassettransfer" selObj="approve_state" selVal="02"><span style="color:#fff;background:#003267;padding: 2px 4px;margin-right: 10px;">个</span>个人资产转移：'+
						TranNum[i].NUM+' 条</li>';
						ul.append(li);
						index += TranNum[i].NUM;
					}else if(TranNum[i].TRANSFER_TYPE == "02"){//资产调拨
						var li = '<li class="applyANDapproveList" page="departassettransfer" selObj="approve_dept_state" selVal="02"><span style="color:#fff;background:#66AAFF;padding: 2px 4px;margin-right: 10px;">调</span>资产调拨：'+
						TranNum[i].NUM+' 条</li>';
						ul.append(li);
						index += TranNum[i].NUM;
					}
				}
				if(data.asignNum){
					var li = '<li class="applyANDapproveList" page="assettransf_assign" selObj="assign_state" selVal="01"><span style="color:#fff;background:#84A600;padding: 2px 4px;margin-right: 10px;">配</span>资产调拨分配：'+
					data.asignNum+' 条</li>';
					ul.append(li);
					index += data.asignNum;
				} 
				//权证的待办
				if(data.WarrantIn){
					var li = '<li class="applyANDapproveList" page="warrantstorage" selObj="ENTER_FLAG" selVal="00"><span style="color:#fff;background:#9344FF;padding: 2px 4px;margin-right: 10px;">入</span>权证入库：'+
					data.WarrantIn+' 条</li>';
					ul.append(li);
					index += data.WarrantIn;
				}
				if(data.WarrantOut){
					var li = '<li class="applyANDapproveList" page="warrantout" selObj="ENTER_FLAG" selVal="00"><span style="color:#fff;background:#28B779;padding: 2px 4px;margin-right: 10px;">出</span>权证出库：'+
					data.WarrantOut+' 条</li>';
					ul.append(li);
					index += data.WarrantOut;
				}
				if(data.draftSchemeNum){
					var li = '<li class="applyANDapproveList" page="inventoryschemelist" selObj="scheme_state" selVal="01"><span style="color:#fff;background:orange;padding: 2px 4px;margin-right: 10px;">待</span>待制定方案：'+
					data.draftSchemeNum+' 条</li>';
					ul.append(li);
					index += data.draftSchemeNum;
				} 
				currTab.find("[spn='totalDeal']").html("("+index+")");
				initNeedToDealButtonEvent();//初始化待办事项按钮事件
			}
		});
	}
	
	/**
	 * 初始化待办按钮事件
	 * page属性	 li跳转的页面的菜单编号
	 * selObj属性 跳转页面后要设置的下拉选的对象
	 * selVal属性 下拉选对象要设置的值 
	 */
	function initNeedToDealButtonEvent(){
		var liObj = $("ul[class='applyANDapprove'] li");
		for(var i = 0; i < liObj.length; i++){
			$(liObj[i]).click(function(){
				var obj = $(this);
				$.ajaxSettings.async = false;//设为同步，防止过滤不到信息
				pageDispatch2(obj.attr("page"),true,function(){
					var currTab2 = getCurrentPageObj();//跳转后的当前页
					var selObj = currTab2.find("[sel='"+obj.attr("selObj")+"']");
					selObj.val(obj.attr("selVal"));
					//selObj.select2();
					currTab2.find("[btn='query']").click();
					$.ajaxSettings.async = true;
				});
			});
		}
	}
	
}
