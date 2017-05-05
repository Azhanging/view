import View from './init';

(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	typeof _require === 'function' ? _require.define('View', factory) :
	(global?(global.View = factory()):{});
})(typeof window !== 'undefined' ? window : this, function() {
	
	View.version = "v1.1.2";
	
	View.versionDescription = "";

	return View;
});