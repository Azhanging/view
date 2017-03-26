import Observer from './../observer';
import vdom from './../vdom';
import {getEl} from './../tools';
import {domUpdate,createTextNodes,replaceTextNode} from './../dom';

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
		
		//解析对象
		this.el = (el && typeof getEl(el) !== 'null' && template === undefined ? getEl(el) : '');
		//组件
		this.components = components;
		//设置data值
		this.data = data;
		
		//判断是否绑定节点或者模板
		if(!(this.el) && !(this.template)) {
			return false;
		}
		
		//配置对象
		this.config();
		//设置observe
		new Observer(this.data,undefined,this);
		//初始化内容
		this.init();
	}
	init(){
		//创建vdom内容
		this.vdom = new vdom().resolve(this.el,this);
		//创建存在绑定的文本节点
		createTextNodes.call(this);
		//新建和替换绑定的文本节点信息
		replaceTextNode.call(this);
		//初始化更新
		this.update();
	}
	config(){
		this.__ob__ = {
			dom:{},
			attr:{}
		};
	}
	update(keys){
		domUpdate.call(this,keys);
	}
	_get(keyLink) {
		let key = '';
		//存在实例屬性對象
		if(/\./g.test(keyLink)) {
			let obj = keyLink.split('.'),
				newObject = this['data'];
			//存在值
			if(this['data'][obj[0]]) {
				for(let i = 0; i < obj.length; i++) {
					key = obj[i];
					newObject = newObject[key] !== undefined ? newObject[key] : null;
				}
				return newObject;
			} else {
				return null;
			}
		} else if(this['data'][keyLink] != undefined) {
			return this['data'][keyLink];
		} else {
			return null;
		}
	}
	/*设置过滤器*/
	static setFilter(filterName, handler){
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