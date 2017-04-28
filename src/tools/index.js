function getEl(id){
	return document.getElementById(id);
}

//拆分数据
function disassembly(text){
	if(text !== ''){
		let textNodes = [];
		//把文本节点拆开,只存在文本
		let textNode = text.replace(/\{\{.*?\}\}/g, '||data||');
		//把文本data提取
		let	dataNodes = text.match(/(\{\{.*?\}\})/g);
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
	}else{
		return [];
	}
}

//获取key数据链
function getDisassemblyKey(keys){
	let newKeys = keys.map((val,index)=>{
		if(/\{\{\S+\}\}/.test(val)){
			return val.replace(/(\{)?(\})?/g, '');
		}
	});
	
	return newKeys.filter((value)=>value!=undefined);
}

//用来清除绑定数据中的空字符串
function trim(value){
	if(value.indexOf(' ') !== -1){		
		return value.replace(/\{\{ */g,'{{').replace(/ *\}\}/g,'}}');
	}else{
		return value;
	}
}

//function getKeyLink(expr) {	
//拆解表达式和返回绑定值
/*
 *	isExpr是的为了返回解析表达式还是 
 * */
function resolveExpr(expr,isExpr) {
	//新的解析解析符
	let newExpr = expr;
	let bindKeys = [];
	let strings = [];
	//判断字符串内容
	expr.match(/\'(.*?)\'|\"(.*?)\"/g).forEach(function(string){
		strings.push(string);
		newExpr = newExpr.replace(string,"||string||");
	});

	//判断函数
	unique(newExpr.match(/([_$A-z\d]*\()/g)).forEach((fn)=>{
		newExpr = newExpr.replace(new RegExp(initRegExp(fn),'g'),'$fn.'+fn);
	});

	//清空数组内项目的空格内的值
	let trimData = newExpr.split(/\+|-|\*|\/|:|\?|\(|\)|,/g).map((data)=>{
		return data.trim();
	})

	//判断绑定值
	unique(trimData).forEach((bindData)=>{
		if(!/^[\$fn\.|\$scope\.]\S*?/g.test(bindData) && !(/^\d*$/.test(bindData))){
			bindKeys.push(bindData);
			newExpr = newExpr.replace(new RegExp(initRegExp(bindData),'g'),'$scope.'+bindData);
		}
	});
	
	//把抽离的字符串重新插回到表达式中
	let splitString = newExpr.split('||');
	for(let index = 0;index < splitString.length;index++){
		let _index = splitString.indexOf("string")
		if(_index !== -1){
			splitString[_index] = strings.shift();
		}
	}
	
	//合并字符内容
	newExpr = splitString.join('');
	
	//返回解析函数
	if(isExpr){
		return newExpr;	
	}else{
	//返回绑定的键值组
		return bindKeys;
	}
	
}

//去重
function unique(array){
	let newArray = [];
	array.forEach((item)=>{
		if(newArray.indexOf(item) === -1){
			newArray.push(item);
		}
	});
	return newArray;
}

//转义正则里面的内容
function initRegExp(expr){
	let tm = '\\/*.?+$^[](){}|';
	for(let index = 0;index<tm.length;index++){
		expr = expr.replace(new RegExp('\\' + tm[index],'g'),'\\' + tm[index]);
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
	} else if(el.dataset['index']){
		return el.dataset['index'];
	}else if(el.id != this.$element){
		return getIndex.call(this,el.parentNode);
	}else{
		return false;
	}
}

//设置绑定的依赖
function setBind(keyLine){
	if(this.__ob__.bind.indexOf(keyLine) == -1){
		this.__ob__.bind.push(keyLine);
	}
}

//设置作用域
function setScope(el){
	//查看当前是否存在作用域
	if(!el.$scope){
		//设置作用域
		el.$scope = Object.create(getScope.call(this,el));
	}
}

//获取作用域
function getScope(el){
	//查看当前是否顶层的节点信息
	if(this.el === el){
		return this.data;
	}
	//如果当前的节点是存在作用域的
	if(el.$scope){
		return el.$scope; 
	}
	//以上都没有作用域,向父级查找作用域
	let parentNode = el.parentNode;
	if(parentNode !== null){
		if(parentNode.$scope){
			return parentNode.$scope;
		}else{
			return getScope.call(this,parentNode);	
		}
	}
}

//获取第一个element节点
function getFirstElementChild(element){
	try{
		return element.firstElementChild;
	}catch(e){
		for(let index = 0;index<element.childNodes.length;index++){
			let children = element.childNodes[index];
			if(children.nodeType === 1){
				return children;
			}
		}
	}
}

export {
	getEl,
	disassembly,
	getDisassemblyKey,
	getKeyLink,
	deepCopy,
	getIndex,
	setBind,
	setScope,
	getScope,
	trim,
	getFirstElementChild
}
