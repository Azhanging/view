import View from './init';

(function(global, factory) {
	//封装在模块加载器中
	(typeof _require === 'function' ? _require.define('View', factory) : (global.View = factory()));
})(typeof window !== 'undefined' ? window : this, function() {
	
	View.version = "v0.0.1";
	
	View.versionDescription = "vdom";
	
	//AMD module
	if(typeof define === "function" && define.amd) {
		define("View", [], function() {
			return View;
		});
	}
	
	return View;
});