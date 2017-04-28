import {disassembly,setBind , ResolveExpr} from './../tools';


function setDom(element) {
	//非空的节点才进入过滤赛选
	if(element.textContent !== ''){
		let textNodes = disassembly(element.textContent);
		this.__bind__.textNodeLists.push([textNodes, element]);
	}
}

//创建文本节点单独循环执行
function createTextNodes() {
	this.__bind__.textNodeLists.forEach((item, index) => {
		let [textNodes, el] = item;
		createTextNodeElements.call(this, textNodes, el);
	});
	this.__bind__.textNodeLists = [];
}

//创建文本节点对象,推送到临时的存放点
function createTextNodeElements(textNodes, el) {
	//创建文档片段
	let fragment = document.createDocumentFragment();
	//数据推入文档节点(当个花括号内的值)
	for(let i = 0; i < textNodes.length; i++) {
/*		//过滤器组
		let filters = [];
		//查找是否存在过滤器
		if(textNodes[i].indexOf('|') != -1) {
			//获取过滤器
			let templateFilters = textNodes[i].substring(textNodes[i].indexOf('|'), textNodes[i].length - 2);
			filters = templateFilters.replace('|', '').split(' ');
			//过滤空白数组
			filters = filters.filter(function(item, index) {
				if(item != '') {
					return item;
				}
			});
			//重写绑定链
			textNodes[i] = trim(textNodes[i].replace(templateFilters, ''));
		}
		
		//中间在过滤一次空格层
		textNodes[i] = textNodes[i].replace(/ /g, '');*/

		if(textNodes[i].trim() !== "") {
			//查看是否为数据绑定
			let element = document.createTextNode(textNodes[i]);
			if(/\{\{.*?\}\}/.test(textNodes[i]) == true) {
				let expr = textNodes[i].replace(/(\{)?(\})?/g, '');
				let re = new ResolveExpr(expr);
				
				re.getKeys().forEach((key)=>{
					if(!(this.__ob__.dom[key] instanceof Array)) {
						this.__ob__.dom[key] = [];
						setBind.call(this,key);
					}
					
					//设置attrs的expr
					if(!(element.__dom__ instanceof Object)) {
						element.__dom__ = {};
					}
					
					//给element元素加上__attrs__依赖
					element.__dom__.__bind__ = re.getExpr();
					element.__dom__.__filter__ = re.getFilter();
					
					this.__ob__.dom[key].push(element);
				});
				
			}
			fragment.appendChild(element);
		}
	}
	//el为父级节点,fragment为文档片段,index为索取文本节点在父级节点的位置
	this.__bind__.tempFragmentElements.push([el.parentNode, fragment, el]);
}

//替换原文本节点
function replaceTextNode() {
	this.__bind__.tempFragmentElements.forEach((item, index) => {
		let [parentNode, fragmentNode, oldTextNode] = item;
		parentNode.replaceChild(fragmentNode, oldTextNode);
	});
	this.__bind__.tempFragmentElements = [];
}

export {
	setDom,
	createTextNodes,
	replaceTextNode
};