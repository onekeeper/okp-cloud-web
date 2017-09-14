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
  .config(['$stateProvider','$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {
        'use strict';

  		var timestamp = Date.parse( new Date());//时间戳清空缓存

    	$urlRouterProvider
    	.when("", "/login")
    	.when('/', "/login")
		.otherwise('/login');

		$stateProvider
		.state("login", {
			url: "/login",
			templateUrl: "views/login/index.html?"+timestamp,
			controller: "LoginCtrl"
		})
        .state("onekeeper", {
            url: "/onekeeper",
            templateUrl: "views/login/onekeeper.html?"+timestamp,
            controller: "superLoginCtrl"
        })
		.state("main", {
     		url: "/main",
            templateUrl: "views/index.html?"+timestamp,
            controller: "HeaderCtrl"
		})
		.state("main.home", {
			url: "/home",
			templateUrl: "views/home/index.html?"+timestamp,
			controller: "HomeCtrl"
		})
        .state("main.untreated", {//未处理告警
            url: "/untreated",
            templateUrl: "views/untreated/index.html?"+timestamp,
            controller: "untreatedCtrl"
        })
		.state("main.warning", {//历史告警查询
			url: "/warning",
			templateUrl: "views/warning/index.html?"+timestamp,
			controller: "warningCtrl"
		})
		.state("main.notice", {//历史通知查询
			url: "/notice",
			templateUrl: "views/notice/index.html?"+timestamp,
			controller: "noticeCtrl"
		})
		.state("main.noticeRule", {//通知规则
			url: "/noticeRule",
			templateUrl: "views/noticeRule/index.html?"+timestamp,
			controller: "noticeRuleCtrl"
		})
		.state("main.mNoticeRule", {//管理员通知规则
			url: "/mNoticeRule",
			templateUrl: "views/mNoticeRule/index.html?"+timestamp,
			controller: "mNoticeRuleCtrl"
		})
		.state("main.mAuthorizeManage", {//授权管理
			url: "/mAuthorizeManage",
			templateUrl: "views/mAuthorizeManage/index.html?"+timestamp,
			controller: "mAuthorizeManageCtrl"
		})
		.state("main.mUserManage", {//人员管理
			url: "/mUserManage",
			templateUrl: "views/mUserManage/index.html?"+timestamp,
			controller: "mUserManageCtrl"
		})
		.state("main.mSiteManage", {//站点管理
			url: "/mSiteManage",
			templateUrl: "views/mSiteManage/index.html?"+timestamp,
			controller: "mSiteManageCtrl"
		})
        .state("main.sPartner", {//合作伙伴
            url: "/partner",
            templateUrl: "views/sPartnerManage/index.html?"+timestamp,
            controller: "sPartnerManageCtrl"
        })
        .state("main.sPartnerCount", {//合作伙伴统计
            url: "/partnerCount",
            templateUrl: "views/sPartnerCount/index.html?"+timestamp,
            controller: "sPartnerCountCtrl"
        })
        .state("500", {
            url: "/500",
            templateUrl: "500.html?"+timestamp,
            controller: ""
        })
        .state("400", {
            url: "/400",
            templateUrl: "400.html?"+timestamp,
            controller: ""
        })
        .state("404", {
            url: "/404",
            templateUrl: "404.html?"+timestamp,
            controller: ""
        })
        .state("402", {
            url: "/402",
            templateUrl: "authError.html?"+timestamp,
            controller: ""
        });
  }]);
