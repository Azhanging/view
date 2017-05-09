import View from './init';

(function(global, factory) {
	if(typeof exports === 'object' && typeof module !== 'undefined' ){
		module.exports = factory();
	}else if(typeof define === 'function' && define.amd){
		define(factory);
	}else if(typeof _require === 'function'){
		_require.define('View', factory);
	}else{
		(global?(global.View = factory()):{});	
	}
})(typeof window !== 'undefined' ? window : this, function() {
	
	View.version = "v1.1.2";
	
	View.versionDescription = "";

	return View;
});