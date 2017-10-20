/**
 * @ngdoc function
 * @name myappApp.controller:WorkOrderCtrl
 * @description
 * WorkOrderCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
    .controller('WorkOrderCtrl', ['$scope', '$rootScope',
        function ($scope, $rootScope) {
            'use strict';

            $scope.resetRender = function () {
                $scope.menuHeight = $(window).height() - 52;
                $scope.apply();
            };

            $scope.bindEvent = function () {
                $(window).resize(function(){
                    $scope.resetRender();
                });
            };

            $scope.apply = function() {
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            };

            $scope.init = function() {
                $scope.resetRender();
                $scope.bindEvent();
            };
        }
]);
