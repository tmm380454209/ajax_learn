~function(){

//->createXHR:创建一个AJAX对象，兼容所有的浏览器
function createXHR(){
	var xhr = null,
		ary = [
			function(){
				return new XMLHttpRequest();
			},
			function(){
				return new ActiveXObject("Microsoft.XMLHTTP");
			},
			function(){
				return new ActiveXObject("Msxml2.XMLHTTP");
			},
			function(){
				return new ActiveXObject("Msxml3.XMLHTTP");
			}
		];
	for (var i = 0; i < ary.length; i++) {
		var curFn = ary[i];
		try{
			xhr = curFn();
			//本次循环获取的方法执行没有出现错误，说明此方法是我想要的，我们下一次直接执行这个方法即可，这需要我们把createXHR重写为小方法
			createXHR = curFn;
			flag = true;
			break;
		}catch(e){
			//出现错误 继续下一次循环

		}
		
	}
	if(!flag){
		throw  new Error ("Don't support AJAX");
	}
	return xhr;
}

//->ajax：实现AJAX请求的公共方法;
//当一个方法传递的参数值过多，而且还不固定，我们使用对象统一传值法（把需要传递的参数先放在一个对象中，一起传递进去即可）
function ajax(options){
	//，默认值
	var _default = {
		url:"", //请求地址
		type:"get", //请求方式
		dataType:"json",//设置请求回来的内容格式“JSON”：
		async:true, //请求是同步还是异步
		data:null, //放在请求主体中的内容(post)
		getHead:null,  //当ready state === 2的时候执行的回调方法
		success:null  //当ready state === 4的时候执行的回调方法
	};

	//使用用户传递进来的值覆盖默认值
	for (var key in options) {
		if(options.hasOwnProperty(key)){
			_default[key] = options[key];
		}
	}

	//如果是get请求，需要清除缓存
	if(_default.type === "get"){
		_default.url.indexOf("?")>=0?_default.url+="&":_default.url+="?";
		_default.url +="_="+Math.random();
	}


	//send ajax
	var xhr = createXHR();
	xhr.open(_default.type,_default.url,_default.async);
	xhr.onreadystatechange=function(){
		if(/^2\d{2}$/.test(xhr.status)){
			if(xhr.readyState === 2){
				//想要在readyState 等于2 的时候 做一些操作,需要保证ajax是异步请求。
				if(typeof _default.getHead === "function"){
					_default.getHead.call(xhr);
				}
				
			}
 
			if(xhr.readyState === 4){
				var val = xhr.responseText;
				//
				if(_default.dataType === "json"){
					val = "JSON" in window?JSON.parse(val):eval("("+val+")");
				}
				_default.success && _default.success.call(xhr,val);
			}



		}
	};

	xhr.send(_default.data);




	}
window.ajax = ajax;
}();


ajax({
	url:"data.txt",
	type:"get",
	dataType:"json",
	async:false,
	getHead:function(){
		//this ->xhr当前ajax对象
	},
	success:function(data){
		//data:我们从服务器获取到的内容
	}
});