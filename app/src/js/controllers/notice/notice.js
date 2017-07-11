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
                host: '',
                page : '' ,
                per_page : ''
            }
        },
        getSiteList: {
            url: urlPrefix + '/user/site/detail',
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
            host: $scope.hostName,
            page: $scope.pager.curPage || 1,
            per_page: parseInt($scope.pager.pageSize) || 20
        };
        var fnSuccess = function (d) {
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.pager.total = data.data.total;
            $scope.cache.listArr = data.data.items;

            for(var i = 0;i<$scope.cache.listArr.length;i++){
                if(data.data.items[i].status == 1){
                    $scope.cache.listArr[i].status = '成功';
                }else if(data.data.items[i].status == 0){
                    $scope.cache.listArr[i].status = '失败';
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
        config.url = urlPrefix + '/user/site/detail' + item;
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

    $scope.showSite = function(item){
        $scope.getSiteList(item);
        $scope.showflag = 1;
    }

    $scope.showWarn = function(item){
        $('.modal-header > h6').html('告警详情');
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
