(function ($) {
    if(!sessionStorage ||
        (!sessionStorage.getItem('userLogStatus') || !sessionStorage.getItem('loginUser') || !sessionStorage.getItem('token'))) {
        $(window.location).attr('href', '../../#/login');
        return;
    }
    var baseUrl = '/api/v1',
        mapDataTimmer = null,
        chart = null,
        bmap = null,
        mapZoom = null,
        ecModel = null,
        bounds = null,
        bssw = null,
        bsne = null;

    var option = {
        backgroundColor: '#404a59',
        title: {
            text: '运维自动化监控',
            left: 'center',
            show:false,
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
                str = str + "<li>共 " + value[2] + " 台OKP主机</li>";
                str = str + "<li>故障 <span style='color:#f35d40;'>" + value[3] + "</span> 台设备</li>";
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
        bmap: {
            center: [],
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
                            'visibility': 'off'
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
                data: [],
                symbolSize: function (val) {
                    return 10**(val[2]/1000 + 1);
                },
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        color: "#fff",
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
                data: [],
                symbolSize: function (val) {
                    return 10**(val[2]/1000 + 1);
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
                        color: "#fff",
                        show: false
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

    /*
     *获取中心点及当前级别、最大最小级别
     */
    function getMapParms(){
        $.ajax({
            type: "get",
            dataType: "json",
            url: baseUrl + "/partner/map/setting",
            data: {},
            headers: {
                'Authorization': 'Onekeeper ' + sessionStorage.getItem('token')
            },
            success: function (data) {
                if(data && data.data) {
                    option.bmap.zoom = data.data.zoom;
                    option.bmap.center = [parseFloat(data.data.longitude), parseFloat(data.data.latitude)];
                    chart = echarts.init( document.getElementById("J_map"));
                    chart.setOption(option, true, true);

                    ecModel = chart._model;
                    ecModel.eachComponent('bmap', function (bmapModel) {
                        if(bmap == null){
                            bmap = bmapModel.__bmap;
                            //bmap.setMaxZoom(15);
                            //bmap.setMinZoom(4);
                            mapZoom = bmap.getZoom();
                            bounds = bmap.getBounds();
                            bssw = bounds.getSouthWest();   //可视区域左下角
                            bsne = bounds.getNorthEast();   //可视区域右上角
                        }
                    });
                    initMapListener();
                    getMapDataTimmer(mapZoom);
                }
            },
            error: function () {
                console.log("系统程序错误！");
            }
        });
    }

    function initMapListener(){
        bmap.addEventListener("zoomend", function(){
            mapZoom = this.getZoom();
            //console.log("地图缩放至：" + this.getZoom() + "级");
            bounds = bmap.getBounds();
            bssw = bounds.getSouthWest();   //可视区域左下角
            bsne = bounds.getNorthEast();   //可视区域右上角
            //console.log(bssw.lat,bssw.lng); //获取左下角的经纬度
            //console.log(bsne.lat,bsne.lng); //获取右上角的经纬度
            getMapDataTimmer(mapZoom);
        });
    }

    var convertData = function (data) {
        var res = [],colorValue;
        var normalColor = '#34cbff',
            warnColor = '#f35d40';
        var blue = '#1E90FF',
            yellow = '#FFFF00',
            orange = '#FFA500',
            red = '#FF4500';
        for (var i = 0; i < data.length; i++) {
            if(data[i].warn && data[i].warn >=1 &&  data[i].warn <= 3){
                colorValue = yellow;
            }else if(data[i].warn && data[i].warn >=4 &&  data[i].warn <= 10){
                colorValue = orange;
            }else if(data[i].warn && data[i].warn >=11){
                colorValue = red;
            }else{
                colorValue = blue;
            }
            res.push({
                name: data[i].name,
                value: data[i].coordinate.concat(data[i].value).concat(data[i].warn),
                itemStyle:{normal:{color:colorValue}}
            });
        }
        return res;
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
		   timer=setInterval(mar,30);
		});
	})

    var structScrollInfo = function(arrInfo){
        $("#J_scroll_info").html(" ");
        clearInterval(timer);
        if(arrInfo.length === 0){
            arrInfo = [
                "Status of interface GigabitEthernet0/0/16 was abnormal on Core_Switch_12.1.1.2 Status of interface GigabitEthernet0/0/16 was abnormal on Core_Switch_12.1.1.2",
                "2017-05-08 15:50:42 sh-db-002 Used space of file system /oracle was to high on 11gRAC",
                "2017-05-08 15:50:42 sh-db-002 Used space of file system /oracle was to high on 11gRAC",
                "2017-05-08 15:50:42 sh-db-002 Used space of file system /oracle was to high on 11gRAC",
                "2017-05-08 15:50:42 sh-db-002 Used space of file system /oracle was to high on 11gRAC",
                "2017-05-08 15:50:42 sh-db-002 Used space of file system /oracle was to high on 11gRAC",
                "2017-05-08 15:50:42 sh-db-002 Used space of file system /oracle was to high on 11gRAC",
                "2017-05-08 15:50:42 sh-db-002 Used space of file system /oracle was to high on 11gRAC"
            ];
        }
        var ul = $("<ul></ul>");
        var li = null;
        var divTime = null;
        var divInfo = null;
        for(var i=0;  i<arrInfo.length;i++){
            li = $("<li></li>");
            //divInfo = $("<div></div>");
            li.html(arrInfo[i]);
            //li.append(divInfo);
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
        setTimeout(getKeyTimmer,18000000);
    }

    //转换后台地图点接口数据
    function convertInterfaceData(data){
        var reArr = [];
        var objTemp = null;
        for(var i=0; i<data.length; i++){
            objTemp = {};
            objTemp.name = data[i].address;
            objTemp.coordinate = [data[i].longitude,data[i].latitude];
            objTemp.value = parseInt(data[i].site_total);
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
            //strTemp += transData(data[i].occure_at)+' ';
            strTemp += data[i].occure_at+' ';
            strTemp += data[i].site_name+' ';
            strTemp += data[i].content+' ';
            strTemp += data[i].severity
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

    function getMapDataTimmer(zoom){
        if(!zoom){
            zoom = mapZoom;
        }
        if(mapDataTimmer){
            clearTimeout(mapDataTimmer);
        }
        var tempArr = [];
        $.ajax({
            type: "get",
            dataType: "json",
            url: baseUrl + "/partner/map/allhosts",
            data: {
                zoom: zoom
            },
            headers: {
                'Authorization': 'Onekeeper ' + sessionStorage.getItem('token')
            },
            success: function (data) {
                if(data && data.data) {
                    tempArr = convertInterfaceData(data.data);
                    option.series[0].data = convertData(tempArr);
                    getMapWarnDataTimmer(tempArr, zoom);
                }
            },
            error: function () {
                //getMapWarnDataTimmer(dataMap);
                console.log("系统程序错误！");
            }
        });
        mapDataTimmer = setTimeout(getMapDataTimmer,20000);
    }

    function getMapWarnDataTimmer(arr, zoom){
        $.ajax({
            type: "get",
            dataType: "json",
            url: baseUrl + "/partner/map/problemhosts",
            data: {
                zoom: zoom
            },
            headers: {
                'Authorization': 'Onekeeper ' + sessionStorage.getItem('token')
            },
            success: function (data) {
                if(data && data.data) {
                    for(var i=0; i<data.data.length; i++){
                        for(var j=0; j<arr.length; j++){
                            if(data.data[i].address == arr[j].name){
                                arr[j].warn = parseInt(data.data[i].site_total);
                            }
                        }
                    }
                    option.series[1].data = convertData(arr.sort(function (a, b) {
                        return b.value - a.value;
                    }).slice(0, 5));
                    var objTemp = {
                        bmap:{
                          zoom: zoom
                        },
                        series:option.series
                    };
                    chart.setOption(objTemp);
                }
            },
            error: function () {
                var objTemp = {
                    bmap:{
                        zoom: zoom
                    }
                };
                chart.setOption(objTemp);
                console.log("系统程序错误！");
            }
        });
    }

    function getScrollDataTimmer(){
        $.ajax({
            type: "get",
            dataType: "json",
            url: baseUrl + "/partner/map/alertcontents",
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


    getMapParms();
    getScrollDataTimmer();
    getKeyTimmer();

})(jQuery);
