import Observer from './../observer';
import method from './../method';
import vdom from './../vdom';
import { getEl,getKeyLink, deepCopy, getScope, getFirstElementChild, initRegExp,ElementCache,setDep} from './../tools';
import { domUpdate, createTextNodes, replaceTextNode } from './../dom';
import { attrUpdate } from './../attr';
import { showUpdate } from './../show';
import { ifUpdate } from './../if';
import { forUpdate } from './../for';
import { watchUpdate } from './../watch';
import { setEvent, setChildTemplateEvent } from './../event';
import { modelUpdate ,formElements} from './../model';

let ___index = 0;

class View {
	constructor({
		el = '',
		template = undefined,
		data = {},
		methods = {},
		components = {},
		watch = {},
		init = () => {},
		created = () => {},
		ready = () => {}
	} = options) {
		this.$element = el;
		//设置data值
		this.data = data;
		//解析对象
		if(el && typeof getEl(el) !== 'null') {
			//获取当前的元素
			this.el = getEl(el);
			//提前判断是否为模板
			this.isTemplate = false;
			//判断是否为模板
			if(this.el.tagName == 'TEMPLATE') {
				this.el = getFirstElementChild(this.el.content ? this.el.content : this.el);
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
		if(!(this.el)) {
			return false;
		}
		//初始化内容
		this._init();
	}
	_init() {
		//构建前钩子函数
		this.init();
		//配置对象
		this.config();
		//设置方法
		method.call(this);
		//设置observe
		new Observer(this.data, undefined, this);
		//创建vdom内容
		this.vdom = new vdom().resolve(this.el, this);
		//创建存在绑定的文本节点
		createTextNodes.call(this);
		//新建和替换绑定的文本节点信息
		replaceTextNode.call(this);
		//创建钩子函数
		this.created();
		//初始化更新
		this.update();
		//准备钩子函数
		this.ready();
	}
	config() {
		this.__ob__ = {
			dom: {},
			attr: {},
			show: {},
			if: {},
			for: {},
			model:{},
			bind: []
		};

		this.__bind__ = {
			textNodeLists: [],
			tempFragmentElements: [],
			templateIndex: 0
		};
		
		this.cache = [];
		//更新列表
		this.updateList = [];
	}
	dep(keys) {
		
		setDep.call(this,keys);
		
		console.log(this.updateList);
		
		for(let index = 0;index < this.updateList.length;index++){
			this.update(this.updateList[index]);
		}
		
		this.updateList = [];
	}
	update(keys) {
		watchUpdate.call(this, keys);
		forUpdate.call(this, keys);			
		modelUpdate.call(this,keys);
		attrUpdate.call(this, keys);
		showUpdate.call(this, keys);
		ifUpdate.call(this, keys);
		domUpdate.call(this, keys);
		//清楚节点中的缓存
		new ElementCache(this).removeCache();
	}
	_get(keyLink, element) {
		//是否存在缓存节点信息
		if(element == undefined || element.__cache__[keyLink] === undefined){
			//获取作用域内的值
			let getVal;
			if(element) {
				getVal = getScope.call(this, element);
			} else {
				getVal = this.data;
			}
			//存在实例屬性對象
			if(/\./g.test(keyLink)) {
				let keys = keyLink.split('.');
				//存在值
				if(getVal) {
					for(let i = 0; i < keys.length; i++) {
						let key = keys[i];
						try {
							let data = getVal[key];
							getVal = (getVal !== null && data !== undefined) ? data : null;
						} catch(error) {
							return null;
						}
					}
					element?(element.__cache__[keyLink] = getVal):null;
					return getVal;
				} else {
					element?(element.__cache__[keyLink] = null):null;
					return null;
				}
			} else{
				let data = getVal[keyLink];
				if(data != undefined) {
					element?(element.__cache__[keyLink] = data):null;
					return data;
				} else {
					element?(element.__cache__[keyLink] = null):null;
					return null;
				}
			}
		}else{
			//直接返回缓存数据
			return element.__cache__[keyLink];
		}
	}
	_set(element, obj, val, key) {
		let data = this['data'],
			objs = obj.split('.'),
			keyLen = objs.length,
			parentObj = objs[0], //对象中顶级key
			i = 0,
			tempObject = data,
			tempVal;
		//如果存在多层值
		if(keyLen != 1) {
			//最后一个key
			let lastIndex = objs[objs.length - 1];
			//移除最后一个值
			objs.pop();
			//把key链重组
			obj = objs.join('.');
			let getData;
			if(element) {
				getData = this._get(obj, element);
			} else {
				getData = this._get(obj);
			}
			if(getData !== null) {
				//设置新的值
				if(key != undefined) {
					getData[lastIndex][key] = val;
				} else {
					getData[lastIndex] = val;
				}
				//处理字符串数据流更新
				if(!(typeof val === 'string')) {
					getData[lastIndex] = deepCopy(getData[lastIndex]);
				}
			}
		} else {
			let getData;

			if(element) {
				getData = this._get(obj, element);
			} else {
				getData = this._get(obj);
			}

			/*只有一个key值*/
			if(getData !== null) {
				if(key != undefined) {
					getData[key] = val;
				} else {
					this.data[obj] = (typeof val == 'object' ? deepCopy(val) : val);
				}
			}
		}
	}
	expr(expr, element) {
		//作用域
		let $scope = getScope.call(this, element);
		//方法
		let $fn = this.methods;
		//返回值
		let data = new Function('$scope', '$fn', `
			return ${expr};	
		`).apply(this, [$scope, $fn]);
		return data;
	}

	createTemplate(vals, appendEl) {
		if(typeof appendEl === 'string') {
			appendEl = document.getElementById(appendEl);
		} else if(appendEl.nodeType !== 1) {
			console.warn('第二参数为添加节点的id或者为对应的节点对象');
			return;
		}

		//循环添加到指定的DOM节点上
		try {
			//如果值为字符串（兼容IE）
			if(typeof vals === 'string') {
				vals = vals.split('');
			}

			Object.keys(vals).forEach((key, index) => {
				//更新模板的index
				this.el.$scope.$index++;
				//设置数据流更新
				this.data.templateData = vals[key];
				//复制临时节点
				let tempNode = this.el.cloneNode(true);
				//设置模板中的index属性
				tempNode.setAttribute('data-index', this.__bind__.templateIndex++);
				//添加到对应节点上
				appendEl.appendChild(tempNode);
				//绑定当前节点事件
				if(tempNode.nodeType == 1) {
					setEvent.call(this, tempNode);
				}
				//模板添加事件
				setChildTemplateEvent.call(this, tempNode);
			});
		} catch(e) {
			console.warn('createTemplate方法中的第一个参数只能为的数组或者对象');
		}
	}
	/*设置过滤器*/
	static setFilter(filterName, handler) {
		this.filter[filterName] = handler;
	}
	/*----------------------数组操作---------------------------*/
	/*
	 * push方法
	 * */
	push(data, pushData) {
		//深拷贝数据
		let getData = deepCopy(this._get(data));
		//必须为数组
		if(Array.isArray(getData)) {
			if(Array.isArray(pushData)) {
				pushData.forEach(function(item, index) {
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
	pop(data) {
		//深拷贝数据
		let getData = deepCopy(this._get(data)),
			popData = "";
		//必须为数组
		if(Array.isArray(getData)) {
			popData = getData.pop();
			this._set(undefined, data, getData);
		}
		return popData;
	}
	/*
	 * unshift方法 
	 * 
	 * */
	unshift(data, unshiftData) {
		//深拷贝数据
		let getData = deepCopy(this._get(data));
		//必须为数组
		if(Array.isArray(getData)) {
			if(Array.isArray(unshiftData)) {
				unshiftData.forEach(function(item, index) {
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
	shift(data) {
		//深拷贝数据
		let getData = deepCopy(this._get(data)),
			shiftData = "";
		//必须为数组
		if(Array.isArray(getData)) {
			shiftData = getData.shift();
			this._set(undefined, data, getData);
		}
		return shiftData;
	}
	/* 
	 * splice 方法
	 * */
	splice(data, index, length) {
		//深拷贝数据
		let getData = deepCopy(this._get(data));
		//必须为数组
		if(Array.isArray(getData)) {
			getData.splice(index, length);
			this._set(undefined, data, getData);
		}
	}
}

//过滤器数据(带默认过滤器)
View.filter = {
	'trim': function(data) {
		return data.replace(/(^ +)?( +$)?/g, '');
	},
	'upper': function(data) {
		return data.toLocaleUpperCase();
	},
	'lower': function(data) {
		return data.toLocaleLowerCase();
	},
	'length': function(data) {
		return data.length;
	},
	'html': function(data) {
		let fragment = document.createDocumentFragment(),
			tempDom = document.createElement('div'),
			doms = [];
		tempDom.innerHTML = data;
		Array.prototype.forEach.call(tempDom.childNodes, function(item, index) {
			fragment.appendChild(item.cloneNode(true));
		});

		Array.prototype.forEach.call(fragment.childNodes, function(item, index) {
			doms.push(item);
		});

		return doms;
	}
};

export default View;