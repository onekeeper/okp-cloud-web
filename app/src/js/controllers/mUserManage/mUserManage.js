'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:mUserManageCtrl
 * @description
 * @author [James]
 * # mUserManageCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
.controller('mUserManageCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate',function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate) {
    $scope.tbh = (angular.element(window).height() - 140 ) * .9 - 30;
    $scope.trh = angular.element('.table-custom tr').height() || 30;
    $scope.pslgst = 30;

    $scope.pager = {};

    $scope.userList = {
        init: {
            token: '',
            getListError: '',
            actionId: '',
            actionType: 'add',
            tdObj:[],
            loading: true,
            modalForm:{
                email:'',
                username:'',
                mobile:''
            }
        },
        query:{
            'username':'',
        },
        apis:{
            getList: {
                url: urlPrefix + '/partner/user/details',
                method: 'get',
                data: {
                    page: 1,
                    per_page: '',
                    username:''
                }
            },
            addOne:{
               url: urlPrefix + '/partner/user',
               method: 'post',
               data: {
                    email:'',
                    username:'',
                    mobile:''
               }
            },
            updateOne:{
               url: urlPrefix + '/partner/user/#',
               method: 'put',
               data: {
                    email:'',
                    username:'',
                    mobile:''
               }
            },
            deleteOne:{
               url: urlPrefix + '/partner/user/#',
               method: 'delete',
               data: {
               }
            },
            resetPwd:{
                url: urlPrefix + '/partner/user/#',
                method: 'patch',
                data: {
                }
            }
        }
    };

    /**
     * 初始化
     */
    $scope.init = function () {
        $scope.bindEvent();
        $scope.getList();
    };

    /**
     * 页面查询操作
     * @param flag: if curPage == 1
     */
    $scope.query = function ( flag ) {
        if( flag ){
            $scope.pager.curPage = 1;
        }
        $scope.formatState();
        $scope.getList();
    };

    /**
     * 状态初始化
     */
    $scope.formatState = function () {
        $scope.userList.init.getListError = '';
        $scope.userList.init.loading = true;
    };

    /**
     * 获取列表数据
     */
    $scope.getList = function(){;
        var config = {
            url:  $scope.userList.apis.getList.url,
            method: $scope.userList.apis.getList.method,
            data: {
                page: $scope.pager.curPage || 1,
                per_page: parseInt($scope.pager.pageSize) || 10,
                username: $scope.userList.query.username || null
            }
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.userList.init.loading = false;
            $scope.userList.init.tdObj = data.data.items;
            $scope.pager.total = data.data.total;
            $scope.pager.totalPage = Math.ceil( data.total / parseInt($scope.pager.pageSize) );
            $scope.apply();
        },
        fnFail = function(data){
            $scope.userList.init.getListError = data.message || '网络问题，请刷新页面重试';
            $scope.userList.init.loading = false;
            $scope.userList.init.tdObj = [];
            $scope.apply();
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 发送新增或修改请求
     * @param it: clicked object
     */
    $scope.addOrUpdate = function(it){
        $scope.errMsg = '';
        var flag = $scope.userList.init.actionType === 'add';
        var config = {
            url:  flag ? $scope.userList.apis.addOne.url : $scope.userList.apis.updateOne.url.replace(/\#/,$scope.userList.init.actionId),
            method: flag ? $scope.userList.apis.addOne.method : $scope.userList.apis.updateOne.method,
            data: {
                username: $scope.userList.init.modalForm.username,
                email: $scope.userList.init.modalForm.email,
                mobile: $scope.userList.init.modalForm.mobile
                //passWord: flag ? hex_md5($scope.userList.modalForm.passWord) : null
            }
        },
        fnSuccess = function (data){
            it.removeClass('disabled');
            if(data){
               $('#J_addUser').modal('hide');
               $scope.userList.init.modalForm = {email:'',username:'',mobile:''};
               $scope.modalTitle = '';
               $scope.query(true);
            }
            $scope.apply();
        },
        fnFail = function(data){
            it.removeClass('disabled');
            $scope.errMsg = data.message;
            console.log(data.message);
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 发送请求删除
     * @param it: clicked object
     */
    $scope.deleteOneUser = function(it){
        var config = {
            url:  $scope.userList.apis.deleteOne.url.replace(/\#/,$scope.userList.init.actionId),
            method: $scope.userList.apis.deleteOne.method,
            data: {}
        },
        fnSuccess = function (data){
            it.removeClass('disabled');
            if(data){
                angular.element('#J_userConfirm').modal('hide');
                $scope.modalTitle = '';
                $scope.modalInfo = '';
                $scope.userList.init.actionId = 0;
                $scope.query(true);
            }
            $scope.apply();
        },
        fnFail = function(data){
            it.removeClass('disabled');
            console.log(data.message);
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 密码重置
     */
    $scope.resetPwd = function(it) {
        var config = {
                url: $scope.userList.apis.resetPwd.url.replace(/\#/, $scope.userList.init.actionId),
                method: $scope.userList.apis.resetPwd.method,
                data: {}
            },
            fnSuccess = function (data) {
                it.removeClass('disabled');
                if (data) {
                    angular.element('#J_userConfirm').modal('hide');
                    $scope.modalTitle = '';
                    $scope.modalInfo = '';
                    $scope.userList.init.actionId = 0;
                    $scope.query(true);
                }
                $scope.apply();
            },
            fnFail = function (data) {
                it.removeClass('disabled');
                console.log(data.message);
            };
        AjaxServer.ajaxInfo(config, fnSuccess, fnFail);
    };

    /**
     * 点击确定
     * @param event: event object
     */
    $scope.clickOk = function (event){
        var it = $(event.target),
            type = $scope.userList.init.actionType;
        if(it.hasClass('disabled')){
            return false;
        }
        switch(type){
            case 'delete':
                it.addClass('disabled');
                $scope.deleteOneUser(it);
                break;
            case 'resetPwd':
                it.addClass('disabled');
                $scope.resetPwd(it);
                break;
            default:
                if($scope.validateForm('all','user')){
                    it.addClass('disabled');
                    $scope.addOrUpdate(it);
                }
                break;
        }
    };

    /**
     * 点击新增
     */
    $scope.clickAdd = function(){
         $scope.modalTitle = '新增用户';
         $scope.userList.init.actionType = 'add';
         $scope.userList.init.modalForm = {email:'',username:'',mobile:''};
         $scope.userList.init.selected = [];
         $scope.selfValid();
         angular.element('#J_addUser').modal();
    };

    /**
     * 点击修改
     * @param index
     */
    $scope.clickEdit = function(index){
         $scope.modalTitle = '修改用户';
         $scope.userList.init.actionType = 'update';
         $scope.userList.init.actionId = $scope.userList.init.tdObj[index].id;
         $scope.userList.init.modalForm = angular.extend({},$scope.userList.init.tdObj[index]);
         $scope.selfValid();
         angular.element('#J_addUser').modal();
    };

    /**
     * 点击删除
     * @param index
     */
    $scope.clickDelete = function(index){
        $scope.modalTitle = '删除用户';
        $scope.modalInfo = '删除后不可恢复，确定删除这个用户吗？';
        $scope.userList.init.actionType = 'delete';
        $scope.userList.init.actionId = $scope.userList.init.tdObj[index].id;
        angular.element('#J_userConfirm').modal();
    };

    /**
     * 点击重置密码
     * @param index
     */
    $scope.clickResetPwd = function(index){
        $scope.modalTitle = '重置密码';
        $scope.modalInfo = '重置密码将以邮件形式发送，确认重置该用户密码吗？';
        $scope.userList.init.actionType = 'resetPwd';
        $scope.userList.init.actionId = $scope.userList.init.tdObj[index].id;
        angular.element('#J_userConfirm').modal();
    };

    /**
     * 表单验证
     * @param type: 字段是哪个
     * @param whichForm: 用户添加(user)
     * @returns {boolean}
     */
    $scope.validateForm = function ( type , whichForm ){
        var validDirtyObj = angular.extend({},validFormatObj,{dirty:true}),
            validNotObj = angular.extend({},validDirtyObj,{valid:true,invalid:true});
        // 清除提示
        $scope.errorMsg = '';
        // 用户表单
        if(whichForm === 'user'){
            // 添加时验证用户名
            if($scope.userList.init.actionType === 'add'){
                // 账号
                if(type === 'email' || type === 'all'){
                    $scope.validate.user.email = angular.extend({},validDirtyObj);
                    if(!$scope.userList.init.modalForm.email){
                        $scope.validate.user.email = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                        $scope.apply();
                        return false;
                    }
                    else if(!Validate.validEmail($scope.userList.init.modalForm.email)){
                        $scope.validate.user.email = angular.extend({},validNotObj,{ error:{ required:false,format:true,same:false } });
                        $scope.apply();
                        return false;
                    }
                }
            }

            // 用户名
            if(type === 'username' || type === 'all'){
                $scope.validate.user.username = angular.extend({},validDirtyObj);
                if(!$scope.userList.init.modalForm.username){
                    $scope.validate.user.username = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                    $scope.apply();
                    return false;
                }
                else if(!Validate.validLength($scope.userList.init.modalForm.username,{maxLen:10})){
                    $scope.validate.user.username = angular.extend({},validNotObj,{ error:{required:false,format:true,same:false} });
                    $scope.apply();
                    return false;
                }
            }

            // 联系电话
            if(type === 'mobile' || type === 'all'){
                $scope.validate.user.mobile = angular.extend({},validDirtyObj);
                if($scope.userList.init.modalForm.mobile && !Validate.validTel($scope.userList.init.modalForm.mobile)){
                    $scope.validate.user.mobile = angular.extend({},validNotObj,{ error:{required:false,format:true,same:false} });
                    $scope.apply();
                    return false;
                }
                if(!$scope.userList.init.modalForm.mobile){
                    $scope.validate.user.mobile.valid = true;
                    $scope.validate.user.mobile.invalid = false;
                    $scope.validate.user.mobile.error.format = false;
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
            user:{
                email:{},
                username:{},
                mobile:{}
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
    }
}]);
