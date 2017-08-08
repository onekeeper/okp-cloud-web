'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:mAuthorizeManageCtrl
 * @description
 * @author [Guor]
 * # mAuthorizeManageCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
.controller('mAuthorizeManageCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate',function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate) {
    urlPrefix = urlPrefix + "/partner";//管理员
    $scope.initData = {
        getListError: '',
        loading: true,
        actionType: 'add',
        actionId: 0,
        total:0,
        modalForm:{
            id:'',
            siteId: '',
            partnerId: '',
            moduleId: '',
            grantorId:'',
            granteeId:'',
            module: []
        },
        siteOptions:[{'site_id' : '1' , 'site_name' : '站点1'},{'site_id' : '2' , 'site_name' : '站点2'}],
        partnerOptions:[{'partner_id' : '1' , 'partner_name' : '美创'},{'partner_id' : '2' , 'partner_name' : '网易'}],
        delegationOptions:[{'module_id' : '1' , 'module_name' : '数据库'},{'module_id' : '2' , 'module_name' : '中间件'}],
        query:{siteName:'',grantorName:''}
    };
    $scope.pager = {};
    $scope.apis = {
            getSiteOptions: {
                url: urlPrefix + '/dropdown/sites',
                method: 'get',
                data: {}
            },
            getPartnerOptions: {
                url: urlPrefix + '/dropdown/partners',
                method: 'get',
                data: {}
            },
            getDelegationOptions: {
                url: urlPrefix + '/dropdown/modules',
                method: 'get',
                data: {}
            },
            getmDelegationList: {
                url: urlPrefix + '/delegations',
                method: 'get',
                data: {
                    page: 1,
                    per_page: '',
                    partner_name:'',
                    site_name:''
                }
            },
            addOne:{
               url: urlPrefix + '/delegation',
               method: 'post',
               data: {
                    site_id: '',
                    grantee_id: '',
                    delegation_module: ''
               }
            },
            editOne:{
               url: urlPrefix + '/delegation',
               method: 'put',
               data: {
               }
            },
            deleteOne:{
               url: urlPrefix + '/delegation',
               method: 'delete',
               data: {}
            }
        };
    $scope.mDelegationList = [];

    /**
     * 初始化
     */
    $scope.init = function () {
        $rootScope.pagePath = '';
         //得到下拉列表框内容
        $scope.getSiteOptions();
        $scope.getPartnerOptions();
        $scope.getDelegationOptions();

        //得到列表
        $scope.getmDelegationList();//通知规则

        //绑定事件
        // $scope.bindEvent();
    };

    //点击回车查询
    $scope.queryAsKeyup = function(e){
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
            $scope.query(true);
        }
    };
        
    /**
     * 页面查询操作
     * @param flag: if curPage == 1
     */
    $scope.query = function ( flag ) {
        console.log(flag);
        if( flag ) $scope.pager.curPage = 1;
        $scope.formatState();
        $scope.queryData();
    };
    /**
     * 查询
     */
    $scope.queryData = function(){
        $scope.getmDelegationList();
    };

    $scope.formatState = function () {
        $scope.initData.getListError = '';
        $scope.initData.loading = true;
        $scope.mDelegationList = [];
    };

    /**
     * 获取站点列表选项
     */
    $scope.getSiteOptions = function(){
        var config = {
            url:  $scope.apis.getSiteOptions.url,
            method: $scope.apis.getSiteOptions.method,
            data: {}
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            if(data && data.data.length > 0){
                $scope.initData.siteOptions = data.data;
            }
            $scope.apply();
        },
        fnFail = function(data){
            console.log(data.message || '获取列表失败');
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 获取合作伙伴列表选项
     */
    $scope.getPartnerOptions = function(){
        var config = {
            url:  $scope.apis.getPartnerOptions.url,
            method: $scope.apis.getPartnerOptions.method,
            data: {}
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            if(data && data.data.length > 0){
                $scope.initData.partnerOptions = data.data;
            }
            $scope.apply();
        },
        fnFail = function(data){
            console.log(data.message || '获取列表失败');
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 获取授权类型列表选项
     */
    $scope.getDelegationOptions = function(){
        var config = {
            url:  $scope.apis.getDelegationOptions.url,
            method: $scope.apis.getDelegationOptions.method,
            data: {}
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            if(data && data.data.length > 0){
                $scope.initData.delegationOptions = data.data;
            }
            $scope.apply();
        },
        fnFail = function(data){
            console.log(data.message || '获取列表失败');
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 获取授权管理列表
     */
    $scope.getmDelegationList = function(){
        var config = {
            url:  $scope.apis.getmDelegationList.url,
            method: $scope.apis.getmDelegationList.method,
            data: {
                page: $scope.pager.curPage || 1,
                per_page: parseInt($scope.pager.pageSize) || 20,
                site_name: $scope.query.siteName || null,
                partner_name: $scope.query.grantorName || null,
            }
        },
        fnSuccess = function (d){
            var data = typeof(d)==='string' ? JSON.parse(d) : d;
            $scope.initData.loading = false;
            if(data && data.data.items.length > 0){
                $scope.mDelegationList = data.data.items;
                $scope.initData.total = data.data.total;
                $scope.getPager();
            }
            else $scope.mDelegationList = [];
            $scope.apply();
        },
        fnFail = function(data){
            $scope.initData.getListError = data.message || '网络问题，请刷新页面重试';
            $scope.initData.loading = false;
            $scope.mDelegationList = [];
            $scope.apply();
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 获取数据条数
     */
    $scope.getPager = function(){
        if($scope.initData.total > 0){
            $scope.pager.total = $scope.initData.total;
            $scope.pager.totalPage = Math.ceil( $scope.initData.total / parseInt($scope.pager.per_page) );
        }
    };

    /**
     * 添加授权
     * @param it: clicked object
     */
    $scope.addOne = function(it){
        var flag = $scope.initData.actionType === 'add',
            config = {
            url: $scope.apis.addOne.url,
            method: $scope.apis.addOne.method,
            data: {
                site_id: String($scope.initData.modalForm.siteId),
                grantee_id: String($scope.initData.modalForm.partnerId),
                delegation_module: String($scope.initData.modalForm.moduleId)
            }
        },
        fnSuccess = function (data){
            it.removeClass('disabled');
            if(data.code == 1){
               $('#J_addmDelegation').modal('hide');
               $scope.query(true);
            }
            $scope.apply();
        },
        fnFail = function(data){
            it.removeClass('disabled');
            console.log(data.message);
            $scope.errMsg = data.message;
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 接受授权
     * @param it: clicked object
     */
    $scope.editOne = function(it){
        var flag = $scope.initData.actionType === 'update',
            config = {
            url: $scope.apis.editOne.url + "/" + $scope.initData.modalForm.id,
            method: $scope.apis.editOne.method,
            data: {}
        },
        fnSuccess = function (data){
            it.removeClass('disabled');
            if(data.code == 1){
               $('#J_mDelegationConfirm').modal('hide');
               $scope.query(true);
            }
            $scope.apply();
        },
        fnFail = function(data){
            it.removeClass('disabled');
            console.log(data.message);
            $scope.errMsg = data.message;
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    /**
     * 收回授权
     * @param it: clicked object
     */
    $scope.deleteOne = function(it){
        var config = {
            url:  $scope.apis.deleteOne.url + "/" + $scope.initData.modalForm.id,
            method: $scope.apis.deleteOne.method,
            data: {}
        },
        fnSuccess = function (data){
            it.removeClass('disabled');
            if(data.code == 1){
                angular.element('#J_mDelegationConfirm').modal('hide');
                $scope.query(true);
            }
            $scope.apply();
        },
        fnFail = function(data){
            it.removeClass('disabled');
            console.log(data.message);
            $scope.errMsg = data.message;
        };
        AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };

    /**
     * 点击确定
     * @param event: event object
     */
    $scope.clickOk = function (event){
        var it = $(event.target),
            type = $scope.initData.actionType;
        if(it.hasClass('disabled')){
            return false;
        }
        switch(type){
            case 'delete':
                it.addClass('disabled');
                $scope.deleteOne(it);
                break;
            case 'update':
                it.addClass('disabled');
                $scope.editOne(it);
                break;
            default:
                if($scope.validateForm('all')){
                    it.addClass('disabled');
                    $scope.addOne(it);
                }
                break;
        }
    };
    /**
     * 点击新增
     */
    $scope.clickAdd = function(){
         $scope.modalTitle = '新增授权';
         $scope.initData.actionType = 'add';
         $scope.errMsg = '';
         $scope.initData.modalForm = {
            id:'',
            siteId: '',
            partnerId: '',
            moduleId: '',
            grantorId:'',
            granteeId:'',
            module: []
        };
        $scope.selfValid();
        angular.element('#J_addmDelegation').modal();
        angular.element('#J_addmDelegation').draggable({   
            handle: ".modal-header",   
            cursor: 'move',   
            refreshPositions: false  
        }); 
    };
    /**
     * 取消授权
     * @param index
     */
    $scope.clickDelete = function(index){
        $scope.modalTitle = '取消授权';
        $scope.modalInfo = '取消授权后不可恢复，确定执行此操作吗？';
        $scope.initData.actionType = 'delete';
        $scope.errMsg = '';
        $scope.initData.modalForm.id = $scope.mDelegationList[index].id;
        angular.element('#J_mDelegationConfirm').modal();
        angular.element('#J_mDelegationConfirm').draggable({   
            handle: ".modal-header",   
            cursor: 'move',   
            refreshPositions: false  
        });
    };
    /**
     * 接受授权
     * @param index
     */
    $scope.clickEdit = function(index){
        $scope.modalTitle = '接受授权';
        $scope.modalInfo = '接受授权后不可恢复，确定执行此操作吗？';
        $scope.initData.actionType = 'update';
        $scope.errMsg = '';
        $scope.initData.modalForm.id = $scope.mDelegationList[index].id;
        angular.element('#J_mDelegationConfirm').modal();
        angular.element('#J_mDelegationConfirm').draggable({   
            handle: ".modal-header",   
            cursor: 'move',   
            refreshPositions: false  
        });
    };
    /**
     * 表单验证
     * @returns {boolean}
     */
    $scope.validateForm = function (type){
        var validDirtyObj = angular.extend({},validFormatObj,{dirty:true}),
            validNotObj = angular.extend({},validDirtyObj,{valid:false,invalid:true});
        if(type === 'site' || type === 'all'){
            $scope.validate.siteName = angular.extend({},validDirtyObj);
            if(!$scope.initData.modalForm.siteId){
                $scope.validate.siteName = angular.extend({},validNotObj,{error:{required:true}});
                return;
            }
        }
        if(type === 'partner' || type === 'all'){
            $scope.validate.partner = angular.extend({},validDirtyObj);
            if(!$scope.initData.modalForm.partnerId){
                $scope.validate.partner = angular.extend({},validNotObj,{error:{required:true}});
                return;
            }
        }
        if(type === 'module' || type === 'all'){
            $scope.initData.modalForm.moduleId = 0;
            if(!!$scope.initData.modalForm.module){
                $.each($scope.initData.modalForm.module, function(k,v){
                    if(v){
                        $scope.initData.modalForm.moduleId += parseInt(k);
                    }
                });
            }
            $scope.validate.module = angular.extend({},validDirtyObj);
            if($scope.initData.modalForm.moduleId == 0){
                $scope.validate.module = angular.extend({},validNotObj,{error:{required:true}});
                return;
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
            site:{},
            partner:{},
            module:{}
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
