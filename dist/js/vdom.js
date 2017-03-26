/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
function getEl(id) {
	return document.getElementById(id);
}

function disassembly(text) {
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
}

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

exports.getEl = getEl;
exports.disassembly = disassembly;
exports.getDisassemblyKey = getDisassemblyKey;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _update = __webpack_require__(8);

Object.defineProperty(exports, 'domUpdate', {
  enumerable: true,
  get: function get() {
    return _update.domUpdate;
  }
});

var _setDom = __webpack_require__(7);

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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _observer = __webpack_require__(10);

var _observer2 = _interopRequireDefault(_observer);

var _vdom = __webpack_require__(11);

var _vdom2 = _interopRequireDefault(_vdom);

var _tools = __webpack_require__(0);

var _dom = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

		//解析对象
		this.el = el && typeof (0, _tools.getEl)(el) !== 'null' && template === undefined ? (0, _tools.getEl)(el) : '';
		//组件
		this.components = components;
		//设置data值
		this.data = data;

		//判断是否绑定节点或者模板
		if (!this.el && !this.template) {
			return false;
		}

		//配置对象
		this.config();
		//设置observe
		new _observer2.default(this.data, undefined, this);
		//初始化内容
		this.init();
	}

	_createClass(View, [{
		key: 'init',
		value: function init() {
			//创建vdom内容
			this.vdom = new _vdom2.default().resolve(this.el, this);
			//创建存在绑定的文本节点
			_dom.createTextNodes.call(this);
			//新建和替换绑定的文本节点信息
			_dom.replaceTextNode.call(this);
			//初始化更新
			this.update();
		}
	}, {
		key: 'config',
		value: function config() {
			this.__ob__ = {
				dom: {},
				attr: {}
			};
		}
	}, {
		key: 'update',
		value: function update(keys) {
			_dom.domUpdate.call(this, keys);
		}
	}, {
		key: '_get',
		value: function _get(keyLink) {
			var key = '';
			//存在实例屬性對象
			if (/\./g.test(keyLink)) {
				var obj = keyLink.split('.'),
				    newObject = this['data'];
				//存在值
				if (this['data'][obj[0]]) {
					for (var i = 0; i < obj.length; i++) {
						key = obj[i];
						newObject = newObject[key] !== undefined ? newObject[key] : null;
					}
					return newObject;
				} else {
					return null;
				}
			} else if (this['data'][keyLink] != undefined) {
				return this['data'][keyLink];
			} else {
				return null;
			}
		}
		/*设置过滤器*/

	}], [{
		key: 'setFilter',
		value: function setFilter(filterName, handler) {
			this.filterHandlers[filterName] = handler;
		}
	}]);

	return View;
}();

//过滤器数据(带默认过滤器)


