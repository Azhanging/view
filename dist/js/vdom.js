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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
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

function getEl(id) {
	return document.getElementById(id);
}

//拆分数据
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

/*获取表达式中data绑定的值*/
function getKeyLink(expr) {
	var tempExpr = expr.match(/\{\{.*?\}\}/g);
	if (tempExpr != null) {
		var _this = this;
		return tempExpr.map(function (item, index) {
			return item.replace(/\{?\}?/g, '');
		});
	} else {
		return expr;
	}
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

exports.getEl = getEl;
exports.disassembly = disassembly;
exports.getDisassemblyKey = getDisassemblyKey;
exports.getKeyLink = getKeyLink;
exports.deepCopy = deepCopy;
exports.getIndex = getIndex;
exports.setBind = setBind;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setAttr = __webpack_require__(6);

Object.defineProperty(exports, 'setAttr', {
  enumerable: true,
  get: function get() {
    return _setAttr.setAttr;
  }
});

var _update = __webpack_require__(7);

Object.defineProperty(exports, 'attrUpdate', {
  enumerable: true,
  get: function get() {
    return _update.attrUpdate;
  }
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _update = __webpack_require__(10);

Object.defineProperty(exports, 'domUpdate', {
  enumerable: true,
  get: function get() {
    return _update.domUpdate;
  }
});

var _setDom = __webpack_require__(9);

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

var _setIf = __webpack_require__(12);

Object.defineProperty(exports, 'setIf', {
  enumerable: true,
  get: function get() {
    return _setIf.setIf;
  }
});

var _update = __webpack_require__(13);

Object.defineProperty(exports, 'ifUpdate', {
  enumerable: true,
  get: function get() {
    return _update.ifUpdate;
  }
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setShow = __webpack_require__(18);

Object.keys(_setShow).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _setShow[key];
    }
  });
});

var _update = __webpack_require__(19);

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _observer = __webpack_require__(17);

var _observer2 = _interopRequireDefault(_observer);

var _method = __webpack_require__(15);

var _method2 = _interopRequireDefault(_method);

var _vdom = __webpack_require__(20);

var _vdom2 = _interopRequireDefault(_vdom);

var _tools = __webpack_require__(0);

var _dom = __webpack_require__(2);

var _attr = __webpack_require__(1);

var _show = __webpack_require__(4);

var _if = __webpack_require__(3);

