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
 *登录
 */
Mock.mock(/\/superviser\/login/, 'post', function(options){
    return {
        'code' : 1,
        'data' : {
            access_token: '9363f395-e656-96e9-dc26-5040e723626a'
        }
    }
});

/*
 *待处理告警
 */
Mock.mock(/\/user\/app\/alerts\/untreated/, 'get',{
    code : 1 ,
    data : [{
        'occure_at' : '2017-07-01 12:00:00' ,
        'site_id':'1',
        'site_name' : '站点1' ,
        'host' : 'pc001' ,
        'severity' : 1,
        'status' : 1 ,
        'content' : 'error start at 11:50am...'
    }]
});

/*
*历史告警
*/
Mock.mock(/\/user\/alerts/, 'get',{
    'code' : 1 ,
    'message' : 'success' ,
    data : {
        'items' : [
        {
            'occure_at' : '2017-07-01 12:00:00' ,
            'site_id':'1',
            'site_name' : '站点1' ,
            'host' : 'pc001' ,
            'severity' : 1,
            'status' : 1 ,
            'content' : 'error start at 11:50am...'
        }
        ] ,
        'total' : 20
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
            'province_name':'浙江省',
            'city_code':'100',
            'city_name':'杭州市',
            'access_key':'sdsf3423432432432',
            'address' : '西湖区凤起路1号' ,
            'create_at' : '2017-07-01 00:00:00' ,
            'license_end' : '2018-07-01 00:00:00'
        }
        ]
    }
});

/*
*站点信息
*/
Mock.mock(/\/user\/site\/1/,'get',{
    'code' : 1 ,
    'message' : 'success' ,
    'data' : {
        'site_name' : '站点1' ,
        'province' : '浙江' ,
        'city' : '杭州' ,
        'address' : '西湖区凤起路1号'
    }
});

/*
*通知规则
*/
Mock.mock(/\/user\/rules/,'get', {
    'code' : 1 ,
    'message' : 'success' ,
    'data' : {
        'items' : [
        {
            'site_id':'1',
            'site_name' : '站点1' ,
            'alert_severity' : 1 ,
            'alert_status' : 1 ,
            'method' : 1
        }
        ] ,
        'total' : 20
    }
});

/*
*历史通知
*/
Mock.mock(/\/user\/notifications/,'get', {
    'code' : 1 ,
    'message' : 'success' ,
    data : {
        'items' : [
        {
            'begin_at' : '2017-07-11T07:33:31' ,
            'finish_at' : '2017-07-11T07:33:34' ,
            'site_id':1,
            'site_name' : '站点1' ,
            'host' : 'pc001' ,
            'status' : 0 ,
            'content' : 'error start at 11:50am...error start at 11:50am...error start at 11:50am...error start at 11:50am...error start at 11:50am...'
        }
        ] ,
        'total' : 20
    }
});

/*
 *合作伙伴
 */
Mock.mock(/\/superviser\/partner/, 'get',{
    'code' : 1 ,
    'message' : 'success' ,
     data : {
        'items' : [
            {
                'id' : '100' ,
                'partner_name':'杭州美创科技有限公司',
                'login_username' : 'hzmc' ,
                'province_name' : '浙江' ,
                'province_code' : '100',
                'city_name' : '杭州' ,
                'city_code' : '10001',
                'address' : '丰谭路199号'
            }
        ] ,
        'total' : 40
    }
});

/*
 *数据总览
 */
Mock.mock(/\/superviser\/listCount/, 'get',{
    'code' : 1 ,
    'message' : 'success' ,
    data : {
        'items' : [
            {
                'id' : '100' ,
                'site_name':'站点名称',
                'partner_name' : '公司名称' ,
                'add_time' : '2017-09-11 12:00:08'
            }
        ] ,
        'total' : 40
    }
});
