/**
 * @ngdoc function
 * @name myappApp.controller:WorkOrderEditAndAssignCtrl
 * @description
 * WorkOrderEditAndAssignCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
    .controller('WorkOrderEditAndAssignCtrl', ['$scope', '$rootScope', '$window', '$location', '$timeout', '$cookieStore','$state','$stateParams','urlPrefix','AjaxServer','Validate','sessionStore',
        function ($scope, $rootScope, $window, $location, $timeout, $cookieStore,$state,$stateParams,urlPrefix,AjaxServer,Validate,sessionStore) {
            'use strict';

            $scope.formData = { // 工单信息
                alert_id: '',
                alert_content: '',
                site_id: '',
                site_name: '',
                problem_type: '',
                server_type: '',
                source: [],
                status: '',
                name: '' , //工单标题
                content: '', // 处理记录
                handling: true, // 是否处理中的判断
                updating: true, //升级中和已关闭的判断
                title: ''
            };
            $scope.trans = { // 类型转换
                worksheet_status_list: [{'status': '1', 'name': '处理中'},{'status': '2', 'name': '升级中'},
                    {'status': '3', 'name': '已关闭'}],
                problem_type_list: [{'id': '1', 'name': '网络'},{'id': '2', 'name': '服务器'},
                    {'id': '3', 'name': '存储'},{'id': '4', 'name': '虚拟化'},{'id': '5', 'name': '操作系统'},
                    {'id': '6', 'name': '中间件'}, {'id': '7', 'name': '数据库'}],
                server_type_list: [{'id': '1', 'name': '配置变更'},{'id': '2', 'name': '故障处理'},
                    {'id': '3', 'name': '性能优化'}]
            };
            $scope.infoList = {
                noteList: {}, // 处理记录
                recordList: {} // 操作记录
            };
            $scope.tab = {
                status: true
            };


            $scope.apis = {
                getEditInfo: { // 获取工单详情
                    url: urlPrefix + '/worksheet/edit',
                    method: 'get',
                    data: {
                        id: ''
                    }
                },
                getNoteList: { // 查询处理记录
                    url: urlPrefix + '/worksheet/note',
                    method: 'get',
                    data: {
                        id: ''
                    }
                },
                getRecordList: { // 查询操作记录
                    url: urlPrefix + '/worksheet/record',
                    method: 'get',
                    data: {
                        id: ''
                    }
                },
                saveWorkOrder: { // 修订工单（提交修改）
                    url: urlPrefix + '/worksheet/edit',
                    method: 'post',
                    data: {
                        id: '',
                        name: '',
                        problem_type: '',
                        server_type: '',
                        content: '',
                        source: []
                    }
                },
                updateWorkOrder: { // 升级工单
                    url: urlPrefix + '/worksheet/update',
                    method: 'post',
                    data: {
                        id: '',
                        content: ''
                    }
                },
                assignWorkOrder: { //指派工单
                    url: urlPrefix + '/worksheet/assign',
                    method: 'post',
                    data: {
                        id: '',
                        user_id: ''
                    }
                },
                closeWorkOrder: { // 关闭工单
                    url: urlPrefix + '/worksheet/close',
                    method: 'post',
                    data:　{
                        id: '',
                        cost: ''
                    }
                }
            };
            /*
             * 初始化
             */
            $scope.init = function () {
                $rootScope.pagePath = $location.path();
                $scope.formData = {};
                $scope.getEditInfo($stateParams.id);
                $scope.getNoteList($stateParams.id);
                $scope.getRecordList($stateParams.id);
                $scope.bindEvent();
                $('.nav-tabs>li:first-child').addClass('active');
            };
            /*
             * 上传文件触发
             */
            $scope.uploadFile = function () {
                $('#J_uploadFile_edit').click();
            };
            /*
             * 缩略图
             */
            $scope.bindEvent = function () {
                $('#J_uploadFile_edit').on('change',function (ev) {
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
                        };
                    }
                });
            };
            /*
             * 获取工单详情
             */
            $scope.getEditInfo = function (id) {
                var config = $scope.apis.getEditInfo;
                config.data.id = id;
                var fnSuccess = function (d) {
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                    $scope.formData = data.data;
                    var status = $scope.formData.status;
                    switch(status){
                        case '1':
                            $scope.formData.title = '处理中的';
                            $scope.formData.handling = true;
                            $scope.formData.updating = false;
                            break;
                        case '2':
                            $scope.formData.title = '升级中的';
                            $scope.formData.handling = false;
                            $scope.formData.updating = true;
                            break;
                        case '3':
                            $scope.formData.title = '已关闭的';
                            $scope.formData.handling = false;
                            $scope.formData.updating = false;
                            break;
                    }
                    for (var i = 0; i < $scope.formData.source.length; i++) {
                        var div = document.createElement('div');
                        var img = document.createElement('img');
                        var name = document.createElement('p');
                        div.style = "width: 80px; float: left;";
                        img.style = "width: 60px; height: 60px; margin: 10px;";
                        name.innerHTML = $scope.formData.source[i].name;
                        name.style = "width: 100%; text-align: center;";
                        div.appendChild(img);
                        div.appendChild(name);
                        $('#thumbnail').append(div);
                    }
                };
                var fnFail = function (data) {
                };
                AjaxServer.ajaxInfo(config, fnSuccess ,fnFail);
            };
            /*
             * 查询处理记录
             */
            $scope.getNoteList = function (id) {
                var config = $scope.apis.getNoteList;
                config.data.id = id;
                var fnSuccess = function (d) {
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                    $scope.infoList.noteList = data.data;
                };
                var fnFail = function (data) {

                };
                AjaxServer.ajaxInfo(config, fnSuccess ,fnFail);
            };
            /*
             * 查询操作记录
             */
            $scope.getRecordList = function (id) {
                var config = $scope.apis.getRecordList;
                config.data.id = id;
                var fnSuccess = function (d) {
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                    $scope.infoList.recordList = data.data;
                };
                var fnFail = function (data) {

                };
                AjaxServer.ajaxInfo(config, fnSuccess ,fnFail);
            };
            /*
             * 修订工单（提交修改）
             */
            $scope.saveWorkOrder = function () {
                var config = $scope.apis.saveWorkOrder;
                config.data.id = $stateParams.id;
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

                };
                AjaxServer.ajaxInfo(config, fnSuccess ,fnFail);
            };
            /*
             * 取消
             */
            $scope.cancel = function () {
                window.history.go(-1);
            };
            /*
             * 升级工单
             */
            $scope.updateWorkOrder = function () {
                var config = $scope.apis.updateWorkOrder;
                config.data.id = $stateParams.id;
                config.data.content = $scope.formData.content;
                var fnSuccess = function (d) {
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                };
                var fnFail = function (data) {

                };
                AjaxServer.ajaxInfo(config, fnSuccess, fnFail);
            };
            /*
             * 指派工单
             */
            $scope.assignWorkOrder = function (id) {
                var config = $scope.apis.assignWorkOrder;
                config.data.id = $stateParams.id;
                //todo
                var fnSuccess = function (d) {
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                };
                var fnFail = function (data) {

                };
                AjaxServer.ajaxInfo(config, fnSuccess, fnFail);
            };
            /*
             * 关闭工单
             */
            $scope.clickOk = function () {
                var config = $scope.apis.closeWorkOrder;
                config.data.id = $stateParams.id;
                var fnSuccess = function (d) {
                    $('#J_editConfirm').modal('hide');
                    window.history.go(-1);
                };
                var fnFail = function (data) {

                };
                AjaxServer.ajaxInfo(config, fnSuccess, fnFail);
            };
            $scope.closeWorkOrder = function () {
                angular.element('#J_editConfirm').modal();
                angular.element('#J_editConfirm').draggable({
                    handle: ".modal-header",
                    cursor: 'move',
                    refreshPositions: false
                });
                $scope.modalInfo = '确定关闭工单吗？';
            };
            $scope.tabTrans = function (flag) {
                $scope.tab.status = flag;
                if($scope.tab.status == true){
                    $('.nav-tabs>li:first-child').addClass('active');
                    $('.nav-tabs>li:last-child').removeClass('active');
                }else{
                    $('.nav-tabs>li:last-child').addClass('active');
                    $('.nav-tabs>li:first-child').removeClass('active');
                }
            };

            $scope.apply = function() {
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            };
        }]);
