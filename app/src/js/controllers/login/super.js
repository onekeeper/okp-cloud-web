/**
 * @ngdoc function
 * @name myappApp.controller:superLoginCtrl
 * @description
 * # 超级管理用户登录 superLoginCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
  	.controller('superLoginCtrl', ['$scope', '$rootScope', '$location','$cookieStore','$state','urlPrefix','AjaxServer','sessionStore',
        function($scope, $rootScope, $location, $cookieStore,$state,urlPrefix,AjaxServer,sessionStore){
  	    'use strict';
  	    var apiLoginUrl = urlPrefix + '/superviser/login';

        $scope.init = function() {
            $scope.clearLoginInfo();
  		};

        $scope.clickSubmit = function( ev ) {
            var data = {
                login_username: $scope.user.username,
                login_password: $scope.user.password
            };
            var it = $(ev.target), ajaxConfig;
            if( it.hasClass('disabled') ){
                return false;
            }
            if( $scope.validForm() ){
                // 清空
                if( sessionStore.get('token') ){
                    sessionStore.clear();
                }
                $scope.errorMsg = '';
                it.addClass('disabled');
                ajaxConfig = {
                    method: 'post',
                    url: apiLoginUrl,
                    data: data
                };
                AjaxServer.ajaxInfo( ajaxConfig, function(data){
                    it.removeClass('disabled');
                    if(data){
                        var d = typeof(data)==="string" ? JSON.parse(data) : data;
                        $rootScope.userLogStatus = 'login';
                        sessionStore.set('token',d.data.access_token);
                        sessionStore.set('freshToken',d.data.refresh_token);
                        $rootScope.username = $scope.user.username;
                        sessionStore.set('loginUser',$rootScope.username);
                        sessionStore.set('userLogStatus','login');
                        $rootScope.partnerFlag = 'true';
                        sessionStore.set('partnerFlag','true');
                        $state.go('main.sPartnerCount');
                    }
                }, function( error ) {
                    it.removeClass('disabled');
                    $scope.validFailFn(error.message);
                });
           }else{
                $scope.validFailFn();
           }
        };

        $scope.validForm = function() {
            if( $scope.user.username === '' || $scope.user.password === ''){
                $scope.errorMsg = '请输入用户名和密码';
                return false;
            }else{
                return true;
            }

        };

        $scope.validFailFn = function( msg ){
            if( msg ) $scope.errorMsg = msg;
            $scope.apply();
        };

        $scope.clearLoginInfo = function(){
            $rootScope.userLogStatus = '';
            $scope.user = {
                username:'',
                password:''
            };
            $scope.errorMsg = '';
            $rootScope.username = '';
            sessionStore.clear();
            $scope.apply();
        };

        $scope.apply = function() {
            if(!$scope.$$phase) $scope.$apply();
        };
  	}]);
