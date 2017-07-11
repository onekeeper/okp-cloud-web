'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:noticeRuleCtrl
 * @description
 * # noticeRuleCtrl
 * Controller of the myappApp
 * author: wein
 */

angular.module('myappApp')
.controller('noticeRuleCtrl', function ($scope, $rootScope, $http, $timeout, $location, $interval, AjaxServer, $state, urlPrefix) {
    $scope.tbh = (angular.element(window).height() - 140 ) * .9 - 30;
    $scope.trh = angular.element('.table-custom tr').height() || 30;
    $scope.pslgst = 30;
    $scope.pager = {};

	$scope.init = function(){
        $rootScope.pagePath = $location.path();
        $scope.pager.curPage = 1;
        $scope.siteName = '';
        $scope.getNoticeRuleList();//显示列表
   }

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
    }

    $scope.cache = {
        listArr: [],
        siteObj: {}
    }

    /*获取列表*/
    $scope.getNoticeRuleList = function(){
        var config = $scope.api.getNoticeRuleList;
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
                if(data.data.items[i].alert_severity == 1){
                    $scope.cache.listArr[i].alert_severity = '消息';
                }else if(data.data.items[i].alert_severity == 2){
                    $scope.cache.listArr[i].alert_severity = '告警';
                }else if(data.data.items[i].alert_severity == 4){
                    $scope.cache.listArr[i].alert_severity = '威胁';
                }
            }
            for(var i = 0;i<$scope.cache.listArr.length;i++){
                if(data.data.items[i].alert_status == 1){
                    $scope.cache.listArr[i].alert_status = '已解决';
                }else if(data.data.items[i].alert_status == 2){
                    $scope.cache.listArr[i].alert_status = '遗留';
                }
            }
            for(var i = 0;i<$scope.cache.listArr.length;i++){
                if(data.data.items[i].method == 1){
                    $scope.cache.listArr[i].method = '邮件';
                }else if(data.data.items[i].method == 2){
                    $scope.cache.listArr[i].method = '微信';
                }
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

    /*获取站点*/
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
            //angular.element("#J_infoDetail").modal('show');
        };
        AjaxServer.ajaxInfo(config, fnSuccess, fnError);
    }

    $scope.showSite = function(item){
        $scope.getSiteList(item);
        $scope.showflag = 1;
    }

    $scope.clickOk = function () {
        if($scope.showflag == 1){
            angular.element("#J_stationDetail").modal('hide');
        }else{
            angular.element("#J_infoDetail").modal('hide');
        }

    }

    $scope.apply = function() {
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }

})
