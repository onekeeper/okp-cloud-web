'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:mNoticeRuleCtrl
 * @description
 * @author [Xieq]
 * # mNoticeRuleCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
.controller('mNoticeRuleCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate',function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate) {
    urlPrefix = urlPrefix + "/partner";//管理员
    $scope.initData = {
        getListError: '',
        loading: true,
        actionType: 'add',
        actionId: 0,
        total:0,
        modalForm:{
            id:'',
            siteId: '',
            userId: '',
            severityId: '',
            statusId:'',
            methodId:'',
            severity:[],
            status:[],
            method: []
        },
        // siteOptions:[{'site_id' : '1' , 'site_name' : '站点1'},{'site_id' : '2' , 'site_name' : '站点2'}],
        // userOptions:[{'user_id' : '1' , 'username' : '王2'},{'user_id' : '2' , 'username' : '张三'}],
        // warnLevelOptions:[{'severity_id' : '1' , 'severity_name' : '消息'},{'severity_id' : '2' , 'severity_name' : '告警'}],
        // warnStatusOptions:[{'status_id' : '1' , 'status_name' : '已解决'},{'status_id' : '2' , 'status_name' : '遗留'}],
        // noticeMethodOptions:[{'method_id' : '1' , 'method_name' : '成功'},{'method_id' : '2' , 'method_name' : '失败'}],
        siteOptions:[],
        userOptions:[],
        warnLevelOptions:[],
        warnStatusOptions:[],
        noticeMethodOptions:[],
        query:{siteName:'',userName:''}
    };
    $scope.pager = {};
    $scope.apis = {
        getSiteOptions: {
            url: urlPrefix + '/dropdown/sites',
            method: 'get',
            data: {}
        },
        getUserOptions: {
            url: urlPrefix + '/dropdown/users',
            method: 'get',
            data: {}
        },
        getWarnLevelOptions: {
            url: urlPrefix + '/dropdown/severities',
            method: 'get',
            data: {}
        },
        getWarnStatusOptions: {
            url: urlPrefix + '/dropdown/statuses',
            method: 'get',
            data: {}
        },
        getNoticeMethodOptions: {
            url: urlPrefix + '/dropdown/methods',
            method: 'get',
            data: {}
        },
        getmNoticeRuleList: {
            url: urlPrefix + '/notificationrules',
            method: 'get',
            data: {
                page: 1,
                per_page: '',
                site_name:'',
                username:''
            }
        },
        addOne:{
           url: urlPrefix + '/notificationrule',
           method: 'post',
           data: {
                site_id:'',
                user_id:'',
                severity_id:'',
                status_id:'',
                method_id:''
           }
        },
        editOne:{
           url: urlPrefix + '/notificationrule',
           method: 'put',
           data: {
                site_id:'',
                user_id:'',
                severity_id:'',
                status_id:'',
                method_id:''
           }
        },
        deleteOne:{
           url: urlPrefix + '/notificationrule',
           method: 'delete',
           data: {}
        }
    };
    $scope.mNoticeRuleList = [];

    /**
     * 初始化
     */
    $scope.init = function () {
        $rootScope.pagePath = '';

        //得到下拉列表框内容
        $scope.getSiteOptions();
        $scope.getUserOptions();
        $scope.getWarnLevelOptions();
        $scope.getWarnStatusOptions();
        $scope.getNoticeMethodOptions();

        //得到列表
        $scope.getmNoticeRuleList();//通知规则

        //绑定事件
        // $scope.bindEvent();
        console.log($scope.initData);
    };
    /**
     * 页面查询操作
     * @param flag: if curPage == 1
     */
    $scope.query = function ( flag ) {
        if( flag ) $scope.pager.curPage = 1;
        $scope.formatState();
        $scope.queryData();
    };
    /**
     * 查询
     */
    $scope.queryData = function(){
        $scope.getmNoticeRuleList();
        $scope.getPager();
    };
    $scope.formatState = function () {
        $scope.initData.getListError = '';
        $scope.initData.loading = true;
        $scope.mNoticeRuleList = [];
    };

    /**
     * 获取站点列表选项
     */
    $scope.getSiteOptions = function(){
        var config = {
            url:  $scope.apis.getSiteOptions.url,
            method: $scope.apis.getSiteOptions.method,
            data: {}
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            if(data && data.data.length > 0){
                $scope.initData.siteOptions = data.data;
            }
            $scope.apply();
        },
        fnFail = function(data){
            console.log(data.message || '获取列表失败');
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 获取用户列表选项
     */
    $scope.getUserOptions = function(){
        var config = {
            url:  $scope.apis.getUserOptions.url,
            method: $scope.apis.getUserOptions.method,
            data: {}
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            if(data && data.data.length > 0){
                $scope.initData.userOptions = data.data;
            }
            $scope.apply();
        },
        fnFail = function(data){
            console.log(data.message || '获取列表失败');
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 获取告警级别列表选项
     */
    $scope.getWarnLevelOptions = function(){
        var config = {
            url:  $scope.apis.getWarnLevelOptions.url,
            method: $scope.apis.getWarnLevelOptions.method,
            data: {}
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            if(data && data.data.length > 0){
                $scope.initData.warnLevelOptions = data.data;
            }
            $scope.apply();
        },
        fnFail = function(data){
            console.log(data.message || '获取列表失败');
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 获取告警状态列表选项
     */
    $scope.getWarnStatusOptions = function(){
        var config = {
            url:  $scope.apis.getWarnStatusOptions.url,
            method: $scope.apis.getWarnStatusOptions.method,
            data: {}
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            if(data && data.data.length > 0){
                $scope.initData.warnStatusOptions = data.data;
            }
            $scope.apply();
        },
        fnFail = function(data){
            console.log(data.message || '获取列表失败');
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 获取通知方式列表选项
     */
    $scope.getNoticeMethodOptions = function(){
        var config = {
            url:  $scope.apis.getNoticeMethodOptions.url,
            method: $scope.apis.getNoticeMethodOptions.method,
            data: {}
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            if(data && data.data.length > 0){
                $scope.initData.noticeMethodOptions = data.data;
            }
            $scope.apply();
        },
        fnFail = function(data){
            console.log(data.message || '获取列表失败');
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };


    /**
     * 获取通知规则列表
     */
    $scope.getmNoticeRuleList = function(){
        var config = {
            url:  $scope.apis.getmNoticeRuleList.url,
            method: $scope.apis.getmNoticeRuleList.method,
            data: {
                page: $scope.pager.curPage || 1,
                per_page: parseInt($scope.pager.per_page) || 10,
                site_name: $scope.query.siteName || null,
                username: $scope.query.userName || null
            }
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.initData.loading = false;
            if(data && data.data.items.length > 0){
                $scope.mNoticeRuleList = data.data.items;
                $scope.initData.total = data.data.total;
            }
            else $scope.mNoticeRuleList = [];
            $scope.apply();
        },
        fnFail = function(data){
            $scope.initData.getListError = data.errMsg || '网络问题，请刷新页面重试';
            $scope.initData.loading = false;
            $scope.mNoticeRuleList = [];
            $scope.apply();
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 获取数据条数
     */
    $scope.getPager = function(){
        if($scope.initData.total > 0){
            $scope.pager.total = $scope.initData.total;
            $scope.pager.totalPage = Math.ceil( $scope.initData.total / parseInt($scope.pager.per_page) );
        }
    };


    /**
     * 添加
     * @param it: clicked object
     */
    $scope.addOne = function(it){
        var flag = $scope.initData.actionType === 'add',
            config = {
            url: $scope.apis.addOne.url,
            method: $scope.apis.addOne.method,
            data: {
                site_id: String($scope.initData.modalForm.siteId),
                user_id: String($scope.initData.modalForm.userId),
                severity_id: String($scope.initData.modalForm.severityId),
                status_id: String($scope.initData.modalForm.statusId),
                method_id: String($scope.initData.modalForm.methodId)
            }
        },
        fnSuccess = function (data){
            it.removeClass('disabled');
            if(data.code == 1){
               $('#J_addmNoticeRule').modal('hide');
               $scope.query(true);
            }
            $scope.apply();
        },
        fnFail = function(data){
            it.removeClass('disabled');
            console.log(data.message);
            $scope.errMsg = data.message;
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 修改
     * @param it: clicked object
     */
    $scope.editOne = function(it){
        var flag = $scope.initData.actionType === 'update',
            config = {
            url: $scope.apis.editOne.url + "/" + $scope.initData.modalForm.id,
            method: $scope.apis.editOne.method,
            data: {
                site_id: String($scope.initData.modalForm.siteId),
                user_id: String($scope.initData.modalForm.userId),
                severity_id: String($scope.initData.modalForm.severityId),
                status_id: String($scope.initData.modalForm.statusId),
                method_id: String($scope.initData.modalForm.methodId)
            }
        },
        fnSuccess = function (data){
            it.removeClass('disabled');
            if(data.code == 1){
               $('#J_addmNoticeRule').modal('hide');
               $scope.query(true);
            }
            $scope.apply();
        },
        fnFail = function(data){
            it.removeClass('disabled');
            console.log(data.message);
            $scope.errMsg = data.message;
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 删除
     * @param it: clicked object
     */
    $scope.deleteOne = function(it){
        var config = {
            url:  $scope.apis.deleteOne.url + "/" + $scope.initData.modalForm.id,
            method: $scope.apis.deleteOne.method,
            data: {}
        },
        fnSuccess = function (data){
            it.removeClass('disabled');
            if(data.code == 1){
                angular.element('#J_mNoticeRuleConfirm').modal('hide');
                $scope.query(true);
            }
            $scope.apply();
        },
        fnFail = function(data){
            it.removeClass('disabled');
            console.log(data.message);
            $scope.errMsg = data.message;
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 点击确定
     * @param event: event object
     */
    $scope.clickOk = function (event){
        var it = $(event.target),
            type = $scope.initData.actionType;
        if(it.hasClass('disabled')){
            return false;
        }
        switch(type){
            case 'delete':
                it.addClass('disabled');
                $scope.deleteOne(it);
                break;
            case 'update':
                it.addClass('disabled');
                $scope.editOne(it);
                break;
            default:
                if($scope.validateForm('all')){
                    it.addClass('disabled');
                    $scope.addOne(it);
                }
                break;
        }
    };
    /**
     * 点击新增
     */
    $scope.clickAdd = function(){
         $scope.modalTitle = '新增通知规则';
         $scope.initData.actionType = 'add';
         $scope.errMsg = '';
         $scope.initData.modalForm = {
            id:'',
            siteId: '',
            userId: '',
            severityId: '',
            statusId:'',
            methodId:'',
            severity:[],
            status:[],
            method: []
        };
        $scope.selfValid();
        angular.element('#J_addmNoticeRule').modal();
    };
    /**
     * 点击修改
     * @param index
     */
    $scope.clickEdit = function(index){
        $scope.modalTitle = '修改通知规则';
        $scope.initData.actionType = 'update';
        $scope.errMsg = '';
        $scope.initData.modalForm.id = $scope.mNoticeRuleList[index].id;
        $scope.initData.modalForm.siteId = $scope.mNoticeRuleList[index].site_id;
        $scope.initData.modalForm.userId = $scope.mNoticeRuleList[index].user_id;
        $scope.initData.modalForm.severityId = $scope.mNoticeRuleList[index].alert_severity;
        if($scope.initData.modalForm.severityId == 1){
            $scope.initData.modalForm.severity[1] = true;
        }else if($scope.initData.modalForm.severityId == 2){
            $scope.initData.modalForm.severity[2] = true;
        }else if($scope.initData.modalForm.severityId == 4){
            $scope.initData.modalForm.severity[4] = true;
        }else if($scope.initData.modalForm.severityId == 3){
            $scope.initData.modalForm.severity[1] = true;
            $scope.initData.modalForm.severity[2] = true;
        }else if($scope.initData.modalForm.severityId == 5){
            $scope.initData.modalForm.severity[1] = true;
            $scope.initData.modalForm.severity[4] = true;
        }else if($scope.initData.modalForm.severityId == 6){
            $scope.initData.modalForm.severity[2] = true;
            $scope.initData.modalForm.severity[4] = true;
        }else if($scope.initData.modalForm.severityId == 7){
            $scope.initData.modalForm.severity[1] = true;
            $scope.initData.modalForm.severity[2] = true;
            $scope.initData.modalForm.severity[4] = true;
        }
        $scope.initData.modalForm.statusId = $scope.mNoticeRuleList[index].alert_status;
        if($scope.initData.modalForm.statusId == 1){
            $scope.initData.modalForm.status[1] = true;
        }else if($scope.initData.modalForm.statusId == 2){
            $scope.initData.modalForm.status[2] = true;
        }else if($scope.initData.modalForm.statusId == 3){
            $scope.initData.modalForm.status[1] = true;
            $scope.initData.modalForm.status[2] = true;
        }
        $scope.initData.modalForm.methodId = $scope.mNoticeRuleList[index].method;
        if($scope.initData.modalForm.methodId == 1){
            $scope.initData.modalForm.method[1] = true;
        }else if($scope.initData.modalForm.methodId == 2){
            $scope.initData.modalForm.method[2] = true;
        }else if($scope.initData.modalForm.methodId == 3){
            $scope.initData.modalForm.method[1] = true;
            $scope.initData.modalForm.method[2] = true;
        }
        $scope.selfValid();
        angular.element('#J_addmNoticeRule').modal();
    };
    /**
     * 点击删除
     * @param index
     */
    $scope.clickDelete = function(index){
        $scope.modalTitle = '删除通知规则';
        $scope.modalInfo = '删除通知规则后不可恢复，确定执行此操作吗？';
        $scope.initData.actionType = 'delete';
        $scope.errMsg = '';
        $scope.initData.modalForm.id = $scope.mNoticeRuleList[index].id;
        angular.element('#J_mNoticeRuleConfirm').modal();
    };
    /**
     * 表单验证
     * @returns {boolean}
     */
    $scope.validateForm = function (type){
        var validDirtyObj = angular.extend({},validFormatObj,{dirty:true}),
            validNotObj = angular.extend({},validDirtyObj,{valid:false,invalid:true});
        if(type === 'site' || type === 'all'){
            $scope.validate.site = angular.extend({},validDirtyObj);
            if(!$scope.initData.modalForm.siteId){
                $scope.validate.site = angular.extend({},validNotObj,{error:{required:true}});
                return;
            }
        }
        if(type === 'user' || type === 'all'){
            $scope.validate.user = angular.extend({},validDirtyObj);
            if(!$scope.initData.modalForm.userId){
                $scope.validate.user = angular.extend({},validNotObj,{error:{required:true}});
                return;
            }
        }
        if(type === 'severity' || type === 'all'){
            $scope.initData.modalForm.severityId = 0;
            console.log($scope.initData.modalForm.severity);
            if(!!$scope.initData.modalForm.severity){
                $.each($scope.initData.modalForm.severity, function(k,v){
                    if(v){
                        $scope.initData.modalForm.severityId += parseInt(k);
                    }
                });
            }
            $scope.validate.severity = angular.extend({},validDirtyObj);
            if($scope.initData.modalForm.severityId == 0){
                $scope.validate.severity = angular.extend({},validNotObj,{error:{required:true}});
                return;
            }
        }
        if(type === 'status' || type === 'all'){
            $scope.initData.modalForm.statusId = 0;
            if(!!$scope.initData.modalForm.status){
                $.each($scope.initData.modalForm.status, function(k,v){
                    if(v){
                        $scope.initData.modalForm.statusId += parseInt(k);
                    }
                });
            }
            $scope.validate.status = angular.extend({},validDirtyObj);
            if($scope.initData.modalForm.statusId == 0){
                $scope.validate.status = angular.extend({},validNotObj,{error:{required:true}});
                return;
            }
        }
        if(type === 'method' || type === 'all'){
            $scope.initData.modalForm.methodId = 0;
            if(!!$scope.initData.modalForm.method){
                $.each($scope.initData.modalForm.method, function(k,v){
                    if(v){
                        $scope.initData.modalForm.methodId += parseInt(k);
                    }
                });
            }
            $scope.validate.method = angular.extend({},validDirtyObj);
            if($scope.initData.modalForm.methodId == 0){
                $scope.validate.method = angular.extend({},validNotObj,{error:{required:true}});
                return;
            }
        }
        $scope.apply();
        return true;
    };
    var validFormatObj = {
        dirty:false,
        valid:true,
        invalid:false,
        error:{
            required:false,
            format:false,
            same:false
        }
    };
    /**
     * 自定义验证
     */
    $scope.selfValid = function (){
        $scope.validate = {
            site:{},
            user:{},
            severity:{},
            status:{},
            methodId:{}
        };
        angular.forEach($scope.validate,function(v,k){
            angular.forEach($scope.validate[k],function(n,i) {
                $scope.validate[k][i] = angular.extend({}, validFormatObj);
            });
        });
    };

    $scope.apply = function() {
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }
}]);
