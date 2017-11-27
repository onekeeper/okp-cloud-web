/**
 * @ngdoc function
 * @name myappApp.controller:WorkOrderHandlingCtrl
 * @description
 * WorkOrderHandlingCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
    .controller('WorkOrderHandlingCtrl', ['$scope', '$rootScope', '$window', '$location', '$state','urlPrefix','AjaxServer',
        function ($scope, $rootScope, $window, $location, $state, urlPrefix, AjaxServer) {
            'use strict';

            $scope.pager = {};
            $scope.initData = {
                getListError: '',
                loading: true
            };
            $scope.cache = {
                listArr: [],
                siteObj: {},
                statusList: []
            };
            $scope.apis = {
                getHandlingList: {
                    url: urlPrefix + '/worksheet/active',
                    method: 'get',
                    data: {
                        query: '',
                        page: '',
                        per_page: ''
                    }
                }
            };

            /*
            * 初始化
            */
            $scope.init = function () {
                $rootScope.pagePath = $location.path();
                $scope.saveTime = {};
                $scope.query = {};
                $scope.query.queryValue = '';
                $scope.getHandlingList(); //显示列表
            };

            $scope.formatState = function () {
                $scope.initData.getListError = '';
                $scope.initData.loading = true;
                $scope.cache.listArr= [];
            };

            //点击回车查询
            $scope.queryAsKeyup = function(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode === 13){
                    $scope.querySearch(true);
                }
            };

            /**
             * 页面查询操作
             * @param flag: if curPage == 1
             */
            $scope.querySearch = function ( flag ) {
                if( flag ){
                    $scope.pager.curPage = 1;
                }
                $scope.formatState();
                $scope.getHandlingList();
            };

            /*
            * 获取列表
            */
            $scope.getHandlingList = function () {
                $scope.formatState();
                var config = $scope.apis.getHandlingList;
                config.data.query = $scope.query.queryValue;
                config.data.page = $scope.pager.curPage || 1;
                config.data.per_page = parseInt($scope.pager.pageSize) || 20;
                var fnSuccess = function (d) {
                    $scope.initData.loading = false;
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                    $scope.cache.listArr = data.data;
                    $scope.pager.total = data.total;
                    $scope.pager.totalPage = Math.ceil( data.total / parseInt($scope.pager.pageSize) );
                    for(var x in $scope.cache.listArr){
                        $scope.cache.listArr[x].duration = $scope.minToDHM($scope.cache.listArr[x].duration);
                        $scope.cache.listArr[x].idle = $scope.minToDHM($scope.cache.listArr[x].idle);
                    }
                    $scope.apply();
                };
                var fnError = function (data) {
                    $scope.initData.getListError = data.errMsg || '网络问题，请刷新页面重试';
                    $scope.initData.loading = false;
                    $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
                };
                AjaxServer.ajaxInfo(config, fnSuccess, fnError);
            };

            /**
             * 清空
             */
            $scope.queryClean = function( flag ){
                $scope.cleanParameter();
                $scope.getHandlingList();
            };

            /**
             * 清空查询条件
             */
            $scope.cleanParameter = function(){
                $scope.query.queryValue = '';
                $scope.apply();
            };
            /*
             * 跳转到详情
             */
            $scope.gotoDetails = function(obj){
                $state.go('main.workOrder.edit',obj);
            };
            /*
             * 分钟转天时分
             */
            $scope.minToDHM = function(d){
                var days = Math.floor(d / 1440);
                var hours = Math.floor(d % 1440 / 60);
                var mins = d % 1440 % 60;
                if(!days && !hours){
                    return mins + '分钟';
                }else if(!days){
                    return hours + '小时' + mins + '分钟';
                }else {
                    return days + '天' + hours + '小时' + mins + '分钟';
                }
            };

            $scope.apply = function() {
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            };
        }
    ]);
