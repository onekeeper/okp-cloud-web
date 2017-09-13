/**
 * @ngdoc function
 * @name myappApp.directive:SysConfigCtrl
 * @description
 * # SysConfigCtrl
 * Controller of the myappApp
 * author: tangb
 */

 angular.module('myappApp')
.directive('showDirective', function() {
    'use strict';
	return {
		restrict: "EAC",
		templateUrl: 'views/public/showModel.html',
		replace: true,
		transclude: true,
		draggable: true

	}
});
