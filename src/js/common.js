 /** 
  * @description : the script of 项目公共JS
  * @authors : hanjw (hanjw@fengniao.com)
  * @date :  2017-12-26 15:50:30
  * @version : 1.0
  */

 // 禁用路由
 if(!!$){
	$.config = {
	 	// 路由功能开关过滤器，返回 false 表示当前点击链接不使用路由
	 	routerFilter: function($link) {
	 		// 某个区域的 a 链接不想使用路由功能
	 		if ($link.is('.disable-router a')) {
	 			return false;
	 		}

	 		return true;
	 	}
	 };
 } 


(function isWeiXin() {

 	// let ua = window.navigator.userAgent.toLowerCase();

 	// if (ua.match(/MicroMessenger/i) == 'micromessenger') {  
 	// 	$('header.page-header').remove(); 
 	// } else { 
 	// 	$('header.page-header').css({
 	// 		'display' : 'block'
 	// 	});
 	// }

 })()