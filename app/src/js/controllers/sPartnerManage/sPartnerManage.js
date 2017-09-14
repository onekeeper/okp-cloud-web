/**
 * @ngdoc function
 * @name myappApp.controller:sPartnerManageCtrl
 * @description
 * @author [James]
 * # sPartnerManageCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
.controller('sPartnerManageCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate',
    function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate) {
    'use strict';

    $scope.pager = {};

    $scope.partnerList = {
        init: {
            token: '',
            getListError: '',
            actionId: '',
            actionType: 'add',
            tdObj:[],
            loading: true,
            provinceList:[],
            cityList:[],
            modalForm:{
                // login_username:'',
                // partner_name:'',
                // province_code:'',
                // city_code:'',
                // address:''
            }
        },
        query:{
            'partner_name':'',
        },
        apis:{
            getPartnerList: {
                url: urlPrefix + '/superviser/partner',
                method: 'get',
                data: {
                    page: 1,
                    per_page: '',
                    partner_name:''
                }
            },
            addOne:{
               url: urlPrefix + '/superviser/partner',
               method: 'post',
               data: {
                   login_username:'',
                   partner_name:'',
                   province_code:'',
                   city_code:'',
                   address:''
               }
            },
            updateOne:{
               url: urlPrefix + '/superviser/partner/#',
               method: 'put',
               data: {
                   province_code:'',
                   city_code:'',
                   address:''
               }
            },
            deleteOne:{
               url: urlPrefix + '/superviser/partner/#',
               method: 'delete',
               data: {
               }
            },
            resetPwd:{
                url: urlPrefix + '/superviser/partner/#',
                method: 'patch',
                data: {
                }
            },
            getProvince:{
                url: urlPrefix + '/partner/dropdown/provinces',
                method: 'get',
                data: {
                }
            },
            getCity:{
                url: urlPrefix + '/partner/dropdown/citys',
                method: 'get',
                data: {
                    province:''
                }
            }
        }
    };

    /**
     * 初始化
     */
    $scope.init = function () {
        //$scope.bindEvent();
        $scope.getPartnerList();
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
        $scope.getPartnerList();
    };

    /**
     * 状态初始化
     */
    $scope.formatState = function () {
        $scope.partnerList.init.getListError = '';
        $scope.partnerList.init.loading = true;
    };

    /**
     * 获取列表数据
     */
    $scope.getPartnerList = function(){
        var config = {
            url:  $scope.partnerList.apis.getPartnerList.url,
            method: $scope.partnerList.apis.getPartnerList.method,
            data: {
                page: $scope.pager.curPage || 1,
                per_page: parseInt($scope.pager.pageSize) || 20,
                partner_name: $scope.partnerList.query.partner_name || null
            }
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.partnerList.init.loading = false;
            $scope.partnerList.init.tdObj = data.data.items;
            $scope.pager.total = data.data.total;
            $scope.pager.totalPage = Math.ceil( data.data.total / parseInt($scope.pager.pageSize) );
            $scope.apply();
            $scope.getProvinceList();//获取省份
        },
        fnFail = function(data){
            $scope.partnerList.init.getListError = data.message || '网络问题，请刷新页面重试';
            $scope.partnerList.init.loading = false;
            $scope.partnerList.init.tdObj = [];
            $scope.apply();
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 获取省份列表
     */
    $scope.getProvinceList = function(){
        $scope.partnerList.init.provinceList = [];
        var config = $scope.partnerList.apis.getProvince,
            fnSuccess = function (data){
                if(data){
                    $scope.partnerList.init.provinceList = data.data;
                }
                $scope.apply();
            },
            fnFail = function(data){
                console.log(data.message);
            };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 获取市列表
     */
    $scope.getCityList = function(index){
        $scope.partnerList.init.cityList = [];
        var config = {
                url:  $scope.partnerList.apis.getCity.url,
                method: $scope.partnerList.apis.getCity.method,
                data: {province: ''}
            },
            fnSuccess = function (data){
                if(data){
                    $scope.partnerList.init.cityList = data.data;
                    $scope.apply();
                    /*编辑操作时，获取城市列表成功后弹出表单*/
                    if(index !== undefined && index >= 0) {
                        $scope.partnerList.init.actionType = 'update';
                        $scope.partnerList.init.actionId = $scope.partnerList.init.tdObj[index].id;
                        $scope.partnerList.init.modalForm = angular.copy($scope.partnerList.init.tdObj[index]);
                        $scope.apply();
                        $scope.selfValid();
                        angular.element('#J_addPartner').modal();
                        angular.element('#J_addPartner').draggable({
                            handle: ".modal-header",
                            cursor: 'move',
                            refreshPositions: false
                        });
                    }
                }
            },
            fnFail = function(data){
                console.log(data.message);
            };
        if(index !== undefined && index >= 0){
            config.data.province = $scope.partnerList.init.tdObj[index].province_code;
        }else{
            config.data.province = $scope.partnerList.init.modalForm.province_code;
        }
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 发送新增或修改请求
     * @param it: clicked object
     */
    $scope.addOrUpdate = function(it){
        $scope.errMsg = '';
        var flag = $scope.partnerList.init.actionType === 'add';
        var config = {
            url:  flag ? $scope.partnerList.apis.addOne.url : $scope.partnerList.apis.updateOne.url.replace(/\#/,$scope.partnerList.init.actionId),
            method: flag ? $scope.partnerList.apis.addOne.method : $scope.partnerList.apis.updateOne.method,
            data: {
                login_username:$scope.partnerList.init.modalForm.login_username,
                partner_name:$scope.partnerList.init.modalForm.partner_name,
                province_code:$scope.partnerList.init.modalForm.province_code,
                city_code:$scope.partnerList.init.modalForm.city_code,
                address:$scope.partnerList.init.modalForm.address
            }
        },
        fnSuccess = function (data){
            it.removeClass('disabled');
            if(data){
               $('#J_addPartner').modal('hide');
               $scope.partnerList.init.modalForm = {login_username:'',partner_name:'',province_code:'',city_code:'',address:''};
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
        if(!flag){
            delete config.data['login_username'];
            delete config.data['partner_name'];
        }
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 发送请求删除
     * @param it: clicked object
     */
    $scope.deleteOneUser = function(it){
        $scope.errMsg = '';
        var config = {
            url:  $scope.partnerList.apis.deleteOne.url.replace(/\#/,$scope.partnerList.init.actionId),
            method: $scope.partnerList.apis.deleteOne.method,
            data: {}
        },
        fnSuccess = function (data){
            it.removeClass('disabled');
            if(data){
                angular.element('#J_partnerConfirm').modal('hide');
                $scope.modalTitle = '';
                $scope.modalInfo = '';
                $scope.partnerList.init.actionId = 0;
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
     * 密码重置
     */
    $scope.resetPwd = function(it) {
        $scope.errMsg = '';
        var config = {
                url: $scope.partnerList.apis.resetPwd.url.replace(/\#/, $scope.partnerList.init.actionId),
                method: $scope.partnerList.apis.resetPwd.method,
                data: {}
            },
            fnSuccess = function (data) {
                it.removeClass('disabled');
                if (data) {
                    angular.element('#J_partnerConfirm').modal('hide');
                    $scope.modalTitle = '';
                    $scope.modalInfo = '';
                    $scope.partnerList.init.actionId = 0;
                    $scope.query(true);
                }
                $scope.apply();
            },
            fnFail = function (data) {
                it.removeClass('disabled');
                $scope.errMsg = data.message;
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
            type = $scope.partnerList.init.actionType;
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
         $scope.modalTitle = '新增合作伙伴';
         $scope.partnerList.init.actionType = 'add';
         $scope.partnerList.init.modalForm = {login_username:'',partner_name:'',province_code:'',city_code:'',address:''};
         $scope.apply();
         $scope.selfValid();
         angular.element('#J_addPartner').modal();
         angular.element('#J_addPartner').draggable({
            handle: ".modal-header",
            cursor: 'move',
            refreshPositions: false
        });
    };

    /**
     * 点击修改
     * @param index
     */
    $scope.clickEdit = function(index){
         $scope.modalTitle = '修改合作伙伴';
         $scope.getCityList(index);
    };

    /**
     * 点击删除
     * @param index
     */
    $scope.clickDelete = function(index){
        $scope.modalTitle = '删除合作伙伴';
        $scope.modalInfo = '删除后不可恢复，确定删除这个合作伙伴吗？';
        $scope.partnerList.init.actionType = 'delete';
        $scope.partnerList.init.actionId = $scope.partnerList.init.tdObj[index].id;
        angular.element('#J_partnerConfirm').modal();
        angular.element('#J_partnerConfirm').draggable({
            handle: ".modal-header",
            cursor: 'move',
            refreshPositions: false
        });
    };

    /**
     * 点击重置密码
     * @param index
     */
    $scope.clickResetPwd = function(index){
        $scope.modalTitle = '重置密码';
        $scope.modalInfo = '确定重置该合作伙伴密码吗？';
        $scope.partnerList.init.actionType = 'resetPwd';
        $scope.partnerList.init.actionId = $scope.partnerList.init.tdObj[index].id;
        angular.element('#J_partnerConfirm').modal();
        angular.element('#J_partnerConfirm').draggable({
            handle: ".modal-header",
            cursor: 'move',
            refreshPositions: false
        });
    };

    /**
     * 表单验证
     * @param type: 字段是哪个
     * @param whichForm: 用户添加(user)
     * @returns {boolean}
     */
    $scope.validateForm = function ( type , whichForm ){
        var validDirtyObj = angular.extend({},validFormatObj,{dirty:true}),
            validNotObj = angular.extend({},validDirtyObj,{valid:false,invalid:true});
        // 清除提示
        $scope.errorMsg = '';

        // 用户表单
        if(whichForm === 'user'){
            // 添加时验证用户名
            if($scope.partnerList.init.actionType === 'add'){
                // 用户名
                if(type === 'login_username' || type === 'all'){
                    $scope.validate.user.login_username = angular.extend({},validDirtyObj);
                    if(!$scope.partnerList.init.modalForm.login_username){
                        $scope.validate.user.login_username = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                        $scope.apply();
                        return false;
                    }
                    else if(!Validate.validLength($scope.partnerList.init.modalForm.login_username,{maxLen:32})){
                        $scope.validate.user.login_username = angular.extend({},validNotObj,{ error:{required:false,format:true,same:false} });
                        $scope.apply();
                        return false;
                    }
                }

                // 公司名
                if(type === 'partner_name' || type === 'all'){
                    $scope.validate.user.partner_name = angular.extend({},validDirtyObj);
                    if(!$scope.partnerList.init.modalForm.partner_name){
                        $scope.validate.user.partner_name = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                        $scope.apply();
                        return false;
                    }
                    else if(!Validate.validLength($scope.partnerList.init.modalForm.partner_name,{maxLen:50})){
                        $scope.validate.user.partner_name = angular.extend({},validNotObj,{ error:{required:false,format:true,same:false} });
                        $scope.apply();
                        return false;
                    }
                }
            }

            // 省份
            if(type === 'province_code' || type === 'all'){
                $scope.validate.user.province_code = angular.extend({},validDirtyObj);
                if(!$scope.partnerList.init.modalForm.province_code){
                    $scope.validate.user.province_code = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                    $scope.apply();
                    return false;
                }
            }

            // 城市
            if(type === 'city_code' || type === 'all'){
                $scope.validate.user.city_code = angular.extend({},validDirtyObj);
                if(!$scope.partnerList.init.modalForm.city_code){
                    $scope.validate.user.city_code = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                    $scope.apply();
                    return false;
                }
            }

            // 详细地址
            if(type === 'address' || type === 'all'){
                $scope.validate.user.address = angular.extend({},validDirtyObj);
                if(!$scope.partnerList.init.modalForm.address){
                    $scope.validate.user.address = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                    $scope.apply();
                    return false;
                }
                else if(!Validate.validLength($scope.partnerList.init.modalForm.address,{maxLen:50})){
                    $scope.validate.user.address = angular.extend({},validNotObj,{ error:{required:false,format:true,same:false} });
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
        $scope.errMsg = '';
        $scope.validate = {
            user:{
                login_username:{},
                partner_name:{},
                province_code:{},
                city_code:{},
                address:{}
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
