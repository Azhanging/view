/*!
 * 
 * 			View.js v1.1.2
 * 			(c) 2016-2017 Blue
 * 			Released under the MIT License.
 * 		
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("View", [], factory);
	else if(typeof exports === 'object')
		exports["View"] = factory();
	else
		root["View"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getEl(id) {
	return document.getElementById(id);
}

//拆分数据
function disassembly(text) {
	if (text !== '') {
		var textNodes = [];
		//把文本节点拆开,只存在文本
		var textNode = text.replace(/\{\{.*?\}\}/g, '||data||');
		//把文本data提取
		var dataNodes = text.match(/(\{\{.*?\}\})/g);
		//根据||去划分data的字节占位转化为数组
		textNodes = textNode.split('||');
		//把data节点位置推送到节点数组当中
		for (var j = 0; j < textNodes.length; j++) {
			var index = textNodes.indexOf('data');
			if (index !== -1) {
				textNodes[index] = dataNodes.shift();
			}
		}
		return textNodes;
	} else {
		return [];
	}
}

//获取key数据链
function getDisassemblyKey(keys) {
	var newKeys = keys.map(function (val, index) {
		if (/\{\{\S+\}\}/.test(val)) {
			return val.replace(/(\{)?(\})?/g, '');
		}
	});

	return newKeys.filter(function (value) {
		return value != undefined;
	});
}

//用来清除绑定数据中的空字符串
function trim(value) {
	if (value.indexOf(' ') !== -1) {
		return value.replace(/\{\{ */g, '{{').replace(/ *\}\}/g, '}}');
	} else {
		return value;
	}
}

//拆解表达式和返回绑定值
/*
 *	isExpr是的为了返回解析表达式还是 
 * */