View.filterHandlers = {
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setAttr = __webpack_require__(4);

Object.defineProperty(exports, 'setAttr', {
  enumerable: true,
  get: function get() {
    return _setAttr.setAttr;
  }
});

var _update = __webpack_require__(5);

Object.defineProperty(exports, 'attrUpdate', {
  enumerable: true,
  get: function get() {
    return _update.attrUpdate;
  }
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
//import {getKeys} from './../tools'; 
//import {setFor} from './../for'; 
//import {setIf} from './../if'; 
//import {setShow} from './../show'; 
//import {setModel} from './../model'; 

/*查找element对象中的属性*/
function setAttr(el) {
	var _this = this;

	var elAttrs = el.attributes,
	    attrName = void 0,
	    attrVal = void 0,
	    key = void 0,
	    splitKeys = void 0;

	for (var i = 0; i < elAttrs.length; i++) {
		attrName = elAttrs[i].name;
		attrVal = elAttrs[i].textContent;
		if (/:.?/.test(attrName)) {
			//删除绑定属性
			el.removeAttribute(attrName);
			i -= 1;

			attrName = attrName.replace(':', '');
			//获取到主Key的数组
			key = getKeys.call(this, attrVal);
			//存在数据绑定,不存在数据绑定的值无意义,不进行计算,则不会添加属性
			key.forEach(function (item, index) {
				if (item) {
					if (!_this.attrBindings[item]) {
						_this.attrBindings[item] = [];
					}
					if (!(el['attrbindingKey'] instanceof Object)) {
						el['attrbindingKey'] = {};
					}
					el['attrbindingKey'][attrName] = attrVal;
					_this.attrBindings[item].push(el);
				}
			});

			/*key.forEach(function(item, index) {
   	if(item) {
   		if(!(this.attrBindings[item])) {
   			this.attrBindings[item] = [];
   		}
   		if(!(el['attrbindingKey'] instanceof Object)) {
   			el['attrbindingKey'] = {};
   		}
   		el['attrbindingKey'][attrName] = attrVal;
   		this.attrBindings[item].push(el);
   	}
   }.bind(this));*/
		}
		if (/_v-.?/.test(attrName)) {
			//删除绑定属性
			el.removeAttribute(attrName);
			i -= 1;

			attrName = attrName.replace('_v-', '');
			//获取到主Key的数组
			key = getKeys.call(this, attrVal);
			switch (attrName) {
				case 'for':
					setFor.call(this, el, attrVal);
					break;
				case 'if':
					setIf.call(this, el, key, attrName, attrVal);
					break;
				case 'show':
					setShow.call(this, el, key, attrVal);
					break;
				case 'model':
					setModel.call(this, el, attrVal);
				default:
					;
			}
		}
	}
}

exports.setAttr = setAttr;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
//属性更新
function attrUpdate(key) {
	var _this = this;

	//初始化
	if (key === undefined || key === '') {

		Object.keys(this.attrBindings).forEach(function (key, index) {
			var keyObj = _this.attrBindings[key];
			updateFn.call(_this, keyObj);
		});

		/*for(var _key in this.attrBindings) {
  	var keyObj = this.attrBindings[_key];
  	updateFn.call(this, keyObj);
  }*/
	} else {
		//存在key时候更新属性
		var keyObj = this.attrBindings[key] ? this.attrBindings[key] : [];
		updateFn.call(this, keyObj);
	}

	function updateFn(keyObj) {
		var _this2 = this;

		keyObj.forEach(function (item, index) {
			Object.keys(item['attrbindingKey']).forEach(function (key, _index) {
				var obj = _this2.expr(item['attrbindingKey'][key]);
				item.setAttribute(key, obj);
				item[key] = obj;
			});
			/*for(var k in item['attrbindingKey']) {
   	if(item['attrbindingKey'].hasOwnProperty(k)) {
   		//表达式或者不为data绑定的值
   		var obj = this.expr(item['attrbindingKey'][k]);
   		item.setAttribute(k, obj);
   		item.k = obj;
   	}
   }*/
		});
	}
}

exports.attrUpdate = attrUpdate;

/***/ }),
/* 6 */
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
	var componentNode = cloneNode.firstElementChild;
	nodeParent.replaceChild(componentNode, node);
	return componentNode;
}

exports.default = componentHandler;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.replaceTextNode = exports.createTextNodes = exports.setDom = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _tools = __webpack_require__(0);

//let textNodes = []; //拆分的文本节点内容
var textNodeLists = []; //拆分的文本节点内容集合
var tempFragmentElements = []; //插入拆分的文本节点内容

function setDom(element) {
	var textNodes = (0, _tools.disassembly)(element.textContent);
	textNodeLists.push([textNodes, element]);
}

//创建文本节点单独循环执行
function createTextNodes() {
	var _this = this;

	textNodeLists.forEach(function (item, index) {
		var _item = _slicedToArray(item, 2),
		    textNodes = _item[0],
		    el = _item[1];

		createTextNodeElements.call(_this, textNodes, el);
	});
}

//创建文本节点对象,推送到临时的存放点
function createTextNodeElements(textNodes, el) {
	//创建文档片段
	var fragment = document.createDocumentFragment();
	//数据推入文档节点
	for (var i = 0; i < textNodes.length; i++) {
		//过滤器组
		var filters = [];
		//查找是否存在过滤器
		if (textNodes[i].indexOf('|') != -1) {
			//获取过滤器
			var templateFilters = textNodes[i].substring(textNodes[i].indexOf('|'), textNodes[i].length - 2);
			filters = templateFilters.replace('|', '').split(' ');
			//过滤空白数组
			filters = filters.filter(function (item, index) {
				if (item != '') {
					return item;
				}
			});
			//重写绑定链
			textNodes[i] = textNodes[i].replace(templateFilters, '').replace(/ /g, '');
		}
		if (textNodes[i] !== "") {
			//查看是否为数据绑定
			var textNode = document.createTextNode(textNodes[i]);
			if (/\{\{\S+\}\}/.test(textNodes[i]) == true) {
				var key = textNodes[i].replace(/(\{)?(\})?/g, '');
				if (!(this.__ob__.dom[key] instanceof Object)) {
					this.__ob__.dom[key] = [];
				}
				//设置节点的过滤器
				textNode['filters'] = filters;
				this.__ob__.dom[key].push(textNode);
			}
			fragment.appendChild(textNode);
		}
	}
	//el为父级节点,fragment为文档片段,index为索取文本节点在父级节点的位置
	tempFragmentElements.push([el.parentNode, fragment, el]);
}

