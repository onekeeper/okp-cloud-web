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
		 {name: '海门', value: 9, warn: 0},
		 {name: '鄂尔多斯', value: 12, warn: 0},
		 {name: '招远', value: 12, warn: 0},
		 {name: '舟山', value: 12, warn: 0},
		 {name: '齐齐哈尔', value: 14, warn: 0},
		 {name: '盐城', value: 15, warn: 0},
		 {name: '赤峰', value: 16, warn: 0},
		 {name: '青岛', value: 18, warn: 0},
		 {name: '乳山', value: 18, warn: 0},
		 {name: '金昌', value: 19, warn: 0},
		 {name: '泉州', value: 21, warn: 0},
		 {name: '莱西', value: 21, warn: 0},
		 {name: '日照', value: 21, warn: 0},
		 {name: '胶南', value: 22, warn: 0},
		 {name: '南通', value: 23, warn: 0},
		 {name: '拉萨', value: 24, warn: 0},
		 {name: '云浮', value: 24, warn: 0},
		 {name: '梅州', value: 25, warn: 0},
		 {name: '文登', value: 25, warn: 0},
		 {name: '上海', value: 25, warn: 0},
		 {name: '攀枝花', value: 25, warn: 0},
		 {name: '威海', value: 25, warn: 0},
		 {name: '承德', value: 25, warn: 0},
		 {name: '厦门', value: 26, warn: 0},
		 {name: '汕尾', value: 26, warn: 0},
		 {name: '潮州', value: 26, warn: 0},
		 {name: '丹东', value: 27, warn: 0},
		 {name: '太仓', value: 27, warn: 0},
		 {name: '曲靖', value: 27, warn: 0},
		 {name: '烟台', value: 28, warn: 0},
		 {name: '福州', value: 29, warn: 0},
		 {name: '瓦房店', value: 30, warn: 0},
		 {name: '即墨', value: 30, warn: 0},
		 {name: '抚顺', value: 31, warn: 0},
		 {name: '玉溪', value: 31, warn: 0},
		 {name: '张家口', value: 31, warn: 0},
		 {name: '阳泉', value: 31, warn: 0},
		 {name: '莱州', value: 32, warn: 0},
		 {name: '湖州市', value: 32, warn: 0},
		 {name: '汕头', value: 32, warn: 0},
		 {name: '昆山', value: 33, warn: 0},
		 {name: '宁波市', value: 33, warn: 0},
		 {name: '湛江', value: 33, warn: 0},
		 {name: '揭阳', value: 34, warn: 0},
		 {name: '荣成', value: 34, warn: 0},
		 {name: '连云港', value: 35, warn: 0},
		 {name: '葫芦岛', value: 35, warn: 0},
		 {name: '常熟', value: 36, warn: 0},
		 {name: '东莞', value: 36, warn: 0},
		 {name: '河源', value: 36, warn: 0},
		 {name: '淮安', value: 36, warn: 0},
		 {name: '泰州', value: 36, warn: 0},
		 {name: '南宁', value: 37, warn: 0},
		 {name: '营口', value: 37, warn: 0},
		 {name: '惠州', value: 37, warn: 0},
		 {name: '江阴', value: 37, warn: 0},
		 {name: '蓬莱', value: 37, warn: 0},
		 {name: '韶关', value: 38, warn: 0},
		 {name: '嘉峪关', value: 38, warn: 0},
		 {name: '广州市', value: 38, warn: 0},
		 {name: '延安', value: 38, warn: 0},
		 {name: '太原', value: 39, warn: 0},
		 {name: '清远', value: 39, warn: 0},
		 {name: '中山', value: 39, warn: 0},
		 {name: '昆明', value: 39, warn: 0},
		 {name: '寿光', value: 40, warn: 0},
		 {name: '盘锦', value: 40, warn: 0},
		 {name: '长治', value: 41, warn: 0},
		 {name: '深圳', value: 41, warn: 0},
		 {name: '珠海', value: 42, warn: 0},
		 {name: '宿迁', value: 43, warn: 0},
		 {name: '咸阳', value: 43, warn: 0},
		 {name: '铜川', value: 44, warn: 0},
		 {name: '平度', value: 44, warn: 0},
		 {name: '佛山', value: 44, warn: 0},
		 {name: '海口', value: 44, warn: 0},
		 {name: '江门', value: 45, warn: 0},
		 {name: '章丘', value: 45, warn: 0},
		 {name: '肇庆', value: 46, warn: 0},
		 {name: '大连市', value: 47, warn: 0},
		 {name: '临汾', value: 47, warn: 0},
		 {name: '吴江', value: 47, warn: 0},
		 {name: '石嘴山', value: 49, warn: 0},
		 {name: '沈阳', value: 50, warn: 0},
		 {name: '苏州', value: 50, warn: 0},
		 {name: '茂名', value: 50, warn: 0},
		 {name: '嘉兴', value: 51, warn: 0},
		 {name: '长春', value: 51, warn: 0},
		 {name: '胶州', value: 52, warn: 0},
		 {name: '银川', value: 52, warn: 0},
		 {name: '张家港', value: 52, warn: 0},
		 {name: '三门峡', value: 53, warn: 0},
		 {name: '锦州', value: 54, warn: 0},
		 {name: '南昌', value: 54, warn: 0},
		 {name: '柳州', value: 54, warn: 0},
		 {name: '三亚', value: 54, warn: 0},
		 {name: '自贡', value: 56, warn: 0},
		 {name: '吉林', value: 56, warn: 0},
		 {name: '阳江', value: 57, warn: 0},
		 {name: '泸州', value: 57, warn: 0},
		 {name: '西宁', value: 57, warn: 0},
		 {name: '宜宾', value: 58, warn: 0},
		 {name: '呼和浩特', value: 58, warn: 0},
		 {name: '成都', value: 58, warn: 0},
		 {name: '大同', value: 58, warn: 0},
		 {name: '镇江', value: 59, warn: 0},
		 {name: '桂林', value: 59, warn: 0},
		 {name: '张家界', value: 59, warn: 0},
		 {name: '宜兴', value: 59, warn: 0},
		 {name: '北海', value: 60, warn: 0},
		 {name: '西安', value: 61, warn: 0},
		 {name: '金坛', value: 62, warn: 0},
		 {name: '东营', value: 62, warn: 0},
		 {name: '牡丹江', value: 63, warn: 0},
		 {name: '遵义', value: 63, warn: 0},
		 {name: '绍兴', value: 63, warn: 0},
		 {name: '扬州市', value: 64, warn: 0},
		 {name: '常州', value: 64, warn: 0},
		 {name: '潍坊', value: 65, warn: 0},
		 {name: '重庆', value: 66, warn: 0},
		 {name: '台州市', value: 67, warn: 0},
		 {name: '南京市', value: 67, warn: 0},
		 {name: '滨州', value: 70, warn: 0},
		 {name: '贵阳', value: 71, warn: 0},
		 {name: '无锡', value: 71, warn: 0},
		 {name: '本溪', value: 71, warn: 0},
		 {name: '克拉玛依', value: 72, warn: 0},
		 {name: '渭南', value: 72, warn: 0},
		 {name: '马鞍山', value: 72, warn: 0},
		 {name: '宝鸡', value: 72, warn: 0},
		 {name: '焦作', value: 75, warn: 0},
		 {name: '句容', value: 75, warn: 0},
		 {name: '北京', value: 79, warn: 0},
		 {name: '徐州', value: 79, warn: 0},
		 {name: '衡水', value: 80, warn: 0},
		 {name: '包头', value: 80, warn: 0},
		 {name: '绵阳', value: 80, warn: 0},
		 {name: '乌鲁木齐', value: 84, warn: 0},
		 {name: '枣庄', value: 84, warn: 0},
		 {name: '杭州市', value: 84, warn: 0},
		 {name: '淄博', value: 85, warn: 0},
		 {name: '鞍山', value: 86, warn: 0},
		 {name: '溧阳', value: 86, warn: 0},
		 {name: '库尔勒', value: 86, warn: 0},
		 {name: '安阳', value: 90, warn: 20},
		 {name: '开封', value: 90, warn: 0},
		 {name: '济南', value: 92, warn: 0},
		 {name: '德阳', value: 93, warn: 0},
		 {name: '温州市', value: 95, warn: 0},
		 {name: '九江', value: 96, warn: 0},
		 {name: '邯郸', value: 98, warn: 0},
		 {name: '临安', value: 99, warn: 0},
		 {name: '兰州', value: 99, warn: 0},
		 {name: '沧州', value: 100, warn: 0},
		 {name: '临沂', value: 103, warn: 0},
		 {name: '南充', value: 104, warn: 0},
		 {name: '天津市', value: 105, warn: 30},
		 {name: '富阳', value: 106, warn: 0},
		 {name: '泰安', value: 112, warn: 0},
		 {name: '诸暨', value: 112, warn: 0},
		 {name: '郑州', value: 113, warn: 0},
		 {name: '哈尔滨', value: 114, warn: 40},
		 {name: '聊城', value: 116, warn: 0},
		 {name: '芜湖', value: 117, warn: 0},
		 {name: '唐山', value: 119, warn: 0},
		 {name: '平顶山', value: 119, warn: 0},
		 {name: '邢台', value: 119, warn: 0},
		 {name: '德州', value: 120, warn: 0},
		 {name: '济宁', value: 120, warn: 0},
		 {name: '荆州', value: 127, warn: 0},
		 {name: '宜昌', value: 130, warn: 0},
		 {name: '义乌', value: 132, warn: 0},
		 {name: '丽水市', value: 133, warn: 0},
		 {name: '洛阳', value: 134, warn: 0},
		 {name: '秦皇岛', value: 136, warn: 0},
		 {name: '株洲', value: 143, warn: 0},
		 {name: '石家庄', value: 147, warn: 60},
		 {name: '莱芜', value: 148, warn: 0},
		 {name: '常德', value: 152, warn: 0},
		 {name: '保定', value: 153, warn: 0},
		 {name: '湘潭', value: 154, warn: 0},
		 {name: '金华市', value: 157, warn: 0},
		 {name: '岳阳', value: 169, warn: 0},
		 {name: '长沙市', value: 175, warn: 0},
		 {name: '衢州市', value: 177, warn: 0},
		 {name: '廊坊', value: 193, warn: 0},
		 {name: '菏泽', value: 194, warn: 0},
		 {name: '合肥', value: 229, warn: 0},
		 {name: '武汉', value: 273, warn: 0},
		 {name: '大庆', value: 279, warn: 100}
	];

	
	var geoCoordMap = {
		'海门':[121.15,31.89],
		'鄂尔多斯':[109.781327,39.608266],
		'招远':[120.38,37.35],
		'舟山':[122.207216,29.985295],
		'齐齐哈尔':[123.97,47.33],
		'盐城':[120.13,33.38],
		'赤峰':[118.87,42.28],
		'青岛':[120.33,36.07],
		'乳山':[121.52,36.89],
		'金昌':[102.188043,38.520089],
		'泉州':[118.58,24.93],
		'莱西':[120.53,36.86],
		'日照':[119.46,35.42],
		'胶南':[119.97,35.88],
		'南通':[121.05,32.08],
		'拉萨':[91.11,29.97],
		'云浮':[112.02,22.93],
		'梅州':[116.1,24.55],
		'文登':[122.05,37.2],
		'上海':[121.48,31.22],
		'攀枝花':[101.718637,26.582347],
		'威海':[122.1,37.5],
		'承德':[117.93,40.97],
		'厦门':[118.1,24.46],
		'汕尾':[115.375279,22.786211],
		'潮州':[116.63,23.68],
		'丹东':[124.37,40.13],
		'太仓':[121.1,31.45],
		'曲靖':[103.79,25.51],
		'烟台':[121.39,37.52],
		'福州':[119.3,26.08],
		'瓦房店':[121.979603,39.627114],
		'即墨':[120.45,36.38],
		'抚顺':[123.97,41.97],
		'玉溪':[102.52,24.35],
		'张家口':[114.87,40.82],
		'阳泉':[113.57,37.85],
		'莱州':[119.942327,37.177017],
		'湖州市':[120.1,30.86],
		'汕头':[116.69,23.39],
		'昆山':[120.95,31.39],
		'宁波市':[121.56,29.86],
		'湛江':[110.359377,21.270708],
		'揭阳':[116.35,23.55],
		'荣成':[122.41,37.16],
		'连云港':[119.16,34.59],
		'葫芦岛':[120.836932,40.711052],
		'常熟':[120.74,31.64],
		'东莞':[113.75,23.04],
		'河源':[114.68,23.73],
		'淮安':[119.15,33.5],
		'泰州':[119.9,32.49],
		'南宁':[108.33,22.84],
		'营口':[122.18,40.65],
		'惠州':[114.4,23.09],
		'江阴':[120.26,31.91],
		'蓬莱':[120.75,37.8],
		'韶关':[113.62,24.84],
		'嘉峪关':[98.289152,39.77313],
		'广州市':[113.23,23.16],
		'延安':[109.47,36.6],
		'太原':[112.53,37.87],
		'清远':[113.01,23.7],
		'中山':[113.38,22.52],
		'昆明':[102.73,25.04],
		'寿光':[118.73,36.86],
		'盘锦':[122.070714,41.119997],
		'长治':[113.08,36.18],
		'深圳':[114.07,22.62],
		'珠海':[113.52,22.3],
		'宿迁':[118.3,33.96],
		'咸阳':[108.72,34.36],
		'铜川':[109.11,35.09],
		'平度':[119.97,36.77],
		'佛山':[113.11,23.05],
		'海口':[110.35,20.02],
		'江门':[113.06,22.61],
		'章丘':[117.53,36.72],
		'肇庆':[112.44,23.05],
		'大连市':[121.62,38.92],
		'临汾':[111.5,36.08],
		'吴江':[120.63,31.16],
		'石嘴山':[106.39,39.04],
		'沈阳':[123.38,41.8],
		'苏州':[120.62,31.32],
		'茂名':[110.88,21.68],
		'嘉兴':[120.76,30.77],
		'长春':[125.35,43.88],
		'胶州':[120.03336,36.264622],
		'银川':[106.27,38.47],
		'张家港':[120.555821,31.875428],
		'三门峡':[111.19,34.76],
		'锦州':[121.15,41.13],
		'南昌':[115.89,28.68],
		'柳州':[109.4,24.33],
		'三亚':[109.511909,18.252847],
		'自贡':[104.778442,29.33903],
		'吉林':[126.57,43.87],
		'阳江':[111.95,21.85],
		'泸州':[105.39,28.91],
		'西宁':[101.74,36.56],
		'宜宾':[104.56,29.77],
		'呼和浩特':[111.65,40.82],
		'成都':[104.06,30.67],
		'大同':[113.3,40.12],
		'镇江':[119.44,32.2],
		'桂林':[110.28,25.29],
		'张家界':[110.479191,29.117096],
		'宜兴':[119.82,31.36],
		'北海':[109.12,21.49],
		'西安':[108.95,34.27],
		'金坛':[119.56,31.74],
		'东营':[118.49,37.46],
		'牡丹江':[129.58,44.6],
		'遵义':[106.9,27.7],
		'绍兴':[120.58,30.01],
		'扬州市':[119.42,32.39],
		'常州':[119.95,31.79],
		'潍坊':[119.1,36.62],
		'重庆':[106.54,29.59],
		'台州市':[121.420757,28.656386],
		'南京市':[118.78,32.04],
		'滨州':[118.03,37.36],
		'贵阳':[106.71,26.57],
		'无锡':[120.29,31.59],
		'本溪':[123.73,41.3],
		'克拉玛依':[84.77,45.59],
		'渭南':[109.5,34.52],
		'马鞍山':[118.48,31.56],
		'宝鸡':[107.15,34.38],
		'焦作':[113.21,35.24],
		'句容':[119.16,31.95],
		'北京':[116.46,39.92],
		'徐州':[117.2,34.26],
		'衡水':[115.72,37.72],
		'包头':[110,40.58],
		'绵阳':[104.73,31.48],
		'乌鲁木齐':[87.68,43.77],
		'枣庄':[117.57,34.86],
		'杭州市':[120.219375,30.259244],
		'淄博':[118.05,36.78],
		'鞍山':[122.85,41.12],
		'溧阳':[119.48,31.43],
		'库尔勒':[86.06,41.68],
		'安阳':[114.35,36.1],
		'开封':[114.35,34.79],
		'济南':[117,36.65],
		'德阳':[104.37,31.13],
		'温州市':[120.65,28.01],
		'九江':[115.97,29.71],
		'邯郸':[114.47,36.6],
		'临安':[119.72,30.23],
		'兰州':[103.73,36.03],
		'沧州':[116.83,38.33],
		'临沂':[118.35,35.05],
		'南充':[106.110698,30.837793],
		'天津市':[117.2,39.13],
		'富阳':[119.95,30.07],
		'泰安':[117.13,36.18],
		'诸暨':[120.23,29.71],
		'郑州':[113.65,34.76],
		'哈尔滨':[126.63,45.75],
		'聊城':[115.97,36.45],
		'芜湖':[118.38,31.33],
		'唐山':[118.02,39.63],
		'平顶山':[113.29,33.75],
		'邢台':[114.48,37.05],
		'德州':[116.29,37.45],
		'济宁':[116.59,35.38],
		'荆州':[112.239741,30.335165],
		'宜昌':[111.3,30.7],
		'义乌':[120.06,29.32],
		'丽水市':[119.92,28.45],
		'洛阳':[112.44,34.7],
		'秦皇岛':[119.57,39.95],
		'株洲':[113.16,27.83],
		'石家庄':[114.48,38.03],
		'莱芜':[117.67,36.19],
		'常德':[111.69,29.05],
		'保定':[115.48,38.85],
		'湘潭':[112.91,27.87],
		'金华市':[119.64,29.12],
		'岳阳':[113.09,29.37],
		'长沙市':[113,28.21],
		'衢州市':[118.88,28.97],
		'廊坊':[116.7,39.53],
		'菏泽':[115.480656,35.23375],
		'合肥':[117.27,31.86],
		'武汉':[114.31,30.52],
		'大庆':[125.03,46.58]
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
			center: [104.114129, 37.550339],
			zoom: 5,
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