var ResolveExpr = function () {
	function ResolveExpr(expr) {
		_classCallCheck(this, ResolveExpr);

		this.expr = expr;
		this._expr = expr;
		this.strings = [];
		this.bindKeys = [];
		this.keyword = ["undefined", "null", "true", "false"];
		this.filter = [];
		this._init();
	}

	_createClass(ResolveExpr, [{
		key: '_init',
		value: function _init() {
			var _this = this;

			//抽离字符串
			var pullString = this.expr.match(/\'(.*?)\'|\"(.*?)\"/g);

			if (pullString) {
				pullString.forEach(function (string) {
					_this.strings.push(string);
					_this._expr = _this._expr.replace(string, "_____string_____");
				});
			}

			//检查是够存在||与
			this._expr = this._expr.replace(/\|{2}/, '______');

			var splitExpr = this._expr.split('|');
			//拆分过滤器
			this._expr = splitExpr[0];
			//是否存在过滤器
			if (splitExpr.length > 1) {
				//设置过滤器
				this.filter = splitExpr[1].split(' ').filter(function (filter) {
					return filter.trim();
				});
			}

			this._expr = this._expr.replace(/______/, '||');

			//是否存在函数处理
			var exprFn = this._expr.match(/([^!][_$A-z\d]+\()/g);
			if (exprFn) {
				//判断函数
				this.unique(exprFn).forEach(function (fn) {
					fn = fn.trim();
					_this._expr = _this._expr.replace(new RegExp(initRegExp(fn), 'g'), '$fn.' + fn);
				});
			}

			//清空数组内项目的空格内的值
			var trimData = this._expr.split(/\+|-|\*|\/|:|\?|\(|\)|,|!|&{2}|\|{2}|\[|\]|=/g).map(function (data) {
				return data.trim();
			});

			//倒叙绑定链
			var sortData = trimData.sort().reverse();

			//判断绑定值
			this.unique(sortData).forEach(function (bindData) {
				if (bindData !== "" && !/^\$fn\.|^\$scope\.|^_____string_____\S*?/g.test(bindData) && !/^\d*$/.test(bindData) && _this.keyword.indexOf(bindData) === -1) {
					//初始化字符串转化为正则适配
					var initExp = initRegExp(bindData);
					//绑定的正则
					var regexpBind = new RegExp('(\\+|-|\\*|\\/|\\(|\\!|:|\\?|=|\\[|\\s{1,}|,|&{2}|\\|{2})' + initExp, 'g');
					var _regexpBind = new RegExp('^' + initExp, 'g');
					//绑定键值
					_this.bindKeys.push(_this.getBindHasStringIndex(_this.unique(sortData), bindData));
					//加上作用域对象
					if (_regexpBind.test(_this._expr)) {
						_this._expr = _this._expr.replace(_regexpBind, RegExp.$1 + '$scope.' + bindData);
					}
					if (regexpBind.test(_this._expr)) {
						_this._expr = _this._expr.replace(regexpBind, RegExp.$1 + '$scope.' + bindData);
					}
				}
			});

			//把抽离的字符串重新插回到表达式中
			var splitString = this._expr.split('_____');
			for (var index = 0; index < splitString.length; index++) {
				var _index = splitString.indexOf("string");
				if (_index !== -1) {
					splitString[_index] = this.strings.shift();
				}
			}

			//合并字符内容
			this._expr = splitString.join('');
		}
	}, {
		key: 'getKeys',
		value: function getKeys() {
			return this.bindKeys;
		}
	}, {
		key: 'getExpr',
		value: function getExpr() {
			return this._expr;
		}
	}, {
		key: 'getFilter',
		value: function getFilter() {
			return this.filter;
		}
	}, {
		key: 'unique',
		value: function unique(array) {
			var newArray = [];
			array.forEach(function (item) {
				if (newArray.indexOf(item) === -1 || item === '_____string_____') {
					newArray.push(item);
				}
			});
			return newArray;
		}
	}, {
		key: 'getBindHasStringIndex',
		value: function getBindHasStringIndex(isBinds, bindData) {
			var hasString = [];
			isBinds.forEach(function (val) {
				if (/_____string_____/.test(val)) {
					hasString.push(val);
				}
			});

			var getIndex = hasString.indexOf(bindData);

			if (getIndex !== -1) {
				return bindData.replace(/_____string_____/g, this.strings[getIndex]);
			}

			return bindData;
		}
	}]);

	return ResolveExpr;
}();

//解析键值为.链接


function resolveKey(key) {
	var _key = key;
	var strings = [];

	//抽离字符串
	var pullString = key.match(/\'(.*?)\'|\"(.*?)\"/g);
	if (pullString) {
		key.match(/\'(.*?)\'|\"(.*?)\"/g).forEach(function (string) {
			strings.push(string);
			_key = _key.replace(string, "_____string_____");
		});
	}

	//查找[]范围并替换为点
	_key = _key.replace(/\[/g, '.').replace(/\]/g, '');
	var splitString = _key.split('_____');
	for (var index = 0; index < splitString.length; index++) {
		var _index = splitString.indexOf("string");
		if (_index !== -1) {
			splitString[_index] = strings.shift().replace(/\'|\"/g, '');
		}
	}
	return splitString.join('');
}

//去重
function unique(array) {
	var newArray = [];
	array.forEach(function (item) {
		if (newArray.indexOf(item) === -1) {
			newArray.push(item);
		}
	});
	return newArray;
}

//转义正则里面的内容
function initRegExp(expr) {
	var tm = '\\/*.?+$^[](){}|';
	for (var index = 0; index < tm.length; index++) {
		expr = expr.replace(new RegExp('\\' + tm[index], 'g'), '\\' + tm[index]);
	}
	return expr;
}

//深拷贝
function deepCopy(p, c) {
	//如果拷贝的对象是dom节点
	var c = c || (p instanceof Array ? [] : {});
	for (var i in p) {
		if (_typeof(p[i]) === 'object' && !p[i].nodeType) {
			c[i] = p[i].constructor === Array ? [] : {};
			deepCopy(p[i], c[i]);
		} else {
			c[i] = p[i];
		}
	}
	return c;
}

//通过父级的节点查找$index
function getIndex(el) {
	//当前默认节点存在了$index对象 || 模板使用data-index代替
	if (el.$index != undefined || el.$index != null) {
		return el.$index;
	} else if (el.dataset['index']) {
		return el.dataset['index'];
	} else if (el.id != this.$element) {
		return getIndex.call(this, el.parentNode);
	} else {
		return false;
	}
}

//设置绑定的依赖
function setBind(keyLine) {
	if (this.__ob__.bind.indexOf(keyLine) == -1) {
		this.__ob__.bind.push(keyLine);
	}
}

//设置作用域
function setScope(el) {
	//查看当前是否存在作用域
	if (!el.$scope) {
		//设置作用域
		el.$scope = Object.create(getScope.call(this, el));
	}
}

//获取作用域
function getScope(el) {
	//查看当前是否顶层的节点信息
	if (this.el === el) {
		return this.data;
	}
	//如果当前的节点是存在作用域的
	if (el.$scope) {
		return el.$scope;
	}
	//以上都没有作用域,向父级查找作用域
	var parentNode = el.parentNode;
	if (parentNode !== null) {
		if (parentNode.$scope) {
			return parentNode.$scope;
		} else {
			return getScope.call(this, parentNode);
		}
	}
}

//获取第一个element节点
function getFirstElementChild(element) {
	try {
		return element.firstElementChild;
	} catch (e) {
		for (var index = 0; index < element.childNodes.length; index++) {
			var children = element.childNodes[index];
			if (children.nodeType === 1) {
				return children;
			}
		}
	}
}

//判断是否存在for属性循环
function hasForAttr(element) {
	for (var index = 0; index < element.attributes.length; index++) {
		if (/_v-for/.test(element.attributes[index].name)) {
			return true;
		}
	}
	return false;
}

//节点获取的缓存

var ElementCache = function () {
	function ElementCache(context, element) {
		_classCallCheck(this, ElementCache);

		this.element = element;
		this.context = context;
	}

	_createClass(ElementCache, [{
		key: 'setCache',
		value: function setCache() {
			if (!(this.element.cache instanceof Object)) {
				this.element.__cache__ = {};
				this.context.cache.push(this.element);
			}
		}
	}, {
		key: 'removeCache',
		value: function removeCache() {
			this.context.cache.forEach(function (element) {
				if (!(element.__cache__ instanceof Object) && element.parentNode !== null) {
					element.parentNode.__cache__ = {};
				} else {
					element.__cache__ = {};
				}
			});
		}
	}]);

	return ElementCache;
}();

//查找key链


function findKeyLine(element, key) {
	if (this.el === element) {
		return key;
	}
	if (element.__keyLine__ && element.__keyLine__[key] !== undefined) {
		return element.__keyLine__[key];
	} else {
		return findKeyLine.apply(this, [element.parentNode, key]);
	}
}

exports.getEl = getEl;
exports.disassembly = disassembly;
exports.getDisassemblyKey = getDisassemblyKey;
exports.ResolveExpr = ResolveExpr;
exports.deepCopy = deepCopy;
exports.getIndex = getIndex;
exports.setBind = setBind;
exports.setScope = setScope;
exports.getScope = getScope;
exports.trim = trim;
exports.getFirstElementChild = getFirstElementChild;
exports.resolveKey = resolveKey;
exports.initRegExp = initRegExp;
exports.hasForAttr = hasForAttr;
exports.ElementCache = ElementCache;
exports.findKeyLine = findKeyLine;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * 对过滤对象进行处理 
 * */

var Filter = function () {
	function Filter(data, filter, view) {
		_classCallCheck(this, Filter);

		this.data = data;
		this.filter = filter;
		this.view = view;
	}

	_createClass(Filter, [{
		key: "runFilter",
		value: function runFilter() {
			var _this = this;

			this.filter.forEach(function (filter) {
				_this.data = View.filter[filter](_this.data);
			});
			return this.data;
		}
	}]);

	return Filter;
}();

exports.default = Filter;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _update = __webpack_require__(15);

Object.defineProperty(exports, 'domUpdate', {
  enumerable: true,
  get: function get() {
    return _update.domUpdate;
  }
});

var _setDom = __webpack_require__(14);

Object.keys(_setDom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _setDom[key];
    }
  });
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setEventHandler = exports.setChildTemplateEvent = exports.setEvent = undefined;

var _tools = __webpack_require__(0);

//事件绑定
function setEvent(element) {
	var prop = element.attributes;
	for (var index = 0; index < Object.keys(element.attributes).length; index++) {
		var propName = prop[index] ? prop[index].name : '',
		    propValue = prop[index] ? prop[index].value : '';
		if (/@.?/.test(propName)) {
			element.removeAttribute(propName);
			index -= 1;
			setEventHandler.apply(this, [element, propName, propValue]);
		}
	}
}

//事件处理函数
function setEventHandler(element, propName, propValue) {
	var _this3 = this;

	var _this = this;
	var filterpropValue = propValue.replace(/\(+\S+\)+/g, '');
	propName = propName.replace('@', '');
	//存在这个方法
	if (this[filterpropValue]) {
		//存在参数值
		if (propValue.match(/\(\S+\)/) instanceof Array) {
			var args = propValue.match(/\(\S+\)/)[0].replace(/\(?\)?/g, '').split(',');
			//绑定事件
			element.addEventListener(propName, function (event) {
				var _this2 = this;

				//对数组内的数据查看是否存在的数据流进行过滤
				var filterArgs = args.map(function (item, index) {
					//如果传入的对象是$index,获取当前父级中所在的索引
					if (item === '$index') {
						return _tools.getIndex.call(_this, element);
					} else if (item === '$event') {
						return event;
					} else {
						//解析data中的值
						return _this.expr(item, _this2).toString();
					}
				});
				//运行绑定的event
				_this[filterpropValue].apply(_this, filterArgs);
			}, false);
		} else {
			//不存在参数值过滤掉空的括号
			element.addEventListener(propName, function (event) {
				_this3[filterpropValue].call(_this3, event);
			}, false);
		}
	}
}

/*
 *	在templateData中,$index的参数会根据插入的节点对象进行返回index的值
 *	模板子对象循环添加事件
 */

function setChildTemplateEvent(el) {
	var _this4 = this;

	var childEls = el.childNodes;
	Object.keys(childEls).forEach(function (index) {
		var el = childEls[index];
		if (el.nodeType == 1) {
			if (el.childNodes.length > 0) {
				setChildTemplateEvent.call(_this4, el);
			}
			setEvent.call(_this4, el);
		}
	});
}

exports.setEvent = setEvent;
exports.setChildTemplateEvent = setChildTemplateEvent;
exports.setEventHandler = setEventHandler;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.modelUpdate = exports.formElements = exports.setModel = undefined;

var _tools = __webpack_require__(0);

function setModel(element, propValue) {
	propValue = (0, _tools.trim)(propValue);
	var _this = this;
	var elTagName = element.tagName.toLocaleLowerCase();
	var type = element.type;
	//绑定按键事件
	if (/input|textarea|select/.test(elTagName)) {
		//设置model订阅者
		setModelData.apply(this, [propValue, element]);
		_tools.setBind.call(this, propValue);

		if (/text|number|tel|email|url|search|textarea/.test(type)) {
			element.addEventListener('keyup', function (event) {
				if (event.keyCode == 32 || event.keyCode == 34 || event.keyCode == 8 || event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105 || event.keyCode >= 186 && event.keyCode <= 222) {
					var value = this.value;
					_this._set(element, propValue, value);
				}
			});
		} else if (/checkbox|radio/.test(type)) {
			element.addEventListener('change', function () {
				if (/checkbox/.test(type)) {
					return function (event) {
						var inputData = [];
						var form = element.form;
						_this.__ob__.model[propValue].forEach(function (ele) {
							if (ele.form == form && ele.checked) {
								inputData.push(ele.value);
							}
						});
						_this._set(element, propValue, inputData);
					};
				} else if (/radio/.test(type)) {
					return function (event) {
						var form = element.form;
						var inputData = '';
						_this.__ob__.model[propValue].forEach(function (ele) {
							if (ele.form == form && ele.checked) {
								inputData = ele.value;
								return;
							}
						});
						_this._set(element, propValue, inputData);
					};
				}
			}());
		} else if (/select-one|select-multiple/.test(type)) {
			element.addEventListener('change', function (event) {
				var inputData = [];
				for (var index = 0; index < element.childNodes.length; index++) {
					var children = element.childNodes;
					if (children[index].nodeType === 1 && children[index].nodeName === 'OPTION' && children[index].selected) {
						inputData.push(children[index].value);
					}
				}
				_this._set(element, propValue, inputData);
			});
		}
	}
}

//设置model观察者
function setModelData(key, element) {
	if (!(this.__ob__.model[key] instanceof Array)) {
		this.__ob__.model[key] = [];
	}
	this.__ob__.model[key].push(element);
}

/*初始化绑定数据*/
function modelUpdate(key) {
	var _this2 = this;

	//初始化
	if (key === undefined || key === '') {
		Object.keys(this.__ob__.model).forEach(function (keyLine, index) {
			updateFn.call(_this2, keyLine);
		});
	} else {
		//如果不存在键值，不执行更新
		if (!this.__ob__.model[key]) {
			return;
		}
		updateFn.call(this, key);
	}

	function updateFn(key) {
		var _this3 = this;

		var model = this.__ob__.model[key];
		Object.keys(model).forEach(function (_key, index) {
			var element = model[_key];
			var data = _this3._get(key, element);
			formElements.apply(_this3, [element, key, data]);
		});
	}
}

//表单的处理
function formElements(element, keyLine, data) {
	var _this4 = this;

	//没有绑定正确的值跳出
	if (data == null) {
		return;
	}
	var type = element.type;
	//check类型
	if (/checkbox|radio/.test(type)) {
		var diffFormElement = [];
		var checkboxName = element.name;
		//查找不同的form对象
		this.__ob__.model[keyLine].forEach(function (element) {
			if (diffFormElement.indexOf(element.form) === -1) {
				diffFormElement.push(element.form);
			}
		});

		//设置绑定的对象
		diffFormElement.forEach(function (form) {
			var index = 0;
			_this4.__ob__.model[keyLine].forEach(function (element) {
				if (element.form == form) {
					data = !isNaN(data) ? data.toString() : data;
					//当前的对象值是否等于
					var keys = Object.keys(data);
					for (var _index2 = 0; _index2 < keys.length; _index2++) {
						if (element.value == data[keys[_index2]]) {
							element.checked = true;
							break;
						} else {
							element.checked = false;
						}
					}
				}
			});
		});
	} else if (/select-one|select-multiple/.test(type)) {
		for (var index = 0; index < element.childNodes.length; index++) {
			var children = element.childNodes;
			if (data.length > 0) {
				for (var _index = 0; _index < data.length; _index++) {
					if (children[index].nodeType === 1 && children[index].nodeName === 'OPTION' && children[index].value == data[_index]) {
						children[index].selected = true;
						break;
					} else {
						children[index].selected = false;
					}
				}
			} else {
				for (var _index3 = 0; _index3 < children.length; _index3++) {
					children[_index3].selected = false;
				}
			}
		}
	} else {
		element.value = data;
	}
}

exports.setModel = setModel;
exports.formElements = formElements;
exports.modelUpdate = modelUpdate;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setAttr = __webpack_require__(11);

Object.defineProperty(exports, 'setAttr', {
  enumerable: true,
  get: function get() {
    return _setAttr.setAttr;
  }
});

var _update = __webpack_require__(12);

Object.defineProperty(exports, 'attrUpdate', {
  enumerable: true,
  get: function get() {
    return _update.attrUpdate;
  }
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setFor = __webpack_require__(16);

Object.keys(_setFor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _setFor[key];
    }
  });
});

