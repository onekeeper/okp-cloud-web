/**
 * @ngdoc function
 * @name myappApp.controller:WorkOrderEditAndAssignCtrl
 * @description
 * WorkOrderEditAndAssignCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
    .controller('WorkOrderEditAndAssignCtrl', ['$scope', '$rootScope', '$window', '$location', '$timeout', '$cookieStore','$state','urlPrefix','AjaxServer','Validate','sessionStore',
        function ($scope, $rootScope, $window, $location, $timeout, $cookieStore,$state,urlPrefix,AjaxServer,Validate,sessionStore) {
            'use strict';

            /*
             * 初始化
             */
            $scope.init = function () {
                $rootScope.pagePath = $location.path();
            };
            /*
             * 上传文件触发
             */
            $scope.uploadFile = function () {
                $('#J_uploadFile_edit').click()
            };

            $scope.apply = function() {
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            };
        }]);
