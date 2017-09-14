/**
 * @ngdoc function
 * @name myappApp.directive:modalDirective
 * @description
 * Controller of the myappApp
 * author: james
 */

 angular.module('myappApp')
.directive('modalDirective', function() {
    'use strict';
	return {
		restrict: "EAC",
		templateUrl: 'views/public/modal.html',
		replace: true,
		transclude: true
		/*
		compile: function(tElement, tAttrs, transclude) {
			return function(scope, iElement, iAttrs) {
				scope.$watch('msg', function(newVal, oldVal){
					if(newVal != oldVal && newVal != ""){
						iElement.modal('show');
					}
				});
				tElement.on('hidden.bs.modal', function () {
			    	 scope.msg = "";
			    	 scope.$apply();
			    })
			}
		}
		*/
	};
});
