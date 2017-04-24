import View from './init';

(function(global, factory) {
	//封装在模块加载器中
	(typeof _require === 'function' ? _require.define('View', factory) : (global.View = factory()));
})(typeof window !== 'undefined' ? window : this, function() {
	
	View.version = "v1.0.1";
	
	View.versionDescription = "属性过滤器，优化事件代码，添加template模板中的$index的支持";
	
	//全局调用过滤器
	global.$F = View.$F.bind(View);
	
	//AMD module
	if(typeof define === "function" && define.amd) {
		define("View", [], function() {
			return View;
		});
	}
	
	return View;
});