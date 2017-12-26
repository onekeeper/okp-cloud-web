(function ($) {
    if(!sessionStorage ||
        (!sessionStorage.getItem('userLogStatus') || !sessionStorage.getItem('loginUser') || !sessionStorage.getItem('token'))) {
        $(window.location).attr('href', '../../#/login');
        return;
    }
    var baseUrl = '/api/v1',
        rangeTime = 30*24*60;//临时：30天
        //rangeTime = 3(获取3分钟内的数据)
		var dataMap = [
			{name: '杭州市', value: 9, warn: 0},
			{name: '台州市', value: 9, warn: 0},
			{name: '宁波市', value: 9, warn: 0},
			{name: '天津市', value: 9, warn: 0},
			{name: '温州市', value: 9, warn: 0},
			{name: '南京市', value: 9, warn: 0},
			{name: '衢州市', value: 9, warn: 0},
			{name: '扬州市', value: 9, warn: 0},
			{name: '广州市', value: 9, warn: 0},
			{name: '长沙市', value: 9, warn: 0},
			{name: '丽水市', value: 9, warn: 0},
			{name: '湖州市', value: 9, warn: 0},
			{name: '金华市', value: 9, warn: 0},
			{name: '大连市', value: 9, warn: 0},
		];
	
		
		var geoCoordMap = {
			'杭州市':[120.219375,30.259244],
			'台州市':[121.440613,28.668283],
			'宁波市':[121.579006,29.885259],
			'天津市':[117.210813,39.14393],
			'温州市':[120.690635,28.002838],
			'南京市':[118.778074,32.057236],
			'衢州市':[118.875842,28.95691],
			'扬州市':[119.427778,32.408505],
			'广州市':[113.30765,23.120049],
			'长沙市':[112.979353,28.213478],
			'丽水市':[119.929576,28.4563],
			'湖州市':[120.137243,30.877925],
			'金华市':[119.652576,29.102899],
			'大连市':[121.593478,38.94871],
		};

	var convertData = function (data) {
		var res = [],colorValue;
		var normalColor = '#34cbff',
		warnColor = '#f35d40';
		for (var i = 0; i < data.length; i++) {
			var geoCoord = geoCoordMap[data[i].name];
			if (geoCoord) {
				if(data[i].warn){
				   colorValue = warnColor;
				}else{
				   colorValue = normalColor;
				}
				res.push({
					name: data[i].name,
					value: geoCoord.concat(data[i].value).concat(data[i].warn),
					itemStyle:{normal:{color:colorValue}}
				});
			}
		}
		return res;
	};

	var option = {
		backgroundColor: '#404a59',
		title: {
			text: '运维自动化监控',
			left: 'center',
			top:36,
			textStyle: {
				color: '#fff',
				fontSize: 24
			}
		},
		tooltip : {
			trigger: 'item',
			formatter: function (params) {
				var obj = params;//JSON.parse(JSON.stringify(params));
				var itemName = obj.name;
				var value = obj.value;
				var str = "<ur style='text-align:left;list-style:none;'><li style='font-weight:bolder;'>" + itemName + "</li>";
				str = str + "<li>共 " + value[2] + " 台主机</li>";
				str = str + "<li>故障 <span style='color:#f35d40;'>" + value[3] + "</span> 台</li>";
				str = str + "</ul>";
				return str;
			}
		},
		legend: {
			orient: 'vertical',
			y: 'bottom',
			x:'right',
			data:['pm2.5'],
			textStyle: {
				color: '#fff'
			}
		},
		/*
		geo: {
			map: 'china',//浙江
			label: {
				emphasis: {
					show: false
				}
			},
			roam: true,
			itemStyle: {
				normal: {
					areaColor: '#323c48',
					borderColor: '#111'
				},
				emphasis: {
					areaColor: '#2a333d'
				}
			}
		},*/
		bmap: {
			center: [120.219375,30.259244],
			zoom: 6,
			roam: true,  //支持滚轮放大缩小
			mapStyle: {
				styleJson: [
                {
                  'featureType': 'water',
                  'elementType': 'all',
                  'stylers': {
                    'color': '#00173D'
                  }
                },
                {
                  'featureType': 'land',
                  'elementType': 'geometry',
                  'stylers': {
                    'color': '#000004'
                  }
                },
                {
                  'featureType': 'highway',
                  'elementType': 'all',
                  'stylers': {
                    'visibility': 'off'
                  }
                },
                {
                  'featureType': 'arterial',
                  'elementType': 'geometry.fill',
                  'stylers': {
                    'color': '#000000'
                  }
                },
                {
                  'featureType': 'arterial',
                  'elementType': 'geometry.stroke',
                  'stylers': {
                    'color': '#365D7B'
                  }
                },
                {
                  'featureType': 'local',
                  'elementType': 'geometry',
                  'stylers': {
                    'color': '#000000'
                  }
                },
                {
                  'featureType': 'railway',
                  'elementType': 'geometry.fill',
                  'stylers': {
                    'color': '#000000'
                  }
                },
                {
                  'featureType': 'railway',
                  'elementType': 'geometry.stroke',
                  'stylers': {
                    'color': '#08304b'
                  }
                },
                {
                  'featureType': 'subway',
                  'elementType': 'geometry',
                  'stylers': {
                    'lightness': -70
                  }
                },
                {
                  'featureType': 'building',
                  'elementType': 'geometry.fill',
                  'stylers': {
                    'color': '#000000'
                  }
                },
                {
                  'featureType': 'all',
                  'elementType': 'labels.text.fill',
                  'stylers': {
                    'color': '#857f7f'
                  }
                },
                {
                  'featureType': 'all',
                  'elementType': 'labels.text.stroke',
                  'stylers': {
                    'color': '#000000'
                  }
                },
                {
                  'featureType': 'building',
                  'elementType': 'geometry',
                  'stylers': {
                    'color': '#022338'
                  }
                },
                {
                  'featureType': 'green',
                  'elementType': 'geometry',
                  'stylers': {
                    'color': '#062032'
                  }
                },
                {
                  'featureType': 'boundary',
                  'elementType': 'all',
                  'stylers': {
                    'color': '#365D7B'
                  }
                },
                {
                  'featureType': 'manmade',
                  'elementType': 'all',
                  'stylers': {
                    'color': '#022338'
                  }
                },
                {
                  'featureType': 'label',
                  'elementType': 'all',
                  'stylers': {
                    'visibility': 'on'
                  }
                },
				{
					"featureType": "label",
					"elementType": "labels.icon",
                    "stylers": {
                      "visibility": "off"
                    }
				}
			   ]
			}
		},
		series : [
			{
				name: '站点数量',
				type: 'scatter',
				coordinateSystem: 'bmap',
				data: convertData(dataMap),
				symbolSize: function (val) {
					return val[2] / 10;
				},
				label: {
					normal: {
						formatter: '{b}',
						position: 'right',
						show: false
					},
					emphasis: {
						show: true
					}
				},
				itemStyle: {
					normal: {
						color: '#ddb926'
					}
				}
			},{
				name: 'Top 5',
				type: 'effectScatter',
				coordinateSystem: 'bmap',
				data: convertData(dataMap.sort(function (a, b) {
					return b.value - a.value;
				}).slice(0, 6)),
				symbolSize: function (val) {
					return val[2] / 10;
				},
				showEffectOn: 'render',
				rippleEffect: {
					brushType: 'stroke'
				},
				hoverAnimation: true,
				label: {
					normal: {
						formatter: '{b}',
						position: 'right',
						show: true
					}
				},
				itemStyle: {
					normal: {
						color: '#f4e925',
						shadowBlur: 10,
						shadowColor: '#333'
					}
				},
				zlevel: 1
			}
		]
	};


	function getid(id){
		return document.getElementById(id);
	}

	//滚动栏部分-------------------//
	function mar(){
		if(t2.offsetTop<=t.scrollTop){
			t.scrollTop-=t1.offsetHeight;
		}else{
			t.scrollTop++;
		}
	}

	var t=getid("J_scroll"),t1=getid("J_scroll_info"),t2=getid("J_scroll_help"),timer;
	$(function(){
		$("#J_scroll").mouseover(function(){
		   clearInterval(timer);
		}).mouseout(function(){
		   timer=setInterval(mar,30)
		});
	})

	var structScrollInfo = function(arrInfo){
		$("#J_scroll_info").html(" ");
		clearInterval(timer);
		if(arrInfo.length==0){
		   arrInfo = [
				"Status of interface \"GigabitEthernet0/0/16\" was abnormal on Core_Switch_12.1.1.2",
				"\"2017-05-08 15:50:42\" \"sh-db-002\" \"Used space of file system\" /oracle was to high on 11gRAC",
				"\"2017-05-08 15:50:42\" \"sh-db-002\" \"Used space of file system\" /oracle was to high on 11gRAC",
				"\"2017-05-08 15:50:42\" \"sh-db-002\" \"Used space of file system\" /oracle was to high on 11gRAC",
				"\"2017-05-08 15:50:42\" \"sh-db-002\" \"Used space of file system\" /oracle was to high on 11gRAC",
				"\"2017-05-08 15:50:42\" \"sh-db-002\" \"Used space of file system\" /oracle was to high on 11gRAC"
		   ];
		}
		var ul = $("<ul></ul>");
		var li = null;
		var divTime = null;
		var divInfo = null;
		for(var i=0;  i<arrInfo.length;i++){
			li = $("<li></li>");
			divInfo = $("<div></div>");
			divInfo.html(arrInfo[i]);
			li.append(divInfo);
			ul.append(li);
		}
		$("#J_scroll_info").append(ul);
		t2.innerHTML=t1.innerHTML;
		timer=setInterval(mar,30);
	};

    //get key every 30min
    function getKeyTimmer(){
        $.ajax({
            type:"get",
            dataType: "json",
            url:baseUrl + "/partner/refresh",
            data:{},
            async:false,
            headers: {
                'Authorization' : 'Onekeeper '+sessionStorage.getItem('freshToken')
            },
            success:function(data){
                sessionStorage.setItem('token',data.data.access_token);
            },
            error:function(){
                console.log("系统程序错误！");
            }
        });
        setTimeout(getKeyTimmer,18000000)
    }

    //转换后台地图点接口数据
    function convertInterfaceData(data){
        var reArr = [];
        var objTemp = null;
        for(var i=0; i<data.length; i++){
            objTemp = {};
            objTemp.name = data[i].city_name;
            objTemp.value = data[i].site_total;
            objTemp.warn = 0;
            reArr.push(objTemp);
        }
        return reArr;
    }

    //转换后台地图告警接口数据
    function convertWarnInfo(data){
        var reArr = [];
        var strTemp = '';
        for(var i=0; i < data.length; i++){
            strTemp = '';
            strTemp += '"'+transData(data[i].occure_at)+'"';
            strTemp += '"'+data[i].host+'"';
            strTemp += '"'+data[i].content+'"';
            reArr.push(strTemp);
        }
        return reArr;
    }

    //时间格式及+8
    function transData(time){
        time = time.replace(/-/g,'/');
        time = time.replace(/T/g,' ');
        var date = new Date (time);
        var year = date.getFullYear();
        date.setHours (date.getHours () + 8);
        var m = date.getMonth () + 1;
        m = m < 10 ? "0" + m : m;
        var d = date.getDate ();
        d = d < 10 ? "0" + d : d;
        var h = date.getHours ();
        h = h < 10 ? "0" + h : h;
        var mm = date.getMinutes ();
        mm = mm < 10 ? "0" + mm : mm;
        var ss = date.getSeconds ();
        ss = ss < 10 ? "0" + ss : ss;
        var res = year+ '-' +m + "-" + d + " " + h + ":" + mm+ ":"+ss;
        return res;
    }

    var chart = echarts.init( document.getElementById("J_map"));
    function getMapDataTimmer(){
        var tempArr = [];
        $.ajax({
            type: "get",
            dataType: "json",
            url: baseUrl + "/partner/states/allhosts",
            data: {},
            async: false,
            headers: {
                'Authorization': 'Onekeeper ' + sessionStorage.getItem('token')
            },
            success: function (data) {
                if(data && data.data) {
                    tempArr = convertInterfaceData(data.data);
                    option.series[0].data = convertData(tempArr);
                    getMapWarnDataTimmer(tempArr);
                }
            },
            error: function () {
                getMapWarnDataTimmer(dataMap);
                console.log("系统程序错误！");
            }
        });
        setTimeout(getMapDataTimmer,20000);
    }

    function getMapWarnDataTimmer(arr){
        $.ajax({
            type: "get",
            dataType: "json",
            url: baseUrl + "/partner/map/problemhosts?timedelta="+ rangeTime,
            data: {},
            async: false,
            headers: {
                'Authorization': 'Onekeeper ' + sessionStorage.getItem('token')
            },
            success: function (data) {
                if(data && data.data) {
                    for(var i=0; i<data.data.length; i++){
                        for(var j=0; j<arr.length; j++){
                            if(data.data[i].city_name == arr[j].name){
                                arr[j].warn = data.data[i].site_total;
                            }
                        }
                    }
                    option.series[1].data = convertData(arr.sort(function (a, b) {
                        return b.value - a.value;
                    }).slice(0, 6));
                    chart.setOption(option);
                }
            },
            error: function () {
                chart.setOption(option);
                console.log("系统程序错误！");
            }
        });
    }

    function getScrollDataTimmer(){
        $.ajax({
            type: "get",
            dataType: "json",
            url: baseUrl + "/partner/map/contents?timedelta=" + rangeTime,
            data: {},
            async: false,
            headers: {
                'Authorization': 'Onekeeper ' + sessionStorage.getItem('token')
            },
            success: function (data) {
                if(data && data.data) {
                    structScrollInfo(convertWarnInfo(data.data));
                }
            },
            error: function () {
                structScrollInfo([]);
                console.log("系统程序错误！");
            }
        });
        setTimeout(getScrollDataTimmer,20000);
    }

    getMapDataTimmer();
    getScrollDataTimmer();
    getKeyTimmer();

})(jQuery);
