import { disassembly, setBind, ResolveExpr, resolveKey, getScope, findKeyLine } from './../tools';

function setDom(element) {
	//非空的节点才进入过滤赛选
	if(element.textContent !== '') {
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
		if(textNodes[i].trim() !== "") {
			//查看是否为数据绑定
			let element = document.createTextNode(textNodes[i]);
			if(/\{\{.*?\}\}/.test(textNodes[i]) == true) {
				let expr = textNodes[i].replace(/(\{)?(\})?/g, '');
				let re = new ResolveExpr(expr, element);
				re.getKeys().forEach((key) => {
					key = findKeyLine.apply(this, [el, key]);
					if(!(this.__ob__.dom[key] instanceof Array)) {
						this.__ob__.dom[key] = [];
						setBind.call(this, key);
					}
					//设置dom的expr
					if(!(element.__dom__ instanceof Object)) {
						element.__dom__ = {};
					}
					//给element元素加上__dom__依赖,过滤器
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