var _watch = __webpack_require__(21);

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

		this.$element = el;
		//解析对象
		if (el && typeof (0, _tools.getEl)(el) !== 'null') {
			this.el = (0, _tools.getEl)(el);
			if (this.el.tagName == 'TEMPLATE') {
				this.el = this.el.content.firstElementChild;
				//				this.isTemplate = true;
			}
		} else {
			this.el = '';
		}
		//设置data值
		this.data = data;
		//实例方法	
		this.methods = methods;
		//组件
		this.components = components;
		//模板
		//		this.isTemplate ? (this.data['templateData'] = {}) : '';
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
				bind: []
			};
		}
	}, {
		key: 'dep',
		value: function dep(keys) {
			var _this = this;

			var updates = [keys];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.__ob__.bind[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var key = _step.value;

					if (key.indexOf(keys + '.') != -1) {
						updates.push(key);
					}
				}
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

			updates.forEach(function (keyLine) {
				_this.update(keyLine);
			});
		}
	}, {
		key: 'update',
		value: function update(keys) {
			_attr.attrUpdate.call(this, keys);
			_show.showUpdate.call(this, keys);
			_if.ifUpdate.call(this, keys);
			_dom.domUpdate.call(this, keys);
			_watch.watchUpdate.call(this, keys);
		}
	}, {
		key: '_get',
		value: function _get(keyLink) {
			//存在实例屬性對象
			if (/\./g.test(keyLink)) {
				var obj = keyLink.split('.');
				var getVal = this['data'];
				//存在值
				if (this['data'][obj[0]]) {
					for (var i = 0; i < obj.length; i++) {
						var key = obj[i];
						getVal = getVal[key] !== undefined ? getVal[key] : null;
					}
					return getVal;
				} else {
					return null;
				}
			} else if (this['data'][keyLink] != undefined) {
				return this['data'][keyLink];
			} else {
				return null;
			}
		}
	}, {
		key: '_set',
		value: function _set(obj, val, key) {
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
				if (this._get(obj) !== null) {
					//设置新的值
					if (key != undefined) {
						this._get(obj)[lastIndex][key] = val;
					} else {
						this._get(obj)[lastIndex] = val;
					}
					//设置新的值
					if (!(typeof val === 'string')) {
						this._get(obj)[lastIndex] = (0, _tools.deepCopy)(this._get(obj)[lastIndex]);
					}
				}
			} else {
				/*只有一个key值*/
				if (this._get(obj) !== null) {
					if (key != undefined) {
						this._get(obj)[key] = val;
						var getData = this._get(obj);
						getData = (0, _tools.deepCopy)(this._get(obj));
					} else {
						//2017年03月06日20:32:59 优化两次更新  //this.data[obj] = val;
						//					this.data[obj] = (typeof val == 'object' ? deepCopy(val) : this.data[obj]);
						this.data[obj] = (typeof val === 'undefined' ? 'undefined' : _typeof(val)) == 'object' ? (0, _tools.deepCopy)(val) : val;
					}
				}
			}
		}
	}, {
		key: 'expr',
		value: function expr(_expr) {
			var dataValues = _tools.getKeyLink.call(this, _expr);
			var dataValueLen = dataValues.length;
			var newExpr = _expr;

			//返回的不是主key数组
			if (!(dataValues instanceof Array)) {
				//解析表达式抛出
				try {
					return eval("(" + _expr + ")");
				} catch (e) {
					return '';
				}
			}

			for (var i = 0; i < dataValueLen; i++) {
				if (this._get(dataValues[i]) !== null) {
					var data = this._get(dataValues[i]);
					//处理for绑定,for只允许绑定一个data,不支持表达式
					if (arguments[1] === 'for') {
						return this._get(dataValues[i]);
					}
					//更新为绑定表达式
					newExpr = newExpr.replace(new RegExp('\{\{' + dataValues[i] + '\}\}', 'g'), data === false || data === true ? data : "'" + data + "'");
				} else {
					//处理不存在数据流空值替换对象内容
					newExpr = newExpr.replace(new RegExp('\{\{' + dataValues[i] + '\}\}', 'g'), "''");
				}
			}
			try {
				//解析表达式
				return eval(newExpr);
			} catch (e) {
				//报错返回空值
				return '';
			}
		}
	}, {
		key: 'createTemplate',
		value: function createTemplate(vals, appendEl) {
			var html = void 0,
			    cloneNode = void 0;
			//循环添加到指定的DOM节点上
			vals.forEach(function (item, index) {
				//设置数据流更新
				this.data.templateData = item;
				for (var k = 0; k < this.template.content.childNodes.length; k++) {
					//复制临时节点
					var tempNode = this.template.content.childNodes[k].cloneNode(true);
					//添加到对应节点上
					document.getElementById(appendEl).appendChild(tempNode);
					//绑定当前节点事件
					if (tempNode.nodeType == 1) {
						eventBinding.call(this, tempNode);
					}
					//模板添加事件
					setChildTemplateEvent.call(this, tempNode);
				}
			}.bind(this));
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setAttr = undefined;

var _tools = __webpack_require__(0);

var _show = __webpack_require__(4);

var _if = __webpack_require__(3);

var _model = __webpack_require__(16);

/*查找element对象中的属性*/
/*拆解绑定的信息*/
function setAttr(element, vdom) {
	var _this = this;

	var _loop = function _loop(_index) {
		var prop = element.attributes,
		    propName = prop[_index].name,
		    propValue = prop[_index].value;

		if (/:.?/.test(propName)) {
			//删除当前绑定到真实attr上的属性
			//清除:号
			propName = propName.replace(':', '');
			//给vdom加上属性
			vdom.props[propName] = propValue;
			var attrKeys = (0, _tools.getDisassemblyKey)((0, _tools.disassembly)(propValue));
			attrKeys.forEach(function (val, index) {
				if (!_this.__ob__.attr[val]) {
					_this.__ob__.attr[val] = [];
					_tools.setBind.call(_this, val);
				}
				//设置attrs的expr
				if (!(element.__attrs__ instanceof Object)) {
					element.__attrs__ = {};
				}
				//给element元素加上__attrs__依赖
				element.__attrs__[propName] = propValue;
				//在__ob__设置attr的依赖
				_this.__ob__.attr[val].push(element);
			});
		}

		if (/_v-.?/.test(propName)) {
			//删除绑定属性
			propName = propName.replace('_v-', '');
			//获取到主Key的数组
			switch (propName) {
				//				case 'for':
				//					setFor.call(this, el, attrVal);
				//					break;
				case 'show':
					_show.setShow.call(_this, element, propValue);
					break;
				case 'if':
					_if.setIf.call(_this, element, propName, propValue);
					break;
				case 'model':
					_model.setModel.call(_this, element, propValue);
				default:
					;
			}
		}
		if (/@.?/.test(propName)) {
			var filterpropValue = propValue.replace(/\(+\S+\)+/g, '');
			propName = propName.replace('@', '');
			//存在这个方法
			if (_this[filterpropValue]) {
				//存在参数值
				if (propValue.match(/\(\S+\)/) instanceof Array) {
					var args = propValue.match(/\(\S+\)/)[0].replace(/\(?\)?/g, '').split(',');
					//绑定事件
					element.addEventListener(propName, function (event) {
						//对数组内的数据查看是否存在的数据流进行过滤
						var filterArgs = args.map(function (item, index) {
							//如果传入的对象是$index,获取当前父级中所在的索引
							if (item === '$index') {
								return getIndex.call(_this, el);
							} else if (item === '$event') {
								return event;
							} else {
								//解析data中的值
								return _this.expr(item).toString();
							}
						});

						//运行绑定的event
						_this[filterpropValue].apply(_this, filterArgs);
					}, false);
				} else {
					//不存在参数值过滤掉空的括号
					el.addEventListener(propName, function (event) {
						_this[filterpropValue].call(_this, event);
					}, false);
				}
			}
		}
	};

	for (var _index in Object.keys(element.attributes)) {
		_loop(_index);
	}
}

exports.setAttr = setAttr;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Object.entries(attrs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _step$value = _slicedToArray(_step.value, 2),
					    propName = _step$value[0],
					    propValue = _step$value[1];

					element.setAttribute(propName, _this2.expr(propValue));
				}
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
		});
	}
}

