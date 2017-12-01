/**
 * @ngdoc function
 * @name myappApp.controller:WorkOrderAddCtrl
 * @description
 * WorkOrderAddCtrl
 * Controller of the myappApp
 */
angular.module('myappApp')
    .controller('WorkOrderAddCtrl', ['$scope', '$rootScope', '$window', '$location','$stateParams', '$state','urlPrefix','AjaxServer','Validate',
        function ($scope, $rootScope, $window, $location,$stateParams, $state,urlPrefix, AjaxServer, Validate) {
            'use strict';

            var apis = {
                getSiteOptions: {//获取站点
                    url: urlPrefix + '/worksheet/sites',
                    method: 'get',
                    data: {
                    }
                },
                getAlertOptions: {//获取告警
                    url: urlPrefix + '/worksheet/alerts',
                    method: 'get',
                    data: {
                    }
                },
                createWorkOrder: {
                    url: urlPrefix + '/worksheet/create',
                    method: 'post',
                    data: {
                        alert_id: '',
                        //alert_content: '',
                        site_id: '',
                        //site_name: '',
                        name: '',
                        problem_type: '',
                        server_type: '',
                        content: '',
                        source: []
                    }
                },
                upload:{
                    url: urlPrefix + '/worksheet/uploadfile',
                    method: 'post',
                    data: {
                    }
                }
            };
            $scope.initData = {
                getListError: '',
                loading: true
            };
            var ue = null;
            /*
             * 初始化
             */
            $scope.init = function () {
                UE.delEditor('container');
                UE.delEditor('container_add');
                $rootScope.pagePath = $location.path();
                $scope.apis = $.extend({},apis);
                $scope.formData = {
                    alert_id: {
                        alert_id: '',
                        alert_content: ''
                    },
                    alert_content: '',
                    site_id: {
                        site_id: '',
                        site_name: ''
                    },
                    site_name: '',
                    name: '',
                    problem_type: '',
                    server_type: '',
                    content: '',
                    source: [],
                    sites: [],
                    alerts: []
                };
                $scope.source = [];
                $scope.files = [];
                $scope.flag = true;
                ue = UE.getEditor('container_add',{
                    toolbars: [
                        ['bold','italic','underline','fontsize','forecolor','backcolor','justifyleft','justifyright','justifycenter','justifyjustify','source','link','unlink']
                    ],
                    initialFrameHeight : 150,
                    maximumWords: 1024,
                    scaleEnabled: true,
                    initialFrameWidth: 500,
                    minFrameWidth: 500
                });
                $scope.bindEvent();
                $scope.selfValid();
                $scope.initData.loading = false;
                if($stateParams.alert_id){
                    $scope.formData.site_id.site_id = $stateParams.site_id;
                    $scope.formData.site_id.site_name = $stateParams.site_name;
                    $scope.formData.alert_id.alert_id = $stateParams.alert_id;
                    $scope.formData.alert_id.alert_content = $stateParams.alert_content;
                    $scope.flag = false;
                }else {
                    $scope.getSiteOptions();
                }
            };

            /**
             * 获取站点列表
             */
            $scope.getSiteOptions = function(){
                var config = $scope.apis.getSiteOptions;
                var fnSuccess = function (d) {
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                    for(var x in data.data) {
                        $scope.formData.sites.push(data.data[x]);
                    }
                    $scope.apply();
                };
                var fnFail = function (data) {

                };
                if(!$stateParams.alert_id){

                }
                AjaxServer.ajaxInfo(config, fnSuccess ,fnFail);
            };

            /**
             * 获取告警列表
             */
            $scope.getAlertOptions = function(){
                if(!$scope.formData.site_id){
                    $scope.formData.alerts = [];
                    return false;
                }
                $scope.initData.loading = true;
                $scope.apis.getAlertOptions = $.extend({},apis.getAlertOptions);
                var config = $scope.apis.getAlertOptions;
                config.url = $scope.apis.getAlertOptions.url + '?site_id=' + $scope.formData.site_id.site_id;
                var fnSuccess = function (d) {
                    $scope.initData.loading = false;
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                    $scope.formData.alerts = data.data;
                    $scope.apply();
                };
                var fnFail = function (data) {

                };
                AjaxServer.ajaxInfo(config, fnSuccess ,fnFail);
            };

            /*
             * 上传文件触发
             */
            $scope.uploadFile = function () {
                var curNo = $(".j-file-input").length;
                var content = "<input type='file' name='file' id='J_workOrder_"+(curNo+1) + "' class='j-file-input'>";
                $("#J_fileInputContainer").append(content);
                $('#J_workOrder_'+(curNo+1)).click();
            };

            /**
             * 事件绑定
             */
            $scope.bindEvent = function () {
                $('body').on('change','.j-file-input',function(event){
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
                // $('#J_uploadFile').on('change',function (ev) {
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

            /**
             * 清空file文本框
             * @param fileId
             */
            $scope.cleanFile = function(){
                $("#J_fileInputContainer").html("");
            };

            /*
             * 创建工单
             */
            $scope.createWorkOrder = function (it) {
                it.addClass('disabled');
                $scope.initData.loading = true;
                var config = $scope.apis.createWorkOrder;
                config.data.site_id = $scope.formData.site_id.site_id;
                config.data.site_name = $scope.formData.site_id.site_name;
                config.data.alert_id = $scope.formData.alert_id.alert_id;
                config.data.alert_content = $scope.formData.alert_id.alert_content;
                config.data.name = $scope.formData.name;
                config.data.problem_type = $scope.formData.problem_type;
                config.data.server_type = $scope.formData.server_type;
                config.data.content = ue.getContent();
                config.data.source = $scope.source;
                AjaxServer.ajaxInfo(config, function (d) {
                    it.removeClass('disabled');
                    $scope.cleanFile();
                    var data = typeof(d)==='string' ? JSON.parse(d) : d;
                    $state.go('main.workOrder.handling');
                }, function (data) {
                    it.removeClass('disabled');
                    $scope.initData.loading = false;
                    $scope.errorMsg = data.message || '网络问题，请刷新页面重试';
                });
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
            /**
             * 获取有效文件输入框
             * @returns {Array}
             * @private
             */
            function _getFileInputArr(){
                var fileInputIdArr = [];
                var fileInputArr = $(".j-file-input");
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

            /**
             * 表单验证
             * @param type: 验证字段
             * @param whichForm: 添加(workOrder)
             * @returns {boolean}
             */
            $scope.validateForm = function ( type , whichForm ){
                var validDirtyObj = angular.extend({},validFormatObj,{dirty:true}),
                    validNotObj = angular.extend({},validDirtyObj,{valid:false,invalid:true});
                // 表单
                if(whichForm === 'workOrder') {
                    // 站点
                    if(!$stateParams.alert_id) {
                        if (type === 'site_id' || type === 'all') {
                            $scope.validate.workOrder.site_id = angular.extend({}, validDirtyObj);
                            if (!$scope.formData.site_id.site_id) {
                                $scope.validate.workOrder.site_id = angular.extend({}, validNotObj, {
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
                    // 告警
                    // if (type === 'alert_id' || type === 'all') {
                    //     $scope.validate.workOrder.alert_id = angular.extend({}, validDirtyObj);
                    //     if (!$scope.formData.alert_id) {
                    //         $scope.validate.workOrder.alert_id = angular.extend({}, validNotObj, {
                    //             error: {
                    //                 required: true,
                    //                 format: false,
                    //                 same: false
                    //             }
                    //         });
                    //         $scope.formData.alert_content = '';
                    //         $scope.apply();
                    //         return false;
                    //     }
                    //     $scope.formData.alert_content = '';
                    //     if($scope.formData.alert_id && $scope.formData.alert_id.alert_content){
                    //         $scope.formData.alert_content = $scope.formData.alert_id.alert_content;
                    //     }
                    // }
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
                    if (type === 'content' || type === 'all') {
                        $scope.validate.workOrder.content = angular.extend({}, validDirtyObj);
                        // if (!Validate.validLength($scope.formData.content,{maxLen:1024})) {
                        //     $scope.validate.workOrder.content = angular.extend({}, validNotObj, {
                        //         error: {
                        //             required: false,
                        //             format: true,
                        //             same: false
                        //         }
                        //     });
                        //     $scope.apply();
                        //     return false;
                        // }
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
                    workOrder:{
                        site_id:{},
                        alert_id:{},
                        name:{},
                        problem_type:{},
                        server_type:{},
                        content:{}
                    }
                };
                angular.forEach($scope.validate,function(v,k){
                    angular.forEach($scope.validate[k],function(n,i) {
                        $scope.validate[k][i] = angular.extend({}, validFormatObj);
                    });
                });
            };

            /**
             * 上传文件
             */
            $scope.upLoadFileAndCommitForm = function (ev) {
                var it = $(ev.target);
                if($scope.validateForm('all','workOrder')) {
                    $scope.createWorkOrder(it);
                }
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
            };

            $scope.apply = function() {
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            };
        }]);
