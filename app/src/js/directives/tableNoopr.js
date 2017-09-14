/**
 * @ngdoc function
 * @name myappApp.directive:tableNoopr
 * @description
 * # SysConfigCtrl
 * Controller of the myappApp
 * author: james
 */

 angular.module('myappApp')
.directive('tableNoopr', function() {
    'use strict';
	return {
		restrict: "EAC",
		templateUrl: 'views/public/table-noopr.html',
		replace: true,
		scope: {
			thobj: '=',
			tbobj: '=',
            colspan: '=',
			getListError: '=',
			loading: '=',
		},
		controller: function($scope) {

		}
	};
});
