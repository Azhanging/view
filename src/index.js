import View from './init';

(function(global, factory) {
	//封装在模块加载器中
	(typeof _require === 'function' ? _require.define('View', factory) : (global.View = factory()));
})(typeof window !== 'undefined' ? window : this, function() {
	
	View.version = "v1.0.0";
	
	View.versionDescription = "移植旧版功能，细化更新，优化了for的算法";
	
	//AMD module
	if(typeof define === "function" && define.amd) {
		define("View", [], function() {
			return View;
		});
	}
	
	return View;
});