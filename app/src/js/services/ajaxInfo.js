angular.module('myappApp')
  	.service('AjaxServer', function($location, $http, $cookieStore, $rootScope){
  		$rootScope.$broadcast('updateLogin');
  		this.pathStr = $location.path();
  		this.ajaxInfo = function( config , fnSuccess, fnFail ) {
            if(!config || !config.url || '' == config.url){
                console.log('ajax config error');
                return false;
            };
            return $http({
                method: config.method || 'get',
                data: config.data || '',
                params: config.method == 'get' ? config.data || '' : '',
                responseType: config.responseType || 'json',
                headers: {'Authorization' : 'Onekeeper '+ $cookieStore.get('token')},//config.headers,
                url: config.url
            }).success(function(data,status,headers,config){
            	data = data || {};
            	if(data.code){
            		$('.modal-backdrop').remove();
            		if(data.code == '401'){
            			$location.path('/login').search({'redirectUrl':this.pathStr});
            		}
            		if(data.code == '402'){
            			$rootScope.$broadcast('updateLogin');
            			$location.path('/402');
            		}
                    if( fnSuccess ){
                        fnSuccess(data);
                    }else{
                        console.log(data);
                    }
            	}
            }).error(function(data,status,headers,config){
            	data = data || {};
            	if(data.code){
            		$('.modal-backdrop').remove();
            		if(data.code == '401'){
            			$location.path('/login').search({'redirectUrl':this.pathStr});
            		}
            		if(data.code == '402'){
            			$rootScope.$broadcast('updateLogin');
            			$location.path('/402');
            			if( fnSuccess ){
                            fnSuccess(data);
                        }
            		}
                    if( fnFail ){
                        fnFail(data);
                    }else{
                        console.log(status);
                    }
            	}else{
	                if( fnFail ){
	                    fnFail(data);
	                }else{
	                    console.log(status);
	                }
            	}
            });
  		};
  	});
