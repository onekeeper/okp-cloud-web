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
                $scope.bindEvent();
            };
            /*
             * 上传文件触发
             */
            $scope.uploadFile = function () {
                $('#J_uploadFile').click();
            };
            $scope.bindEvent = function () {
                $('#J_uploadFile').on('change',function (ev) {
                    for (var i = 0; i < this.files.length; i++) {
                        var reader = new FileReader();
                        reader.readAsDataURL(this.files[i]);
                        reader.onload = function () {
                            var div = document.createElement('div');
                            var img = document.createElement('img');
                            var name = document.createElement('p');
                            div.style = "width: 80px; float: left;";
                            img.src = this.result;
                            img.style = "width: 60px; height: auto; margin: 10px;";
                            name.innerHTML = ev.currentTarget.value.replace(/C/g,'').replace(/\:/g,'').replace(/\\/g,'').replace(/fakepath/g,'');
                            name.style = "width: 100%; text-align: center;";
                            div.appendChild(img);
                            div.appendChild(name);
                            $('#thumbnail').append(div);
                        }
                    }
                });
            };
            /*
             * 创建工单
             */
            $scope.createWorkOrder = function (event) {
                $(event.target).addClass('disabled');
                if($('#J_uploadFile').val()){

                }else{

                }
                var config = $scope.apis.createWorkOrder;
                config.data.site_name = $scope.formData.site_name;
                config.data.alert_id = $scope.formData.alert_id;
                config.data.name = $scope.formData.name;
                config.data.problem_type = $scope.formData.problem_type;
                config.data.server_type = $scope.formData.server_type;
                config.data.content = $scope.formData.content;
                config.data.source = $scope.formData.source;
                var fnSuccess = function (d) {
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;

                    $state.go('main.workOrder.handling');
                };
                var fnFail = function (data) {
                    $scope.initData.getListError = data.errMsg || '网络问题，请刷新页面重试';
                    $scope.initData.loading = false;
                    $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
                };
                AjaxServer.ajaxInfo(config, fnSuccess, fnFail);
            };

            $scope.importImgAndCommitForm = function () {

            };

            $scope.apply = function() {
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            };
        }]);
