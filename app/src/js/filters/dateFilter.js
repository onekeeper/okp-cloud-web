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
    'use strict';
 	return function(time){
        time = time.replace(/-/g,'/');
        time = time.replace(/T/g,' ');
 		var date = new Date(time);
        date.setHours (date.getHours () + 8);
 		var symbol1 = "-";
 		var symbol2 = ":";
 		var month = date.getMonth() + 1;
 		var day = date.getDate();
 		var hour = date.getHours();
 		var minute= date.getMinutes();
 		var second = date.getSeconds();
 		if (month >= 1 && month <= 9) {
 			month = "0" + month;
 		}
 		if (day >= 0 && day <= 9) {
 			day = "0" + day;
 		}
 		if (hour >= 1 && hour <= 9) {
 			hour = "0" + hour;
 		}
 		if (minute >= 0 && minute <= 9) {
 			minute = "0" + minute;
 		}
 		if (second >= 0 && second <= 9) {
 			second = "0" + second;
 		}
 		var res = date.getFullYear() + symbol1 + month + symbol1 + day + " " + hour + symbol2 + minute + symbol2 + second;
 		return res;
 	};
 });
