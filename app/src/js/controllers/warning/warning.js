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
            per_page: parseInt($scope.pager.pageSize) || 20
        };
        var fnSuccess = function (d) {
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.pager.total = data.data.total;
            $scope.cache.listArr = data.data.items;

            for(var i = 0;i<$scope.cache.listArr.length;i++){
                if(data.data.items[i].severity == 1){
                    $scope.cache.listArr[i].severity = '消息';
                }else if(data.data.items[i].severity == 2){
                    $scope.cache.listArr[i].severity = '告警';
                }else if(data.data.items[i].severity == 4){
                    $scope.cache.listArr[i].severity = '威胁';
                }
            }
            for(var i = 0;i<$scope.cache.listArr.length;i++){
                if(data.data.items[i].status == 1){
                    $scope.cache.listArr[i].status = '已解决';
                }else if(data.data.items[i].status == 2){
                    $scope.cache.listArr[i].status = '遗留';
                }
            }
            $scope.apply();
        },
        fnError = function (data) {
            $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
            $scope.modalTitle = '错误信息';
            //angular.element("#J_infoDetail").modal('show');
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
            $scope.modalTitle = '站点详情';
            angular.element("#J_stationDetail").modal('show');

            $scope.cache.siteObj = {
                siteName:data.data.site_name,
                province:data.data.province,
                city:data.data.city,
                address:data.data.address
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
        $scope.showflag = 1;
    }

    /*
    *显示告警详情
    */
    $scope.showWarn = function(item){
        $scope.modalTitle = '告警详情';
        angular.element("#J_infoDetail").modal('show');
        $scope.infoDetail = item.content;
        $scope.showflag = 2;
    }

    $scope.clickOk = function () {
        if($scope.showflag == 1){
            angular.element("#J_stationDetail").modal('hide');
        }else if($scope.showflag == 2){
            angular.element("#J_infoDetail").modal('hide');
        }

    }

    $scope.apply = function() {
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }
})
