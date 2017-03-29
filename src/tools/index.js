function getEl(id){
	return document.getElementById(id);
}

//拆分数据
function disassembly(text){
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

/*获取表达式中data绑定的值*/
function getKeyLink(expr) {
	var tempExpr = expr.match(/\{\{.*?\}\}/g);
	if(tempExpr != null) {
		var _this = this;
		return tempExpr.map(function(item, index) {
			return item.replace(/\{?\}?/g, '');
		});
	} else {
		return expr;
	}
}

/*获取到keyLine中的主key*/
function getKey(keyLine) {
	var keys = keyLine.split('.');
	if(this.data[keys[0]] != undefined) {
		return keys[0];
	}
	return null;
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

export {
	getEl,
	disassembly,
	getDisassemblyKey,
	getKeyLink,
	getKey,
	deepCopy,
	getIndex,
	setBind
}
