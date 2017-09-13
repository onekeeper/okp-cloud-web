/**
 * @ngdoc function
 * @name myappApp.controller:LoginCtrl
 * @description
 * # 用户登录 LoginCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
  	.controller('LoginCtrl', ['$scope', '$rootScope', '$location','$cookieStore','$state','urlPrefix','AjaxServer','sessionStore',
        function($scope, $rootScope, $location, $cookieStore,$state,urlPrefix,AjaxServer,sessionStore){
        'use strict';
  	    var apiLoginUrl = urlPrefix + '/user/login',
            otherApiLoginUrl = urlPrefix + '/partner/login';

        $scope.init = function() {
            $scope.clearLoginInfo();
            if($rootScope.commonFlag == undefined) {
                $rootScope.commonFlag = true;
                $cookieStore.put('commonFlag',true);
            }
            $rootScope.partnerFlag = 'false';
            sessionStore.set('partnerFlag','false');
  		};

  		$scope.showLogin = function(type){
            $scope.init();
  		    if(type == 'other'){
                $rootScope.commonFlag = false;
                $cookieStore.put('commonFlag',false);
            }else{
                $rootScope.commonFlag = true;
                $cookieStore.put('commonFlag',true);
            }
            $scope.apply();
        };

        $scope.clickSubmit = function( ev, type ) {
            var data = {
                email: $scope.user.username,
                password: $scope.user.password
            };
            if(type != 'common'){
                apiLoginUrl = otherApiLoginUrl;
                data = {
                    login_username: $scope.user.username,
                    login_password: $scope.user.password//hex_md5($scope.user.password)
                };
            }
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

                        if(type == 'common'){
                            $rootScope.username = d.data.username;
                            sessionStore.set('loginUser',$rootScope.username);
                            sessionStore.set('userLogStatus','login');
                            $state.go('main.untreated');
                        }else {
                            $rootScope.username = d.data.name;
                            sessionStore.set('loginUser',$rootScope.username);
                            sessionStore.set('userLogStatus','login');
                            $state.go('main.mSiteManage');
                        }
                    }
                }, function( error ) {
                    it.removeClass('disabled');
                    $scope.validFailFn(error.message);
                })
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