var _update = __webpack_require__(17);

Object.defineProperty(exports, 'forUpdate', {
  enumerable: true,
  get: function get() {
    return _update.forUpdate;
  }
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setIf = __webpack_require__(18);

Object.defineProperty(exports, 'setIf', {
  enumerable: true,
  get: function get() {
    return _setIf.setIf;
  }
});

var _update = __webpack_require__(19);

Object.defineProperty(exports, 'ifUpdate', {
  enumerable: true,
  get: function get() {
    return _update.ifUpdate;
  }
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setShow = __webpack_require__(23);

Object.keys(_setShow).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _setShow[key];
    }
  });
});

var _update = __webpack_require__(24);

Object.keys(_update).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _update[key];
    }
  });
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(2);

var _component = __webpack_require__(13);

var _component2 = _interopRequireDefault(_component);

var _attr = __webpack_require__(5);

var _event = __webpack_require__(3);

var _tools = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//状态
var REPLACE = 0;
var REORDER = 1;
var PROPS = 2;
var TEXT = 3;

var _Element = function () {
	function _Element(context) {
		_classCallCheck(this, _Element);

		this.id = 0;
		this.elementList = {};
		this.context = context;
	}

	_createClass(_Element, [{
		key: 'render',
		value: function render(options) {
			var _this2 = this;

			var el = void 0;
			if (options.tagName) {
				el = document.createElement(options.tagName);
				//设置属性
				Object.keys(options.props).forEach(function (key) {
					var value = options.props[key];
					el.setAttribute(key, value);
				});

				//设置子节点
				Object.keys(options.childrens).forEach(function (index) {
					var children = options.childrens[index];
					var createElement = void 0;
					if (children instanceof Object) {
						createElement = _this2.render(children);
					} else {
						createElement = document.createTextNode(children);
					}
					el.appendChild(createElement);
				});
			} else {
				el = document.createTextNode(options.textContent);
			}

			return el;
		}
	}, {
		key: 'resolve',
		value: function resolve(element, _this) {
			var vdom = void 0;
			//dom节点
			if (element.nodeType === 1) {
				//当前的ELement是否为组件
				if (_this.components[element.tagName.toLowerCase()] && element.tagName.indexOf('-') > -1) {
					element = _component2.default.call(_this, element);
				}
				vdom = {
					tagName: element.tagName.toLowerCase(),
					props: {},
					childrens: [],
					index: this.id,
					el: element
				};
				//设置作用域
				_tools.setScope.call(_this, element);

				//设置节点缓存
				new _tools.ElementCache(_this, element).setCache();

				//设置属性的绑定
				var hasInitFor = _attr.setAttr.call(_this, element, vdom);

				if (!hasInitFor) {
					for (var index = 0; index < element.childNodes.length; index++) {
						var el = element.childNodes[index];
						if (el.nodeType === 1 || el.nodeType === 3) {
							this.id++;
							vdom.childrens.push(this.resolve(el, _this));
						}
					}
				}
			} else if (element.nodeType === 3) {
				//设置文本节点绑定的更新
				_dom.setDom.call(_this, element);
				//设置节点缓存
				new _tools.ElementCache(_this, element).setCache();
				//文本节点
				vdom = {
					textContent: element.textContent,
					index: this.id,
					el: element
				};
			}
			//给当前的链路中添加
			this.elementList[vdom.index] = vdom;

			//如果递归到最开始的节点，index的值返回到0
			if (vdom.id == 0) {
				this.id = 0;
			}

			return vdom;
		}
	}, {
		key: 'diff',
		value: function diff(oldTree, newTree) {
			var patched = [];
			this.diffTag(oldTree, newTree, patched);
			return patched;
		}
		/*判断节点和之前的节点是否相同*/

	}, {
		key: 'diffTag',
		value: function diffTag(oldTree, newTree, patched) {
			//先计算出属性的差异性
			if (!oldTree.textContent) {
				var getProps = this.diffProps(oldTree, newTree);
				//主节点不同,完全替换
				if (oldTree.tagName != newTree.tagName) {
					patched.push({
						type: REPLACE,
						node: newTree,
						index: oldTree.index
					});
				} else if (Object.keys(getProps.props).length > 0) {
					/*从对比的差异中查看是否有差异*/
					patched.push(getProps);
				}
				/*查看当前的节点中是否存在子节点*/
				if (oldTree.childrens.length > 0) {
					this.diffChildNode(oldTree, newTree, patched);
				}
			} else {
				this.diffTextNode(oldTree, newTree, patched);
			}
		}
		/*判断属性是否有增加或者属性时候是否进行过修改*/

	}, {
		key: 'diffProps',
		value: function diffProps(oldTree, newTree) {
			var props = {};

			Object.keys(newTree.props).forEach(function (key) {
				var value = newTree.props[key];
				//如果当前的属性存在，值不相同，存值
				if (Reflect.has(oldTree.props, key) && !(oldTree.props[key] === value)) {
					props[key] = value;
				} else if (!Reflect.has(oldTree.props, key)) {
					props[key] = newTree.props[key];
				}
			});
			//添加修改过属性内容
			return {
				type: PROPS,
				props: props,
				index: oldTree.index
			};
		}
		/*判断当前的文本节点是够改变了*/

	}, {
		key: 'diffTextNode',
		value: function diffTextNode(oldTree, newTree, patched) {
			if (oldTree.textContent != newTree.textContent) {
				patched.push({
					type: TEXT,
					content: newTree.textContent,
					index: oldTree.index
				});
			}
		}

		/*给子节点进行递归*/

	}, {
		key: 'diffChildNode',
		value: function diffChildNode(oldTree, newTree, patched) {
			var _this3 = this;

			oldTree.childrens.forEach(function (childNode, _index) {
				_this3.diffTag(childNode, newTree.childrens[_index], patched);
			});
		}
	}]);

	return _Element;
}();

