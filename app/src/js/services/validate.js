'use strict';
/**
 * 通用验证服务
 * modified by:
 * description: 用于表单验证，可提供非空，长度范围等校验
 */
angular.module('myappApp')
  	.service('Validate', function($location, $http){
    var self = this;
	/*
	*  validEmpty  非空校验
	*  param: value 需要验证的数据
	*/
	this.validEmpty = function(value, msgObj){
		if(!value){
			return false;
		}
		value = $.trim(value);
		if(value == '' || value.length == 0){
			return false;
		}else{
			return true;
		}
	};

    /*
	*  validEqual  相同校验
	*  param: value1，value2 需要验证的数据
	*/
	this.validEqual = function(value1,value2){
        if(!value1 || !value2 || value1==null || value2==null){
			return true;
		}
        value1 = $.trim(value1);
        value2 = $.trim(value2);
        if(value1===value2 && value1.indexOf(value2)>-1 && value2.indexOf(value1)>-1){
            return true;
        }
        else{
            return false;
        }
	};

	/*
	*  validTime  时间校验
	*  param: str 需要验证的数据
	*/
	this.validTime = function(str){
		var regDate = /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1} ([0-2][0-9]):([0-5][0-9]):([0-5][0-9])$/;
		return regDate.test(str);
	};

	/*
	*  validDate  日期校验
	*  param: str 需要验证的日期
	*/
	this.validDate = function(str){
		var regDate = /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/;
		return regDate.test(str);
	};

	/*
	*  validClock  时间“--：--：--”校验
	*  param: str 需要验证的数据
	*/
	this.validClock = function(str){
		var regTime = /^([0-2][0-9]):([0-5][0-9]):([0-5][0-9])$/;
		return regTime.test(str);
	};

	/*
	*  validEmail  邮箱校验
	*  param: str 需要验证的数据
	*/
	this.validEmail = function(str){
		var regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		return regEmail.test(str);
	};

	/*
	*  validTel  联系方式校验
	*  param: str 需要验证的数据
	*/
	this.validTel= function(str){
		var regPhone = /^1[3|4|5|7|8]\d{9}$/,
			regTel = /^(\(\d{3,4}\)|\d{3,4}-|\s){1}\d{7,14}$/;
		return regPhone.test(str) || regTel.test(str);
	};

	/*
	*  validIp  Ip校验
	*  param: str 需要验证的数据
	*/
	this.validIp = function(str){
		var regIp = /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/,
			regIp2 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		return regIp.test(str) || regIp2.test(str);
	};

	/*
	*  validPort  端口校验
	*  param: str 需要验证的数据
	*/
	this.validPort = function(str){
		var regPort = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
		return regPort.test(str);
	};

	/*
	*  validHash  密码校验
	*  param: str 需要验证的数据
	*/
	this.validHash = function(str){
		var regPwd = /((?=.*[0-9])|(?=.*[a-z])(?=.*\d)|(?=[a-z])(?=.*[#@!~%^&*])|(?=.*\d)(?=.*[#@!~%^&*]))[a-z\d#@!~%^&*]{5,}/i;
		return regPwd.test(str);
	};

	/*
	*  validComplexHash  复杂密码校验（8-20位，数字和字母的组合）
	*  param: str 需要验证的数据
	*/
	this.validComplexHash = function(str){
		// var reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,20}$/;
		var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
        return reg.test(str);
	};

	/*
	*  validAppointedSign  指定特殊符号校验
	*  param: str 需要验证的数据
	*/
	this.validAppointedSign = function(str){
		var flag = true,
		specialWords = ['!','@','#','~',',','.','。','，','/','?','%','&','='];
		$.each(specialWords, function(k,v){
			if(!!str && str.indexOf(v) > -1){
				flag = false;
				return false;
			}
		});
		return flag;
	};

	/*
	*  validSign  所有特殊符号校验
	*  param: word 需要验证的数据
	*/
	this.validSign = function(word){
		var backInfo = {},
			last = word.replace(/\w|\d|[\u2E80-\u9FFF]/g,'');
		if(last.length>0){
			var err = last.split('').map(function(i){
				return " "+i+" ";
			});
			err = self._uniq(err);

			if(!!err && err.length!=0){
				err = err.join(", ");
				backInfo.status = false;
				backInfo.error = "名称中不能含有特殊符号  " + err;
			}
		}
		else{
			backInfo.status = true;
		}

		return backInfo;
	}

	/*
	*  validChinese  中文校验
	*  param: str 需要验证的数据
	*/
	this.validChinese = function(str){
		var re = /^([\u4E00-\u9FA5]+，?)+$/;   //判断字符串是否为中文或中文逗号
	    if(!re.test(str)){
	    	return false;
	    }else{
	    	return true;
	    }
	};

	/*
	 *  validEnglish  英文校验
	 *  param: str 需要验证的数据
	 */
	this.validEnglish = function(str){
		var re = /^[A-Za-z]+$/;   //判断字符串是否为英文字母
		if(re.test(str)){
			return true;
		}else{
			return false;
		}
	};

	/*
	*  validNumber 数字校验
	*  param: text 需要验证的数据
	*  param: type 数字类型
	*/
	this.validNumber = function(text,type){
		var re = null;
		if(type=='integer'){
			re=/^[1-9]+[0-9]*]*$/;
		    if(!re.test(text)){
		    	return false;
		    }else{
		    	return true;
		    }
		}else if(type=='short'){
	        re=/^-([0-2]\d{4}|3[0-1]\d{3}|32[0-6]\d{2}|327[0-5]\d|3276[0-8]|\d{1,4})$|^([0-2]\d{4}|3[0-1]\d{3}|32[0-6]\d{2}|327[0-5]\d|3276[0-7]|\d{1,4})$/;
	        if(!re.test(text)){
	            return false;
	        }else{
	            return true;
	        }
		}else if(type=='int'){
	        re=/^-([0-2]\d{8}|3[0-1]\d{9}|32[0-6]\d{7}|327[0-5]{6}\d|3276[0-8]|\d{1,10})$|^([0-2]\d{10}|3[0-1]\d{9}|32[0-6]\d{8}|327[0-5]\d{7}|3276[0-7]{6}|\d{1,10})$/;
	        if(!re.test(text)){
	            return false;
	        }else{
	            return true;
	        }
		}else if(type=='long'){
	        re=/^-([0-1]\d{9}|20\d{8}|21[0-3]\d{7}|214[0-6]\d{6}|2147[0-3]\d{5}|21474[0-7]\d{4}|214748[0-2]\d{3}|2147483[0-5]\d{2}|21474836[0-3]\d{1}|214748364[0-8])|^([0-1]\d{9}|20\d{8}|21[0-3]\d{7}|214[0-6]\d{6}|2147[0-3]\d{5}|21474[0-7]\d{4}|214748[0-2]\d{3}|2147483[0-5]\d{2}|21474836[0-3]\d{1}|214748364[0-7])$/;
	        if(!re.test(text)){
	            return false;
	        }else{
	            return true;
	        }
	    }else if(type=='decimal' || type=='float' || type=='double'){
	        re=/^-?([0-9]|\d)+\.([0-9]|\d)+$/;
	        if(!re.test(text)){
	            return false;
	        }else{
	            return true;
	        }
	    }
	};


	/*
	*  validNaturalNum  正整数校验
	*  param: str 需要验证的数据
	*/
	this.validNaturalNum = function(str){
		var re =  /^[1-9]+[0-9]*]*$/;   //判断字符串是否为正整数
	    if(!re.test(str)){
	    	return false;
	    }else{
	    	return true;
	    }
	};

	/*
	*  validLength  长度校验
	*  param: str 需要验证的数据
	*         lengthRange(object) 长度范围
	*         lengthRange.minLen: 最小长度，默认为0
	*         lengthRange.maxLen: 最大长度，默认为25
	*/
	this.validLength = function(str, lengthRange){
		if(!str || str.length == 0 || typeof(str)!='string'){
			return false;
		}
		var minLen = lengthRange ? lengthRange.minLen || 0 : 0;
		var maxLen = lengthRange ? lengthRange.maxLen || 25 : 25;
		var realLen = self._getRealLen(str);
//		return minLen*2 <= realLen && realLen <= maxLen*2;
		return minLen <= realLen && realLen <= maxLen;
	};

	/*
	*  _getRealLen
	*  获取字符长度，1个中文为2个字符长度，1个英文为1个字符长度
	*/
	this._getRealLen = function(str){
		var len = 0;
		if(!str || str==''){
            return len;
        }
        var realLength = 0,
            charCode = -1;
            len = str.length;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128){
                realLength += 1;
            }else{
                realLength += 2;
            }
        }
		return realLength;
	};

	/*
	 * _uniq
	 */
	this._uniq = function(arr){
		var result = [];
		for(var i=0;i<arr.length;i++){
			var flag = self._isRepeat(arr, arr[i]);
			if(typeof(flag) == 'boolean'){
				result.push(arr[i]);
			}else{
				if(i == flag){
					result.push(arr[i]);
				}
			}
		}
		return result;
	};

	/*
	 * _isRepeat
	 */
	this._isRepeat = function(arr,a){
		var k = 0,m = 0;
		for(var i=0; i<arr.length; i++){
			if(arr[i] == a){
				++ k;
				if(k == 1){
					m = i;
				}
			}
		}
		if(k>1){
			return m;
		}else{
			return false;
		}
	}

});
