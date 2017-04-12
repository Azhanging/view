import { setBind, setScope } from './../tools';

function setFor(element, propValue, propIndex) {
	let _this = this;
	//拆解数据
	let [forKey, forVal] = propValue.split(' in ');
	//移除花括号数据
	let filterForVal = forVal.replace(/(\{)?(\})?/g, '');

	//获取当前的作用域链数据
	let getForVal = this._get(filterForVal, element);

	//插入当前的列表占位
	let presentSeize = document.createTextNode('');
	let oldElementReplace = document.createTextNode('');
	let parentNode = element.parentNode;
	parentNode.insertBefore(presentSeize, element.nextSibling);

	//设置键值 
	if(!this.__ob__.for[filterForVal]) {
		this.__ob__.for[filterForVal] = [];
		setBind.call(this, filterForVal);
	}

	//写进观察者
	this.__ob__.for[filterForVal].push(element);
	//存储循环组节点成员
	element.__forElementGroup__ = [];
	//存储父级的节点
	element.__parentNode__ = parentNode;
	//存储循环组的占位节点
	element.__presentSeize__ = presentSeize;
	//储存当前for中的循环键
	element.__forKey__ = forKey;
	//存储自己节点
	element.__self__ = element.cloneNode(true);
	presentSeize.__element__ = element;

	//创建一个文档片段
	let fragment = document.createDocumentFragment();

	//设置节点
	let getKeys = Object.keys(getForVal);
	getKeys.forEach((key, index) => {
		let cloneNode = element.cloneNode(true);
		cloneNode.__for__ = {
			forKey: forKey,
			index: index,
			keyLine: filterForVal + '.' + getKeys[index],
			isAppend: true
		}
		cloneNode.$index = index;
		element.__forElementGroup__.push(cloneNode);
		fragment.appendChild(cloneNode);
	});
	//使用占位节点替换掉原本的dom节点信息
	parentNode.replaceChild(oldElementReplace, element);
	parentNode.insertBefore(fragment, presentSeize);

	//设置一下键值作用域
	element.__forElementGroup__.forEach((element) => {
		setScope.call(this, element);
		//设置键值的作用域
		Object.defineProperty(element.$scope, element.__for__.forKey, {
			get() {
				return _this._get(element.__for__.keyLine, element);
			}
		});
		//设置索引的作用域
		Object.defineProperty(element.$scope, '$index', {
			get() {
				return element.__for__.index;
			}
		});
	});
};

export {
	setFor
};