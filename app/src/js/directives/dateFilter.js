'use strict';

/**
 * @ngdoc function
 * @name myappApp.dateFiler
 * @description
 * # dateFiler
 * Controller of the myappApp
 * author: wein
 */

 angular.module('myappApp')
 .filter('dateFilter', function(){
 	return function(time){
 		var bjTime = new Date(time)
 		var res = bjTime.getFullYear() + '-' + (bjTime.getMonth() + 1) + '-' + bjTime.getDate() + ' ' + bjTime.getHours() + ':' + bjTime.getMinutes() + ':' + bjTime.getSeconds(); 
 		return res 
 	}
 })