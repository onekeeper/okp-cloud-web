'use strict';

/**
 * @ngdoc function
 * @name myappApp.directive:SysConfigCtrl
 * @description
 * # SysConfigCtrl
 * Controller of the myappApp
 * author: tangb
 */

 angular.module('myappApp')
.directive('tableNoopr', function() {
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
	}
})
