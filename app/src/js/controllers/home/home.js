'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
  	.controller('HomeCtrl', function ($scope, $rootScope, $http, $timeout, $interval, AjaxServer, urlPrefix) {
		$scope.cache = {
            runningTasks:[
                {
                    id:1,
                    jobName:'xxxx',
                    jobGroup:'xxxx',
                    jobGroupId:1,
                    jobFile:'xxxx',
                    jobStatus:'xxxx',
                    startTime:'2017-04-10 09:24',
                    endTime:'2017-04-10 09:24',
                    continuedTime:1,//频率
                    logMsg:'',
                    errMsg:'',
                    linesRead:1,
                    linesWritten:1,
                    linesUpdated:1,
                    linesInput:1,
                    linesOutput:1,
                    linesError:1,
                    linesDeleted:1,
                    userId:'xxx',
                    idCluster:1,
                    idSlave:1,
                    idBatch:1,
                    idLogchannel:'xxx'
                },
                {
                    id:1,
                    jobName:'xxxx',
                    jobGroup:'xxxx',
                    jobGroupId:1,
                    jobFile:'xxxx',
                    jobStatus:'xxxx',
                    startTime:'2017-04-10 09:24',
                    endTime:'2017-04-10 09:24',
                    continuedTime:1,//频率
                    logMsg:'',
                    errMsg:'',
                    linesRead:1,
                    linesWritten:1,
                    linesUpdated:1,
                    linesInput:1,
                    linesOutput:1,
                    linesError:1,
                    linesDeleted:1,
                    userId:'xxx',
                    idCluster:1,
                    idSlave:1,
                    idBatch:1,
                    idLogchannel:'xxx'
                },
                {
                    id:1,
                    jobName:'xxxx',
                    jobGroup:'xxxx',
                    jobGroupId:1,
                    jobFile:'xxxx',
                    jobStatus:'xxxx',
                    startTime:'2017-04-10 09:24',
                    endTime:'2017-04-10 09:24',
                    continuedTime:1,//频率
                    logMsg:'',
                    errMsg:'',
                    linesRead:1,
                    linesWritten:1,
                    linesUpdated:1,
                    linesInput:1,
                    linesOutput:1,
                    linesError:1,
                    linesDeleted:1,
                    userId:'xxx',
                    idCluster:1,
                    idSlave:1,
                    idBatch:1,
                    idLogchannel:'xxx'
                },
                {
                    id:1,
                    jobName:'xxxx',
                    jobGroup:'xxxx',
                    jobGroupId:1,
                    jobFile:'xxxx',
                    jobStatus:'xxxx',
                    startTime:'2017-04-10 09:24',
                    endTime:'2017-04-10 09:24',
                    continuedTime:1,//频率
                    logMsg:'',
                    errMsg:'',
                    linesRead:1,
                    linesWritten:1,
                    linesUpdated:1,
                    linesInput:1,
                    linesOutput:1,
                    linesError:1,
                    linesDeleted:1,
                    userId:'xxx',
                    idCluster:1,
                    idSlave:1,
                    idBatch:1,
                    idLogchannel:'xxx'
                },
                {
                    id:1,
                    jobName:'xxxx',
                    jobGroup:'xxxx',
                    jobGroupId:1,
                    jobFile:'xxxx',
                    jobStatus:'xxxx',
                    startTime:'2017-04-10 09:24',
                    endTime:'2017-04-10 09:24',
                    continuedTime:1,//频率
                    logMsg:'',
                    errMsg:'',
                    linesRead:1,
                    linesWritten:1,
                    linesUpdated:1,
                    linesInput:1,
                    linesOutput:1,
                    linesError:1,
                    linesDeleted:1,
                    userId:'xxx',
                    idCluster:1,
                    idSlave:1,
                    idBatch:1,
                    idLogchannel:'xxx'
                },
                {
                    id:1,
                    jobName:'xxxx',
                    jobGroup:'xxxx',
                    jobGroupId:1,
                    jobFile:'xxxx',
                    jobStatus:'xxxx',
                    startTime:'2017-04-10 09:24',
                    endTime:'2017-04-10 09:24',
                    continuedTime:1,//频率
                    logMsg:'',
                    errMsg:'',
                    linesRead:1,
                    linesWritten:1,
                    linesUpdated:1,
                    linesInput:1,
                    linesOutput:1,
                    linesError:1,
                    linesDeleted:1,
                    userId:'xxx',
                    idCluster:1,
                    idSlave:1,
                    idBatch:1,
                    idLogchannel:'xxx'
                },
                {
                    id:1,
                    jobName:'xxxx',
                    jobGroup:'xxxx',
                    jobGroupId:1,
                    jobFile:'xxxx',
                    jobStatus:'xxxx',
                    startTime:'2017-04-10 09:24',
                    endTime:'2017-04-10 09:24',
                    continuedTime:1,//频率
                    logMsg:'',
                    errMsg:'',
                    linesRead:1,
                    linesWritten:1,
                    linesUpdated:1,
                    linesInput:1,
                    linesOutput:1,
                    linesError:1,
                    linesDeleted:1,
                    userId:'xxx',
                    idCluster:1,
                    idSlave:1,
                    idBatch:1,
                    idLogchannel:'xxx'
                },
                {
                    id:1,
                    jobName:'xxxx',
                    jobGroup:'xxxx',
                    jobGroupId:1,
                    jobFile:'xxxx',
                    jobStatus:'xxxx',
                    startTime:'2017-04-10 09:24',
                    endTime:'2017-04-10 09:24',
                    continuedTime:1,//频率
                    logMsg:'',
                    errMsg:'',
                    linesRead:1,
                    linesWritten:1,
                    linesUpdated:1,
                    linesInput:1,
                    linesOutput:1,
                    linesError:1,
                    linesDeleted:1,
                    userId:'xxx',
                    idCluster:1,
                    idSlave:1,
                    idBatch:1,
                    idLogchannel:'xxx'
                },
                {
                    id:1,
                    jobName:'xxxx',
                    jobGroup:'xxxx',
                    jobGroupId:1,
                    jobFile:'xxxx',
                    jobStatus:'xxxx',
                    startTime:'2017-04-10 09:24',
                    endTime:'2017-04-10 09:24',
                    continuedTime:1,//频率
                    logMsg:'',
                    errMsg:'',
                    linesRead:1,
                    linesWritten:1,
                    linesUpdated:1,
                    linesInput:1,
                    linesOutput:1,
                    linesError:1,
                    linesDeleted:1,
                    userId:'xxx',
                    idCluster:1,
                    idSlave:1,
                    idBatch:1,
                    idLogchannel:'xxx'
                }

                ]
        };
  		$scope.init = function () {
            $rootScope.pagePath = '';
  			$scope.loadLineChart();
  			adjustFontSize();

  			var dom = document.getElementById("J_task");
  			drawCircle(dom,"25","任务总数", 0.8);

  			$(window).on("resize", adjustFontSize);

            $scope.getJobs();
  		}

  		function adjustFontSize() {
  			var height = $(window).height();
			var fontSize = height/75;
			$("html").css("font-size", fontSize + 'px');
			$scope.apply();
  		}

  		$scope.loadLineChart = function () {
            /*
  			var cpu = angular.element("#J_CPU")[0],
  				memory = angular.element("#J_memory")[0],
  				disk = angular.element("#J_disk")[0],
  				optCpu = {
  					title: {
  						text: "CPU(最近一小时)",
  						x: "百分比(%)",
  						y: "分钟(min)"
  					}
  				},
  				optMemery = {
  					title: {
  						text: "内存(最近一小时)",
  						x: "百分比(%)",
  						y: "分钟(min)"
  					}
  				},
  				optDisk = {
  					title: {
  						text: "磁盘(最近30天)",
  						x: "百分比(%)",
  						y: "天(day)"
  					}
  				};
  			createPolyline(cpu, optCpu);
  			createPolyline(memory, optMemery);
  			createPolyline(disk, optDisk);
            */
            $scope.getCPU();
            $scope.getMemory();
            $scope.getDisk();
  		}

  		/*
			opt : {
				title: {
					text: '',
					x: "",
					y： ""
				},
				xData: '',
				yData: ''

			}
  		*/
		function createPolyline( dom, opt ) {
			var ec = echarts.init(dom);
			var option = {
			    title: {
			        left: 'left',
			        text: opt.title.text,
			        subtext: "x: "+opt.title.x+"  y: " + opt.title.y,
			        textStyle: {
			        	fontWeight: '400'
			        }
			    },
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}:{c}',
                    position: function (pt) {
                        return [pt[0]-60, pt[1]-55];
                    }
                },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: opt.xData || (function(flag){
			        	var arr = [];
			        	var i = 0;
			        	while( i<=60 ) {
			        		arr.push(i);
			        		i ++;
			        	}
			        	return arr;
			        })(60)
			    },
			    yAxis: {
			        type: 'value',
			    },
			    series: [
			        {
			            type:'line',
			            smooth:true,
			            symbol: 'none',
			            sampling: 'average',
                        silent: false,
			            itemStyle: {
			                normal: {
			                    color: 'rgb(98,194,255)'
			                }
			            },
			            areaStyle: {
			                normal: {
			                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
			                        offset: 0,
			                        color: 'rgb(51,171,249)'
			                    }, {
			                        offset: 1,
			                        color: 'rgb(171,219,243)'
			                    }])
			                }
			            },
			            data: opt.yData || (function(flag){
				        	var arr = [];
				        	var i = 0;
				        	while( i<=60 ) {
				        		arr.push(~~(100*Math.random()));
				        		i ++;
				        	}
				        	return arr;
				        })(60)
			        }
			    ]
			};
			ec.setOption(option);
			window.addEventListener("resize", ec.resize);
		}

		function createRing( dom, opt ) {

			chart.setOption(option);
			window.addEventListener("resize", chart.resize);
		}

		function drawCircle(dom,text1,text2,ratio,bool){
			var height = dom.clientHeight;
			var width = dom.clientWidth;
			var padding_left = getComputedStyle(dom)['padding-left'];
			var padding_right = getComputedStyle(dom)['padding-right'];
			var padding_top = getComputedStyle(dom)['padding-top'];
			var padding_bottom = getComputedStyle(dom)['padding-bottom'];
			padding_left = +padding_left.substring(0, padding_left.length-2);
			padding_right = +padding_right.substring(0, padding_right.length-2);
			padding_top = +padding_top.substring(0, padding_top.length-2);
			padding_bottom = +padding_bottom.substring(0, padding_bottom.length-2);
			var canvas = document.createElement("canvas");
			canvas.height = height - padding_top - padding_bottom;
			canvas.width = width - padding_left - padding_right;
			dom.appendChild(canvas);
			var ctx=canvas.getContext("2d");;
			var radius = canvas.width <= canvas.height ? (canvas.width-40)/2 : (canvas.height-40)/2;
			var center = {
				x: canvas.width/2,
				y: canvas.height/2
			}
			ctx.beginPath();
			ctx.lineWidth = 10;
			ctx.arc(center.x,center.y,radius,0,2*Math.PI*ratio, false);
			ctx.textAlign = 'center';
			ctx.textBaseline="top";
			ctx.fillStyle = '#5fc1fe';
			ctx.fillText(text2,center.x, center.y);
			ctx.textBaseline="bottom";
			if(bool){
				ctx.fillStyle = '#1FB5AD';
			}else{
				ctx.fillStyle = '#5fc1fe';
			}
			ctx.font="20px 微软雅黑";
			ctx.fillText(text1,center.x, center.y);
			//ctx.strokeStyle = "#FF6C60";
			if(bool){
				ctx.strokeStyle = '#1FB5AD';
			}else{
				ctx.strokeStyle = '#5fc1fe';
			}
			ctx.stroke();
			ctx.beginPath();
			if(ratio == 0){
				ctx.arc(center.x,center.y,radius,0,2*Math.PI, true);
			}else{
				ctx.arc(center.x,center.y,radius,0,2*Math.PI*ratio, true);
			}
			ctx.strokeStyle = '#ffa7a9';
			ctx.stroke();
			ctx.closePath();
		}

        $scope.getCPU = function() {
            var config = {
                url: urlPrefix + '/system/cpu',
                method: 'get'
            },
            fnSuccess = function (data) {
                var cpu = angular.element("#J_CPU").empty()[0];
                var optCpu = {
                    title: {
                        text: "CPU(最近一小时)",
                        x: "百分比(%)",
                        y: "分钟(min)"
                    },
                    yData: data.map(function(item){
                        return item.used;
                    }),
                };
                createPolyline(cpu, optCpu);
            },
            fnError = function (data) {

            };
            AjaxServer.ajaxInfo(config, fnSuccess, fnError);
        }

        $scope.getMemory = function () {
            var config = {
                url: urlPrefix + '/system/memory',
                method: 'get'
            },
            fnSuccess = function (data) {
                var memory = angular.element("#J_memory").empty()[0];
                var optMemory = {
                    title: {
                        text: "CPU(最近一小时)",
                        x: "百分比(%)",
                        y: "分钟(min)"
                    },
                    yData: data.map(function(item){
                        return item.used;
                    }),
                };
                createPolyline(memory, optMemory);
            },
            fnError = function (data) {

            };
            AjaxServer.ajaxInfo(config, fnSuccess, fnError);
        }

        $scope.getDisk = function () {
            var config = {
                url: urlPrefix + '/system/disk',
                method: 'get'
            },
            fnSuccess = function (data) {
                var disk = angular.element("#J_disk").empty()[0];
                var optDisk = {
                    title: {
                        text: "CPU(最近30天)",
                        x: "百分比(%)",
                        y: "分钟(min)"
                    },
                    yData: data.map(function(item){
                        return item.used;
                    }),
                };
                createPolyline(disk, optDisk);
            },
            fnError = function (data) {

            };
            AjaxServer.ajaxInfo(config, fnSuccess, fnError);
        }

        $scope.getJobs = function (data) {
            var config = {
                url: urlPrefix + '/system/job',
                method: 'get'
            },
            fnSuccess = function (data) {
                $scope.cache.runningTasks = data;
                $scope.apply();
            },
            fnError = function (data) {

            };
            AjaxServer.ajaxInfo(config, fnSuccess, fnError);
        }

  		$scope.apply = function() {
			if(!$scope.$$phase) {
			    $scope.$apply();
			}
		}
  	});