exports.default = _Element;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _observer = __webpack_require__(22);

var _observer2 = _interopRequireDefault(_observer);

var _method = __webpack_require__(21);

var _method2 = _interopRequireDefault(_method);

var _vdom = __webpack_require__(9);

var _vdom2 = _interopRequireDefault(_vdom);

var _tools = __webpack_require__(0);

var _dom = __webpack_require__(2);

var _attr = __webpack_require__(5);

var _show = __webpack_require__(8);

var _if = __webpack_require__(7);

var _for = __webpack_require__(6);

var _watch = __webpack_require__(25);

var _event = __webpack_require__(3);

var _model = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ___index = 0;

var View = function () {
	function View() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : options,
		    _ref$el = _ref.el,
		    el = _ref$el === undefined ? '' : _ref$el,
		    _ref$template = _ref.template,
		    template = _ref$template === undefined ? undefined : _ref$template,
		    _ref$data = _ref.data,
		    data = _ref$data === undefined ? {} : _ref$data,
		    _ref$methods = _ref.methods,
		    methods = _ref$methods === undefined ? {} : _ref$methods,
		    _ref$components = _ref.components,
		    components = _ref$components === undefined ? {} : _ref$components,
		    _ref$watch = _ref.watch,
		    watch = _ref$watch === undefined ? {} : _ref$watch,
		    _ref$init = _ref.init,
		    init = _ref$init === undefined ? function () {} : _ref$init,
		    _ref$created = _ref.created,
		    created = _ref$created === undefined ? function () {} : _ref$created,
		    _ref$ready = _ref.ready,
		    ready = _ref$ready === undefined ? function () {} : _ref$ready;

		_classCallCheck(this, View);

		this.$element = el;
		//设置data值
		this.data = data;
		//解析对象
		if (el && typeof (0, _tools.getEl)(el) !== 'null') {
			//获取当前的元素
			this.el = (0, _tools.getEl)(el);
			//提前判断是否为模板
			this.isTemplate = false;
			//判断是否为模板
			if (this.el.tagName == 'TEMPLATE') {
				this.el = (0, _tools.getFirstElementChild)(this.el.content ? this.el.content : this.el);
				this.data['templateData'] = [];
				this.isTemplate = true;
				this.data['$index'] = -1;
			}
		} else {
			this.el = '';
		}
		//实例方法	
		this.methods = methods;
		//组件
		this.components = components;
		//data监听
		this.watch = watch;
		//钩子函数
		this.init = init;
		this.created = created;
		this.ready = ready;

		//判断是否绑定节点或者模板
		if (!this.el) {
			return false;
		}
		//初始化内容
		this._init();
	}

	_createClass(View, [{
		key: '_init',
		value: function _init() {
			//构建前钩子函数
			this.init();
			//配置对象
			this.config();
			//设置方法
			_method2.default.call(this);
			//设置observe
			new _observer2.default(this.data, undefined, this);
			//创建vdom内容
			this.vdom = new _vdom2.default().resolve(this.el, this);
			//创建存在绑定的文本节点
			_dom.createTextNodes.call(this);
			//新建和替换绑定的文本节点信息
			_dom.replaceTextNode.call(this);
			//创建钩子函数
			this.created();
			//初始化更新
			this.update();
			//准备钩子函数
			this.ready();
		}
	}, {
		key: 'config',
		value: function config() {
			this.__ob__ = {
				dom: {},
				attr: {},
				show: {},
				if: {},
				for: {},
				model: {},
				bind: []
			};

			this.__bind__ = {
				textNodeLists: [],
				tempFragmentElements: [],
				templateIndex: 0
			};

			this.cache = [];
		}
	}, {
		key: 'dep',
		value: function dep(keys) {
			var _this = this;

			var updates = [];
			//设置当前链上一级依赖
			if (keys.indexOf('.') != -1) {
				var newKeys = keys.split('.');
				for (var index = 0, len = newKeys.length; index < len; index++) {
					updates.push(newKeys.join('.'));
					newKeys.pop();
				}
			} else {
				//当前的数据依赖
				updates.push(keys);
			}

			//设置当前链下面的所有依赖数据
			Object.keys(this.__ob__.bind).forEach(function (index) {
				var key = _this.__ob__.bind[index];
				if (key.indexOf(keys + '.') != -1) {
					updates.push(key);
				}
			});

			updates.forEach(function (keyLine) {
				_this.update(keyLine);
			});
		}
	}, {
		key: 'update',
		value: function update(keys) {
			_watch.watchUpdate.call(this, keys);
			_for.forUpdate.call(this, keys);
			_model.modelUpdate.call(this, keys);
			_attr.attrUpdate.call(this, keys);
			_show.showUpdate.call(this, keys);
			_if.ifUpdate.call(this, keys);
			_dom.domUpdate.call(this, keys);
			//清楚节点中的缓存
			new _tools.ElementCache(this).removeCache();
		}
		//	_update(keys){
		//		watchUpdate.call(this,keys);
		//		ifUpdate.call(this,keys);
		//		modelUpdate.call(this,keys);
		//		attrUpdate.call(this,keys);
		//		showUpdate.call(this,keys);
		//		domUpdate.call(this,keys);
		//		//清楚节点中的缓存
		//		new ElementCache(this).removeCache();
		//	}

	}, {
		key: '_get',
		value: function _get(keyLink, element) {
			//是否存在缓存节点信息
			if (element == undefined || element.__cache__[keyLink] === undefined) {
				//获取作用域内的值
				var getVal = void 0;
				if (element) {
					getVal = _tools.getScope.call(this, element);
				} else {
					getVal = this.data;
				}
				//存在实例屬性對象
				if (/\./g.test(keyLink)) {
					var keys = keyLink.split('.');
					//存在值
					if (getVal) {
						for (var i = 0; i < keys.length; i++) {
							var key = keys[i];
							try {
								var data = getVal[key];
								getVal = getVal !== null && data !== undefined ? data : null;
							} catch (error) {
								return null;
							}
						}
						element ? element.__cache__[keyLink] = getVal : null;
						return getVal;
					} else {
						element ? element.__cache__[keyLink] = null : null;
						return null;
					}
				} else {
					var _data = getVal[keyLink];
					if (_data != undefined) {
						element ? element.__cache__[keyLink] = _data : null;
						return _data;
					} else {
						element ? element.__cache__[keyLink] = null : null;
						return null;
					}
				}
			} else {
				//直接返回缓存数据
				return element.__cache__[keyLink];
			}
		}
	}, {
		key: '_set',
		value: function _set(element, obj, val, key) {
			var data = this['data'],
			    objs = obj.split('.'),
			    keyLen = objs.length,
			    parentObj = objs[0],
			    //对象中顶级key
			i = 0,
			    tempObject = data,
			    tempVal = void 0;
			//如果存在多层值
			if (keyLen != 1) {
				//最后一个key
				var lastIndex = objs[objs.length - 1];
				//移除最后一个值
				objs.pop();
				//把key链重组
				obj = objs.join('.');
				var getData = void 0;
				if (element) {
					getData = this._get(obj, element);
				} else {
					getData = this._get(obj);
				}
				if (getData !== null) {
					//设置新的值
					if (key != undefined) {
						getData[lastIndex][key] = val;
					} else {
						getData[lastIndex] = val;
					}
					//处理字符串数据流更新
					if (!(typeof val === 'string')) {
						getData[lastIndex] = (0, _tools.deepCopy)(getData[lastIndex]);
					}
				}
			} else {
				var _getData = void 0;

				if (element) {
					_getData = this._get(obj, element);
				} else {
					_getData = this._get(obj);
				}

				/*只有一个key值*/
				if (_getData !== null) {
					if (key != undefined) {
						_getData[key] = val;
					} else {
						this.data[obj] = (typeof val === 'undefined' ? 'undefined' : _typeof(val)) == 'object' ? (0, _tools.deepCopy)(val) : val;
					}
				}
			}
		}
	}, {
		key: 'expr',
		value: function expr(_expr, element) {
			//作用域
			var $scope = _tools.getScope.call(this, element);
			//方法
			var $fn = this.methods;
			//返回值
			var data = new Function('$scope', '$fn', '\n\t\t\treturn ' + _expr + ';\t\n\t\t').apply(this, [$scope, $fn]);
			return data;
		}
	}, {
		key: 'createTemplate',
		value: function createTemplate(vals, appendEl) {
			var _this2 = this;

			if (typeof appendEl === 'string') {
				appendEl = document.getElementById(appendEl);
			} else if (appendEl.nodeType !== 1) {
				console.warn('第二参数为添加节点的id或者为对应的节点对象');
				return;
			}

			//循环添加到指定的DOM节点上
			try {
				//如果值为字符串（兼容IE）
				if (typeof vals === 'string') {
					vals = vals.split('');
				}

				Object.keys(vals).forEach(function (key, index) {
					//更新模板的index
					_this2.el.$scope.$index++;
					//设置数据流更新
					_this2.data.templateData = vals[key];
					//复制临时节点
					var tempNode = _this2.el.cloneNode(true);
					//设置模板中的index属性
					tempNode.setAttribute('data-index', _this2.__bind__.templateIndex++);
					//添加到对应节点上
					appendEl.appendChild(tempNode);
					//绑定当前节点事件
					if (tempNode.nodeType == 1) {
						_event.setEvent.call(_this2, tempNode);
					}
					//模板添加事件
					_event.setChildTemplateEvent.call(_this2, tempNode);
				});
			} catch (e) {
				console.warn('createTemplate方法中的第一个参数只能为的数组或者对象');
			}
		}
		/*设置过滤器*/

	}, {
		key: 'push',

		/*----------------------数组操作---------------------------*/
		/*
   * push方法
   * */
		value: function push(data, pushData) {
			//深拷贝数据
			var getData = (0, _tools.deepCopy)(this._get(data));
			//必须为数组
			if (Array.isArray(getData)) {
				if (Array.isArray(pushData)) {
					pushData.forEach(function (item, index) {
						getData.push(item);
					});
				} else {
					getData.push(pushData);
				}
				this._set(undefined, data, getData);
			}
		}
		/* 
   * pop方法 
   * */

	}, {
		key: 'pop',
		value: function pop(data) {
			//深拷贝数据
			var getData = (0, _tools.deepCopy)(this._get(data)),
			    popData = "";
			//必须为数组
			if (Array.isArray(getData)) {
				popData = getData.pop();
				this._set(undefined, data, getData);
			}
			return popData;
		}
		/*
   * unshift方法 
   * 
   * */

	}, {
		key: 'unshift',
		value: function unshift(data, unshiftData) {
			//深拷贝数据
			var getData = (0, _tools.deepCopy)(this._get(data));
			//必须为数组
			if (Array.isArray(getData)) {
				if (Array.isArray(unshiftData)) {
					unshiftData.forEach(function (item, index) {
						getData.unshift(item);
					});
				} else {
					getData.unshift(unshiftData);
				}
				this._set(undefined, data, getData);
			}
		}
		/*
   * shift方法 
   * */

	}, {
		key: 'shift',
		value: function shift(data) {
			//深拷贝数据
			var getData = (0, _tools.deepCopy)(this._get(data)),
			    shiftData = "";
			//必须为数组
			if (Array.isArray(getData)) {
				shiftData = getData.shift();
				this._set(undefined, data, getData);
			}
			return shiftData;
		}
		/* 
   * splice 方法
   * */

	}, {
		key: 'splice',
		value: function splice(data, index, length) {
			//深拷贝数据
			var getData = (0, _tools.deepCopy)(this._get(data));
			//必须为数组
			if (Array.isArray(getData)) {
				getData.splice(index, length);
				this._set(undefined, data, getData);
			}
		}
	}], [{
		key: 'setFilter',
		value: function setFilter(filterName, handler) {
			this.filter[filterName] = handler;
		}
	}]);

	return View;
}();

