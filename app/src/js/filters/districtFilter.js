/**
 * @ngdoc function
 * @name myappApp.districtFiler
 * @description
 * # dateFiler
 * Controller of the myappApp
 * author: james
 */

 angular.module('myappApp')
 .filter('districtFiler', function(){
    'use strict';
 	return function(str){
 	    if(str && str.length > 1 && (str.charAt(str.length-1) == '市' || str.charAt(str.length-1) == '省')) {
            str = str.substr(0, str.length-1);
            return str;
        }else{
 	        return str;
        }
 	};
 });
