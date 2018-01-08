/**
 * @ngdoc function
 * @name myappApp.controller:AdvanceSearchCtrl
 * @description 高级搜索
 * AdvanceSearchCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
.controller('AdvanceSearchCtrl', ['$scope', '$rootScope', '$window', '$location', '$state','urlPrefix','AjaxServer',
    function ($scope, $rootScope, $window, $location, $state, urlPrefix, AjaxServer) {
        'use strict';

        $scope.pager = {};
        $scope.initData = {
            getListError: '',
            loading: true,
            durationOptions:[
                {"id":"4","name":"小于"},
                {"id":"5","name":"小于等于"},
                {"id":"1","name":"等于"},
                {"id":"2","name":"大于"},
                {"id":"3","name":"大于等于"}
            ]
        };
        $scope.cache = {
            listArr: [],
            siteObj: {},
            statusList: []
        };
        $scope.apis = {
            getSiteList: {//站点
                url: urlPrefix + '/worksheet//sites',
                method: 'get',
                data: {}
            },
            getAuthorList: {//工单所有者
                url: urlPrefix + '/worksheet/users',
                method: 'get',
                data: {}
            },
            getAdvanceClosedList: {
                url: urlPrefix + '/worksheet//advancedsearch',
                method: 'post',
                data: {
                    is_paginate:true
                }
            }

        };

        /*
         * 初始化
         */
        $scope.init = function () {
            $rootScope.pagePath = $location.path();
            $scope.advanceQuery = {
                "siteId":"",
                "authorId":"",
                "orderTypeId":"",
                "problemTypeId":"",
                "orderStatusId":"",
                "createStart":"",
                "createEnd":"",
                "closeStart":"",
                "closeEnd":"",
                "durationDays":"",
                "idleDays":"",
                "idleSymbol":"",
                "durationSymbol":""
            };
            $scope.initSelect();//初始化所有的多选下拉列表框
            $scope.getData();//日期插件
            $scope.initSiteList();//初始化站点
            $scope.initAuthorList();//初始化工单所有者
            $scope.initOrderTypeList();//初始化工单类型
            $scope.initProblemTypeList();//初始化事件类型
            $scope.initOrderStatusList();//初始化工单状态
        };

        /*
         * 初始化多选下拉列表框
         */
        $scope.initSelect = function(){
            $('#J_site').selectpicker({//站点
                'noneSelectedText': '请选择站点'
            });
            $('#J_author').selectpicker({//工单所有者
                'noneSelectedText': '请选择工单所有者'
            });
            $('#J_orderType').selectpicker({//工单类型
                'noneSelectedText': '请选择工单类型'
            });
            $('#J_problemType').selectpicker({//事件类型
                'noneSelectedText': '请选择事件类型'
            });
            $('#J_orderStatus').selectpicker({//工单状态
                'noneSelectedText': '请选择工单状态'
            });
        };

        /*
        *日期插件
        */
        $scope.getData = function(){
            var createStart = {
                skinCell:'jedateblack',
                format: 'YYYY-MM-DD hh:mm:ss',
                minDate: '1977-01-01 00:00:00',
                maxDate: '2099-01-01 00:00:00',
                ishmsVal:false,
                zIndex:3000,
                choosefun: function(elem,date){
                    createEnd.minDate = date;
                    $scope.advanceQuery.createStart = date;
                },
                okfun:function (elem,date) {
                    createEnd.minDate = date;
                    $scope.advanceQuery.createStart = date;
                },
                clearfun:function() {
                    $scope.advanceQuery.createStart = "";
                }
            };
            var createEnd = {
                skinCell:'jedateblack',
                format: 'YYYY-MM-DD hh:mm:ss',
                minDate: '1977-01-01 00:00:00',
                maxDate: '2099-06-16 00:00:00',
                ishmsVal:false,
                zIndex:3000,
                choosefun: function(elem,date){
                    createStart.maxDate = date;
                    $scope.advanceQuery.createEnd = date;
                },
                okfun:function (elem,date) {
                    createStart.maxDate = date;
                    $scope.advanceQuery.createEnd = date;
                },
                clearfun:function() {
                    $scope.advanceQuery.createEnd = "";
                }
            };
            var closeStart = {
                skinCell:'jedateblack',
                format: 'YYYY-MM-DD hh:mm:ss',
                minDate: '1977-01-01 00:00:00',
                maxDate: '2099-01-01 00:00:00',
                ishmsVal:false,
                zIndex:3000,
                choosefun: function(elem,date){
                    closeEnd.minDate = date;
                    $scope.advanceQuery.closeStart = date;
                },
                okfun:function (elem,date) {
                    closeEnd.minDate = date;
                    $scope.advanceQuery.closeStart = date;
                },
                clearfun:function() {
                    $scope.advanceQuery.closeStart = "";
                }
            };
            var closeEnd = {
                skinCell:'jedateblack',
                format: 'YYYY-MM-DD hh:mm:ss',
                minDate: '1977-01-01 00:00:00',
                maxDate: '2099-06-16 00:00:00',
                ishmsVal:false,
                zIndex:3000,
                choosefun: function(elem,date){
                    closeStart.maxDate = date;
                    $scope.advanceQuery.closeEnd = date;
                },
                okfun:function (elem,date) {
                    closeStart.maxDate = date;
                    $scope.advanceQuery.closeEnd = date;
                },
                clearfun:function() {
                    $scope.advanceQuery.closeEnd = "";
                }
            };
            $("#J_createStartTime").jeDate(createStart);
            $("#J_createEndTime").jeDate(createEnd);
            $("#J_closeStartTime").jeDate(closeStart);
            $("#J_closeEndTime").jeDate(closeEnd);
        };

        /*
        * 填充多选下拉列表数据
        */
        $scope.createOptions = function(id,optionsData){
            var optionString = "";
            for (var v in optionsData) {
                optionString += "<option value=\'"+ optionsData[v].id +"\'>" + optionsData[v].name + "</option>";
            }
            var myobj = document.getElementById(id);
            if (myobj.options.length == 0){
                $("#" + id).html(optionString);
                $("#" + id).selectpicker('refresh');
            }
        };

        $scope.clearOptions = function(id){
            document.getElementById(id).options.selectedIndex = -1;
            $("#"+id).selectpicker('refresh');
        };

        /*
         * 初始化站点列表
         */
        $scope.initSiteList = function(){
            var config = {
                url:  $scope.apis.getSiteList.url,
                method: $scope.apis.getSiteList.method,
                data: {}
            },
            fnSuccess = function (d){
                var data = typeof(d)==='string' ? JSON.parse(d) : d;
                if(data && data.data.length > 0){
                    // $scope.initData.siteOptions = data.data;
                    var dataTemp = [];
                    for(var v in data.data){
                        dataTemp.push({"id":data.data[v].site_id,"name":data.data[v].site_name});
                    }
                    $scope.createOptions("J_site",dataTemp);
                }
                $scope.apply();
            },
            fnFail = function(data){
                console.log(data.message || '获取列表失败');
            };
            AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
        };

        /*
         * 初始化工单所有者列表
         */
        $scope.initAuthorList = function(){
            var config = {
                url:  $scope.apis.getAuthorList.url,
                method: $scope.apis.getAuthorList.method,
                data: {}
            },
            fnSuccess = function (d){
                var data = typeof(d)==='string' ? JSON.parse(d) : d;
                if(data && data.data.length > 0){
                    // $scope.initData.siteOptions = data.data;
                    var dataTemp = [];
                    for(var v in data.data){
                        dataTemp.push({"id":data.data[v].user_id,"name":data.data[v].user_name});
                    }
                    $scope.createOptions("J_author",dataTemp);
                }
                $scope.apply();
            },
            fnFail = function(data){
                console.log(data.message || '获取列表失败');
            };
            AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
        };

        /*
         * 初始化工单类型列表
         */
        $scope.initOrderTypeList = function(){
            var data = [
                {'id': '1', 'name': '其他'},
                {'id': '2', 'name': '网络'},
                {'id': '3', 'name': '存储'},
                {'id': '4', 'name': '服务器'},
                {'id': '5', 'name': '中间件'},
                {'id': '6', 'name': '数据库'},
                {'id': '7', 'name': '操作系统'},
                {'id': '8', 'name': '硬件故障'}
            ];
            $scope.createOptions("J_orderType",data);
        };

        /*
         * 初始化事件类型列表
         */
        $scope.initProblemTypeList = function(){
            var data = [
                {'id': '1', 'name': '故障处理'},
                {'id': '2', 'name': '配置变更'},
                {'id': '3', 'name': '配件更换'},
                {'id': '4', 'name': '健康巡检'}
            ];
            $scope.createOptions("J_problemType",data);
        };

        /*
         * 初始化工单状态列表
         */
        $scope.initOrderStatusList = function(){
            var data = [
                {'id': '1', 'name': '处理中'},
                {'id': '2', 'name': '升级中'},
                {'id': '3', 'name': '已关闭'}
            ];
            if( $location.path().indexOf('handlingList') > -1){
                data = [{'id': '1', 'name': '处理中'}];
                $scope.advanceQuery.orderTypeId = '1';
            }else if($location.path().indexOf('updatingList') > -1){
                data = [{'id': '2', 'name': '升级中'}];
                $scope.advanceQuery.orderTypeId = '2';
            }else if($location.path().indexOf('closedList') > -1){
                data = [{'id': '3', 'name': '已关闭'}];
                $scope.advanceQuery.orderTypeId = '3';
            }
            $scope.createOptions("J_orderStatus",data);
            $scope.apply();
        };

        /**
         * 高级搜索
         * @param flag: if curPage == 1
         */
        $scope.advanceSearch = function ( flag ) {
            if( flag ){
                $scope.pager.curPage = 1;
            }
            $scope.formatState();
            $scope.getClosedListByAdvanceSearch();
        };

        $scope.advanceClean = function(flag){
            $scope.clearOptions('J_site');
            $scope.clearOptions('J_author');
            $scope.clearOptions('J_orderType');
            $scope.clearOptions('J_problemType');
            $scope.clearOptions('J_orderStatus');

            $scope.advanceQuery.siteId = '';
            $scope.advanceQuery.authorId = '';
            $scope.advanceQuery.orderTypeId = '';
            $scope.advanceQuery.problemTypeId = '';
            $scope.advanceQuery.orderStatusId = '';

            $scope.advanceQuery.authorId = '';
            $scope.advanceQuery.orderTypeId = '';
            $scope.advanceQuery.problemTypeId = '';
            $scope.advanceQuery.orderStatusId = '';

            $scope.advanceQuery.createStart = '';
            $scope.advanceQuery.createEnd = '';
            $scope.advanceQuery.closeStart = '';
            $scope.advanceQuery.closeEnd = '';
            $scope.advanceQuery.durationDays = '';
            $scope.advanceQuery.idleDays = '';
            $scope.advanceQuery.durationSymbol = '';
            $scope.advanceQuery.idleSymbol = '';

            $('#J_createStartTime').val('');
            $('#J_createEndTime').val('');
            $('#J_closeStartTime').val('');
            $('#J_closeEndTime').val('');

            $scope.apply();
            $scope.getClosedListByAdvanceSearch();
        };

        $scope.getClosedListByAdvanceSearch = function () {
            var siteId = $scope.advanceQuery.siteId;
            var authorId = $scope.advanceQuery.authorId;
            var orderTypeId = $scope.advanceQuery.orderTypeId;
            var problemTypeId = $scope.advanceQuery.problemTypeId;
            var orderStatusId = $scope.advanceQuery.orderStatusId;
            var createStart = $scope.advanceQuery.createStart;
            var createEnd = $scope.advanceQuery.createEnd;
            var closeStart = $scope.advanceQuery.closeStart;
            var closeEnd = $scope.advanceQuery.closeEnd;
            var durationDays = $scope.advanceQuery.durationDays;
            var idleDays = $scope.advanceQuery.idleDays;
            var durationSymbol = $scope.advanceQuery.durationSymbol;
            var idleSymbol = $scope.advanceQuery.idleSymbol;

            var config = $scope.apis.getAdvanceClosedList;
            config.data.page = $scope.pager.curPage || 1;
            config.data.per_page = parseInt($scope.pager.pageSize) || 20;
            //参数
            config.data.site_name = siteId;
            config.data.editor_name = authorId;
            config.data.server_type = orderTypeId;
            config.data.problem_type = problemTypeId;
            config.data.status = orderStatusId;
            config.data.create_start = createStart;
            config.data.create_end = createEnd;
            config.data.close_start = closeStart;
            config.data.close_end = closeEnd;
            config.data.duration_days = durationDays;
            config.data.duration_symbol = durationSymbol;
            config.data.idle_days = idleDays;
            config.data.idle_symbol = idleSymbol;

            var fnSuccess = function (d) {
                $scope.initData.loading = false;
                var data = typeof(d)==='string' ? JSON.parse(d) : d;
                $scope.cache.listArr = data.data;
                $scope.pager.total = data.total;
                $scope.pager.totalPage = Math.ceil( data.total / parseInt($scope.pager.pageSize) );
                for(var x in $scope.cache.listArr){
                    $scope.cache.listArr[x].duration = $scope.minToDHM($scope.cache.listArr[x].duration);
                    $scope.cache.listArr[x].close_at = justifyTime($scope.cache.listArr[x].close_at);
                    $scope.cache.listArr[x].create_at = justifyTime($scope.cache.listArr[x].create_at);
                }
                $scope.$parent.$parent.cache.listArr =  angular.copy($scope.cache.listArr);
                $scope.$parent.$parent.pager = angular.copy($scope.pager);
                $scope.apply();
            };
            var fnError = function (data) {
                $scope.initData.getListError = data.errorMsg || '网络问题，请刷新页面重试';
                $scope.initData.loading = false;
                $scope.infoDetail = data.message || '网络问题，请刷新页面重试';
            };
            AjaxServer.ajaxInfo(config, fnSuccess, fnError);
        };

        $scope.formatState = function () {
            $scope.initData.getListError = '';
            $scope.initData.loading = true;
            $scope.cache.listArr= [];
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
    }
]);