//过滤器数据(带默认过滤器)


View.filter = {
	'trim': function trim(data) {
		return data.replace(/(^ +)?( +$)?/g, '');
	},
	'upper': function upper(data) {
		return data.toLocaleUpperCase();
	},
	'lower': function lower(data) {
		return data.toLocaleLowerCase();
	},
	'length': function length(data) {
		return data.length;
	},
	'html': function html(data) {
		var fragment = document.createDocumentFragment(),
		    tempDom = document.createElement('div'),
		    doms = [];
		tempDom.innerHTML = data;
		Array.prototype.forEach.call(tempDom.childNodes, function (item, index) {
			fragment.appendChild(item.cloneNode(true));
		});

		Array.prototype.forEach.call(fragment.childNodes, function (item, index) {
			doms.push(item);
		});

		return doms;
	}
};

exports.default = View;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setAttr = undefined;

var _tools = __webpack_require__(0);

var _show = __webpack_require__(8);

var _if = __webpack_require__(7);

var _for = __webpack_require__(6);

var _event = __webpack_require__(3);

var _model = __webpack_require__(4);

/*查找element对象中的属性*/
/*拆解绑定的信息*/
function setAttr(element, vdom) {
	var _this = this;

	var hasFor = (0, _tools.hasForAttr)(element);

	var _loop = function _loop(_index2) {
		var prop = element.attributes,
		    propName = prop[_index2] ? prop[_index2].name : '',
		    propValue = prop[_index2] ? prop[_index2].value : '';

		if (/:.?/.test(propName) && !hasFor) {
			//解析表达式
			var re = new _tools.ResolveExpr(propValue);
			var attrExpr = re.getExpr();
			var filter = re.getFilter();
			var attrKeys = re.getKeys();

			//删除当前绑定到真实attr上的属性
			element.removeAttribute(propName);
			_index2 -= 1;
			//清除:号
			propName = propName.replace(':', '');
			//给vdom加上属性
			vdom.props[propName] = attrExpr;

			attrKeys.forEach(function (key, index) {
				key = _tools.findKeyLine.apply(_this, [element, key]);
				key = (0, _tools.resolveKey)(key);
				if (!_this.__ob__.attr[key]) {
					_this.__ob__.attr[key] = [];
					_tools.setBind.call(_this, key);
				}
				if (!(element.__attrs__ instanceof Object)) {
					element.__attrs__ = {};
				}
				if (!(element.__attrs__[propName] instanceof Object)) {
					element.__attrs__[propName] = {};
				}
				element.__attrs__[propName].__bind__ = attrExpr;
				element.__attrs__[propName].__filter__ = filter;
				_this.__ob__.attr[key].push(element);
			});
		} else if (/_v-.?/.test(propName)) {
			//删除当前绑定到真实attr上的属性
			element.removeAttribute(propName);
			_index2 -= 1;
			//删除绑定属性
			propName = propName.replace('_v-', '');
			//获取到主Key的数组
			switch (propName) {
				case 'for':
					_for.setFor.call(_this, element, propValue, _index2);
					break;
				case 'show':
					if (hasFor) {
						break;
					}
					_show.setShow.call(_this, element, propValue);
					break;
				case 'if':
					if (hasFor) {
						break;
					}
					_if.setIf.call(_this, element, propName, propValue);
					break;
				case 'model':
					if (hasFor) {
						break;
					}
					_model.setModel.call(_this, element, propValue);
				default:
					;
			}
		} else if (/@.?/.test(propName)) {
			//如果不是模板中的事件
			if (!_this.isTemplate) {
				//删除当前绑定到真实attr上的属性
				element.removeAttribute(propName);
				_index2 -= 1;
			}
			_event.setEventHandler.apply(_this, [element, propName, propValue]);
		}
		_index = _index2;
	};

	for (var _index = 0; _index < element.attributes.length; _index++) {
		_loop(_index);
	}
	return hasFor;
}

exports.setAttr = setAttr;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.attrUpdate = undefined;

var _filter = __webpack_require__(1);

var _filter2 = _interopRequireDefault(_filter);

