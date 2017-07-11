'use strict';

/**
 * @ngdoc function
 * @name myappApp.service:localStore and sessionStore
 * @description
 * # 客户端存储 localStore 和 sessionStore
 * service of the myappApp
 */
angular.module('myappApp')
    .factory('localStore',['$window',function($window){
        return {
            // 存储单个属性
            set: function (key,value) {
                $window.localStorage[key]=value;
            },
            // 读取单个属性
            get: function (key,defaultValue) {
                return  $window.localStorage[key] || defaultValue;
            },
            // 存储对象，以JSON格式存储
            setObject: function (key,value) {
                $window.localStorage[key]=JSON.stringify(value);
            },
            // 读取对象
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            // 删除某项 “key” 为string
            remove: function (key){
                $window.localStorage.removeItem(key);
            },
            // 清空
            clear: function () {
                $window.localStorage.clear();
            }
        };
    }])
    .factory('sessionStore',['$window',function($window){
        return {
            set: function (key,value) {
                $window.sessionStorage.setItem(key,value);
            },
            get: function (key,defaultValue) {
                return  $window.sessionStorage.getItem(key) || defaultValue;
            },
            setObject: function (key,value) {
                $window.sessionStorage.setItem(key,JSON.stringify(value));
            },
            getObject: function (key) {
                return JSON.parse($window.sessionStorage.getItem(key) || '{}');
            },
            remove: function (key){
                $window.sessionStorage.removeItem(key);
            },
            clear: function () {
                $window.sessionStorage.clear();
            }
        };
    }]);