//替换原文本节点
function replaceTextNode() {
	tempFragmentElements.forEach(function (item, index) {
		var _item2 = _slicedToArray(item, 3),
		    parentNode = _item2[0],
		    fragmentNode = _item2[1],
		    oldTextNode = _item2[2];

		parentNode.replaceChild(fragmentNode, oldTextNode);
	});
}

exports.setDom = setDom;
exports.createTextNodes = createTextNodes;
exports.replaceTextNode = replaceTextNode;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
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

	function updateFn(keyLine) {
		var val = this._get(keyLine),
		    textNodes = this.__ob__.dom[keyLine];

		textNodes.forEach(function (element) {
			//是否存在过滤器
			if (element['filters'].length > 0) {
				val = filter(val, element['filters']);
			}
			element.textContent = val;
		});
	}
}

//检测绑定的对象是否存在过滤器,存在过滤器则返回过滤的值
function filter(val, filters) {
	filters.forEach(function (item, index) {
		val = View.filterHandlers[filters[index]](val);
	});
	return val;
};

exports.domUpdate = domUpdate;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _init = __webpack_require__(2);

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (global, factory) {
	//封装在模块加载器中
	typeof _require === 'function' ? _require.define('View', factory) : global.View = factory();
})(typeof window !== 'undefined' ? window : undefined, function () {

	_init2.default.version = "v0.0.1";

	_init2.default.versionDescription = "vdom";

	//AMD module
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return _init2.default;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}

	return _init2.default;
});

/***/ }),
/* 10 */
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
					}

					//闭包内值代理
					var val = _this2.element[key];

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
							_this.setVal(newVal, keyLine, _this.view);
							//设置新值
							val = newVal;

							_this.view.update(keyLine);
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
				new Observer(data, keyLine);
			}
		}
	}]);

	return Observer;
}();

exports.default = Observer;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/*拆解绑定的信息*/


var _dom = __webpack_require__(1);

var _component = __webpack_require__(6);

var _component2 = _interopRequireDefault(_component);

var _attr = __webpack_require__(3);

var _tools = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//状态
var REPLACE = 0;
var REORDER = 1;
var PROPS = 2;
var TEXT = 3;

var _ELement = function () {
	function _ELement(context) {
		_classCallCheck(this, _ELement);

		this.id = 0;
		this.elementList = {};
		this.context = context;
	}

	_createClass(_ELement, [{
		key: 'render',
		value: function render(options) {
			var el = void 0;
			if (options.tagName) {
				el = document.createElement(options.tagName);
				//设置属性
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = Object.entries(options.props)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var _step$value = _slicedToArray(_step.value, 2),
						    prop = _step$value[0],
						    value = _step$value[1];

						el.setAttribute(prop, value);
					}
					//设置子节点
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = options.childrens[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var children = _step2.value;

						var createElement = void 0;
						if (children instanceof Object) {
							createElement = this.render(children);
						} else {
							createElement = document.createTextNode(children);
						}
						el.appendChild(createElement);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			} else {
				el = document.createTextNode(options.textContent);
			}

			return el;
		}
	}, {
		key: 'resolve',
		value: function resolve(element, _this) {
			var _this2 = this;

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

				for (var _index in Object.keys(element.attributes)) {
					var prop = element.attributes,
					    propName = prop[_index].name,
					    propValue = prop[_index].value;

					if (/:.?/.test(propName)) {
						//清除:号
						propName = propName.replace(':', '');
						//给vdom加上属性
						vdom.props[propName] = propValue;
						var attrKeys = (0, _tools.getDisassemblyKey)((0, _tools.disassembly)(propValue));
						attrKeys.forEach(function (val, index) {
							if (!_this.__ob__.attr[val]) {
								_this.__ob__.attr[val] = [];
							}
							_this.__ob__.attr[val].push(element);
						});
					}
				}

				[].concat(_toConsumableArray(element.childNodes)).forEach(function (el) {
					//设置索引
					_this2.id++;
					vdom.childrens.push(_this2.resolve(el, _this));
				});
			} else {
				//设置文本节点绑定的更新
				(0, _dom.setDom)(element);
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
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = Object.entries(newTree.props)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var _step3$value = _slicedToArray(_step3.value, 2),
					    key = _step3$value[0],
					    value = _step3$value[1];

					//如果当前的属性存在，值不相同，存值
					if (Reflect.has(oldTree.props, key) && !(oldTree.props[key] === value)) {
						props[key] = value;
					} else if (!Reflect.has(oldTree.props, key)) {
						props[key] = newTree.props[key];
					}
				}
				//添加修改过属性内容
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

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

	return _ELement;
}();

exports.default = _ELement;

/***/ })
/******/ ]);