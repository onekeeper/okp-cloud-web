/**
 * @ngdoc function
 * @name myappApp.controller:WorkClosedCtrl
 * @description
 * WorkClosedCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
    .controller('WorkOrderClosedCtrl', ['$scope', '$rootScope', '$window', '$location', '$timeout', '$cookieStore','$state','urlPrefix','AjaxServer','Validate','sessionStore',
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
                getClosedList: {
                    url: urlPrefix + '/worksheet/closure',
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
                $scope.getClosedList(); //显示列表
                // $scope.getStatus();//获取告警状态
            };

            $scope.formatState = function () {
                $scope.initData.getListError = '';
                $scope.initData.loading = true;
                $scope.cache.listArr= [];
            };

            $scope.getClosedList = function () {
                $scope.formatState();
                var config = $scope.apis.getClosedList;
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
                    // $scope.modalTitle = '错误信息';
                    // angular.element("#J_infoDetailUntreated").modal('show');
                    // angular.element('#J_infoDetailUntreated').draggable({
                    //     handle: ".modal-header",
                    //     cursor: 'move',
                    //     refreshPositions: false
                    // });
                };
                AjaxServer.ajaxInfo(config, fnSuccess, fnError);
            };

            /**
             * 清空
             */
            $scope.queryClean = function( flag ){
                $scope.cleanParameter();
                $scope.getClosedList();
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
