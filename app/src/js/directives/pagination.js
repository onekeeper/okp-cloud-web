'use strict';

/**
 * @ngdoc function
 * @name myappApp.directive:pagerDirective
 * @description
 * Controller of the myappApp
 */

 angular.module('myappApp')
.directive('pagerDirective', function() {
	return {
		restrict: "EAC",
		templateUrl: 'views/public/pagination.html',
		replace: true,
		scope: {
			pager: '=',        // 分页对象
            func: '=',         // 获取列表方法名
            formatState: '=',  // 初始化状态方法名
            tbh:'=',           // 表格的总高度
            trh:'=',           // 表格单行的高度
            pslgst:'='         // pageSize最大值
		},
		compile: function(tElement, tAttrs, transclude) {
			return function(scope, iElement, iAttrs) {
                /**
                 * pager的默认值
                 * @type {{curPage: number, totalPage: number, total: number, pageSize: string, pageSizeOptions: array}}
                 */
                scope.pager = {
                     curPage: 1,                                                          // 当前页码
                     totalPage: 0,                                                        // 总页数
                     total: 0,                                                            // 总条数
                     pageSize: (function( tableHeight , trHeight ){                       // 每页显示（页面可选择）
                        //return ( ~~(tableHeight / trHeight) || 1 ) + '';
                        return 10;
                     })( scope.tbh , scope.trh ),
                     pageSizeOptions: (function(largest){                                 // 每页条数选项,largest为每页条数最大值
                         var arr = [10,20,30,40,50];
                         //for(var i = 0; i < largest; i++) arr[i] = i + 1 + '';
                         return  arr;
                     })( scope.pslgst || 50 )
                 };

                /**
                 * 监听pageSize变化
                 */
                // scope.$watch('pager.pageSize',function ( newVal,oldVal ) {
                //     if( newVal && +newVal !== +oldVal ){
                //         scope.pager.pageSize = newVal + '';
                //     }else{
                //         scope.pager.pageSize = oldVal + '';
                //     }
                //     scope.pager.curPage = 1;
                //     _loadingData ();
                // });

                /**
                 * 页面跳转
                 * @param targetPage：目标页
                 */
                scope.gotoPage = function ( targetPage ) {
                    if(typeof targetPage === 'string'){
                        if(targetPage === 'Prev'){
                            if(scope.pager.curPage <= 1) return false;
                            scope.pager.curPage--;
                        }
                        if(targetPage === 'Next'){
                            if(scope.pager.curPage >= scope.pager.totalPage) return false;
                            scope.pager.curPage++;
                        }
                    }else{
                        scope.pager.curPage = +targetPage;
                    }
                    _loadingData ();
                };

                /**
                 * 每页显示事件
                 * @private
                 */
                scope.changePageSize = function (pageSize) {
                    scope.pager.pageSize = pageSize;
                    scope.pager.curPage = 1;
                    _loadingData ();
                };

                function _loadingData () {
                    if(scope.formatState) scope.$parent[scope.formatState]();
                    if(scope.func) scope.$parent[scope.func]();
                }

			}
		}
	}
})
