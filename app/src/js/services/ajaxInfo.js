angular.module('myappApp')
  	.service('AjaxServer', function($location, $http, $cookieStore, $rootScope, $state, sessionStore){
  		$rootScope.$broadcast('updateLogin');
  		this.pathStr = $location.path();
  		this.ajaxInfo = function( config , fnSuccess, fnFail ) {
            if(!config || !config.url || '' === config.url){
                console.log('ajax config error');
                return false;
            }
            return $http({
                method: config.method || 'get',
                data: config.data || '',
                params: config.method == 'get' ? config.data || '' : '',
                responseType: config.responseType || 'json',
                headers: {'Authorization' : 'Onekeeper '+ sessionStore.get('token')},//config.headers,
                url: config.url
            }).success(function(data,status,headers,config){
            	data = data || {};
            	if(data.code){
            		if(status == 401 && sessionStore.get('partnerFlag')!='true'){
                        $state.go("login");
            		}else if(status == 401 && sessionStore.get('partnerFlag')=='true'){
                        $state.go("onekeeper");
                    }
            		if(status == 402){
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
                if((status == 401 || status == 400) && sessionStore.get('partnerFlag')!='true'){
                    $state.go("login");
                }else if((status == 401 || status == 400)  && sessionStore.get('partnerFlag')=='true'){
                    $state.go("onekeeper");
                }
            	if(data.code){
            		//$('.modal-backdrop').remove();
            		if(status == 402){
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
