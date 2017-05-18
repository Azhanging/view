import { setBind, setScope, trim,resolveKey,findKeyLine} from './../tools';

function setFor(element, propValue, propIndex) {
	let _this = this;
	//拆解数据
	let bindIden = propValue.split(' in ')[0];
	let forVal = propValue.split(' in ')[1];
	
	//拆分键值
	let forItem = bindIden.split(',')[0];
	let forKey = bindIden.split(',')[1];
	
	//整理空字符
	forVal = trim(forVal);
	//处理数据链
	let filterForVal = resolveKey(forVal);
	let getForVal;
	//查看是否为数字的循环
	if(!isNaN(filterForVal)){
		let num = parseInt(filterForVal);
		let newData = [];
		for(let index = 0;index<num;index++){
			newData.push(index);
		}
		filterForVal = '_____array_____';
		getForVal = newData;
		element.isNumFor = true;
		element.__forValue__ = getForVal;
	}else{
	//非数组循环
		getForVal = this._get(filterForVal, element);
	}
	//插入当前的列表占位
	let presentSeize = document.createTextNode('');
	let oldElementReplace = document.createTextNode('');
	let parentNode = element.parentNode;
	parentNode.insertBefore(presentSeize, element.nextSibling);

	/*let keyLine = findKeyLine.apply(this,[element,forVal]);
	//设置键值 
	if(!this.__ob__.for[keyLine]) {
		this.__ob__.for[keyLine] = [];
		setBind.call(this, keyLine);
	}

	//写进观察者
	this.__ob__.for[keyLine].push(element);*/
	
	
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
	//储存当前for中的item
	element.__forItem__ = forItem;
	//储存当前for中的key
	element.__forKey__ = forKey;
	//存储自己节点
	element.__self__ = element.cloneNode(true);
	presentSeize.__element__ = element;

	//创建一个文档片段
	let fragment = document.createDocumentFragment();

	//设置节点
	let getKeys; 
	if(getForVal === null ||　getForVal === undefined || getForVal === ''){
		getKeys = [];
	}else{
		getKeys = Object.keys(getForVal);
	}
	
	getKeys.forEach((key, index) => {
		let cloneNode = element.cloneNode(true);
		cloneNode.__for__ = {
			forItem: forItem,
			forKey: key,
			index: index,
			keyLine: filterForVal + '.' + getKeys[index],
			isAppend: true
		}
		
		if(!(cloneNode.__keyLine__ instanceof Object)){
			cloneNode.__keyLine__ = {};
		}
		
		cloneNode.__keyLine__[forItem] = getForVal.__keyLine__+'.'+getKeys[index];
		
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
		Object.defineProperty(element.$scope, element.__for__.forItem, {
			get() {
				//这里是为了处理值对象为数字而建立
				let getData = _this._get(element.__for__.keyLine, element);
				if(getData !== null){
					return getData;
				}else if(/^_____array_____/.test(element.__for__.keyLine)){
					return element.__for__.index + 1;
				}else{
					return null;
				}
			}
		});
		//设置索引的作用域
		Object.defineProperty(element.$scope, '$index', {
			get() {
				return element.__for__.index;
			}
		});
		//设置索引的作用域
		if(forKey){
			Object.defineProperty(element.$scope,forKey, {
				get() {
					return element.__for__.forKey;
				}
			});	
		}
	});
};

export {
	setFor
};