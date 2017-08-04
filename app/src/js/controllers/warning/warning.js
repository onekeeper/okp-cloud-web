'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:warningCtrl
 * @description
 * # warningCtrl
 * Controller of the myappApp
 * author: wein
 */

 angular.module('myappApp')
 .controller('warningCtrl', function ($scope, $rootScope, $http, $timeout, $location, $interval, AjaxServer, $state, urlPrefix) {
    $scope.tbh = (angular.element(window).height() - 140 ) * .9 - 30;
    $scope.trh = angular.element('.table-custom tr').height() || 30;
    $scope.pslgst = 30;
    $scope.pager = {};

    $scope.api = {
        getWarnList: {
            url: urlPrefix + '/user/alerts',
            method: 'get',
            data: {
                sitename: '',
                status:'',
                starttime:'',
                endtime:'',
                page : '' ,
                per_page : ''
            }
        },
        getSiteList: {
            url: urlPrefix + '/user/site/',
            method: 'get',
            data: {}
        },
        getStatusList:{
            url: urlPrefix + '/partner/dropdown/statuses',
            method: 'get',
            data: {}
        }
    };

    $scope.cache = {
        listArr: [],
        siteObj: {},
        statusList: []
    };

    /*
    *初始化
    */
    $scope.init = function(){
        $rootScope.pagePath = $location.path();
        $scope.pager.curPage = 1;
        ///$scope.siteName= '';
        $scope.queryInfo = {};
        $scope.saveTime = {};
        $scope.getWarnList(); //显示列表
        $scope.getStatus();//获取告警状态
        $scope.getData();//日期插件
    };

    /*
    *获取列表
    */
    $scope.getWarnList = function(){
        var config = $scope.api.getWarnList;
        config.data = {
            sitename: $scope.queryInfo.siteName,
            status:$scope.queryInfo.warnStatus,
            starttime:$scope.saveTime.time_Start,
            endtime:$scope.saveTime.time_End,
            page: $scope.pager.curPage || 1,
            per_page: parseInt($scope.pager.pageSize) || 10
        };
        var fnSuccess = function (d) {
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.pager.total = data.data.total;
            $scope.pager.totalPage = Math.ceil( data.data.total / parseInt($scope.pager.pageSize) );
            $scope.cache.listArr = data.data.items;
            $scope.apply();
        },
        fnError = function (data) {
            $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
            $scope.modalTitle = '错误信息';
            angular.element("#J_infoDetail").modal('show');
        };
        AjaxServer.ajaxInfo(config, fnSuccess, fnError);
    };

    /*
    *获取告警状态列表
    */
    $scope.getStatus = function(){
        var config = $scope.api.getStatusList;
        var fnSuccess = function (d) {
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.cache.statusList = data.data;
            $scope.apply();
        },
        fnError = function (data) {
            $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
            $scope.modalTitle = '错误信息';
        };
        AjaxServer.ajaxInfo(config, fnSuccess, fnError);
    };

    /*
    *获取站点
    */
    $scope.getSiteList = function(item){
        var config = $scope.api.getSiteList;
        config.url = urlPrefix + '/user/site/' + item;
        var fnSuccess = function (d) {
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.mTitle = '站点详情';
            angular.element("#J_stationDetail").modal('show');
            $scope.cache.siteObj = data.data[0];
            $scope.listContent = {
                '站点名称':$scope.cache.siteObj.site_name,
                '省':$scope.cache.siteObj.province,
                '市':$scope.cache.siteObj.city ,
                '地址':$scope.cache.siteObj.address//,
                //'access_key':$scope.cache.siteObj.access_key
            }
            $scope.apply();
        },
        fnError = function (data) {
            $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
            $scope.modalTitle = '错误信息';
            angular.element("#J_infoDetail").modal('show');
        };
        AjaxServer.ajaxInfo(config, fnSuccess, fnError);
    };

    /*
    *显示站点详情
    */
    $scope.showSite = function(item){
        $scope.getSiteList(item);
    };

    /*
    *显示告警详情
    */
    $scope.showWarn = function(item){
        $scope.mTitle = '告警详情';
        angular.element("#J_infoDetail").modal('show');
        $scope.infoDetail = item.content;
    };

    /*
    *日期减去8小时
    */
    $scope.countDate = function(date){
        var temp = ($.timeStampDate(date,false) - 28800).toString();
        return ($.timeStampDate(temp,true));
    };

    /*
    *日期插件
    */
    $scope.getData = function(){
        var start = {
            format: 'YYYY-MM-DD hh:mm:ss',
            minDate: '1977-01-01 00:00:00',
            maxDate: $.nowDate({DD:0}),
            ishmsVal:false,
            zIndex:3000,
            choosefun: function(elem,date){
                end.minDate = date;
                endDates();
                $scope.saveTime.time_Start = $scope.countDate(date); 
            },
            okfun:function (elem,date) {
                 end.minDate = date;
                 endDates();
                 $scope.saveTime.time_Start = $scope.countDate(date);
            },
            clearfun:function() {
                $scope.saveTime.time_Start = "";
            }
        };
        var end = {
            format: 'YYYY-MM-DD hh:mm:ss',
            minDate: $.nowDate({DD:0}),
            maxDate: '2099-06-16 00:00:00',
            ishmsVal:false,
            zIndex:3000, 
            choosefun: function(elem,date){
                start.maxDate = date; 
                $scope.saveTime.time_End = $scope.countDate(date);
            },
            okfun:function (elem,date) {
                 start.maxDate = date;
                 $scope.saveTime.time_End = $scope.countDate(date); 
            },
            clearfun:function() {
                $scope.saveTime.time_End = "";
            }
        };
        function endDates() {
            end.trigger = false;
            $("#endTime").jeDate(end);
        }
        $("#startTime").jeDate(start);
        $("#endTime").jeDate(end);
    };
    
    $scope.apply = function() {
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }
});
