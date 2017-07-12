'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
  	.controller('HeaderCtrl', ['$scope', '$rootScope', '$window', '$location', '$timeout', '$cookieStore','$state','urlPrefix','AjaxServer','Validate',function ($scope, $rootScope, $window, $location, $timeout, $cookieStore,$state,urlPrefix,AjaxServer,Validate) {
        $scope.userList = {
            init:{
                defaultUser: {
                    userId: 0,
                    username: '',
                    passWord:'',
                    confirmPassWord:''
                },
                pwdModalForm:{
                    passWord:'',
                    repeatPassWord:''
                }
            },
            apis:{
                logoutCommon:{
                    url: urlPrefix + '/user/logout',
                    method: 'post',
                    data:{}
                },
                logoutOther:{
                    url: urlPrefix + '/partner/logout',
                    method: 'post',
                    data:{}
                },
                changePwdCommon:{
                    url: urlPrefix + '/user/info',
                    method: 'post',
                    data:{
                        password:''
                    }
                },
                changePwdOther:{
                    url: urlPrefix + '/partner/info',
                    method: 'post',
                    data:{
                        login_password:''
                    }
                }
            }
        };

	   	$scope.initHeader = function () {
	    	$scope.errorMsg = '';
            $scope.selfValid();
            if($rootScope.commonFlag == undefined){
                $rootScope.commonFlag = $cookieStore.get('commonFlag');
            }
            if($rootScope.userLogStatus == undefined){
                $rootScope.userLogStatus = $cookieStore.get('userLogStatus');
            }
	        // 获取登入信息
			if($rootScope.userLogStatus == 'login'){
                if( $cookieStore && $cookieStore.get('loginUser') ){
                    $rootScope.username = $cookieStore.get('loginUser');
                }
			}else{
                $state.go("login");
            }
	    };

        /**
         * 清除信息
         */
        $scope.clearLoginInfo = function(){
            if( $cookieStore && $cookieStore.get('token') ) {
                $cookieStore.remove('token');
            }
            if( $cookieStore && $cookieStore.get('userLogStatus') ) {
                $cookieStore.remove('userLogStatus');
            }
            if( $cookieStore && $cookieStore.get('loginUser') ) {
                $cookieStore.remove('loginUser');
            }
            $rootScope.userLogStatus = 'logout';
            $rootScope.username = '';
            $state.go('login');
            $scope.apply();
        };

        /**
         * 用户登出
         */
        $scope.clickLogout = function(type){
            if(type){
                $rootScope.commonFlag = type;
            }
            $scope.clearLoginInfo();
            $scope.apply();
        };

        /**
         * 获取登录信息
         */
        //$scope.getLocalLoginInfo = function(){

        //};

        $scope.bindEvent = function () {
            $('body').off('click','.nav li');
            $('body').on('click','.nav li', function(){
                //$scope.getLocalLoginInfo();
            });
        };

        /**
         * 点击修改密码
         */
        $scope.clickChangePwd = function(){
            $scope.errorMsg = '';
            $scope.selfValid();
            $scope.modalTitle = '修改密码';
            $scope.isEditPwd = true;
            $scope.userList.init.pwdModalForm.passWord = '';
            $scope.userList.init.pwdModalForm.repeatPassWord = '';
            $scope.apply();
            angular.element('#J_editPwd').modal();
        };

        /**
         * 发送请求修改密码
         */
	    $scope.clickOk = function(ev){
	    	var it = $(ev.target);
	    	if(it.hasClass('disabled')){
	    		return false;
	    	}
	    	if( $scope.validateForm('all','pwd') ){
	    		it.addClass('disabled');
                var ajaxConfig = $.extend(true,{},$scope.userList.apis.changePwdCommon);
                ajaxConfig.data = {
                    password: $scope.userList.init.pwdModalForm.passWord
                };
	    		if(!$rootScope.commonFlag){
                    ajaxConfig = $.extend(true,{},$scope.userList.apis.changePwdOther);
                    ajaxConfig.data = {
                        login_password: $scope.userList.init.pwdModalForm.passWord
                    };
                }

                AjaxServer.ajaxInfo( ajaxConfig, function(data){
                    it.removeClass('disabled');
                    if(data) angular.element('#J_editPwd').modal('hide');
                }, function( error ) {
                    it.removeClass('disabled');
                    var err = typeof error === 'string' ? JSON.parse(error) : error;
					$scope.sysError = err.errMsg || '系统未知错误，请联系开发人员';
					console.log($scope.sysError);
					$scope.apply();
                });
            }
	    };

	     /**
         * 表单验证
         * @param type: 字段是哪个
         * @param whichForm: 用户添加（user）or修改密码（pwd）
         * @returns {boolean}
         */
        $scope.validateForm = function ( type , whichForm ){
            var validDirtyObj = angular.extend({},validFormatObj,{dirty:true}),
                validNotObj = angular.extend({},validDirtyObj,{valid:false,invalid:true});

            // 清除提示
            $scope.errorMsg = '';

            if(whichForm === 'pwd'){
                // 新密码
                if(type.indexOf('passWord')>-1 || type.indexOf('all')>-1){
                    $scope.validate.pwd.passWord = angular.extend({},validDirtyObj);
                    if(!$scope.userList.init.pwdModalForm.passWord){
                        $scope.validate.pwd.passWord = angular.extend({},validNotObj,{ error:{ required:true, format:false, same:false } });
                        $scope.apply();
                        return false;
                    }
                    else if($scope.userList.init.pwdModalForm.passWord === $scope.userList.init.pwdModalForm.account){
                        $scope.validate.pwd.passWord = angular.extend({},validNotObj,{ error:{ required:false, format:false, same:true } });
                        $scope.apply();
                        return false;
                    }
                    else if(!Validate.validComplexHash($scope.userList.init.pwdModalForm.passWord)){
                        $scope.validate.pwd.passWord = angular.extend({},validNotObj,{ error:{ required:false, format:true, same:false } });
                        if($scope.userList.init.pwdModalForm.repeatPassWord && $scope.userList.init.pwdModalForm.repeatPassWord !== $scope.userList.init.pwdModalForm.passWord){
                            $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{ required:false, format:false, same:true } });
                        }
                        $scope.apply();
                        return false;
                    }
                    else if($scope.userList.init.pwdModalForm.repeatPassWord && $scope.userList.init.pwdModalForm.repeatPassWord !== $scope.userList.init.pwdModalForm.passWord){
                        $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{ required:false, format:false, same:true } });
                        $scope.apply();
                        return false;
                    }
                    else if($scope.userList.init.pwdModalForm.repeatPassWord && $scope.userList.init.pwdModalForm.repeatPassWord === $scope.userList.init.pwdModalForm.passWord){
                        $scope.validate.pwd.repeatPassWord.valid = true;
                        $scope.validate.pwd.repeatPassWord.invalid = false;
                        $scope.validate.pwd.repeatPassWord.error.same= false;
                    }
                }
                // 确认新密码
                if(type.indexOf('repeatPassWord')>-1 || type.indexOf('all')>-1){
                    $scope.validate.pwd.repeatPassWord = angular.extend({},validDirtyObj);
                    if(!$scope.userList.init.pwdModalForm.repeatPassWord){
                        $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{ required:true, format:false, same:false } });
                        $scope.apply();
                        return false;
                    }
                    else if(!Validate.validComplexHash($scope.userList.init.pwdModalForm.repeatPassWord)){
                        $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{ required:false, format:true, same:false } });
                        $scope.apply();
                        return false;
                    }
                    else if($scope.userList.init.pwdModalForm.passWord && $scope.userList.init.pwdModalForm.repeatPassWord !== $scope.userList.init.pwdModalForm.passWord){
                        $scope.validate.pwd.repeatPassWord = angular.extend({},validNotObj,{ error:{ required:false, format:false, same:true }
                        });
                        $scope.apply();
                        return false;
                    }
                }
            }
            $scope.apply();
            return true;
	    };

        var validFormatObj = {
            dirty:false,
            valid:true,
            invalid:false,
            error:{
                required:false,
                format:false,
                same:false
            }
        };

        /**
         * 自定义验证
         */
        $scope.selfValid = function (){
            $scope.validate = {
                pwd:{
                    passWord:{},
                    repeatPassWord:{}
                }
            };
            angular.forEach($scope.validate,function(v,k){
                angular.forEach($scope.validate[k],function(n,i) {
                    $scope.validate[k][i] = angular.extend({}, validFormatObj);
                });
            });
        };

        $scope.apply = function() {
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        };
  	}]);
