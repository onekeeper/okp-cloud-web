/**
* 工具箱相关js
* 作者：郭荣
*/
var apiGetToolListUrl = 'toolBoxDemo.json';//得到工具列表接口（需要换成线上真实接口地址）
var initToolList = null;
var initToolObj = null;

$(document).ready(function(){
	init();//初始化得到数据
	bindEvent();//绑定事件
});

function init(){
    if(!!initToolList){
    	createToolPanel();
    }else{
    	getToolList();
    }
}

function getToolList(){
	$.ajax({
		type: "GET",
		url: apiGetToolListUrl,
		async:false,
		dataType:"json",
		success: function(data){
			console.log("获取信息成功！");
			initToolList = typeof(data) == 'string' ? JSON.parse(data) : data;
			createToolPanel();
		},
		error:function(){
			console.log("获取信息失败！");
			$("#J_errorMsg").html('网络问题，请刷新页面重试');
		}
	});
}

function getInitToolObj(toolId){
	if(!!initToolList){
		$(initToolList).each(function(i,toolObj) {
			if(toolId == toolObj.toolId){
				initToolObj = toolObj;
				createDetail();
			}
		});
	}
}

function bindEvent(){
	$('body').on('click', '.toolBox-button', function () {
		var toolId = $(this).attr('data-id');
		if(!!toolId){
			window.location.href="toolDetail.html?id="+toolId;
		}
	});

	$('body').on('click', '.back-button', function () {
		window.history.back();
	});

}

function createToolPanel(){
	$("#J_tool_panel").html("");
	if(!!initToolList){
		var htmlStr = '';
		$(initToolList).each(function(i,toolObj) {
			htmlStr += '<div class="one-tool col-lg-1 col-md-3 col-sm-6 col-xs-12">' +
                '<img class="toolBox-button" src="../../src/images/toolBox/' + toolObj.toolDir + '" data-id="' + toolObj.toolId + '">' +
                '<p>' + toolObj.toolName + '</p>' +
                '</div>';
		});
		// console.log(htmlStr);
		$("#J_tool_panel").html(htmlStr);
	}
}

function createDetail(){
	$("#J_tool_detail_panel").html("");
	if(!!initToolObj){
		var htmlStr = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 tool-top-panel ">' +
            '<img src="../../src/images/toolBox/' + initToolObj.toolDir + '">' +
            '<strong>' + initToolObj.toolName + '</strong>' +
            '</div>' +
            '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 tool-top-panel text-r">' +
            '<a role="button" class="btn button-blue back-button">返回</a>' +
            '<a role="button" class="btn button-blue back-downLoad">下载</a>' +
            '</div>' +
            '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 tool-text">' +
            '<h4>应用介绍</h4>' +
            '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
            initToolObj.toolText +
            '</div>' +
            '</div>';
		// console.log(htmlStr);
		$("#J_tool_detail_panel").html(htmlStr);
	}else{
		console.log("获取信息失败！");
		$("#J_errorMsg").html('网络问题，请刷新页面重试');
	}
	window.location.href="toolDetail.html?toolId="+toolId;
}