exports.attrUpdate = attrUpdate;

/***/ }),
/* 8 */
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
/* 9 */
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
					_tools.setBind.call(this, key);
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
/* 10 */
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
		var val = this._get(keyLine);
		//如果当前的对象获取到的为null，返回一个空的字符串
		val = val == null ? '' : val;
		var textNodes = this.__ob__.dom[keyLine];
		textNodes.forEach(function (element) {
			//是否存在过滤器
			if (element['filters'].length > 0) {
				val = filter(val, element['filters']);
			}
			//如果返回的是节点
			if (val instanceof Array && val.length > 0 && val[0].nodeType) {
				//走接点过滤处理
				htmlNode(val, element);
			} else {
				//检查是否存在过滤器或者数组插入的dom节点
				isTextNodePrevSibline(element);
				//直接为数据节点
				element.textContent = val;
			}
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setChildTemplateEvent = exports.setForEvent = exports.setEvent = undefined;

var _tools = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//事件绑定
function setEvent(el) {
	var _this = this;

	var elAttrs = el.attributes,
	    attrName = void 0,
	    attrVal = void 0;

	[].concat(_toConsumableArray(el.attributes)).forEach(function (item, index) {
		attrName = item.name;
		attrVal = item.textContent;
		var filterAttrVal = attrVal.replace(/\(+\S+\)+/g, '');
		if (/@.?/.test(attrName)) {
			attrName = attrName.replace('@', '');
			//存在这个方法
			if (_this[filterAttrVal]) {
				//存在参数值
				if (attrVal.match(/\(\S+\)/) instanceof Array) {
					var args = attrVal.match(/\(\S+\)/)[0].replace(/\(?\)?/g, '').split(',');
					//绑定事件
					el.addEventListener(attrName, function (event) {
						//对数组内的数据查看是否存在的数据流进行过滤
						var filterArgs = args.map(function (item, index) {
							//如果传入的对象是$index,获取当前父级中所在的索引
							if (item === '$index') {
								return _tools.getIndex.call(_this, el);
							} else if (item === '$event') {
								return event;
							} else {
								//解析data中的值
								return _this.expr(item).toString();
							}
						});

						//运行绑定的event
						_this[filterAttrVal].apply(_this, filterArgs);
					}, false);
				} else {
					//不存在参数值过滤掉空的括号
					el.addEventListener(attrName, function (event) {
						_this[filterAttrVal].call(_this, event);
					}, false);
				}
			}
		}
	});
}

/*_v-for对象循环添加事件*/
function setForEvent(el, index) {
	var _this2 = this;

	var childEls = el.childNodes,
	    childElsLen = childEls.length;
	if (el.nodeType === 1) {
		//这里为查看是否通过数组循环出来的，添加index到当前循环对象
		if (!isNaN(index)) {
			//如果使用的是模板，cloneNode中无法赋值私有的属性，通过data-index设置所有值
			if (this.template) {
				el.dataset['index'] = index;
			} else {
				el.$index = index;
			}
		}
		//绑定循环中的事件
		setEvent.call(this, el);
		if (childElsLen > 0) {
			[].concat(_toConsumableArray(childEls)).forEach(function (item, index) {
				if (item.nodeType == 1) {
					setEvent.call(_this2, item);
				}
			});
		}
	}
}

/*
 *	在templateData中,$index的参数会根据插入的节点对象进行返回index的值
 *	模板子对象循环添加事件
 */

function setChildTemplateEvent(el) {
	var _this3 = this;

	var childEls = el.childNodes,
	    childElsLen = childEls.length,
	    i = 0;

	[].concat(_toConsumableArray(el.childNodes)).forEach(function (el, index) {
		if (el.nodeType == 1) {
			if (el.childNodes.length > 0) {
				setChildTemplateEvent.call(_this3, el);
			}
			setEvent.call(_this3, el);
		}
	});
}

exports.setEvent = setEvent;
exports.setForEvent = setForEvent;
exports.setChildTemplateEvent = setChildTemplateEvent;

/***/ }),
/* 12 */
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
		Object.keys(attributes).forEach(function (key, index) {
			var propName = attributes[index].name;
			var propValue = attributes[index].value;
			if (/_v-.?/.test(propName)) {
				propName = propName.replace('_v-', '');
				//再遇到if就跳出
				if (propName == 'if') {
					return;
				}
				//else和elseif的对象
				if (propName == 'elseif' || propName == 'else') {
					var ifKeys = (0, _tools.getDisassemblyKey)((0, _tools.disassembly)(propValue));
					ifKeys.forEach(function (key, index) {
						if (key) {
							if (!(_this.__ob__.if[key] instanceof Array)) {
								_this.__ob__.if[key] = [];
							}
							_this.__ob__.if[key].push(ifCount);
						}
					});
					if (propName == 'else') {
						//因为要过match，必须为字符串类型的true
						element.__if__ = 'true';
					} else {
						element.__if__ = propValue;
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
		//其他内容节点直接跳过
		if (element.nextSibling) {
			var nextElement = element.nextSibling;
			nextSibling.call(this, nextElement, ifCount);
		}
	}
}

function setIf(element, propName, propValue) {
	var _this2 = this;

	var ifCount = void 0;
	var ifKeys = (0, _tools.getDisassemblyKey)((0, _tools.disassembly)(propValue));
	ifKeys.forEach(function (key, index) {
		if (key) {
			if (!(_this2.__ob__.if[key] instanceof Array)) {
				_this2.__ob__.if[key] = [];
				_tools.setBind.call(_this2, key);
			}
			if (propName === 'if') {
				ifCount = [];
				element.__if__ = propValue;
				ifCount.push(element);
				if (element.nextSibling) {
					nextSibling.call(_this2, element.nextSibling, ifCount);
				}
			}
			_this2.__ob__.if[key].push(ifCount);
		}
	});
};

exports.setIf = setIf;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
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
		//if集合中的if和else/elseif
		ifNodes.forEach(function (keyLineItem, index) {
			for (var j = 0; j < keyLineItem.length; j++) {
				var obj = _this2.expr(keyLineItem[j].__if__);
				if (obj) {
					keyLineItem.forEach(function (el, _index) {
						el.style.display = 'none';
					});
					//初始化所有的对象隐藏,当前的对象显示
					keyLineItem[j].style.display = 'block';
					break;
				}
				if (j == keyLineItem.length - 1) {
					keyLineItem.forEach(function (el, _index) {
						el.style.display = 'none';
					});
				}
			}
		});
	}
};

exports.ifUpdate = ifUpdate;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _init = __webpack_require__(5);

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
/* 15 */
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
}

