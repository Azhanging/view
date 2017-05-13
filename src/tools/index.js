function getEl(id) {
	return document.getElementById(id);
}

//拆分数据
function disassembly(text) {
	if(text !== '') {
		let textNodes = [];
		//把文本节点拆开,只存在文本
		let textNode = text.replace(/\{\{.*?\}\}/g, '||data||');
		//把文本data提取
		let dataNodes = text.match(/(\{\{.*?\}\})/g);
		//根据||去划分data的字节占位转化为数组
		textNodes = textNode.split('||');
		//把data节点位置推送到节点数组当中
		for(let j = 0; j < textNodes.length; j++) {
			let index = textNodes.indexOf('data');
			if(index !== -1) {
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
	let newKeys = keys.map((val, index) => {
		if(/\{\{\S+\}\}/.test(val)) {
			return val.replace(/(\{)?(\})?/g, '');
		}
	});

	return newKeys.filter((value) => value != undefined);
}

//用来清除绑定数据中的空字符串
function trim(value) {
	if(value.indexOf(' ') !== -1) {
		return value.replace(/\{\{ */g, '{{').replace(/ *\}\}/g, '}}');
	} else {
		return value;
	}
}

//拆解表达式和返回绑定值
/*
 *	isExpr是的为了返回解析表达式还是 
 * */
class ResolveExpr {
	constructor(expr) {
		this.expr = expr;
		this._expr = expr;
		this.strings = [];
		this.bindKeys = [];
		this.keyword = ["undefined","null","true","false"];
		this.filter = [];
		this._init();
	}
	_init() {
		//抽离字符串
		
		let pullString = this.expr.match(/\'(.*?)\'|\"(.*?)\"/g);
		
		if(pullString){
			pullString.forEach((string)=>{
				this.strings.push(string);
				this._expr = this._expr.replace(string, "_____string_____");
			});	
		}
		
		//检查是够存在||与
		this._expr = this._expr.replace(/\|{2}/,'______');
		
		
		let splitExpr = this._expr.split('|');
		//拆分过滤器
		this._expr = splitExpr[0];
		//是否存在过滤器
		if(splitExpr.length>1){			
			//设置过滤器
			this.filter = splitExpr[1].split(' ').filter((filter)=>{
				return filter;
			});
		}
		
		this._expr = this._expr.replace(/______/,'||');
		
		//是否存在函数处理
		let exprFn = this._expr.match(/([^!][_$A-z\d]+\()/g)
		if(exprFn){			
			//判断函数
			this.unique(exprFn).forEach((fn) => {
				fn = fn.trim();
				this._expr = this._expr.replace(new RegExp(initRegExp(fn), 'g'), '$fn.' + fn);
			});
		}

		//清空数组内项目的空格内的值
		let trimData = this._expr.split(/\+|-|\*|\/|:|\?|\(|\)|,|!|&{2}|\|{2}|\[|\]|=/g).map((data) => {
			return data.trim();
		});

		//判断绑定值
		this.unique(trimData).forEach((bindData) => {
			if(bindData !== "" && !/^\$fn\.|^\$scope\.|^_____string_____\S*?/g.test(bindData) && !(/^\d*$/.test(bindData)) && this.keyword.indexOf(bindData) === -1) {
				this.bindKeys.push(this.getBindHasStringIndex(this.unique(trimData),bindData));
				if(new RegExp('\\('+initRegExp(bindData), 'g').test(this._expr)){
					this._expr = this._expr.replace(new RegExp('\\('+initRegExp(bindData), 'g'), '($scope.' + bindData);
				}else if(new RegExp('\\['+initRegExp(bindData), 'g').test(this._expr)){
					this._expr = this._expr.replace(new RegExp('\\['+initRegExp(bindData), 'g'), '[$scope.' + bindData);
				}else{					
					this._expr = this._expr.replace(new RegExp('(\\+|-|\\*|\\!|:|\\?|=|\\s*)'+initRegExp(bindData), 'g'), '$scope.' + bindData);
				}
			}
		});

		//把抽离的字符串重新插回到表达式中
		let splitString = this._expr.split('_____');
		for(let index = 0; index < splitString.length; index++) {
			let _index = splitString.indexOf("string")
			if(_index !== -1) {
				splitString[_index] = this.strings.shift();
			}
		} 

		//合并字符内容
		this._expr = splitString.join('');
	}
	getKeys(){
		return this.bindKeys;
	}
	getExpr(){
		return this._expr;
	}
	getFilter(){
		return this.filter;
	}
	unique(array) {
		let newArray = [];
		array.forEach((item) => {
			if(newArray.indexOf(item) === -1 || item === '_____string_____') {
				newArray.push(item);
			}
		});
		return newArray;
	}
	getBindHasStringIndex(isBinds,bindData){
		let hasString = [];
		isBinds.forEach((val)=>{
			if(/_____string_____/.test(val)){
				hasString.push(val);	
			}
		});
		
		let getIndex = hasString.indexOf(bindData);
		
		if(getIndex !== -1){
			return bindData.replace(/_____string_____/g,this.strings[getIndex]);
		}
		
		return bindData;
	}
}

//解析键值为.链接
function resolveKey(key){
	let _key = key;
	let strings = [];
	
	//抽离字符串
	let pullString = key.match(/\'(.*?)\'|\"(.*?)\"/g); 
	if(pullString){
		key.match(/\'(.*?)\'|\"(.*?)\"/g).forEach(function(string){
			strings.push(string);
			_key = _key.replace(string,"_____string_____");
		});	
	}
	
	//查找[]范围并替换为点
	_key = _key.replace(/\[/g,'.').replace(/\]/g,'');
	let splitString = _key.split('_____');
	for(let index = 0; index < splitString.length; index++) {
		let _index = splitString.indexOf("string")
		if(_index !== -1) {
			splitString[_index] = strings.shift().replace(/\'|\"/g,'');
		}
	}
	return splitString.join('');
}


//去重
function unique(array) {
	let newArray = [];
	array.forEach((item) => {
		if(newArray.indexOf(item) === -1) {
			newArray.push(item);
		}
	});
	return newArray;
}

//转义正则里面的内容
function initRegExp(expr) {
	let tm = '\\/*.?+$^[](){}|';
	for(let index = 0; index < tm.length; index++) {
		expr = expr.replace(new RegExp('\\' + tm[index], 'g'), '\\' + tm[index]);
	}
	return expr;
}

//深拷贝
function deepCopy(p, c) {
	//如果拷贝的对象是dom节点
	var c = c || (p instanceof Array ? [] : {});
	for(var i in p) {　　　　　　
		if(typeof p[i] === 'object' && !(p[i].nodeType)) {　　　　　　
			c[i] = (p[i].constructor === Array) ? [] : {};　　　　　　　　
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
	if(el.$index != undefined || el.$index != null) {
		return el.$index;
	} else if(el.dataset['index']) {
		return el.dataset['index'];
	} else if(el.id != this.$element) {
		return getIndex.call(this, el.parentNode);
	} else {
		return false;
	}
}

//设置绑定的依赖
function setBind(keyLine) {
	if(this.__ob__.bind.indexOf(keyLine) == -1) {
		this.__ob__.bind.push(keyLine);
	}
}

//设置作用域
function setScope(el) {
	//查看当前是否存在作用域
	if(!el.$scope) {
		//设置作用域
		el.$scope = Object.create(getScope.call(this, el));
	}
}

//获取作用域
function getScope(el) {
	//查看当前是否顶层的节点信息
	if(this.el === el) {
		return this.data;
	}
	//如果当前的节点是存在作用域的
	if(el.$scope) {
		return el.$scope;
	}
	//以上都没有作用域,向父级查找作用域
	let parentNode = el.parentNode;
	if(parentNode !== null) {
		if(parentNode.$scope) {
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
	} catch(e) {
		for(let index = 0; index < element.childNodes.length; index++) {
			let children = element.childNodes[index];
			if(children.nodeType === 1) {
				return children;
			}
		}
	}
}

//判断是否存在for属性循环
function hasForAttr(element){
	for(let index = 0; index < element.attributes.length;index++){
		if(/_v-for/.test(element.attributes[index])){
			return true;
		}
	}
	return false;
}

export {
	getEl,
	disassembly,
	getDisassemblyKey,
	ResolveExpr,
	deepCopy,
	getIndex,
	setBind,
	setScope,
	getScope,
	trim,
	getFirstElementChild,
	resolveKey,
	initRegExp,
	hasForAttr
}