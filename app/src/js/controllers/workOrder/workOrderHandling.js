/**
 * @ngdoc function
 * @name myappApp.controller:WorkOrderHandlingCtrl
 * @description
 * WorkOrderHandlingCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
    .controller('WorkOrderHandlingCtrl', ['$scope', '$rootScope', '$window', '$location', '$timeout', '$cookieStore','$state','urlPrefix','AjaxServer','Validate','sessionStore',
        function ($scope, $rootScope, $window, $location, $timeout, $cookieStore,$state,urlPrefix,AjaxServer,Validate,sessionStore) {
            'use strict';

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
                        query: ''
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

            /*
            * 获取列表
            */
            $scope.getHandlingList = function () {
                $scope.formatState();
                var config = $scope.apis.getHandlingList;
                config.data.query = $scope.query.queryValue;
                var fnSuccess = function (d) {
                    $scope.initData.loading = false;
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                    $scope.cache.listArr = data.data;
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

            $scope.apply = function() {
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            };
        }
    ]);
