/**
 * @ngdoc function
 * @name myappApp.controller:WorkOrderEditAndAssignCtrl
 * @description
 * WorkOrderEditAndAssignCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
    .controller('WorkOrderEditAndAssignCtrl', ['$scope', '$rootScope', '$window', '$location', '$state','$stateParams','urlPrefix','AjaxServer','Validate','$sce',
        function ($scope, $rootScope, $window, $location, $state, $stateParams,urlPrefix,AjaxServer,Validate,$sce) {
            'use strict';

            var modal={
                tips:''
            };
            var internation = {
                "变更为": "ZW00001",
                "创建了": "ZW00002",
                "工单": "ZW00003",
                "添加了": "ZW00004",
                "处理记录": "ZW00005",
                "升级了": "ZW00006",
                "指派了": "ZW00007",
                "关闭了": "ZW00008",
                "给": "ZW00009",
                "管理员": "ZW00010",
                "处理中": "ZW00011",
                "升级中": "ZW00012",
                "已关闭": "ZW00013",
                "网络": "ZW00014",
                "服务器": "ZW00015",
                "存储": "ZW00016",
                "虚拟化": "ZW00017",
                "操作系统": "ZW00018",
                "中间件": "ZW00019",
                "数据库": "ZW00020",
                "配置变更": "ZW00021",
                "故障处理": "ZW00022",
                "性能优化": "ZW00023",
                "配件更换": "ZW00024"
            };
            $scope.trans = { // 类型转换
                worksheet_status_list: [
                    {'status': '1', 'name': '处理中'},
                    {'status': '2', 'name': '升级中'},
                    {'status': '3', 'name': '已关闭'}]
            };
            $scope.initData = {
                getListError: '',
                loading: true
            };
            $scope.infoList = {
                noteList: {}, // 处理记录
                recordList: {} // 操作记录
            };

            $scope.apis = {
                getSiteOptions: {//获取站点
                    url: urlPrefix + '',
                    method: 'get',
                    data: {
                    }
                },
                getAlertOptions: {//获取告警
                    url: urlPrefix + '',
                    method: 'get',
                    data: {
                    }
                },
                getAssignUser: {//获取指派用户
                    url: urlPrefix + '/partner/dropdown/users',
                    method: 'get',
                    data: {
                    }
                },
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
                selectFile: {
                    url: urlPrefix + '/worksheet/selectfile',
                    method: 'get',
                    data: {

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
                        content: ''
                    }
                },
                delteWorkOrderFile:{//删除附件
                    url: urlPrefix + '/worksheet/deletefile',
                    method: 'post',
                    data:　{
                        id: ''
                    }
                },
                upload:{
                    url: urlPrefix + '/worksheet/uploadfile',
                    method: 'post',
                    data:{

                    }
                }
            };
            var ue = null;
            /*
             * 初始化
             */
            $scope.init = function () {
                UE.delEditor('container');
                UE.delEditor('container_add');
                $rootScope.pagePath = $location.path();
                $scope.formData = {
                    alert_id: '',
                    alert_content: '',
                    site_id: '',
                    site_name: '',
                    problem_type: '',
                    server_type: '',
                    status: '',
                    name: '' , //工单标题
                    content: '', // 处理记录
                    handling: false, // 是否处理中的判断
                    updating: false, //升级中和已关闭的判断
                    title: '',
                    assign_user: '',
                    source: [],
                    sites: [],
                    alerts: [],
                    usersList: [],
                    id:''
                };
                $scope.source = [];
                $scope.tab = {status: true};
                $scope.init = {actionType: ''};
                $scope.modal = $.extend({},modal);
                $scope.files = [];
                ue = UE.getEditor('container',{
                    toolbars: [
                        ['bold','italic','underline','fontsize','forecolor','backcolor','justifyleft','justifyright','justifycenter','justifyjustify','source','link','unlink']
                    ],
                    initialFrameHeight : 150,
                    maximumWords: 1024,
                    scaleEnabled: true,
                    initialFrameWidth: 500,
                    minFrameWidth: 500
                });
                $scope.getEditInfo($stateParams.id);
                $scope.getNoteList($stateParams.id);
                $scope.getRecordList($stateParams.id);
                $scope.selectFile($stateParams.id);
                $scope.bindEvent();
                $scope.selfValid();
                if($scope.commonFlag == false){
                    $scope.getAssignUser($stateParams.id);
                }
                $scope.initData.loading = false;
            };

            /*
             * 上传文件触发
             */
            $scope.uploadFile = function () {
                var curNo = $(".j-file-input-edit").length;
                var content = "<input type='file' name='file' id='J_workOrderEdit_"+(curNo+1) + "' class='j-file-input-edit' accept='application/pdf,text/plain,application/msword,image/jpeg'>";
                $("#J_fileInputEditContainer").append(content);
                $('#J_workOrderEdit_'+(curNo+1)).click();
            };

            /**
             * 获取有效文件输入框
             * @returns {Array}
             * @private
             */
            function _getFileInputArr(){
                var fileInputIdArr = [];
                var fileInputArr = $(".j-file-input-edit");
                for(var i=0; i < fileInputArr.length; i++){
                    if(fileInputArr.eq(i).val()){
                        fileInputIdArr.push(fileInputArr.eq(i).attr("id"));
                    }
                }
                return fileInputIdArr;
            }

            /**
             * 获取文件名
             * @param o
             * @returns {string}
             * @private
             */
            function _getFileName(o){
                var pos=o.lastIndexOf("\\");
                return o.substring(pos+1);
            }

            /*
             * 缩略图
             */
            $scope.bindEvent = function () {
                $('body').off('change').on('change','.j-file-input-edit',function(event){
                    var inputArr = _getFileInputArr(),
                        fileName = null;
                    var file = event.target.files[0];
                    fileName = _getFileName($('#'+inputArr[inputArr.length-1]).val());
                    browserMD5File(file, function(err,md5){
                        $scope.files.push({'md5': md5});
                        $scope.uploadFiles(fileName,inputArr[inputArr.length-1]);
                    });
                    $scope.apply();
                });
                // $('#J_uploadFile_edit').on('change',function (ev) {
                //     for (var i = 0; i < this.files.length; i++) {
                //         var reader = new FileReader();
                //         reader.readAsDataURL(this.files[i]);
                //         reader.onload = function () {
                //             var div = document.createElement('div');
                //             var img = document.createElement('img');
                //             var name = document.createElement('p');
                //             div.style = "width: 80px; float: left;";
                //             img.src = this.result;
                //             img.style = "width: 60px; height: auto; margin: 10px;";
                //             name.innerHTML = ev.currentTarget.value.replace(/C/g,'').replace(/\:/g,'').replace(/\\/g,'').replace(/fakepath/g,'');
                //             name.style = "width: 100%; text-align: center;";
                //             div.appendChild(img);
                //             div.appendChild(name);
                //             $('#thumbnail').append(div);
                //         };
                //     }
                // });
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
                    $scope.formData.id = id;
                    switch(status){
                        case '1':
                            $scope.formData.title = '处理中的';
                            $scope.formData.handling = true;
                            $scope.formData.updating = false;
                            break;
                        case '2':
                            $scope.formData.title = '待指派的';
                            $scope.formData.handling = false;
                            $scope.formData.updating = true;
                            break;
                        case '3':
                            $scope.formData.title = '已关闭的';
                            $scope.formData.handling = false;
                            $scope.formData.updating = false;
                            break;
                    }
                };
                var fnFail = function (data) {
                    console.log(data.message);
                };
                AjaxServer.ajaxInfo(config, fnSuccess ,fnFail);
            };

            /**
             * 获取指派用户
             * params id为工单id
             */
            $scope.getAssignUser = function(id) {
                var config = $scope.apis.getAssignUser;
                var fnSuccess = function (d) {
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                    $scope.formData.usersList = data.data;
                };
                var fnFail = function (data) {
                    console.log(data.message);
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
                    for(var x in $scope.infoList.noteList){
                        $scope.infoList.noteList[x].text = $sce.trustAsHtml($scope.infoList.noteList[x].text);
                        $scope.infoList.noteList[x].create_at = justifyTime($scope.infoList.noteList[x].create_at);
                    }
                };
                var fnFail = function (data) {
                    console.log(data.message);
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
                    for(var x in $scope.infoList.recordList){
                        $scope.infoList.recordList[x].text = $sce.trustAsHtml($scope.trans($scope.infoList.recordList[x].text));
                        $scope.infoList.recordList[x].create_at = justifyTime($scope.infoList.recordList[x].create_at);
                    }
                };
                var fnFail = function (data) {
                    console.log(data.message);
                };
                AjaxServer.ajaxInfo(config, fnSuccess ,fnFail);
            };

            /*
             * 查询附件
             */
            $scope.selectFile = function(id){
                var ajaxConfig = $scope.apis.selectFile;
                ajaxConfig.data.order_id = id;
                AjaxServer.ajaxInfo(ajaxConfig, function (data) {
                    $scope.formData.source = data.data;
                }, function (data) {
                    console.log(data);
                });
            };

            /*
             * 解析操作记录
             */
            $scope.trans = function (txt) {
                var arr1 = [];
                for(var i in internation){
                    var reg = new RegExp(internation[i],'g');
                    txt = txt.replace(reg,i);
                }
                arr1 = txt.split('<ENDLINE>');
                // arr1 = txt.replace(/ZW00001/g,'变更为')
                //         .replace(/ZW00002/g,'创建了')
                //         .replace(/ZW00003/g,'工单')
                //         .replace(/ZW00004/g,'添加了')
                //         .replace(/ZW00005/g,'处理记录')
                //         .replace(/ZW00006/g,'升级了')
                //         .replace(/ZW00007/g,'指派了')
                //         .replace(/ZW00008/g,'关闭了')
                //         .replace(/ZW00009/g,'给')
                //         .split('<ENDLINE>');
                arr1 = arr1.slice(0,arr1.length - 1);
                var str = '';
                for(var x in arr1){
                    str += arr1[x] + '<br>';
                }
                return str;
            };

            /**
             * 清空file文本框
             * @param fileId
             */
            $scope.cleanFile = function(){
                $("#J_fileInputEditContainer").html("");
            };

            /*
             * 修订工单（提交修改）
             */
            $scope.saveWorkOrder = function (it) {
                it.addClass('disabled');
                var config = $scope.apis.saveWorkOrder;
                config.data.id = $stateParams.id;
                config.data.name = $scope.formData.name;
                config.data.problem_type = $scope.formData.problem_type;
                config.data.server_type = $scope.formData.server_type;
                config.data.content = ue.getContent();
                config.data.source = $scope.source;
                var fnSuccess = function (d) {
                    it.removeClass('disabled');
                    $scope.cleanFile();
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                    $state.go('main.workOrder.handling');
                };
                var fnFail = function (data) {
                    console.log(data.message);
                };
                AjaxServer.ajaxInfo(config, fnSuccess ,fnFail);
            };

            /**
             * 上传文件并提交表单
             */
            $scope.upLoadFileAndCommitForm = function (ev) {
                var it = $(ev.target);
                if($scope.validateForm('all','workOrder')) {
                    $scope.saveWorkOrder(it);
                }
            };
            /*
             * 上传文件
             */
            $scope.uploadFiles = function(fileName,id){
                $scope.initData.loading = true;
                var preData = {};
                var uploadKey = {};
                preData[0] = ({'filename': fileName,'md5': $scope.files[$scope.files.length-1].md5});
                var ajaxConfig = {
                    url: urlPrefix + '/worksheet/preupload',
                    method: 'post',
                    data: preData
                };
                AjaxServer.ajaxInfo(ajaxConfig, function(data){
                    uploadKey = data.data;
                    delete uploadKey[0].filename;
                    $.ajaxFileUpload({
                        url: $scope.apis.upload.url,
                        type: 'post',
                        secureuri: false,
                        fileElementId: [id],
                        dataType: "json",
                        data: uploadKey[0],
                        success: function (d, status) {
                            $scope.initData.loading = false;
                            if (d.code == 0) {
                                $scope.errorMsg = '附件上传失败,请核对';
                                $scope.apply();
                                return;
                            }
                            $scope.source.push(d.data);
                            $scope.formData.source.push({"id":"", "name":fileName});
                            $scope.errorMsg = '';
                            $scope.apply();
                        },
                        error: function (d) {
                            $scope.initData.loading = false;
                            $scope.errorMsg = '附件上传失败,请核对';
                            $scope.apply();
                        }
                    });
                }, function(data){
                    $scope.initData.loading = false;
                    console.log(data);
                });
            };

            /*
             * 取消
             */
            $scope.cancel = function () {
                window.history.go(-1);
            };

            /*
             * 点击升级工单
             */
            $scope.clickUpdateWorkOrder = function () {
                $scope.modalTitle = '提示信息';
                $scope.modalInfo = '确定升级该工单吗？';
                $scope.init.actionType = 'update';
                $scope.modal = $.extend({},modal);
                angular.element('#J_workOrderConfirm').modal();
                angular.element('#J_workOrderConfirm').draggable({
                    handle: ".modal-header",
                    cursor: 'move',
                    refreshPositions: false
                });
                $scope.apply();
            };

            /*
             * 升级工单
             */
            $scope.updateWorkOrder = function (it) {
                var config = $scope.apis.updateWorkOrder;
                config.data.id = $stateParams.id;
                config.data.content = $scope.modal.tips;
                console.log(config.data);
                var fnSuccess = function (d) {
                    it.removeClass('disabled');
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                    $("#J_workOrderConfirm").modal('hide');
                    setTimeout(function(){$state.go('main.workOrder.handling')},1000);
                };
                var fnFail = function (data) {
                    it.removeClass('disabled');
                    console.log(data.message);
                };
                AjaxServer.ajaxInfo(config, fnSuccess, fnFail);
            };

            /**
             * 点击指派工单
             */
            $scope.clickAssignOrder = function(){
                $scope.modalTitle = '指派工单';
                $scope.init.actionType = 'assign';
                $scope.selfValid();
                $scope.modal = $.extend({},modal)
                angular.element('#J_workOrderAssign').modal();
                angular.element('#J_workOrderAssign').draggable({
                    handle: ".modal-header",
                    cursor: 'move',
                    refreshPositions: false
                });
            };

            /**
             * 指派工单
             */
            $scope.assignWorkOrder = function (it, id) {
                if($scope.validateForm('all','assignOrder')) {
                    var config = $scope.apis.assignWorkOrder;
                    config.data.id = $stateParams.id;
                    config.data.user_id = $scope.formData.assign_user;
                    config.data.content = $scope.modal.tips;
                    var fnSuccess = function (d) {
                        it.removeClass('disabled');
                        $("#J_workOrderAssign").modal('hide');
                        setTimeout(function(){$state.go('main.workOrder.updating')},1000);
                    };
                    var fnFail = function (data) {
                        it.removeClass('disabled');
                        console.log(data.message);
                    };
                    AjaxServer.ajaxInfo(config, fnSuccess, fnFail);
                }
                it.removeClass('disabled');
            };

            /*
             * 触发弹出确定事件
             */
            $scope.clickOk = function (event){
                var it = $(event.target),
                type = $scope.init.actionType;
                if(it.hasClass('disabled')){
                    return false;
                }
                switch(type) {
                    case 'close':  //关闭工单
                        it.addClass('disabled');
                        $scope.closeWorkOrder(it);
                        break;
                    case 'assign': //指派工单
                        it.addClass('disabled');
                        $scope.assignWorkOrder(it);
                        break;
                    case 'update': //升级工单
                        it.addClass('disabled');
                        $scope.updateWorkOrder(it);
                        break;
                }
            };

            /**
             * 触发关闭工单操作
             */
            $scope.clickCloseWorkOrder = function () {
                $scope.modalTitle = '提示信息';
                $scope.modalInfo = '确定关闭工单吗？';
                $scope.init.actionType = 'close';
                angular.element('#J_workOrderConfirm').modal();
                angular.element('#J_workOrderConfirm').draggable({
                    handle: ".modal-header",
                    cursor: 'move',
                    refreshPositions: false
                });
                $scope.apply();
            };

            /**
             * 关闭工单
             */
            $scope.closeWorkOrder = function (it) {
                var config = $scope.apis.closeWorkOrder;
                config.data.id = $stateParams.id;
                config.data.content = $scope.modal.tips; //待指定
                var fnSuccess = function (d) {
                    it.removeClass('disabled');
                    $('#J_workOrderConfirm').modal('hide');
                    setTimeout(function(){window.history.go(-1)},1000);
                };
                var fnFail = function (data) {
                    it.removeClass('disabled');
                    console.log(data.message);
                };
                AjaxServer.ajaxInfo(config, fnSuccess, fnFail);
            };

            /*
             * 删除附件
             */
            $scope.deleteFile = function (file) {
                $scope.formData.source.splice($.inArray(file, $scope.formData.source), 1);
                var inputArr = _getFileInputArr(),
                    fileName = null;
                for(var i=0; i< inputArr.length; i++){
                    fileName = _getFileName($('#'+inputArr[i]).val());
                    if(fileName === file.name){
                        $('#'+inputArr[i]).remove();
                    }
                }
                if(file.id){
                    var config = $scope.apis.delteWorkOrderFile;
                    config.data.id = file.id;
                    var fnSuccess = function (d) {
                        if (d.message === 'success') {
                            console.log("附件删除成功！");
                        }
                    };
                    var fnFail = function (data) {

                    };
                    AjaxServer.ajaxInfo(config, fnSuccess, fnFail);
                }
            };

            /**
             * 信息切换
             * @param flag
             */
            $scope.tabTrans = function (flag) {
                $scope.tab.status = flag;
            };

            /**
             * 表单验证
             * @param type: 字段是哪个
             * @param whichForm: 添加(workOrder)
             * @returns {boolean}
             */
            $scope.validateForm = function ( type , whichForm ){
                var validDirtyObj = angular.extend({},validFormatObj,{dirty:true}),
                    validNotObj = angular.extend({},validDirtyObj,{valid:false,invalid:true});
                if(whichForm === 'assignOrder'){
                    //指派用户
                    if (type === 'assign_user' || type === 'all') {
                        $scope.validate.assignOrder.assign_user = angular.extend({}, validDirtyObj);
                        if (!$scope.formData.assign_user) {
                            $scope.validate.assignOrder.assign_user = angular.extend({}, validNotObj, {
                                error: {
                                    required: true,
                                    format: false,
                                    same: false
                                }
                            });
                            $scope.apply();
                            return false;
                        }
                    }
                }
                // 表单
                if(whichForm === 'workOrder') {
                    // 工单标题
                    if (type === 'name' || type === 'all') {
                        $scope.validate.workOrder.name = angular.extend({}, validDirtyObj);
                        if (!$scope.formData.name) {
                            $scope.validate.workOrder.name = angular.extend({}, validNotObj, {
                                error: {
                                    required: true,
                                    format: false,
                                    same: false
                                }
                            });
                            $scope.apply();
                            return false;
                        }
                        else if (!Validate.validLength($scope.formData.name, {maxLen: 128})) {
                            $scope.validate.workOrder.name = angular.extend({}, validNotObj, {
                                error: {
                                    required: false,
                                    format: true,
                                    same: false
                                }
                            });
                            $scope.apply();
                            return false;
                        }
                    }
                    // 故障类型
                    if (type === 'problem_type' || type === 'all') {
                        $scope.validate.workOrder.problem_type = angular.extend({}, validDirtyObj);
                        if (!$scope.formData.problem_type) {
                            $scope.validate.workOrder.problem_type = angular.extend({}, validNotObj, {
                                error: {
                                    required: true,
                                    format: false,
                                    same: false
                                }
                            });
                            $scope.apply();
                            return false;
                        }
                    }
                    // 处理类型
                    if (type === 'server_type' || type === 'all') {
                        $scope.validate.workOrder.server_type = angular.extend({}, validDirtyObj);
                        if (!$scope.formData.server_type) {
                            $scope.validate.workOrder.server_type = angular.extend({}, validNotObj, {
                                error: {
                                    required: true,
                                    format: false,
                                    same: false
                                }
                            });
                            $scope.apply();
                            return false;
                        }
                    }
                    // 工单记录
                    // if (type === 'content' || type === 'all') {
                    //     $scope.validate.workOrder.content = angular.extend({}, validDirtyObj);
                    //     if($scope.formData.content) {
                    //         if (!Validate.validLength($scope.formData.content, {maxLen: 1024})) {
                    //             $scope.validate.workOrder.content = angular.extend({}, validNotObj, {
                    //                 error: {
                    //                     required: false,
                    //                     format: true,
                    //                     same: false
                    //                 }
                    //             });
                    //             $scope.apply();
                    //             return false;
                    //         }
                    //     }
                    // }
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
                $scope.errorMsg = '';
                $scope.validate = {
                    workOrder: {
                        name:{},
                        problem_type:{},
                        server_type:{},
                        content:{}
                    },
                    assignOrder: {
                        assign_user: {}
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
