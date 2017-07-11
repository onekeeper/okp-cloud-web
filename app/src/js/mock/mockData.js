/*
*普通登录
 */
Mock.mock(/\/user\/login/, 'post', function(options){
    console.log(options.body);
    return {
        'code' : 1 ,
        'message' : 'success' ,
        'data' : {
            username: '张三',
            access_token: '9363f395-e656-96e9-dc26-5040e723626a'
        }
    }
});

/*
 *管理员登录
 */
Mock.mock(/\/partner\/login/, 'post', function(options){
    console.log(options.body);
    return {
        'code' : 1 ,
        'message' : 'success' ,
        'data' : {
            name: '管理员',
            access_token: '9363f395-e656-96e9-dc26-5040e723626a'
        }
    }
});

/*
*历史告警
 */
Mock.mock(/\/user\/alert/, 'get',{
	'code' : 1 ,
	'message' : 'success' ,
	data : {
		'total':20,
		'items' : [
		{
			'create_at' : '2017-07-01 12:00:00' ,
			'site_name' : '站点1' ,
			'host' : 'pc001' ,
			'severity' : 'serious' ,
			'status' : 'PROBLEM' ,
			'content' : 'error start at 11:50am...'
		},
		]
	}
});

/*
 *人员管理
 */
Mock.mock(/\/partner\/user\/details/, 'get',{
    code : 1 ,
    message : 'success' ,
    data : {
        'total':20,
        'items' : [
            {
                'username' : '张三' ,
                'email' : 'user@qq.com' ,
                'mobile' : '13900000000' ,
                'create_at' : '2017-07-01 12:00:00'
            }
        ]
    }
});

/*
 *站点管理
 */
Mock.mock(/\/partner\/sites/, 'get',{
    code : 1 ,
    message : 'success' ,
    data : {
        'total':20,
        'items' : [
            {
                'site_name' : '站点名称' ,
                'sn' : '站点序号' ,
                'province_code':'300',
                'province_name':'浙江',
                'city_code':'100',
                'city_name':'杭州',
                'address' : '西湖区凤起路1号' ,
                'create_at' : '2017-07-01 00:00:00' ,
                'license_end' : '2018-07-01 00:00:00'
            }
        ]
    }
});

