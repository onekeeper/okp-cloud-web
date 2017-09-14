/**
 * @ngdoc function
 * @name myappApp.controller:noticeRuleCtrl
 * @description
 * # noticeRuleCtrl
 * Controller of the myappApp
 * author: wein
 */

angular.module('myappApp')
.controller('noticeRuleCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$location', '$interval', 'AjaxServer', '$state', 'urlPrefix',
    function ($scope, $rootScope, $http, $timeout, $location, $interval, AjaxServer, $state, urlPrefix) {
    'use strict';

    $scope.pager = {};
    $scope.initData = {
        getListError: '',
        loading: true
    };

	$scope.init = function(){
        $rootScope.pagePath = $location.path();
        $scope.pager.curPage = 1;
        $scope.siteName = '';
        $scope.getNoticeRuleList();//显示列表
   };

   $scope.formatState = function () {
        $scope.initData.getListError = '';
        $scope.initData.loading = true;
        $scope.cache.listArr= [];
    };

   $scope.api = {
        getNoticeRuleList: {
            url: urlPrefix + '/user/rules',
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
    };

    $scope.cache = {
        listArr: [],
        siteObj: {}
    };

    /*获取列表*/
    $scope.getNoticeRuleList = function(){
        $scope.formatState();//初始化s

        var config = $scope.api.getNoticeRuleList;
        config.data = {
            sitename: $scope.siteName,
            page: $scope.pager.curPage || 1,
            per_page: parseInt($scope.pager.pageSize) || 20
        };
        var fnSuccess = function (d) {
            $scope.initData.loading = false;
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.pager.total = data.data.total;
            $scope.pager.totalPage = Math.ceil( data.data.total / parseInt($scope.pager.pageSize) );
            $scope.cache.listArr = data.data.items;
            $scope.apply();
        },
        fnError = function (data) {
            $scope.initData.getListError = data.errMsg || '网络问题，请刷新页面重试';
            $scope.initData.loading = false;
            $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
            $scope.modalTitle = '错误信息';
            //angular.element("#J_infoDetail").modal('show');
        };
        AjaxServer.ajaxInfo(config, fnSuccess, fnError);
    };

    /*获取站点*/
    $scope.getSiteList = function(item){
        var config = $scope.api.getSiteList;
        config.url = urlPrefix + '/user/site/' + item;
        var fnSuccess = function (d) {
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.mTitle = '站点详情';
            angular.element("#J_stationDetail").modal('show');
            angular.element('#J_stationDetail').draggable({
                handle: ".modal-header",
                cursor: 'move',
                refreshPositions: false
            });
            $scope.cache.siteObj = data.data[0];
            $scope.listContent = {
                '站点名称':$scope.cache.siteObj.site_name,
                '省':$scope.cache.siteObj.province,
                '市':$scope.cache.siteObj.city ,
                '地址':$scope.cache.siteObj.address//,
                //'access_key':$scope.cache.siteObj.access_key
            };
            $scope.apply();
        },
        fnError = function (data) {
            $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
            $scope.modalTitle = '错误信息';
            //angular.element("#J_infoDetail").modal('show');
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
    *回车事件
    */
    $scope.enterSearch = function(e){
        var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
               $scope.getNoticeRuleList();
            }
    };

    /**
    * 清空
    */
    $scope.queryClean = function( flag ){
        if( flag ){
            $scope.pager.curPage = 1;
        }
        $scope.cleanParameter();
        $scope.getNoticeRuleList();
    };

    /**
    * 清空查询条件
    */
    $scope.cleanParameter = function(){
        $scope.siteName = '';
    };

    $scope.apply = function() {
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    };

}]);
