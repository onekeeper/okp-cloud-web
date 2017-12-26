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
		 {name: '海门市', value: 9, warn: 0},
		 {name: '鄂尔多斯市', value: 12, warn: 0},
		 {name: '招远市', value: 12, warn: 0},
		 {name: '舟山市', value: 12, warn: 0},
		 {name: '齐齐哈尔市', value: 14, warn: 0},
		 {name: '盐城市', value: 15, warn: 0},
		 {name: '赤峰市', value: 16, warn: 0},
		 {name: '青岛市', value: 18, warn: 0},
		 {name: '乳山市', value: 18, warn: 0},
		 {name: '金昌市', value: 19, warn: 0},
		 {name: '泉州市', value: 21, warn: 0},
		 {name: '莱西市', value: 21, warn: 0},
		 {name: '日照市', value: 21, warn: 0},
		 {name: '胶南市', value: 22, warn: 0},
		 {name: '南通市', value: 23, warn: 0},
		 {name: '拉萨市', value: 24, warn: 0},
		 {name: '云浮市', value: 24, warn: 0},
		 {name: '梅州市', value: 25, warn: 0},
		 {name: '文登市', value: 25, warn: 0},
		 {name: '上海市', value: 25, warn: 0},
		 {name: '攀枝花市', value: 25, warn: 0},
		 {name: '威海市', value: 25, warn: 0},
		 {name: '承德市', value: 25, warn: 0},
		 {name: '厦门市', value: 26, warn: 0},
		 {name: '汕尾市', value: 26, warn: 0},
		 {name: '潮州市', value: 26, warn: 0},
		 {name: '丹东市', value: 27, warn: 0},
		 {name: '太仓市', value: 27, warn: 0},
		 {name: '曲靖市', value: 27, warn: 0},
		 {name: '烟台市', value: 28, warn: 0},
		 {name: '福州市', value: 29, warn: 0},
		 {name: '瓦房店市', value: 30, warn: 0},
		 {name: '即墨市', value: 30, warn: 0},
		 {name: '抚顺市', value: 31, warn: 0},
		 {name: '玉溪市', value: 31, warn: 0},
		 {name: '张家口市', value: 31, warn: 0},
		 {name: '阳泉市', value: 31, warn: 0},
		 {name: '莱州市', value: 32, warn: 0},
		 {name: '湖州市', value: 32, warn: 0},
		 {name: '汕头市', value: 32, warn: 0},
		 {name: '昆山市', value: 33, warn: 0},
		 {name: '宁波市', value: 33, warn: 0},
		 {name: '湛江市', value: 33, warn: 0},
		 {name: '揭阳市', value: 34, warn: 0},
		 {name: '荣成市', value: 34, warn: 0},
		 {name: '连云港市', value: 35, warn: 0},
		 {name: '葫芦岛市', value: 35, warn: 0},
		 {name: '常熟市', value: 36, warn: 0},
		 {name: '东莞市', value: 36, warn: 0},
		 {name: '河源市', value: 36, warn: 0},
		 {name: '淮安市', value: 36, warn: 0},
		 {name: '泰州市', value: 36, warn: 0},
		 {name: '南宁市', value: 37, warn: 0},
		 {name: '营口市', value: 37, warn: 0},
		 {name: '惠州市', value: 37, warn: 0},
		 {name: '江阴市', value: 37, warn: 0},
		 {name: '蓬莱市', value: 37, warn: 0},
		 {name: '韶关市', value: 38, warn: 0},
		 {name: '嘉峪关市', value: 38, warn: 0},
		 {name: '广州市', value: 38, warn: 0},
		 {name: '延安市', value: 38, warn: 0},
		 {name: '太原市', value: 39, warn: 0},
		 {name: '清远市', value: 39, warn: 0},
		 {name: '中山市', value: 39, warn: 0},
		 {name: '昆明市', value: 39, warn: 0},
		 {name: '寿光市', value: 40, warn: 0},
		 {name: '盘锦市', value: 40, warn: 0},
		 {name: '长治市', value: 41, warn: 0},
		 {name: '深圳市', value: 41, warn: 0},
		 {name: '珠海市', value: 42, warn: 0},
		 {name: '宿迁市', value: 43, warn: 0},
		 {name: '咸阳市', value: 43, warn: 0},
		 {name: '铜川市', value: 44, warn: 0},
		 {name: '平度市', value: 44, warn: 0},
		 {name: '佛山市', value: 44, warn: 0},
		 {name: '海口市', value: 44, warn: 0},
		 {name: '江门市', value: 45, warn: 0},
		 {name: '章丘市', value: 45, warn: 0},
		 {name: '肇庆市', value: 46, warn: 0},
		 {name: '大连市', value: 47, warn: 0},
		 {name: '临汾市', value: 47, warn: 0},
		 {name: '吴江市', value: 47, warn: 0},
		 {name: '石嘴山市', value: 49, warn: 0},
		 {name: '沈阳市', value: 50, warn: 0},
		 {name: '苏州市', value: 50, warn: 0},
		 {name: '茂名市', value: 50, warn: 0},
		 {name: '嘉兴市', value: 51, warn: 0},
		 {name: '长春市', value: 51, warn: 0},
		 {name: '胶州市', value: 52, warn: 0},
		 {name: '银川市', value: 52, warn: 0},
		 {name: '张家港市', value: 52, warn: 0},
		 {name: '三门峡市', value: 53, warn: 0},
		 {name: '锦州市', value: 54, warn: 0},
		 {name: '南昌市', value: 54, warn: 0},
		 {name: '柳州市', value: 54, warn: 0},
		 {name: '三亚市', value: 54, warn: 0},
		 {name: '自贡市', value: 56, warn: 0},
		 {name: '吉林市', value: 56, warn: 0},
		 {name: '阳江市', value: 57, warn: 0},
		 {name: '泸州市', value: 57, warn: 0},
		 {name: '西宁市', value: 57, warn: 0},
		 {name: '宜宾市', value: 58, warn: 0},
		 {name: '呼和浩特市', value: 58, warn: 0},
		 {name: '成都市', value: 58, warn: 0},
		 {name: '大同市', value: 58, warn: 0},
		 {name: '镇江市', value: 59, warn: 0},
		 {name: '桂林市', value: 59, warn: 0},
		 {name: '张家界市', value: 59, warn: 0},
		 {name: '宜兴市', value: 59, warn: 0},
		 {name: '北海市', value: 60, warn: 0},
		 {name: '西安市', value: 61, warn: 0},
		 {name: '金坛市', value: 62, warn: 0},
		 {name: '东营市', value: 62, warn: 0},
		 {name: '牡丹江市', value: 63, warn: 0},
		 {name: '遵义市', value: 63, warn: 0},
		 {name: '绍兴市', value: 63, warn: 0},
		 {name: '扬州市', value: 64, warn: 0},
		 {name: '常州市', value: 64, warn: 0},
		 {name: '潍坊市', value: 65, warn: 0},
		 {name: '重庆市', value: 66, warn: 0},
		 {name: '台州市', value: 67, warn: 0},
		 {name: '南京市', value: 67, warn: 0},
		 {name: '滨州市', value: 70, warn: 0},
		 {name: '贵阳市', value: 71, warn: 0},
		 {name: '无锡市', value: 71, warn: 0},
		 {name: '本溪市', value: 71, warn: 0},
		 {name: '克拉玛依市', value: 72, warn: 0},
		 {name: '渭南市', value: 72, warn: 0},
		 {name: '马鞍山市', value: 72, warn: 0},
		 {name: '宝鸡市', value: 72, warn: 0},
		 {name: '焦作市', value: 75, warn: 0},
		 {name: '句容市', value: 75, warn: 0},
		 {name: '北京市', value: 79, warn: 0},
		 {name: '徐州市', value: 79, warn: 0},
		 {name: '衡水市', value: 80, warn: 0},
		 {name: '包头市', value: 80, warn: 0},
		 {name: '绵阳市', value: 80, warn: 0},
		 {name: '乌鲁木齐市', value: 84, warn: 0},
		 {name: '枣庄市', value: 84, warn: 0},
		 {name: '杭州市', value: 84, warn: 0},
		 {name: '淄博市', value: 85, warn: 0},
		 {name: '鞍山市', value: 86, warn: 0},
		 {name: '溧阳市', value: 86, warn: 0},
		 {name: '库尔勒市', value: 86, warn: 0},
		 {name: '安阳市', value: 90, warn: 20},
		 {name: '开封市', value: 90, warn: 0},
		 {name: '济南市', value: 92, warn: 0},
		 {name: '德阳市', value: 93, warn: 0},
		 {name: '温州市', value: 95, warn: 0},
		 {name: '九江市', value: 96, warn: 0},
		 {name: '邯郸市', value: 98, warn: 0},
		 {name: '临安市', value: 99, warn: 0},
		 {name: '兰州市', value: 99, warn: 0},
		 {name: '沧州市', value: 100, warn: 0},
		 {name: '临沂市', value: 103, warn: 0},
		 {name: '南充市', value: 104, warn: 0},
		 {name: '天津市', value: 105, warn: 30},
		 {name: '富阳市', value: 106, warn: 0},
		 {name: '泰安市', value: 112, warn: 0},
		 {name: '诸暨市', value: 112, warn: 0},
		 {name: '郑州市', value: 113, warn: 0},
		 {name: '哈尔滨市', value: 114, warn: 40},
		 {name: '聊城市', value: 116, warn: 0},
		 {name: '芜湖市', value: 117, warn: 0},
		 {name: '唐山市', value: 119, warn: 0},
		 {name: '平顶山市', value: 119, warn: 0},
		 {name: '邢台市', value: 119, warn: 0},
		 {name: '德州市', value: 120, warn: 0},
		 {name: '济宁市', value: 120, warn: 0},
		 {name: '荆州市', value: 127, warn: 0},
		 {name: '宜昌市', value: 130, warn: 0},
		 {name: '义乌市', value: 132, warn: 0},
		 {name: '丽水市', value: 133, warn: 0},
		 {name: '洛阳市', value: 134, warn: 0},
		 {name: '秦皇岛市', value: 136, warn: 0},
		 {name: '株洲市', value: 143, warn: 0},
		 {name: '石家庄市', value: 147, warn: 60},
		 {name: '莱芜市', value: 148, warn: 0},
		 {name: '常德市', value: 152, warn: 0},
		 {name: '保定市', value: 153, warn: 0},
		 {name: '湘潭市', value: 154, warn: 0},
		 {name: '金华市', value: 157, warn: 0},
		 {name: '岳阳市', value: 169, warn: 0},
		 {name: '长沙市', value: 175, warn: 0},
		 {name: '衢州市', value: 177, warn: 0},
		 {name: '廊坊市', value: 193, warn: 0},
		 {name: '菏泽市', value: 194, warn: 0},
		 {name: '合肥市', value: 229, warn: 0},
		 {name: '武汉市', value: 273, warn: 0},
		 {name: '大庆市', value: 279, warn: 100}
	];

	
	var geoCoordMap = {
		'海门市':[121.15,31.89],
		'鄂尔多斯市':[109.781327,39.608266],
		'招远市':[120.38,37.35],
		'舟山市':[122.207216,29.985295],
		'齐齐哈尔市':[123.97,47.33],
		'盐城市':[120.13,33.38],
		'赤峰市':[118.87,42.28],
		'青岛市':[120.33,36.07],
		'乳山市':[121.52,36.89],
		'金昌市':[102.188043,38.520089],
		'泉州市':[118.58,24.93],
		'莱西市':[120.53,36.86],
		'日照市':[119.46,35.42],
		'胶南市':[119.97,35.88],
		'南通市':[121.05,32.08],
		'拉萨市':[91.11,29.97],
		'云浮市':[112.02,22.93],
		'梅州市':[116.1,24.55],
		'文登市':[122.05,37.2],
		'上海市':[121.48,31.22],
		'攀枝花市':[101.718637,26.582347],
		'威海市':[122.1,37.5],
		'承德市':[117.93,40.97],
		'厦门市':[118.1,24.46],
		'汕尾市':[115.375279,22.786211],
		'潮州市':[116.63,23.68],
		'丹东市':[124.37,40.13],
		'太仓市':[121.1,31.45],
		'曲靖市':[103.79,25.51],
		'烟台市':[121.39,37.52],
		'福州市':[119.3,26.08],
		'瓦房店市':[121.979603,39.627114],
		'即墨市':[120.45,36.38],
		'抚顺市':[123.97,41.97],
		'玉溪市':[102.52,24.35],
		'张家口市':[114.87,40.82],
		'阳泉市':[113.57,37.85],
		'莱州市':[119.942327,37.177017],
		'湖州市':[120.1,30.86],
		'汕头市':[116.69,23.39],
		'昆山市':[120.95,31.39],
		'宁波市':[121.56,29.86],
		'湛江市':[110.359377,21.270708],
		'揭阳市':[116.35,23.55],
		'荣成市':[122.41,37.16],
		'连云港市':[119.16,34.59],
		'葫芦岛市':[120.836932,40.711052],
		'常熟市':[120.74,31.64],
		'东莞市':[113.75,23.04],
		'河源市':[114.68,23.73],
		'淮安市':[119.15,33.5],
		'泰州市':[119.9,32.49],
		'南宁市':[108.33,22.84],
		'营口市':[122.18,40.65],
		'惠州市':[114.4,23.09],
		'江阴市':[120.26,31.91],
		'蓬莱市':[120.75,37.8],
		'韶关市':[113.62,24.84],
		'嘉峪关市':[98.289152,39.77313],
		'广州市':[113.23,23.16],
		'延安市':[109.47,36.6],
		'太原市':[112.53,37.87],
		'清远市':[113.01,23.7],
		'中山市':[113.38,22.52],
		'昆明市':[102.73,25.04],
		'寿光市':[118.73,36.86],
		'盘锦市':[122.070714,41.119997],
		'长治市':[113.08,36.18],
		'深圳市':[114.07,22.62],
		'珠海市':[113.52,22.3],
		'宿迁市':[118.3,33.96],
		'咸阳市':[108.72,34.36],
		'铜川市':[109.11,35.09],
		'平度市':[119.97,36.77],
		'佛山市':[113.11,23.05],
		'海口市':[110.35,20.02],
		'江门市':[113.06,22.61],
		'章丘市':[117.53,36.72],
		'肇庆市':[112.44,23.05],
		'大连市':[121.62,38.92],
		'临汾市':[111.5,36.08],
		'吴江市':[120.63,31.16],
		'石嘴山市':[106.39,39.04],
		'沈阳市':[123.38,41.8],
		'苏州市':[120.62,31.32],
		'茂名市':[110.88,21.68],
		'嘉兴市':[120.76,30.77],
		'长春市':[125.35,43.88],
		'胶州市':[120.03336,36.264622],
		'银川市':[106.27,38.47],
		'张家港市':[120.555821,31.875428],
		'三门峡市':[111.19,34.76],
		'锦州市':[121.15,41.13],
		'南昌市':[115.89,28.68],
		'柳州市':[109.4,24.33],
		'三亚市':[109.511909,18.252847],
		'自贡市':[104.778442,29.33903],
		'吉林市':[126.57,43.87],
		'阳江市':[111.95,21.85],
		'泸州市':[105.39,28.91],
		'西宁市':[101.74,36.56],
		'宜宾市':[104.56,29.77],
		'呼和浩特市':[111.65,40.82],
		'成都市':[104.06,30.67],
		'大同市':[113.3,40.12],
		'镇江市':[119.44,32.2],
		'桂林市':[110.28,25.29],
		'张家界市':[110.479191,29.117096],
		'宜兴市':[119.82,31.36],
		'北海市':[109.12,21.49],
		'西安市':[108.95,34.27],
		'金坛市':[119.56,31.74],
		'东营市':[118.49,37.46],
		'牡丹江市':[129.58,44.6],
		'遵义市':[106.9,27.7],
		'绍兴市':[120.58,30.01],
		'扬州市':[119.42,32.39],
		'常州市':[119.95,31.79],
		'潍坊市':[119.1,36.62],
		'重庆市':[106.54,29.59],
		'台州市':[121.420757,28.656386],
		'南京市':[118.78,32.04],
		'滨州市':[118.03,37.36],
		'贵阳市':[106.71,26.57],
		'无锡市':[120.29,31.59],
		'本溪市':[123.73,41.3],
		'克拉玛依市':[84.77,45.59],
		'渭南市':[109.5,34.52],
		'马鞍山市':[118.48,31.56],
		'宝鸡市':[107.15,34.38],
		'焦作市':[113.21,35.24],
		'句容市':[119.16,31.95],
		'北京市':[116.46,39.92],
		'徐州市':[117.2,34.26],
		'衡水市':[115.72,37.72],
		'包头市':[110,40.58],
		'绵阳市':[104.73,31.48],
		'乌鲁木齐市':[87.68,43.77],
		'枣庄市':[117.57,34.86],
		'杭州市':[120.219375,30.259244],
		'淄博市':[118.05,36.78],
		'鞍山市':[122.85,41.12],
		'溧阳市':[119.48,31.43],
		'库尔勒市':[86.06,41.68],
		'安阳市':[114.35,36.1],
		'开封市':[114.35,34.79],
		'济南市':[117,36.65],
		'德阳市':[104.37,31.13],
		'温州市':[120.65,28.01],
		'九江市':[115.97,29.71],
		'邯郸市':[114.47,36.6],
		'临安市':[119.72,30.23],
		'兰州市':[103.73,36.03],
		'沧州市':[116.83,38.33],
		'临沂市':[118.35,35.05],
		'南充市':[106.110698,30.837793],
		'天津市':[117.2,39.13],
		'富阳市':[119.95,30.07],
		'泰安市':[117.13,36.18],
		'诸暨市':[120.23,29.71],
		'郑州市':[113.65,34.76],
		'哈尔滨市':[126.63,45.75],
		'聊城市':[115.97,36.45],
		'芜湖市':[118.38,31.33],
		'唐山市':[118.02,39.63],
		'平顶山市':[113.29,33.75],
		'邢台市':[114.48,37.05],
		'德州市':[116.29,37.45],
		'济宁市':[116.59,35.38],
		'荆州市':[112.239741,30.335165],
		'宜昌市':[111.3,30.7],
		'义乌市':[120.06,29.32],
		'丽水市':[119.92,28.45],
		'洛阳市':[112.44,34.7],
		'秦皇岛市':[119.57,39.95],
		'株洲市':[113.16,27.83],
		'石家庄市':[114.48,38.03],
		'莱芜市':[117.67,36.19],
		'常德市':[111.69,29.05],
		'保定市':[115.48,38.85],
		'湘潭市':[112.91,27.87],
		'金华市':[119.64,29.12],
		'岳阳市':[113.09,29.37],
		'长沙市':[113,28.21],
		'衢州市':[118.88,28.97],
		'廊坊市':[116.7,39.53],
		'菏泽市':[115.480656,35.23375],
		'合肥市':[117.27,31.86],
		'武汉市':[114.31,30.52],
		'大庆市':[125.03,46.58]
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
