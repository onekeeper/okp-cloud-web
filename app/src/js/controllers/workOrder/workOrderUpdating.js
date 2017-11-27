/**
 * @ngdoc function
 * @name myappApp.controller:WorkOrderUpdatingCtrl
 * @description
 * WorkOrderUpdatingCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
    .controller('WorkOrderUpdatingCtrl', ['$scope', '$rootScope', '$window', '$location', '$state','urlPrefix','AjaxServer',
        function ($scope, $rootScope, $window, $location, $state, urlPrefix, AjaxServer) {
            'use strict';

            var modal = {
                tips: ''
            };
            $scope.pager = {};
            $scope.initData = {
                getListError: '',
                loading: true,
                curRecord: ''
            };
            $scope.cache = {
                listArr: [],
                siteObj: {},
                statusList: []
            };
            $scope.apis = {
                getUpdatingList: {
                    url: urlPrefix + '/worksheet/updating',
                    method: 'get',
                    data: {
                        query: ''
                    }
                },
                sendBackWorkOrder: { //退回工单
                    url: urlPrefix + '/worksheet/assign',
                    method: 'post',
                    data: {
                        id: '',
                        user_id: ''
                    }
                }
            };

            /*
             * 初始化
             */
            $scope.init = function () {
                $rootScope.pagePath = $location.path();
                $scope.saveTime = {};
                $scope.query = {};
                $scope.query.queryValue = '';
                $scope.getUpdatingList(); //显示列表
            };

            $scope.formatState = function () {
                $scope.initData.getListError = '';
                $scope.initData.loading = true;
                $scope.cache.listArr= [];
            };

            //点击回车查询
            $scope.queryAsKeyup = function(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode === 13){
                    $scope.querySearch(true);
                }
            };

            /**
             * 页面查询操作
             * @param flag: if curPage == 1
             */
            $scope.querySearch = function ( flag ) {
                if( flag ){
                    $scope.pager.curPage = 1;
                }
                $scope.formatState();
                $scope.getUpdatingList();
            };

            /*
             * 获取列表
             */
            $scope.getUpdatingList = function () {
                $scope.formatState();
                var config = $scope.apis.getUpdatingList;
                config.data.query = $scope.query.queryValue;
                config.data.page = $scope.pager.curPage || 1;
                config.data.per_page = parseInt($scope.pager.pageSize) || 20;
                var fnSuccess = function (d) {
                    $scope.initData.loading = false;
                    var data = typeof(d) === 'string' ? JSON.parse(d) : d;
                    $scope.cache.listArr = data.data;
                    $scope.pager.total = data.total;
                    $scope.pager.totalPage = Math.ceil( data.total / parseInt($scope.pager.pageSize) );
                    for(var x in $scope.cache.listArr){
                        $scope.cache.listArr[x].update_at = justifyTime($scope.cache.listArr[x].update_at);
                        $scope.cache.listArr[x].create_at = justifyTime($scope.cache.listArr[x].create_at);
                    }
                    $scope.apply();
                };
                var fnError = function (data) {
                    $scope.initData.getListError = data.errorMsg || '网络问题，请刷新页面重试';
                    $scope.initData.loading = false;
                    $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
                };
                AjaxServer.ajaxInfo(config, fnSuccess, fnError);
            };

            /**
             * 清空
             */
            $scope.queryClean = function( flag ){
                $scope.cleanParameter();
                $scope.getUpdatingList();
            };

            /**
             * 清空查询条件
             */
            $scope.cleanParameter = function(){
                $scope.query.queryValue = '';
                $scope.apply();
            };

            /**
             * 点击退回工单
             */
            $scope.clickSendBack = function(item){
                $scope.modalTitle = '提示信息';
                $scope.modalInfo = '确定退回此工单吗？';
                $scope.modal = $.extend({},modal);
                angular.element('#J_workOrderSendBackConfirm').modal();
                angular.element('#J_workOrderSendBackConfirm').draggable({
                    handle: ".modal-header",
                    cursor: 'move',
                    refreshPositions: false
                });
                $scope.initData.curRecord = item;
            };

            /**
             * 点击确定
             * @param event: event object
             */
            $scope.clickOk = function (event){
                var it = $(event.target);
                if(it.hasClass('disabled')){
                    return false;
                }
                it.addClass('disabled');
                $scope.sendBack(it);
            };

            /**
             * 退回工单
             */
            $scope.sendBack = function(it) {
                var config = $scope.apis.sendBackWorkOrder;
                config.data.id = $scope.initData.curRecord.id;
                config.data.user_id = $scope.initData.curRecord.editor;//要退回的目标（占时只有名称，接口中需要id）
                config.data.content = $scope.modal.tips;
                var fnSuccess = function (d) {
                    it.removeClass('disabled');
                    $('#J_workOrderSendBackConfirm').modal('hide');
                    $scope.getUpdatingList();
                };
                var fnFail = function (data) {
                    it.removeClass('disabled');
                    $scope.errorMsg = data.message;
                    console.log(data.message);
                };
                AjaxServer.ajaxInfo(config, fnSuccess, fnFail);
            };


            $scope.apply = function() {
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            };

            function justifyTime(preTime) {
                var preMS = Date.parse(new Date(preTime));
                var nowMS = preMS + 8 * 60 * 60 * 1000;
                var d = new Date(nowMS);
                var nowTime = d.getFullYear()+'-'+
                    (d.getMonth()<9?('0'+(d.getMonth()+1)):(d.getMonth()+1))+'-'+
                    (d.getDate()<10?('0'+d.getDate()):d.getDate())+' '+
                    (d.getHours()<10?('0'+d.getHours()):d.getHours())+':'+
                    (d.getMinutes()<10?('0'+d.getMinutes()):d.getMinutes())+':'+
                    (d.getSeconds()<10?('0'+d.getSeconds()):d.getSeconds());
                return nowTime;
            }
    }]);
