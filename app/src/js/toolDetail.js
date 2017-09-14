/**
* 工具箱相关js
* 作者：郭荣
*/
var apiGetToolListUrl = 'toolBoxDemo.json';//得到工具列表接口（需要换成线上真实接口地址）
var initToolId = null;
var initToolObj = null;
var initToolUrl = '#';

$(document).ready(function(){
	init();//初始化得到数据
	bindEvent();//绑定事件
});


function init(){
    initToolId = getQueryString('id');
    console.log("获取参数信息为"+initToolId);
    if(!!initToolId){
    	getToolObj(initToolId);
    }else{
    	console.log("获取信息失败！");
		$("#J_errorMsg").html('网络问题，请刷新页面重试');
    }
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r !== null) return unescape(r[2]); return null;
}

function getToolObj(toolId){
	$.ajax({
		type: "GET",
		url: apiGetToolListUrl,
		async:false,
		dataType:"json",
		success: function(data){
			console.log("获取信息成功！");
			var result = typeof(data) == 'string' ? JSON.parse(data) : data;
			getInitToolObj(result,toolId);
		},
		error:function(){
			console.log("获取信息失败！");
			$("#J_errorMsg").html('网络问题，请刷新页面重试');
		}
	});
}

function getInitToolObj(initToolList,toolId){
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
	$('body').on('click', '.back-button', function () {
		window.history.back();
	});
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
            '<a role="button" class="btn button-blue" href="' + initToolObj.toolUrl + '" download="">下载</a>' +
            '</div>' +
            '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 tool-text">' +
            '<h4>应用介绍</h4>' +
            '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
            initToolObj.toolText + '</div></div>';
		// console.log(htmlStr);
		$("#J_tool_detail_panel").html(htmlStr);
	}else{
		console.log("获取信息失败！");
		$("#J_errorMsg").html('网络问题，请刷新页面重试');
	}
}


