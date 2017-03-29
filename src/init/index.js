import Observer from './../observer';
import method from './../method';
import vdom from './../vdom';
import { getEl, getKeyLink,deepCopy } from './../tools';
import { domUpdate, createTextNodes, replaceTextNode } from './../dom';
import { attrUpdate } from './../attr';
import { showUpdate } from './../show';
import { ifUpdate } from './../if';
import { watchUpdate } from './../watch';
import { setEvent ,setChildTemplateEvent} from './../event';


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
		if(el && typeof getEl(el) !== 'null'){
			this.el = getEl(el);
			if(this.el.tagName == 'TEMPLATE'){
				this.el = this.el.content.firstElementChild;
				this.data['templateData'] = {};
			}
		}else{
			this.el = '';
		}
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
			for:{},
			bind:[]
		};
		
		this.__bind__ = {
			textNodeLists:[],
			tempFragmentElements:[]
		}
	}
	dep(keys) {
		let updates = [keys];
		for(let key of this.__ob__.bind){
			if(key.indexOf(keys+'.') != -1){
				updates.push(key);
			}
		}
		updates.forEach((keyLine)=>{
			this.update(keyLine);
		});
	}
	update(keys){
		attrUpdate.call(this, keys);
		showUpdate.call(this, keys);
		ifUpdate.call(this, keys);
		domUpdate.call(this, keys);
		watchUpdate.call(this, keys);
	}
	_get(keyLink) {
		//存在实例屬性對象
		if(/\./g.test(keyLink)) {
			let obj = keyLink.split('.');
			let	getVal = this['data'];
			//存在值
			if(this['data'][obj[0]]) {
				for(let i = 0; i < obj.length; i++) {
					let key = obj[i];
					getVal = getVal[key] !== undefined ? getVal[key] : null;
				}
				return getVal;
			} else {
				return null;
			}
		} else if(this['data'][keyLink] != undefined) {
			return this['data'][keyLink];
		} else {
			return null;
		}
	}
	_set(obj, val, key) {
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
			if(this._get(obj) !== null) {
					//设置新的值
					if(key != undefined) {
						this._get(obj)[lastIndex][key] = val;
					} else {
						this._get(obj)[lastIndex] = val;
					}
					//设置新的值
					if(!(typeof val === 'string')){
						this._get(obj)[lastIndex] = deepCopy(this._get(obj)[lastIndex]);						
					}
			}
		} else {
			/*只有一个key值*/
			if(this._get(obj) !== null) {
				if(key != undefined) {
					this._get(obj)[key] = val;
					var getData = this._get(obj);
					getData = deepCopy(this._get(obj));
				} else {
					//2017年03月06日20:32:59 优化两次更新  //this.data[obj] = val;
					//					this.data[obj] = (typeof val == 'object' ? deepCopy(val) : this.data[obj]);
					this.data[obj] = (typeof val == 'object' ? deepCopy(val) : val);
				}
			}
		}
	}
	expr(expr) {
		let dataValues = getKeyLink.call(this, expr);
		let	dataValueLen = dataValues.length;
		let	newExpr = expr;

		//返回的不是主key数组
		if(!(dataValues instanceof Array)) {
			//解析表达式抛出
			try {
				return eval("(" + expr + ")");
			} catch(e) {
				return '';
			}
		}

		for(let i = 0; i < dataValueLen; i++) {
			if(this._get(dataValues[i]) !== null) {
				let data = this._get(dataValues[i]);
				//处理for绑定,for只允许绑定一个data,不支持表达式
				if(arguments[1] === 'for') {
					return this._get(dataValues[i]);
				}
				//更新为绑定表达式
				newExpr = newExpr.replace(new RegExp('\{\{' + dataValues[i] + '\}\}', 'g'), (data === false || data === true) ? data : "'" + data + "'");
			} else {
				//处理不存在数据流空值替换对象内容
				newExpr = newExpr.replace(new RegExp('\{\{' + dataValues[i] + '\}\}', 'g'), "''");
			}
		}
		try {
			//解析表达式
			return eval(newExpr);
		} catch(e) {
			//报错返回空值
			return '';
		}
	}
	createTemplate(vals, appendEl) {
		//循环添加到指定的DOM节点上
		vals.forEach((item, index)=>{
			//设置数据流更新
			this.data.templateData = item;
			//复制临时节点
			let tempNode = this.el.cloneNode(true);
			//添加到对应节点上
			document.getElementById(appendEl).appendChild(tempNode);
			//绑定当前节点事件
			if(tempNode.nodeType == 1) {
				setEvent.call(this, tempNode);
			}
			//模板添加事件
			setChildTemplateEvent.call(this, tempNode);
		});
	}
	/*设置过滤器*/
	static setFilter(filterName, handler) {
		this.filterHandlers[filterName] = handler;
	}
}

//过滤器数据(带默认过滤器)
View.filterHandlers = {
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