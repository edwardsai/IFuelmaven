// 基于准备好的dom，初始化echarts图表
        var main_echarts1W = echarts.init(document.getElementById('main_echarts1W'));
        var main_echarts2W = echarts.init(document.getElementById('main_echarts2W'));
        var index_qzcr = echarts.init(document.getElementById('index_qzcr'));
        
        var option = {
        	    title : {
        	        text: '',
        	        subtext: ''
        	    },
        	    tooltip : {
        	        trigger: 'axis'
        	    },
        	    legend: {
        	        data:['IT资产','一般资产']
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
        	            data : ['2016','2016-02','2016-04','2016-08','2016-10','2016-10','2016-12']
        	        }
        	    ],
        	    yAxis : [
        	        {
        	            type : 'value',
        	           axisLabel : {
        	                formatter: '{value}'
        	            },
        	          min:0,
        	          max:30000,
        	          calculable: false,
        	            splitNumber:6
        	          
        	        }
        	    ],
        	    series : [
        	        {
        	            name:'IT资产',
        	            type:'line',
        	            data:[6000, 15500, 20500, 5600, 12000, 29000, 23000],
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
        	            name:'一般资产',
        	            type:'line',
        	            data:[10000,22000,30000, 15000, 23000, 26000, 21000],
        	            markPoint : {
        	                data : [
        	                    {name : '最小值', value : 0, xAxis: 1, yAxis: -1.5}
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
        main_echarts1W.setOption(option); 
        
        var idx = 1;
       var option = {
            timeline : {
                data : [
                    '2016-01-01', '2016-02-01', '2016-03-01', '2016-04-01', '2016-05-01',
                    { name:'2016-06-01', symbol:'emptyStar6', symbolSize:8 },
                    '2016-07-01', '2016-08-01', '2016-09-01', '2016-10-01', '2016-11-01',
                    { name:'2016-12-01', symbol:'star6', symbolSize:8 }
                ],
             
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
                   color: ['#FFC000','#C6E584','#B0DC00','#9BC300','#84A600'],
                    legend: {
                       data:['设备分类一','设备分类二','设备分类三','设备分类四','设备分类五']
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
                    series : [
                        {
                            name:'',
                            type:'pie',
                            center: ['50%', '45%'],
                            radius: '50%',
                            data:[
                            	   {value:1248, name:'设备分类一'},
                	                {value:1310, name:'设备分类二'},
                	                {value:2234, name:'设备分类三'},
                	                {value:735, name:'设备分类四'},
                	                {value:1035, name:'设备分类五'}
                            ]
                        }
                    ]
                },
                {
                    series : [
                        {
                            name:'',
                            type:'pie',
                            data:[
                               {value:1548, name:'设备分类一'},
                	                {value:310, name:'设备分类二'},
                	                {value:134, name:'设备分类三'},
                	                {value:95, name:'设备分类四'},
                	                {value:335, name:'设备分类五'}
                            ]
                        }
                    ]
                },
                {
                    series : [
                        {
                            name:'',
                            type:'pie',
                            data:[
                                  {value:1548, name:'设备分类一'},
                	                {value:310, name:'设备分类二'},
                	                {value:234, name:'设备分类三'},
                	                {value:135, name:'设备分类四'},
                	                {value:335, name:'设备分类五'}
                            ]
                        }
                    ]
                },
                {
                    series : [
                        {
                            name:'',
                            type:'pie',
                            data:[
                                {value:1848, name:'设备分类一'},
                	                {value:110, name:'设备分类二'},
                	                {value:234, name:'设备分类三'},
                	                {value:335, name:'设备分类四'},
                	                {value:775, name:'设备分类五'}
                            ]
                        }
                    ]
                },
                {
                    series : [
                        {
                            name:'',
                            type:'pie',
                            data:[
                               {value:148, name:'设备分类一'},
                	                {value:710, name:'设备分类二'},
                	                {value:214, name:'设备分类三'},
                	                {value:735, name:'设备分类四'},
                	                {value:335, name:'设备分类五'}
                            ]
                        }
                    ]
                },
                {
                    series : [
                        {
                            name:'',
                            type:'pie',
                            data:[
                               {value:1548, name:'设备分类一'},
                	                {value:310, name:'设备分类二'},
                	                {value:234, name:'设备分类三'},
                	                {value:135, name:'设备分类四'},
                	                {value:335, name:'设备分类五'}
                            ]
                        }
                    ]
                },
                {
                    series : [
                        {
                            name:'',
                            type:'pie',
                            data:[
                                {value:348, name:'设备分类一'},
                	                {value:710, name:'设备分类二'},
                	                {value:134, name:'设备分类三'},
                	                {value:135, name:'设备分类四'},
                	                {value:335, name:'设备分类五'}
                            ]
                        }
                    ]
                },
                {
                    series : [
                        {
                            name:'',
                            type:'pie',
                            data:[
                                {value:1148, name:'设备分类一'},
                	                {value:910, name:'设备分类二'},
                	                {value:234, name:'设备分类三'},
                	                {value:105, name:'设备分类四'},
                	                {value:335, name:'设备分类五'}
                            ]
                        }
                    ]
                },
                {
                    series : [
                        {
                            name:'',
                            type:'pie',
                            data:[
                               {value:1548, name:'设备分类一'},
                	                {value:310, name:'设备分类二'},
                	                {value:534, name:'设备分类三'},
                	                {value:135, name:'设备分类四'},
                	                {value:735, name:'设备分类五'}
                            ]
                        }
                    ]
                },
                {
                    series : [
                        {
                            name:'',
                            type:'pie',
                            data:[
                                {value:1048, name:'设备分类一'},
                	                {value:310, name:'设备分类二'},
                	                {value:834, name:'设备分类三'},
                	                {value:135, name:'设备分类四'},
                	                {value:135, name:'设备分类五'}
                            ]
                        }
                    ]
                },
                {
                    series : [
                        {
                            name:'',
                            type:'pie',
                            data:[
                               {value:348, name:'设备分类一'},
                	                {value:310, name:'设备分类二'},
                	                {value:834, name:'设备分类三'},
                	                {value:135, name:'设备分类四'},
                	                {value:1335, name:'设备分类五'}
                            ]
                        }
                    ]
                },
                {
                    series : [
                        {
                            name:'',
                            type:'pie',
                            data:[
                              {value:148, name:'设备分类一'},
                	                {value:310, name:'设备分类二'},
                	                {value:234, name:'设备分类三'},
                	                {value:135, name:'设备分类四'},
                	                {value:335, name:'设备分类五'}
                            ]
                        }
                    ]
                }
            ]
        };
                            
        // 为echarts对象加载数据 
        main_echarts2W.setOption(option);
        
        
        
        
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
        	            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
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
        	            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
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
        	            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        	            markPoint : {
        	                data : [
        	                    {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
        	                    {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
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