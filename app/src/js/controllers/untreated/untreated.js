/**
 * @ngdoc function
 * @name myappApp.controller:untreatedCtrl
 * @description
 * # warningCtrl
 * Controller of the myappApp
 * author: james
 */

 angular.module('myappApp')
 .controller('untreatedCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$location', '$interval', 'AjaxServer', '$state', 'urlPrefix',
     function ($scope, $rootScope, $http, $timeout, $location, $interval, AjaxServer, $state, urlPrefix) {
    'use strict';

    $scope.initData = {
        getListError: '',
        loading: true
    };

    $scope.api = {
        getWarnList: {
            url: urlPrefix + '/user/app/alerts/untreated?query=',
            method: 'get',
            data: {
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
        $scope.queryInfo = {};
        $scope.saveTime = {};
        $scope.queryInfo.keyWords = '';
        $scope.getWarnList(); //显示列表
        $scope.getStatus();//获取告警状态
    };

    $scope.formatState = function () {
        $scope.initData.getListError = '';
        $scope.initData.loading = true;
        $scope.cache.listArr= [];
    };

    /*
    *获取列表
    */
    $scope.getWarnList = function(){
        $scope.formatState();//初始化

        var config = $scope.api.getWarnList;
            config.url = $scope.api.getWarnList.url + $scope.queryInfo.keyWords;
        var fnSuccess = function (d) {
            $scope.initData.loading = false;
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.cache.listArr = data.data;
            $scope.apply();
        },
        fnError = function (data) {
            $scope.initData.getListError = data.errMsg || '网络问题，请刷新页面重试';
            $scope.initData.loading = false;
            $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
            $scope.modalTitle = '错误信息';
            angular.element("#J_infoDetailUntreated").modal('show');
            angular.element('#J_infoDetailUntreated').draggable({
                handle: ".modal-header",
                cursor: 'move',
                refreshPositions: false
            });
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
            angular.element("#J_stationDetailUntreated").modal('show');
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
            angular.element("#J_infoDetailUntreated").modal('show');
            angular.element('#J_infoDetailUntreated').draggable({
                handle: ".modal-header",
                cursor: 'move',
                refreshPositions: false
            });
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
        $scope.mTitle = '告警内容';
        angular.element("#J_infoDetailUntreated").modal('show');
        angular.element('#J_infoDetailUntreated').draggable({
            handle: ".modal-header",
            cursor: 'move',
            refreshPositions: false
        });
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
    *回车事件
    */
    $scope.enterSearch = function(e){
        var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
               $scope.getWarnList();
            }
    };

    /**
    * 清空
    */
    $scope.queryClean = function( flag ){
        $scope.cleanParameter();
        $scope.getWarnList();
    };

    /**
    * 清空查询条件
    */
    $scope.cleanParameter = function(){
        $scope.queryInfo.keyWords = '';
        $scope.apply();
    };

    $scope.apply = function() {
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    };
}]);
