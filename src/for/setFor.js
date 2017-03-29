import { getKey } from './../tools';

//一直往上找for父节点中是否存在for
function findParentForUpdateKey(parent) {
	if(parent.forUpdateKey) {
		return parent;
	} else if(parent.id == this.$element) {
		return false;
	} else {
		return findParentForUpdateKey(parent.parentNode);
	}
}

function setFor(el, attrVal) {
	//el存放
	let fragment = document.createDocumentFragment(),
		//占位节点
		seize = document.createTextNode(''),
		//拆分字符串获得key和依赖date
		keyAndExpr = attrVal.split(' in '),
		//循环依赖的key //循环绑定的数据
		[key,expr] = keyAndExpr,
		//去掉{{}}的数据
		resolveKey = getKey.call(this, expr.replace(/\{?\}?/g, ''));
	//for数据存放点ob数据
	this.data[key] = {};

	//for中依赖的参数键
	if(!(Array.isArray(this.forItem[key]))) {
		this.forItem[key] = [];
	}
	if(this.forItem[key].indexOf(resolveKey) == -1) {
		this.forItem[key].push(resolveKey);
	}

	//給el贴上for标签
	el.forTag = resolveKey;
	//el未添加到文档片段前的父级节点
	let parentNode = el.parentNode;

	//插入占位节点
	el.parentNode.insertBefore(seize, el);
	//储存elements
	fragment.appendChild(el);
	//绑定key的订阅者数据
	let watch = {
		['data'] : expr,
		['key'] : key,
		['el'] : fragment,
		['seize'] : seize,
		['appendEls'] : []
	};

	//for中的父级
	let _parentNode = findParentForUpdateKey.call(this, parentNode);
	//判断是否为顶节点，继承更新key
	if(_parentNode) {
		el.forUpdateKey = _parentNode.forUpdateKey;
	} else {
		el.forUpdateKey = resolveKey;
	}

	//设置依赖更新的keys
	if(resolveKey != el.forUpdateKey && !(this.forItem[resolveKey])) {
		if(!(Array.isArray(this.forKeyLineDate[resolveKey]))) {
			this.forKeyLineDate[resolveKey] = [];
		}
		//如果存在相同的主key，只push一次
		if(this.forKeyLineDate[resolveKey].indexOf(el.forUpdateKey) == -1) {
			this.forKeyLineDate[resolveKey].push(el.forUpdateKey);
		}
	}
	//为节点设置订阅者信息
	if(_parentNode.forTag) {
		if(!(_parentNode['forChild'] instanceof Array)) {
			_parentNode['forChild'] = [];
		}
		_parentNode['forChild'].push(watch);
	} else {
		if(!(this.forEls[resolveKey] instanceof Array)) {
			this.forEls[resolveKey] = [];
		}
		this.forEls[resolveKey].push(watch);
	}
};

export { setFor };