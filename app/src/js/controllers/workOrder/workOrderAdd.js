/**
 * @ngdoc function
 * @name myappApp.controller:WorkOrderAddCtrl
 * @description
 * WorkOrderAddCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
    .controller('WorkOrderAddCtrl', ['$scope', '$rootScope', '$window', '$location', '$timeout', '$cookieStore','$state','urlPrefix','AjaxServer','Validate','sessionStore',
        function ($scope, $rootScope, $window, $location, $timeout, $cookieStore,$state,urlPrefix,AjaxServer,Validate,sessionStore) {
            'use strict';

            $scope.formData = {
                alert_id: '',
                alert_content: '',
                site_id: '',
                site_name: '',
                name: '',
                problem_type: '',
                server_type: '',
                content: '',
                source: []
            };
            $scope.apis = {
                createWorkOrder: {
                    url: urlPrefix + '/worksheet/create',
                    method: 'post',
                    data: {
                        alert_id: '',
                        alert_content: '',
                        site_id: '',
                        site_name: '',
                        name: '',
                        problem_type: '',
                        server_type: '',
                        content: '',
                        source: []
                    }
                }
            };
            /*
             * 初始化
             */
            $scope.init = function () {
                $rootScope.pagePath = $location.path();
                $scope.formData = {};
            };
            /*
             * 上传文件触发
             */
            $scope.uploadFile = function () {
                $('#J_uploadFile').click()
            };
            /*
             * 上传文件
             */
            $scope.createWorkOrder = function () {
                var config = $scope.apis.createWorkOrder;
                config.data.site_name = $scope.formData.site_name;
                config.data.alert_id = $scope.formData.alert_id;
                config.data.name = $scope.formData.name;
                config.data.problem_type = $scope.formData.problem_type;
                config.data.server_type = $scope.formData.server_type;
                config.data.content = $scope.formData.content;
                config.data.source = $scope.formData.source;
                var fnSuccess = function (d) {
                    
                };
                var fnFail = function (data) {

                };
                AjaxServer.ajaxInfo(config, fnSuccess, fnFail);
            };

            $scope.apply = function() {
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            };
        }]);
