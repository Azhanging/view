import { setBind } from './../tools';

function setFor(el, propValue, propIndex) {
	let [forKey, forVal] = propValue.split(' in ');
	let filterForVal = forVal.replace(/(\{)?(\})?/g, '');
	let getForVal = this._get(filterForVal);
	let seize = document.createTextNode('');
	//现在循环列表中最后的占位节点
	let presentSeize = document.createTextNode('');
	//插入列表占位
	el.parentNode.insertBefore(presentSeize, el.nextSibling);
	
	if(!this.__ob__.for[filterForVal]) {
		this.__ob__.for[filterForVal] = [];
		setBind.call(this, filterForVal);
	}
	el.parentNode.insertBefore(seize, el.nextSibling);
	el.removeAttribute('_v-for');

	//这里是为了支持template的用法才这么使用的,默认循环中template是不存在值的
	if(getForVal == undefined || getForVal == null) {
		getForVal = [];
	}

	Object.keys(getForVal).forEach((key, index) => {
		let cloneNode = el.cloneNode(true);
		//设置索引
		cloneNode.$index = index;
		let forSeize = document.createTextNode('');
		cloneNode.__seize__ = forSeize;
		cloneNode.isReplace = false;
		forSeize.__seize__ = cloneNode;

		this.__ob__.for[filterForVal].push(cloneNode);
		seize.parentNode.insertBefore(cloneNode, seize);
		//初始是空数组还是字符串类型，创建数据链的字符串结构
		if(getForVal.__keyLine__) {
			replateForKey.call(this, cloneNode, forKey, getForVal.__keyLine__ + '.' + key);
		} else {
			replateForKey.call(this, cloneNode, forKey, filterForVal + '.' + key);
		}
		
		cloneNode.__html__ = cloneNode.outerHTML;

		//如果当前的元素是第一个，存储下面的兄弟节点
		if(index === 0) {
			cloneNode.__forElement__ = [cloneNode];
			//存储当前列表的占位
			cloneNode.__presentSeize__ = presentSeize;
		}
		else {
			setForElement(cloneNode, cloneNode);
		}
	});

	let oldElSeize = document.createTextNode('');

	//如果为一个空数组数据
	if(Object.keys(getForVal).length === 0) {
		let cloneNode = el.cloneNode(true);
		//设置索引,空对象中的索引从-1开始
		if(getForVal instanceof Object && !(getForVal instanceof Array) || typeof getForVal === 'string' ||  typeof getForVal === 'boolean' ||  typeof getForVal === 'number' || getForVal === null || getForVal === undefined) {
			cloneNode.$index = -1;
			//当前对象是否从空值开始
			cloneNode.isNullStart = true;
			//当前是否模板中的循环，设置dataset
			if(this.isTemplate) {
				cloneNode.dataset['index'] = -1;
			}
		} else {
			cloneNode.$index = 0;
			//当前是否模板中的循环，设置dataset
			if(this.isTemplate) {
				cloneNode.dataset['index'] = 0;
			}
		}

		let forSeize = document.createTextNode('');
		cloneNode.__seize__ = forSeize;
		cloneNode.isReplace = true;
		forSeize.__seize__ = cloneNode;
		let parentNode = seize.parentNode;
		this.__ob__.for[filterForVal].push(cloneNode);
		//替换空数据节点
		parentNode.insertBefore(cloneNode, seize);
		//初始是空数组还是字符串类型，创建数据链的字符串结构
		if(getForVal.__keyLine__) {
			replateForKey.call(this, cloneNode, forKey, getForVal.__keyLine__ + '.' + 0);
		} else {
			replateForKey.call(this, cloneNode, forKey, filterForVal + '.' + 0);
		}
		cloneNode.__html__ = cloneNode.outerHTML;

		//如果当前的元素是第一个，存储下面的兄弟节点
		cloneNode.__forElement__ = [cloneNode];
		//存储当前列表的占位
		cloneNode.__presentSeize__ = presentSeize;
		
	}

	el.parentNode.replaceChild(oldElSeize, el);
};

function setForElement(element, _pushElement) {
	let prevElement = element.previousElementSibling;
	if(prevElement.__forElement__) {
		prevElement.__forElement__.push(_pushElement);
	} else {
		setForElement(prevElement, _pushElement);
	}
}

//替换下面对应依赖中绑定的数据
function replateForKey(element, forKey, keyLine) {
	//匹配
	let REGEXP_TYPE_1 = new RegExp('\\{\\{' + forKey + '( ?\\|.*)?\\}\\}', 'g');

	let REGEXP_TYPE_2 = new RegExp('\\{\\{' + forKey + '\\.(.*?)', 'g');

	let innerHTML = element.innerHTML;

	let newHTML = innerHTML;

	if(REGEXP_TYPE_1.test(innerHTML)) {
		newHTML = newHTML.replace(REGEXP_TYPE_1, '{{' + keyLine + RegExp.$1 + '}}');
	}
	if(REGEXP_TYPE_2.test(innerHTML)) {
		newHTML = newHTML.replace(REGEXP_TYPE_2, '{{' + keyLine + '.' + RegExp.$1);
	}

	//获取当前的节点
	let attrList = element.attributes;

	Object.keys(attrList).forEach((index) => {
		if(/^_v-|^:/.test(attrList[index].name)) {
			let attrValue = attrList[index].value;
			if(REGEXP_TYPE_1.test(attrValue)) {
				element.setAttribute(attrList[index].name, attrValue.replace(REGEXP_TYPE_1, '{{' + keyLine + RegExp.$1 + '}}'));
			}
			if(REGEXP_TYPE_2.test(attrValue)) {
				element.setAttribute(attrList[index].name, attrValue.replace(REGEXP_TYPE_2, '{{' + keyLine + '.' + RegExp.$1));
			}
		}
	});

//	newHTML = replateForChildKey(newHTML);

	element.innerHTML = newHTML !== '' ? newHTML : innerHTML;
}

//初始化数据是否为空值绑定，则隐藏对于的列表
function testForNullArray() {
	Object.keys(this.__ob__.for).forEach((index) => {
		for(let element of this.__ob__.for[index]) {
			if(element.isReplace === true && element.parentNode != null) {
				let parentNode = element.parentNode;
				element.isReplace = true;
				parentNode.replaceChild(element.__seize__, element);
			}
		}
	})
}

export { setFor, testForNullArray };