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
                host: '',
                page : '' ,
                per_page : ''
            }
        },
        getSiteList: {
            url: urlPrefix + '/user/site/',
            method: 'get',
            data: {}
        },
    }

    $scope.cache = {
        listArr: [],
        siteObj: {}
    }

    /*
    *初始化
    */
    $scope.init = function(){
        $rootScope.pagePath = $location.path();
        $scope.pager.curPage = 1;
        $scope.siteName= '';
        $scope.getWarnList(); //显示列表
    }

    /*
    *获取列表
    */
    $scope.getWarnList = function(){
        var config = $scope.api.getWarnList;
        config.data = {
            sitename: $scope.siteName,
            page: $scope.pager.curPage || 1,
            per_page: parseInt($scope.pager.pageSize) || 10
        };
        var fnSuccess = function (d) {
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            console.log($scope.pager.pageSize)
            $scope.pager.total = data.data.total;
            $scope.pager.totalPage = Math.ceil( data.total / parseInt($scope.pager.pageSize) );
            $scope.cache.listArr = data.data.items;

            $scope.apply();
        },
        fnError = function (data) {
            $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
            $scope.modalTitle = '错误信息';
            angular.element("#J_infoDetail").modal('show');
        };
        AjaxServer.ajaxInfo(config, fnSuccess, fnError);
    }

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
                '地址':$scope.cache.siteObj.address,
                'access_key':$scope.cache.siteObj.access_key
            }
            $scope.apply();
        },
        fnError = function (data) {
            $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
            $scope.modalTitle = '错误信息';
            angular.element("#J_infoDetail").modal('show');
        };
        AjaxServer.ajaxInfo(config, fnSuccess, fnError);
    }

    /*
    *显示站点详情
    */
    $scope.showSite = function(item){
        $scope.getSiteList(item);
    }

    /*
    *显示告警详情
    */
    $scope.showWarn = function(item){
        $scope.mTitle = '告警详情';
        angular.element("#J_infoDetail").modal('show');
        $scope.infoDetail = item.content;
    }

    $scope.apply = function() {
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }
})
