'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:noticeCtrl
 * @description
 * # noticeCtrl
 * Controller of the myappApp
 * author: wein
 */

 angular.module('myappApp')
 .controller('noticeCtrl', function ($scope, $rootScope, $http, $timeout, $location, $interval, AjaxServer, $state, urlPrefix) {
    $scope.tbh = (angular.element(window).height() - 140 ) * .9 - 30;
    $scope.trh = angular.element('.table-custom tr').height() || 30;
    $scope.pslgst = 30;
    $scope.pager = {};

    $scope.api = {
        getNoticeList: {
            url: urlPrefix + '/user/notifications',
            method: 'get',
            data: {
                sitename: '',
                page : '' ,
                per_page : ''
            }
        },
        getSiteList: {
            url: urlPrefix + '/user/site/',
            method: 'get',
            data: {}
        }
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
        $scope.siteName = '';
        $scope.getNoticeList();//显示列表
   }

    /*
    *获取列表
    */
    $scope.getNoticeList = function(){
        var config = $scope.api.getNoticeList;
        config.data = {
            sitename: $scope.siteName,
            page: $scope.pager.curPage || 1,
            per_page: parseInt($scope.pager.pageSize) || 10
        };
        var fnSuccess = function (d) {
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.pager.total = data.data.total;
            $scope.cache.listArr = data.data.items;

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
            $scope.mTitle = '站点详情';
            angular.element("#J_stationDetail").modal('show');
            $scope.cache.siteObj = data.data[0];

            $scope.apply();
        },
        fnError = function (data) {
            $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
            $scope.modalTitle = '错误信息';
            //angular.element("#J_infoDetail").modal('show');
        };
        AjaxServer.ajaxInfo(config, fnSuccess, fnError);
    }

    $scope.showSite = function(item){
        $scope.getSiteList(item);
    }

    $scope.showWarn = function(item){
        $scope.mTitle = '通知详情';
        angular.element("#J_infoDetail").modal('show');
        $scope.infoDetail = item.content;
    }

    $scope.apply = function() {
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }

})
