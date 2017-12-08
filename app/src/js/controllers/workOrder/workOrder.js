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
                $scope.overrallData = {
                    problem_type_list: [{'id': '1', 'name': '其他'},{'id': '2', 'name': '网络'},
                        {'id': '3', 'name': '存储'},{'id': '4', 'name': '服务器'},{'id': '5', 'name': '中间件'},
                        {'id': '6', 'name': '数据库'}, {'id': '7', 'name': '操作系统'}, {'id': '8', 'name': '硬件故障'}],
                    server_type_list: [{'id': '1', 'name': '故障处理'},{'id': '2', 'name': '配置变更'},
                        {'id': '3', 'name': '配件更换'},{'id': '4', 'name': '健康巡检'}]
                };
            };

            /**
             * 构建上传文件页面示意图
             */
            $scope.structFileInfo = function(sourceArr, id) {
                $('#' + id).html("");
                for (var i = 0; i < sourceArr.length; i++) {
                    var div = document.createElement('div');
                    var img = document.createElement('img');
                    var name = document.createElement('p');
                    div.style = "width: 80px; float: left;";
                    img.style = "width: 60px; height: 60px; margin: 10px;";
                    name.innerHTML = sourceArr[i];
                    name.style = "width: 100%; text-align: center;";
                    div.appendChild(img);
                    div.appendChild(name);
                    $('#' + id).append(div);
                }
            };
        }
]);