var _model = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//属性更新
function attrUpdate(key) {
	var _this = this;

	//初始化
	if (key === undefined || key === '') {
		Object.keys(this.__ob__.attr).forEach(function (keyLine, index) {
			updateFn.call(_this, keyLine);
		});
	} else {
		//如果不存在键值，不执行更新
		if (!this.__ob__.attr[key]) {
			return;
		}
		updateFn.call(this, key);
	}

	function updateFn(keyLine) {
		var _this2 = this;

		var attrNodes = this.__ob__.attr[keyLine];
		attrNodes.forEach(function (element, index) {
			var attrs = element.__attrs__;
			Object.keys(attrs).forEach(function (propName, index) {
				var propValue = attrs[propName].__bind__;
				var data = new _filter2.default(_this2.expr(propValue, element), attrs[propName].__filter__).runFilter();
				element.setAttribute(propName, data);
			});
		});
	}
}

exports.attrUpdate = attrUpdate;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _tools = __webpack_require__(0);

//组件初始化
function componentHandler(node) {
	var nodeName = node.nodeName.toLowerCase(),
	    elHtml = (0, _tools.getEl)(this.components[nodeName]) != null ? (0, _tools.getEl)(this.components[nodeName]).innerHTML : this.components[nodeName],

	//复制组件节点
	cloneNode = node.cloneNode(true),
	    nodeParent = node.parentNode;
	//复制的组件中添加子节点
	cloneNode.innerHTML = elHtml;
	//获取组件中的节点内容
	var componentNode = (0, _tools.getFirstElementChild)(cloneNode);
	nodeParent.replaceChild(componentNode, node);
	return componentNode;
}

exports.default = componentHandler;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.replaceTextNode = exports.createTextNodes = exports.setDom = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _tools = __webpack_require__(0);

function setDom(element) {
	//非空的节点才进入过滤赛选
	if (element.textContent !== '') {
		var textNodes = (0, _tools.disassembly)(element.textContent);
		this.__bind__.textNodeLists.push([textNodes, element]);
	}
}

//创建文本节点单独循环执行
function createTextNodes() {
	var _this = this;

	this.__bind__.textNodeLists.forEach(function (item, index) {
		var _item = _slicedToArray(item, 2),
		    textNodes = _item[0],
		    el = _item[1];

		createTextNodeElements.call(_this, textNodes, el);
	});
	this.__bind__.textNodeLists = [];
}

//创建文本节点对象,推送到临时的存放点
function createTextNodeElements(textNodes, el) {
	var _this2 = this;

	//创建文档片段
	var fragment = document.createDocumentFragment();
	//数据推入文档节点(当个花括号内的值)
	for (var i = 0; i < textNodes.length; i++) {
		if (textNodes[i].trim() !== "") {
			(function () {
				//查看是否为数据绑定
				var element = document.createTextNode(textNodes[i]);
				if (/\{\{.*?\}\}/.test(textNodes[i]) == true) {
					var expr = textNodes[i].replace(/(\{)?(\})?/g, '');
					var re = new _tools.ResolveExpr(expr, element);
					re.getKeys().forEach(function (key) {
						key = _tools.findKeyLine.apply(_this2, [el, key]);
						key = (0, _tools.resolveKey)(key);
						if (!(_this2.__ob__.dom[key] instanceof Array)) {
							_this2.__ob__.dom[key] = [];
							_tools.setBind.call(_this2, key);
						}
						//设置dom的expr
						if (!(element.__dom__ instanceof Object)) {
							element.__dom__ = {};
						}
						//给element元素加上__dom__依赖,过滤器
						element.__dom__.__bind__ = re.getExpr();
						element.__dom__.__filter__ = re.getFilter();

						_this2.__ob__.dom[key].push(element);
					});
				}
				fragment.appendChild(element);
			})();
		}
	}
	//el为父级节点,fragment为文档片段,index为索取文本节点在父级节点的位置
	this.__bind__.tempFragmentElements.push([el.parentNode, fragment, el]);
}

//替换原文本节点
function replaceTextNode() {
	this.__bind__.tempFragmentElements.forEach(function (item, index) {
		var _item2 = _slicedToArray(item, 3),
		    parentNode = _item2[0],
		    fragmentNode = _item2[1],
		    oldTextNode = _item2[2];

		parentNode.replaceChild(fragmentNode, oldTextNode);
	});
	this.__bind__.tempFragmentElements = [];
}

exports.setDom = setDom;
exports.createTextNodes = createTextNodes;
exports.replaceTextNode = replaceTextNode;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.domUpdate = undefined;

var _filter = __webpack_require__(1);

