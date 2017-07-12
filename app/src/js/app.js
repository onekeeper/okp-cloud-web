'use strict';

/**
 * @ngdoc overview
 * @name myappApp
 * @description
 * # myappApp
 *
 * Main module of the application.
 * version: 1.5.0
 */
angular
  .module('myappApp', [
    'ngCookies',
    'ui.router'
  ])
  .constant('urlPrefix', '/api/v1')
  .config(function ($stateProvider, $urlRouterProvider) {
    	$urlRouterProvider
    	.when("", "/login")
    	.when('/', "/login")
		.when('/500', '500.html')
	    .when('/400', '400.html')
		.when('/404', '404.html')
		.when('/402', 'authError.html')
		.otherwise('/login');

		$stateProvider
		.state("login", {
			url: "/login",
			templateUrl: "views/login/index.html",
			controller: "LoginCtrl"
		})
		.state("main", {
     		url: "/main",
            templateUrl: "views/index.html",
            controller: "HeaderCtrl"
		})
		.state("main.home", {
			url: "/home",
			templateUrl: "views/home/index.html",
			controller: "HomeCtrl"
		})
		.state("main.warning", {//历史告警查询
			url: "/warning",
			templateUrl: "views/warning/index.html",
			controller: "warningCtrl"
		})
		.state("main.notice", {//历史通知查询
			url: "/notice",
			templateUrl: "views/notice/index.html",
			controller: "noticeCtrl"
		})
		.state("main.noticeRule", {//通知规则
			url: "/noticeRule",
			templateUrl: "views/noticeRule/index.html",
			controller: "noticeRuleCtrl"
		})
		.state("main.mNoticeRule", {//管理员通知规则
			url: "/mNoticeRule",
			templateUrl: "views/mNoticeRule/index.html",
			controller: "mNoticeRuleCtrl"
		})
		.state("main.mAuthorizeManage", {//授权管理
			url: "/mAuthorizeManage",
			templateUrl: "views/mAuthorizeManage/index.html",
			controller: "mAuthorizeManageCtrl"
		})
		.state("main.mUserManage", {//人员管理
			url: "/mUserManage",
			templateUrl: "views/mUserManage/index.html",
			controller: "mUserManageCtrl"
		})
		.state("main.mSiteManage", {//站点管理
			url: "/mSiteManage",
			templateUrl: "views/mSiteManage/index.html",
			controller: "mSiteManageCtrl"
		})
  });