exports.default = method;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
function setModel(element, propValue) {
	var _this = this;
	var resolveVal = propValue.replace(/\{?\}?/g, '');
	var elTagName = element.tagName.toLocaleLowerCase();
	//初始化值
	element.value = this._get(resolveVal);
	//绑定按键事件
	if (elTagName === 'input' || elTagName === 'textarea') {
		element.addEventListener('keyup', function (event) {
			if (event.keyCode == 32 || event.keyCode == 34 || event.keyCode == 8 || event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 99 || event.keyCode >= 101 && event.keyCode <= 103 || event.keyCode >= 186 && event.keyCode <= 222) {
				var value = this.value;
				_this._set(resolveVal, value);
			}
		});
	}
}

exports.setModel = setModel;

/***/ }),
/* 17 */
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

							_this.view.dep(keyLine);
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setShow = undefined;

var _tools = __webpack_require__(0);

function setShow(element, propValue) {
	var _this = this;

	var attrKeys = (0, _tools.getDisassemblyKey)((0, _tools.disassembly)(propValue));
	attrKeys.forEach(function (val, index) {
		if (!(_this.__ob__.show[val] instanceof Array)) {
			_this.__ob__.show[val] = [];
			_tools.setBind.call(_this, val);
		}
		//给element元素加上__attrs__依赖
		element.__show__ = propValue;
		//在__ob__设置attr的依赖
		_this.__ob__.show[val].push(element);
	});
}

exports.setShow = setShow;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
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
			var showValue = _this2.expr(element.__show__);

			if (showValue == true || showValue == 'block' || showValue.toString().toLocaleLowerCase() === 'ok') {
				showValue = 'block';
			} else if (showValue == false || showValue == 'none' || showValue.toString().toLocaleLowerCase() === 'no') {
				showValue = 'none';
			}
			element.style.display = showValue;
		});
	}
}

exports.showUpdate = showUpdate;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(2);

var _component = __webpack_require__(8);

var _component2 = _interopRequireDefault(_component);

var _attr = __webpack_require__(1);

var _event = __webpack_require__(11);

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

				//设置属性的绑定
				_attr.setAttr.call(_this, element, vdom);
				//设置事件
				//			setEvent.call(_this,element);

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

/***/ }),
/* 21 */
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