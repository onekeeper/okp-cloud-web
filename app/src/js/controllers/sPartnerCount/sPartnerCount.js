/**
 * @ngdoc function
 * @name myappApp.controller:sPartnerCountCtrl
 * @description
 * @author [James]
 * # sPartnerManageCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
.controller('sPartnerCountCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate',
    function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate) {
    'use strict';

    $scope.partnerList = {
        init: {
            getListError: '',
            tdObj:[],
            partnerCount:0,
            siteCount:0,
            loading: true
        },
        query:{
            'partner_name':''
        },
        apis:{
            getPartnerCount: {
                url: urlPrefix + '/superviser/partnerCount',
                method: 'get',
                data: {
                }
            },
            getSiteCount: {
                url: urlPrefix + '/superviser/siteCount',
                method: 'get',
                data: {
                }
            },
            getListCount: {
                url: urlPrefix + '/superviser/listCount',
                method: 'get',
                data: {
                }
            }
        }
    };

    /**
     * 初始化
     */
    $scope.init = function () {
        $scope.pager = {};
        $scope.getPartnerCount();
        $scope.getSiteCount();
        $scope.getListCount();
    };

    /**
     * 页面查询操作
     * @param flag: if curPage == 1
     */
    $scope.query = function ( flag ) {
        if( flag ){
            $scope.pager.curPage = 1;
        }
        $scope.formatState();
        $scope.getListCount();
    };

    /**
     * 状态初始化
     */
    $scope.formatState = function () {
        $scope.partnerList.init.getListError = '';
        $scope.partnerList.init.loading = true;
    };

    /**
     * 获取列表数据
     */
    $scope.getListCount = function(){
        var config = {
            url:  $scope.partnerList.apis.getListCount.url,
            method: $scope.partnerList.apis.getListCount.method,
            data: {
                page: $scope.pager.curPage || 1,
                per_page: parseInt($scope.pager.pageSize) || 20
            }
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.partnerList.init.loading = false;
            $scope.partnerList.init.tdObj = data.data.items;
            $scope.pager.total = data.data.total;
            $scope.pager.totalPage = Math.ceil( data.data.total / parseInt($scope.pager.pageSize) );
            $scope.apply();
        },
        fnFail = function(data){
            $scope.partnerList.init.getListError = data.message || '网络问题，请刷新页面重试';
            $scope.partnerList.init.loading = false;
            $scope.partnerList.init.tdObj = [];
            $scope.apply();
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 获取租户数量
     */
    $scope.getPartnerCount = function(){
        var config = $scope.partnerList.apis.getPartnerCount,
            fnSuccess = function (data){
                if(data){
                    $scope.partnerList.init.partnerCount = data.data;
                }
                $scope.apply();
            },
            fnFail = function(data){
                console.log(data.message);
            };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 获取站点数量
     */
    $scope.getSiteCount = function(){
        var config = $scope.partnerList.apis.getSiteCount,
            fnSuccess = function (data){
                if(data){
                    $scope.partnerList.init.siteCount = data.data;
                }
                $scope.apply();
            },
            fnFail = function(data){
                console.log(data.message);
            };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    $scope.apply = function() {
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    };
}]);