var _filter2 = _interopRequireDefault(_filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function domUpdate(key) {
	var _this = this;

	//初始化
	if (key === undefined || key === '') {
		Object.keys(this.__ob__.dom).forEach(function (keyLine, index) {
			updateFn.call(_this, keyLine);
		});
	} else {
		//如果不存在键值，不执行更新
		if (!this.__ob__.dom[key]) {
			return;
		}
		updateFn.call(this, key);
	}
}

function updateFn(keyLine) {
	var _this2 = this;

	var textNodes = this.__ob__.dom[keyLine];
	textNodes.forEach(function (element) {
		var data = new _filter2.default(_this2.expr(element.__dom__.__bind__, element), element.__dom__.__filter__).runFilter();

		if (data instanceof Array && data.length > 0 && hasElement(data)) {
			//走接点过滤处理
			htmlNode(data, element);
		} else {
			//检查是否存在过滤器或者数组插入的dom节点
			isTextNodePrevSibline(element);
			//直接为数据节点		
			if (element.textContent != data) {
				element.textContent = data;
			}
		}
	});
}

//查看是否存在element
function hasElement(elements) {
	for (var index = 0; index < elements.length; index++) {
		if (elements[index].nodeType) {
			return true;
		}
	}
	return false;
}

//处理过滤器html内容
function htmlNode(domNodes, item) {
	//存在过节点
	isTextNodePrevSibline(item);
	//把新的dom插入到对应的节点中
	domNodes.forEach(function (dom, index) {
		dom.htmlNode = true;
		item.parentNode.insertBefore(dom, item);
		item.appendNode = item.appendNode instanceof Array ? item.appendNode : [];
		item.appendNode.push(dom);
	});

	//清空占位文本节点的内容
	item.textContent !== "" ? item.textContent = '' : false;
}

//查看文本节点中是否存在插入式的dom对象
function isTextNodePrevSibline(item) {
	if (item.previousSibling != null && !!item.previousSibling.htmlNode) {
		for (var i = 0, len = item.appendNode.length; i < len; i++) {
			var dom = item.appendNode.shift();
			item.parentNode.removeChild(dom);
		}
	}
}

exports.domUpdate = domUpdate;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setFor = undefined;

var _tools = __webpack_require__(0);

function setFor(element, propValue, propIndex) {
	var _this2 = this;

	var _this = this;
	//拆解数据
	var bindIden = propValue.split(' in ')[0];
	var forVal = propValue.split(' in ')[1];

	//拆分键值
	var forItem = bindIden.split(',')[0];
	var forKey = bindIden.split(',')[1];

	//整理空字符
	forVal = (0, _tools.trim)(forVal);
	//处理数据链
	var filterForVal = (0, _tools.resolveKey)(forVal);
	var getForVal = void 0;
	//查看是否为数字的循环
	if (!isNaN(filterForVal)) {
		var num = parseInt(filterForVal);
		var newData = [];
		for (var index = 0; index < num; index++) {
			newData.push(index);
		}
		filterForVal = '_____array_____';
		getForVal = newData;
		element.isNumFor = true;
		element.__forValue__ = getForVal;
	} else {
		//非数组循环
		getForVal = this._get(filterForVal, element);
	}
	//插入当前的列表占位
	var presentSeize = document.createTextNode('');
	var oldElementReplace = document.createTextNode('');
	var parentNode = element.parentNode;
	parentNode.insertBefore(presentSeize, element.nextSibling);

	//设置键值 
	if (!this.__ob__.for[filterForVal]) {
		this.__ob__.for[filterForVal] = [];
		_tools.setBind.call(this, filterForVal);
	}

	//写进观察者
	this.__ob__.for[filterForVal].push(element);
	//存储循环组节点成员
	element.__forElementGroup__ = [];
	//存储父级的节点
	element.__parentNode__ = parentNode;
	//存储循环组的占位节点
	element.__presentSeize__ = presentSeize;
	//储存当前for中的item
	element.__forItem__ = forItem;
	//储存当前for中的key
	element.__forKey__ = forKey;
	//存储自己节点
	element.__self__ = element.cloneNode(true);
	presentSeize.__element__ = element;

	//创建一个文档片段
	var fragment = document.createDocumentFragment();

	//设置节点
	var getKeys = void 0;
	if (getForVal === null || getForVal === undefined || getForVal === '') {
		getKeys = [];
	} else {
		getKeys = Object.keys(getForVal);
	}

	getKeys.forEach(function (key, index) {
		var cloneNode = element.cloneNode(true);
		cloneNode.__for__ = {
			forItem: forItem,
			forKey: key,
			index: index,
			keyLine: filterForVal + '.' + getKeys[index],
			isAppend: true
		};

		if (!(cloneNode.__keyLine__ instanceof Object)) {
			cloneNode.__keyLine__ = {};
		}

		cloneNode.__keyLine__[forItem] = getForVal.__keyLine__ + '.' + getKeys[index];

		cloneNode.$index = index;
		element.__forElementGroup__.push(cloneNode);
		fragment.appendChild(cloneNode);
	});

	//使用占位节点替换掉原本的dom节点信息
	parentNode.replaceChild(oldElementReplace, element);
	parentNode.insertBefore(fragment, presentSeize);

	//设置一下键值作用域
	element.__forElementGroup__.forEach(function (element) {
		_tools.setScope.call(_this2, element);
		//设置键值的作用域
		Object.defineProperty(element.$scope, element.__for__.forItem, {
			get: function get() {
				//这里是为了处理值对象为数字而建立
				var getData = _this._get(element.__for__.keyLine, element);
				if (getData !== null) {
					return getData;
				} else if (/^_____array_____/.test(element.__for__.keyLine)) {
					return element.__for__.index + 1;
				} else {
					return null;
				}
			}
		});
		//设置索引的作用域
		Object.defineProperty(element.$scope, '$index', {
			get: function get() {
				return element.__for__.index;
			}
		});
		//设置索引的作用域
		if (forKey) {
			Object.defineProperty(element.$scope, forKey, {
				get: function get() {
					return element.__for__.forKey;
				}
			});
		}
	});
};

exports.setFor = setFor;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.forUpdate = undefined;

var _dom = __webpack_require__(2);

var _vdom = __webpack_require__(9);

var _vdom2 = _interopRequireDefault(_vdom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function forUpdate(key) {
	var _this2 = this;

	//初始化
	if (key === undefined || key === '') {
		Object.keys(this.__ob__.for).forEach(function (keyLine, index) {
			updateFn.call(_this2, keyLine);
		});
	} else {
		//如果不存在键值，不执行更新
		if (!this.__ob__.for[key]) {
			return;
		}
		updateFn.call(this, key);
	}
}

function updateFn(key) {
	var _this3 = this;

	var vdom = new _vdom2.default();
	var _this = this;
	var updateKeys = [];
	//获取element节点
	var elements = this.__ob__.for[key];
	var forItem = '';

	elements.forEach(function (element) {
		forItem = element.__forItem__;
		//获取当前的作用域链数据
		var getData = _this3._get(key, element);
		//如果当前值是null，返回空数组循环
		if (getData === null || getData === '' || getData === undefined) {
			getData = [];
			//判断是否通过数字来循环的
			if (element.isNumFor) {
				getData = element.__forValue__;
			}
		}

		//IE下Object.keys不识别字符串
		if (typeof getData === 'string') {
			getData = getData.split('');
		}

		var dataLength = Object.keys(getData).length;
		//当前循环组内的append的循环节点
		var forElementGroup = element.__forElementGroup__;
		var forElementGroupLength = forElementGroup.length;
		//存储移除数据的节点文档片段
		var fragment = document.createDocumentFragment();
		//相同数据数量更新数据流
		if (dataLength == forElementGroupLength) {
			for (var index = 0; index < forElementGroupLength; index++) {
				if (forElementGroup[index].__for__.isAppend == false) {
					forElementGroup[index].__for__.isAppend = true;
					fragment.appendChild(forElementGroup[index]);
				}
			}
			//添加到实际的dom中
			element.__parentNode__.insertBefore(fragment, element.__presentSeize__);

			if (updateKeys.indexOf(element.__forKey__) === -1) {
				updateKeys.push(element.__forKey__);
			}
		} else if (dataLength < forElementGroupLength) {
			var _fragment = document.createDocumentFragment();
			//移除已添加的节点
			for (var _index = dataLength; _index < forElementGroupLength; _index++) {
				if (forElementGroup[_index].__for__.isAppend == true) {
					forElementGroup[_index].__for__.isAppend = false;
					fragment.appendChild(forElementGroup[_index]);
				}
			}

			for (var _index2 = 0; _index2 < dataLength; _index2++) {
				if (forElementGroup[_index2].__for__.isAppend == false) {
					forElementGroup[_index2].__for__.isAppend = true;
					_fragment.appendChild(forElementGroup[_index2]);
				}
			}
			//添加到实际的dom中
			element.__parentNode__.insertBefore(_fragment, element.__presentSeize__);

			if (updateKeys.indexOf(element.__forKey__) === -1) {
				updateKeys.push(element.__forKey__);
			}
		} else if (dataLength > forElementGroupLength) {

			var cloneNodeElements = [];
			var getDataKeys = Object.keys(getData);
			var _element = element;

			//先把原来隐藏的节点打开
			for (var _index3 = 0; _index3 < forElementGroupLength; _index3++) {
				if (forElementGroup[_index3].__for__.isAppend == false) {
					forElementGroup[_index3].__for__.isAppend = true;
					fragment.appendChild(forElementGroup[_index3]);
				}
			}
			//增加数据数量更新数据流
			for (var _index4 = forElementGroupLength, len = getDataKeys.length; _index4 < len; _index4++) {
				var cloneNode = element.__self__.cloneNode(true);
				cloneNode.__for__ = {
					forItem: element.__forItem__,
					forKey: getDataKeys[_index4],
					index: _index4,
					keyLine: key + '.' + getDataKeys[_index4],
					isAppend: true
				};
				cloneNode.$index = _index4;
				element.__forElementGroup__.push(cloneNode);
				fragment.appendChild(cloneNode);
				cloneNodeElements.push(cloneNode);
			}

			//添加到实际的dom中
			element.__parentNode__.insertBefore(fragment, element.__presentSeize__);
			//解析新添加的节点
			cloneNodeElements.forEach(function (element) {
				//解析节点
				vdom.resolve(element, _this3);
				//设置键值的作用域
				Object.defineProperty(element.$scope, element.__for__.forItem, {
					get: function get() {
						return _this._get(element.__for__.keyLine, element);
					}
				});
				//设置索引的作用域
				Object.defineProperty(element.$scope, '$index', {
					get: function get() {
						return element.__for__.index;
					}
				});
				//设置key的作用域
				if (_element.__forKey__) {
					Object.defineProperty(element.$scope, _element.__forKey__, {
						get: function get() {
							return element.__for__.forKey;
						}
					});
				}
			});

			//创建存在绑定的文本节点
			_dom.createTextNodes.call(_this3);
			//新建和替换绑定的文本节点信息
			_dom.replaceTextNode.call(_this3);
		}
	});

	updateKeys.forEach(function (key) {
		_this3.dep(key);
	});
}

exports.forUpdate = forUpdate;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setIf = undefined;

var _tools = __webpack_require__(0);

function nextSibling(element, ifCount) {
	var _this = this;

	if (element.nodeType === 1) {
		var attributes = element.attributes;
		if (attributes.length > 0) {
			Object.keys(attributes).forEach(function (key, index) {
				var propName = attributes[index] ? attributes[index].name : '';
				var propValue = attributes[index] ? attributes[index].value : '';
				if (/_v-.?/.test(propName)) {
					propName = propName.replace('_v-', '');
					//再遇到if就跳出
					if (propName == 'if') {
						return;
					}
					//else和elseif的对象
					if (propName == 'elseif' || propName == 'else') {
						var re = new _tools.ResolveExpr(propValue);
						var ifKeys = re.getKeys();
						var ifExpr = re.getExpr();
						var filter = re.getFilter();

						ifKeys.forEach(function (key, index) {
							if (key) {
								key = _tools.findKeyLine.apply(_this, [element, key]);
								key = (0, _tools.resolveKey)(key);
								if (!(_this.__ob__.if[key] instanceof Array)) {
									_this.__ob__.if[key] = [];
									_tools.setBind.call(_this, key);
								}
								_this.__ob__.if[key].push(ifCount);
							}
						});
						if (propName == 'else') {
							//因为要过match，必须为字符串类型的true
							element.__if__ = {
								__bind__: 'true',
								__filter__: filter
							};
						} else {
							element.__if__ = {
								__bind__: ifExpr,
								__filter__: filter
							};
						}

						ifCount.push(element);

						if (element.nextSibling) {
							var nextElement = element.nextSibling;
							nextSibling.call(_this, nextElement, ifCount);
						}
					}
				}
			});
		} else {
			if (element.nextSibling) {
				var nextElement = element.nextSibling;
				nextSibling.call(this, nextElement, ifCount);
			}
		}
	} else {
		//其他内容节点直接跳过
		if (element.nextSibling) {
			var _nextElement = element.nextSibling;
			nextSibling.call(this, _nextElement, ifCount);
		}
	}
}

function setIf(element, propName, propValue) {
	var _this2 = this;

	var ifCount = void 0;
	var re = new _tools.ResolveExpr(propValue);
	var ifKeys = re.getKeys();
	var ifExpr = re.getExpr();
	var filter = re.getFilter();

	ifKeys.forEach(function (key, index) {
		if (key) {
			key = (0, _tools.resolveKey)(key);
			//创建绑定的ob对象
			if (!(_this2.__ob__.if[key] instanceof Array)) {
				_this2.__ob__.if[key] = [];
				_tools.setBind.call(_this2, key);
			}

			//存储当前的if组
			ifCount = [];
			element.__if__ = {
				__bind__: ifExpr,
				__filter__: filter
			};

			var seize = document.createTextNode('');
			var parentNode = element.parentNode ? element.parentNode : element.__parentNode__;
			parentNode.insertBefore(seize, element.nextSibling);
			ifCount.__seize__ = seize;

			ifCount.push(element);
			if (element.nextSibling) {
				nextSibling.call(_this2, element.nextSibling, ifCount);
			}
			_this2.__ob__.if[key].push(ifCount);
		}
	});
};

exports.setIf = setIf;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ifUpdate = undefined;

var _filter = __webpack_require__(1);

var _filter2 = _interopRequireDefault(_filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*更新if*/
function ifUpdate(key) {
	var _this = this;

	//初始化
	if (key === undefined || key === '') {
		Object.keys(this.__ob__.if).forEach(function (keyLine, index) {
			updateFn.call(_this, keyLine);
		});
	} else {
		//如果不存在键值，不执行更新
		if (!this.__ob__.if[key]) {
			return;
		}
		updateFn.call(this, key);
	}

	function updateFn(keyLine) {
		var _this2 = this;

		var ifNodes = this.__ob__.if[keyLine];
		var fragment = document.createDocumentFragment();
		//if集合中的if和else/elseif
		ifNodes.forEach(function (elements, index) {
			var seize = elements.__seize__;
			var parentNode = seize.parentNode;
			for (var j = 0; j < elements.length; j++) {
				var obj = new _filter2.default(_this2.expr(elements[j].__if__.__bind__, elements[j]), elements[j].__if__.__filter__).runFilter();
				if (obj) {
					elements.forEach(function (el, _index) {
						if (_index != j) {
							fragment.appendChild(el);
						}
					});
					//初始化所有的对象隐藏,当前的对象显示
					parentNode.insertBefore(elements[j], seize);
					break;
				}
				if (j == elements.length - 1) {
					elements.forEach(function (el, _index) {
						fragment.appendChild(el);
					});
				}
			}
		});
	}
};

exports.ifUpdate = ifUpdate;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _init = __webpack_require__(10);

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (global, factory) {
	if (( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined') {
		module.exports = factory();
	} else if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof _require === 'function') {
		_require.define('View', factory);
	} else {
		global ? global.View = factory() : {};
	}
})(typeof window !== 'undefined' ? window : undefined, function () {

	_init2.default.version = "v1.1.2";

	_init2.default.versionDescription = "";

	return _init2.default;
});

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
//methods添加到实例对象的方法(不是添加到原型链上继承)
function method() {
	var methods = this.methods;
	for (var i in methods) {
		if (methods.hasOwnProperty(i)) {
			this[i] = methods[i];
		}
	}
	//集成window下的方法
	this.methods.__proto__ = window;
}

exports.default = method;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//观察者
var Observer = function () {
	function Observer(data, keyLine, _this) {
		_classCallCheck(this, Observer);

		this.element = data;
		this.view = _this;
		this.bind(keyLine);
	}

	_createClass(Observer, [{
		key: 'bind',
		value: function bind() {
			var _this2 = this;

			var _keyLine = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

			if (this.isObject(this.element)) {
				var _this = this;
				Object.keys(this.element).forEach(function (key, index) {
					//对于的数据链
					var keyLine = _keyLine == '' ? key : _keyLine + '.' + key;

					//查看对象是否为顶层对象，然后保存主键
					if (_this2.isObject(_this2.element[key])) {
						new Observer(_this2.element[key], keyLine, _this.view);
						Object.defineProperties(_this2.element[key], {
							__keyLine__: {
								enumerable: false,
								configurable: false,
								value: keyLine
							}
						});
					}

					//闭包内值代理
					var val = _this2.element[key];
					var view = _this.view;

					Object.defineProperty(_this2.element, key, {
						enumerable: true,
						configurable: true,
						get: function get() {
							return val;
						},
						set: function set(newVal) {
							//数据流没有任何变化,跳出set
							if (val === newVal) {
								return;
							}
							//设置对象或数组对象
							_this.setVal(newVal, keyLine, view);
							//设置新值
							val = newVal;
							//更新
							view.dep(keyLine);
						}
					});
				});
			}
		}
	}, {
		key: 'isObject',
		value: function isObject(data) {
			return data instanceof Object || data instanceof Array;
		}
	}, {
		key: 'setVal',
		value: function setVal(data, keyLine) {
			if (this.isObject(data)) {
				new Observer(data, keyLine, this.view);
			}
		}
	}]);

	return Observer;
}();

exports.default = Observer;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setShow = undefined;

var _tools = __webpack_require__(0);

function setShow(element, propValue) {
	var _this = this;

	var re = new _tools.ResolveExpr(propValue);
	var showKeys = re.getKeys();
	var showExpr = re.getExpr();
	var filter = re.getFilter();

	showKeys.forEach(function (key, index) {
		key = _tools.findKeyLine.apply(_this, [element, key]);
		key = (0, _tools.resolveKey)(key);
		if (!(_this.__ob__.show[key] instanceof Array)) {
			_this.__ob__.show[key] = [];
			_tools.setBind.call(_this, key);
		}
		//给element元素加上__attrs__依赖
		element.__show__ = {
			__bind__: showExpr,
			__filter__: filter
		};
		//在__ob__设置attr的依赖
		_this.__ob__.show[key].push(element);
	});
}

exports.setShow = setShow;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.showUpdate = undefined;

var _filter = __webpack_require__(1);

var _filter2 = _interopRequireDefault(_filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function showUpdate(key) {
	var _this = this;

	if (key === undefined || key === '') {
		Object.keys(this.__ob__.show).forEach(function (keyLine, index) {
			updateFn.call(_this, keyLine);
		});
	} else {
		//如果不存在键值，不执行更新
		if (!this.__ob__.show[key]) {
			return;
		}
		updateFn.call(this, key);
	}

	function updateFn(keyLine) {
		var _this2 = this;

		var showElements = this.__ob__.show[keyLine];
		showElements.forEach(function (element, index) {
			var showValue = new _filter2.default(_this2.expr(element.__show__.__bind__, element), element.__show__.__filter__).runFilter();
			if (showValue == true || showValue.toString().toLocaleLowerCase() === 'ok') {
				showValue = '';
			} else if (showValue == false || showValue.toString().toLocaleLowerCase() === 'no') {
				showValue = 'none';
			}
			//如果有数据不相同改变				
			element.style.display = showValue;
		});
	}
}

exports.showUpdate = showUpdate;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
//watch监听data的keyLine更新
function watchUpdate(keyLine) {
	if (this.watch[keyLine] && typeof this.watch[keyLine] === 'function') {
		this.watch[keyLine].call(this, this._get(keyLine));
	}
}

exports.watchUpdate = watchUpdate;

/***/ })
/******/ ]);
});