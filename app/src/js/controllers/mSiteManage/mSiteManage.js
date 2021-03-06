/**
 * @ngdoc function
 * @name myappApp.controller:mUserManageCtrl
 * @description
 * @author [James]
 * # mSiteManageCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
    .controller('mSiteManageCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', '$cookieStore', 'urlPrefix', 'AjaxServer','Validate',
        function ($scope, $rootScope, $http, $timeout, $interval, $filter, $cookieStore, urlPrefix, AjaxServer, Validate) {
        'use strict';

        $scope.pager = {};

        $scope.siteList = {
            init: {
                getListError: '',
                actionId: '',
                actionType: 'add',
                tdObj:[],
                loading: true,
                provinceList:[],
                cityList:[],
                districtList:[],
                modalForm:{
                    license:'',
                    site_name:'',
                    province_code:'',
                    city_code:'',
                    region: '',
                    address:''
                }
            },
            query:{
                'site_name':'',
            },
            apis: {
                getList: {
                    url: urlPrefix + '/partner/sites',
                    method: 'get',
                    data: {
                        page: 1,
                        per_page: '',
                        site_name: ''
                    }
                },
                license: {
                    url: urlPrefix + '/partner/site/license',
                    method: 'post',
                    data:{}
                },
                addOne:{
                    url: urlPrefix + '/partner/site',
                    method: 'post',
                    data: {
                        license:'',
                        site_name:'',
                        province_code:'',
                        city_code:'',
                        address: ''
                    }
                },
                updateOne:{
                    url: urlPrefix + '/partner/site/#',
                    method: 'put',
                    data: {
                        site_name:'',
                        province_code:'',
                        city_code:'',
                        address: ''
                    }
                },
                deleteOne:{
                    url: urlPrefix + '/partner/site/#',
                    method: 'delete',
                    data: {
                    }
                },
                resetKey:{
                    url: urlPrefix + '/partner/site/#',
                    method: 'patch',
                    data: {
                    }
                },
                getProvince:{
                    url: urlPrefix + '/common/provinces',
                    method: 'get',
                    data: {
                    }
                },
                getCity:{
                    url: urlPrefix + '/common/citys',
                    method: 'get',
                    data: {
                        province:''
                    }
                },
                getDistrict:{
                    url: urlPrefix + '/common/districts',
                    method: 'get',
                    data: {
                        city:''
                    }
                }
            }
        };

        /**
         * 初始化
         */
        $scope.init = function () {
            $scope.getList();
            $scope.infoDetail = '';
            $scope.pager.curPage = 1;
            $scope.bindevent();
        };

        //点击回车查询
        $scope.queryAsKeyup = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                $scope.query(true);
            }
        };

        /**
         * 清空file文本框
         * @param fileId
         */
        $scope.cleanFile = function(fileId){
            var file = $("#" + fileId);
            file.after(file.clone().val(""));
            $("#" + fileId + '_name').val("");
            file.remove();
        };

        /**
         * 事件绑定
         */
        $scope.bindevent = function(){
            $('body').on('change','input[id=J_importFile]',function(){
                $('#J_importFile_name').val($(this).val());
            });
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
        * 清空
        */
        $scope.queryClean = function( flag ){
            if( flag ){
                $scope.pager.curPage = 1;
            }
            $scope.formatState();
            $scope.cleanParameter();
            $scope.getList();
        };

        /**
        * 清空查询条件
        */
        $scope.cleanParameter = function(){
            $scope.siteList.query.site_name = '';
        };


        /**
         * 状态初始化
         */
        $scope.formatState = function () {
            $scope.siteList.init.getListError = '';
            $scope.siteList.init.loading = true;
            $scope.infoDetail = '';
        };

        /**
         * 获取列表数据
         */
        $scope.getList = function(){
            var config = {
                    url:  $scope.siteList.apis.getList.url,
                    method: $scope.siteList.apis.getList.method,
                    data: {
                        page: $scope.pager.curPage || 1,
                        per_page: parseInt($scope.pager.pageSize) || 20,
                        site_name: $scope.siteList.query.site_name || null
                    }
                },
                fnSuccess = function (d){
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                    $scope.siteList.init.loading = false;
                    $scope.siteList.init.tdObj = data.data.items;
                    $scope.pager.total = data.data.total;
                    $scope.pager.totalPage = Math.ceil( data.data.total / parseInt($scope.pager.pageSize) );
                    $scope.apply();
                    $scope.getProvinceList();//获取省份
                },
                fnFail = function(data){
                    $scope.siteList.init.getListError = data.message || '网络问题，请刷新页面重试';
                    $scope.siteList.init.loading = false;
                    $scope.siteList.init.tdObj = [];
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
            var flag = $scope.siteList.init.actionType === 'add';
            var config = {
                    url:  flag ? $scope.siteList.apis.addOne.url : $scope.siteList.apis.updateOne.url.replace(/\#/,$scope.siteList.init.actionId),
                    method: flag ? $scope.siteList.apis.addOne.method : $scope.siteList.apis.updateOne.method,
                    data: {
                        license: $scope.siteList.init.modalForm.license || '',
                        site_name: $scope.siteList.init.modalForm.site_name,
                        //province_code: $scope.siteList.init.modalForm.province_code,
                        //city_code: $scope.siteList.init.modalForm.city_code,
                        region: $scope.siteList.init.modalForm.district_code,
                        address: $scope.siteList.init.modalForm.address
                    }
                },
                fnSuccess = function (data){
                    it.removeClass('disabled');
                    if(data){
                        $('#J_addcSite').modal('hide');
                        $scope.siteList.init.modalForm = {site_name:'',district_code:'',address:'',license:''};
                        $scope.modalTitle = '';
                        $scope.query(true);
                        //清空上传的file
                        $scope.cleanFile('J_importFile');
                    }
                    $scope.apply();
                },
                fnFail = function(data){
                    it.removeClass('disabled');
                    $scope.errMsg = data.message;
                    console.log(data.message);
                };
            if(!flag){
                //delete config.data["license"];
            }
            AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
        };


        /**
         * 发送请求删除
         * @param it: clicked object
         */
        $scope.deleteOneSite = function(it){
            $scope.errMsg = '';
            var config = {
                    url:  $scope.siteList.apis.deleteOne.url.replace(/\#/,$scope.siteList.init.actionId),
                    method: $scope.siteList.apis.deleteOne.method,
                    data: {}
                },
                fnSuccess = function (data){
                    it.removeClass('disabled');
                    if(data){
                        angular.element('#J_siteConfirm').modal('hide');
                        $scope.modalTitle = '';
                        $scope.modalInfo = '';
                        $scope.siteList.init.actionId = 0;
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
         * 重置AccessKey
         */
        $scope.resetKey = function(it) {
            $scope.errMsg = '';
            var config = {
                    url: $scope.siteList.apis.resetKey.url.replace(/\#/, $scope.siteList.init.actionId),
                    method: $scope.siteList.apis.resetKey.method,
                    data: {}
                },
                fnSuccess = function (data) {
                    it.removeClass('disabled');
                    if (data) {
                        angular.element('#J_keyConfirm').modal('hide');
                        $scope.modalTitle = '';
                        $scope.modalInfo = '';
                        $scope.siteList.init.actionId = 0;
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
         * 获取省份列表
         */
        $scope.getProvinceList = function(){
            $scope.siteList.init.provinceList = [];
            var config = $scope.siteList.apis.getProvince,
                fnSuccess = function (data){
                    if(data){
                       $scope.siteList.init.provinceList = data.data;
                    }
                    $scope.apply();
                },
                fnFail = function(data){
                    console.log(data.message);
                };
            AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
        };

        /**
         * 获取城市列表
         */
        $scope.getCityList = function(index){
            $scope.siteList.init.cityList = [];
            var config = {
                    url:  $scope.siteList.apis.getCity.url,
                    method: $scope.siteList.apis.getCity.method,
                    data: {province: ''}
                },
                fnSuccess = function (data){
                    if(data){
                        $scope.siteList.init.cityList = data.data;
                    }
                    $scope.apply();
                },
                fnFail = function(data){
                    console.log(data.message);
                };
            if(index !== undefined && index >= 0){
                config.data.province = $scope.siteList.init.tdObj[index].province_code;
            }else {
                config.data.province = $scope.siteList.init.modalForm.province_code;
            }
            AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
        };

        /**
         * 获区县列表
         */
        $scope.getDistrictList = function(index){
            $scope.siteList.init.districtList = [];
            var config = {
                    url:  $scope.siteList.apis.getDistrict.url,
                    method: $scope.siteList.apis.getDistrict.method,
                    data: {city: ''}
                },
                fnSuccess = function (data){
                    if(data){
                        $scope.siteList.init.districtList = data.data;
                        $scope.apply();
                        /*编辑操作时，获取城市列表成功后弹出表单*/
                        if(index !== undefined && index >= 0) {
                            $scope.siteList.init.actionType = 'update';
                            $scope.siteList.init.actionId = $scope.siteList.init.tdObj[index].sn;
                            $scope.siteList.init.modalForm = angular.extend({},$scope.siteList.init.tdObj[index]);
                            $scope.apply();
                            $scope.selfValid();
                            angular.element('#J_addcSite').modal();
                            angular.element('#J_addcSite').draggable({
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
                config.data.city = $scope.siteList.init.tdObj[index].city_code;
            }else{
                config.data.city =  $scope.siteList.init.modalForm.city_code;
            }
            AjaxServer.ajaxInfo( config, fnSuccess, fnFail);
        };

        /**
         * 点击确定
         * @param event: event object
         */
        $scope.clickOk = function (event){
            var it = $(event.target),
                type = $scope.siteList.init.actionType;
            if(it.hasClass('disabled')){
                return false;
            }
            switch(type){
                case 'delete':
                    it.addClass('disabled');
                    $scope.deleteOneSite(it);
                    break;
                case 'resetKey':
                    it.addClass('disabled');
                    $scope.resetKey(it);
                    break;
                case 'update':
                    if($scope.validateForm('all','site')){
                        it.addClass('disabled');
                        if($("#J_importFile").val()){//如果选择了新授权文件，则先上传再提交表单
                            $scope.importLicenseAndCommitForm(event);
                        }else{
                            $scope.addOrUpdate(it);
                        }
                    }
                    break;
                case 'add':
                    if($scope.validateForm('all','site')){
                        it.addClass('disabled');
                        $scope.importLicenseAndCommitForm(event);
                    }
                    break;
            }
        };

        /**
         * 点击新增
         */
        $scope.clickAdd = function(){
            $scope.modalTitle = '新增站点';
            $scope.siteList.init.actionType = 'add';
            $scope.siteList.init.modalForm['site_name'] = '';
            $scope.siteList.init.modalForm['province_code'] = '';
            $scope.siteList.init.modalForm['city_code'] = '';
            $scope.siteList.init.modalForm['address'] = '';
            $scope.siteList.init.modalForm['license'] = '';
            $scope.cleanFile('J_importFile');
            $scope.selfValid();
            angular.element('#J_addcSite').modal();
            angular.element('#J_addcSite').draggable({
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
            $scope.modalTitle = '修改站点';
            $scope.getCityList(index);//获取城市
            $scope.getDistrictList(index);
        };

        /**
         * 点击删除
         * @param index
         */
        $scope.clickDelete = function(index){
            $scope.modalTitle = '删除站点';
            $scope.modalInfo = '删除后不可恢复，确定删除这个站点吗？';
            $scope.siteList.init.actionType = 'delete';
            $scope.siteList.init.actionId = $scope.siteList.init.tdObj[index].sn;
            angular.element('#J_siteConfirm').modal();
            angular.element('#J_siteConfirm').draggable({
                handle: ".modal-header",
                cursor: 'move',
                refreshPositions: false
            });
        };

        /**
         * 点击重置access_key
         * @param index
         */
        $scope.clickResetKey = function(index){
            $scope.modalTitle = '重置密钥';
            $scope.modalInfo = '确定重置该站点密钥吗？';
            $scope.siteList.init.actionType = 'resetKey';
            $scope.siteList.init.actionId = $scope.siteList.init.tdObj[index].sn;
            angular.element('#J_keyConfirm').modal();
            angular.element('#J_keyConfirm').draggable({
                handle: ".modal-header",
                cursor: 'move',
                refreshPositions: false
            });
        };

        /**
         *显示key详细信息
         */
        $scope.showKeyDetail = function(value){
            $scope.mTitle = '密钥';
            angular.element("#J_keyInfoDetail").modal('show');
            angular.element('#J_keyInfoDetail').draggable({
                handle: ".modal-header",
                cursor: 'move',
                refreshPositions: false
            });
            $scope.infoDetail = value;
        };

        /**
         * 表单验证
         * @param type: 字段是哪个
         * @param whichForm: 站点添加(site)
         * @returns {boolean}
         */
        $scope.validateForm = function ( type , whichForm ){
            var validDirtyObj = angular.extend({},validFormatObj,{dirty:true}),
                validNotObj = angular.extend({},validDirtyObj,{valid:false,invalid:true});
            // 清除提示
            $scope.errorMsg = '';
            // 用户表单
            if(whichForm === 'site'){
                // 站点名
                if(type === 'site_name' || type === 'all'){
                    $scope.validate.site.site_name = angular.extend({},validDirtyObj);
                    if(!$scope.siteList.init.modalForm.site_name){
                        $scope.validate.site.site_name = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                        $scope.apply();
                        return false;
                    }
                    else if(!Validate.validLength($scope.siteList.init.modalForm.site_name,{maxLen:64})){
                        $scope.validate.site.site_name = angular.extend({},validNotObj,{ error:{required:false,format:true,same:false} });
                        $scope.apply();
                        return false;
                    }
                }

                if(type === 'license' || (type === 'all' && $scope.siteList.init.actionType == 'add')){
                    if (!$("#J_importFile").val() && $scope.validate.site.license.valid && !$scope.validate.site.license.dirty) {
                        $scope.validate.site.license.dirty = true;
                        $scope.validate.site.license.valid = false;
                        $scope.validate.site.license.invalid = true;
                        $scope.errorMsg = '请选择License文件';
                        return false;
                    }
                }

                // 省
                if(type === 'province' || type === 'all'){
                    $scope.validate.site.province_code = angular.extend({},validDirtyObj);
                    if(!$scope.siteList.init.modalForm.province_code){
                        $scope.validate.site.province_code = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                        $scope.apply();
                        return false;
                    }
                }

                // 市
                if(type === 'city' || type === 'all'){
                    $scope.validate.site.city_code = angular.extend({},validDirtyObj);
                    if(!$scope.siteList.init.modalForm.city_code){
                        $scope.validate.site.city_code = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                        $scope.apply();
                        return false;
                    }
                }

                // 区县
                if(type === 'district' || type === 'all'){
                    $scope.validate.site.district_code = angular.extend({},validDirtyObj);
                    if(!$scope.siteList.init.modalForm.district_code){
                        $scope.validate.site.district_code = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                        $scope.apply();
                        return false;
                    }
                }

                // 详细地址
                if(type === 'address' || type === 'all'){
                    $scope.validate.site.address = angular.extend({},validDirtyObj);
                    if(!$scope.siteList.init.modalForm.address){
                        $scope.validate.site.address = angular.extend({},validNotObj,{ error:{required:true,format:false,same:false} });
                        $scope.apply();
                        return false;
                    }
                    else if(!Validate.validLength($scope.siteList.init.modalForm.address,{maxLen:128})){
                        $scope.validate.site.address = angular.extend({},validNotObj,{ error:{required:false,format:true,same:false} });
                        $scope.apply();
                        return false;
                    }
                }
            }
            $scope.apply();
            return true;
        };

        /**
         * 响应导入License操作
         */
        $scope.importLicenseAndCommitForm = function(ev){
            var it = $(ev.target);
            if(!$("#J_importFile").val()){
                $scope.validate.site.license.dirty = true;
                $scope.validate.site.license.invalid = true;
                $scope.validate.site.license.valid = false;
                $scope.errorMsg = '请选择授权文件';
                return;
            }
            $.ajaxFileUpload({
                    url:$scope.siteList.apis.license.url,
                    secureuri:false,
                    fileElementId:["J_importFile"],
                    //data: {'Authorization' : 'Onekeeper '+ $cookieStore.get('token')},
                    dataType: "json",
                    success: function (data, status){
                        it.removeClass('disabled');
                        if(data['errors']){
                            $scope.validate.site.license.dirty = true;
                            $scope.validate.site.license.invalid = true;
                            $scope.validate.site.license.valid = false;
                            $scope.errorMsg = '导入失败,请核对';
                            $scope.apply();
                            return;
                        }
                        $scope.errorMsg = '';
                        $scope.siteList.init.modalForm.license = data.data.license;
                        $scope.validate.site.license.dirty = true;
                        $scope.validate.site.license.valid = true;
                        $scope.validate.site.license.invalid = false;
                        $scope.apply();

                        //上传成功以后才保存表单
                        $scope.addOrUpdate(it);
                    },
                    error: function(data){
                        it.removeClass('disabled');
                        $scope.validate.site.license.dirty = true;
                        $scope.validate.site.license.invalid = true;
                        $scope.validate.site.license.valid = false;
                        $scope.errorMsg = '导入失败,请核对';
                        $scope.apply();
                    }
            });
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
                site:{
                    site_name:{},
                    license:{},
                    province_code:{},
                    city_code:{},
                    district_code:{},
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
