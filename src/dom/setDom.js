import {disassembly,setBind} from './../tools';

//let textNodes = []; //拆分的文本节点内容
let textNodeLists = []; //拆分的文本节点内容集合
let tempFragmentElements = []; //插入拆分的文本节点内容

function setDom(element) {
	let textNodes = disassembly(element.textContent);
	this.__bind__.textNodeLists.push([textNodes, element]);
}

//创建文本节点单独循环执行
function createTextNodes() {
	this.__bind__.textNodeLists.forEach((item, index) => {
		let [textNodes, el] = item;
		createTextNodeElements.call(this, textNodes, el);
	});
}

//创建文本节点对象,推送到临时的存放点
function createTextNodeElements(textNodes, el) {
	//创建文档片段
	let fragment = document.createDocumentFragment();
	//数据推入文档节点
	for(let i = 0; i < textNodes.length; i++) {
		//过滤器组
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
			textNodes[i] = textNodes[i].replace(templateFilters, '').replace(/ /g, '');
		}
		if(textNodes[i] !== "") {
			//查看是否为数据绑定
			let textNode = document.createTextNode(textNodes[i]);
			if(/\{\{\S+\}\}/.test(textNodes[i]) == true) {
				let key = textNodes[i].replace(/(\{)?(\})?/g, '');
				if(!(this.__ob__.dom[key] instanceof Object)) {
					this.__ob__.dom[key] = [];
					setBind.call(this,key);
				}
				//设置节点的过滤器
				textNode['filters'] = filters;
				this.__ob__.dom[key].push(textNode);
			}
			fragment.appendChild(textNode);
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
}

export {
	setDom,
	createTextNodes,
	replaceTextNode
};