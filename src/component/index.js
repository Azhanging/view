import {getEl} from './../tools';

//组件初始化
function componentHandler(node) {
	let nodeName = node.nodeName.toLowerCase(),
		elHtml = getEl(this.components[nodeName]) != null ? getEl(this.components[nodeName]).innerHTML : this.components[nodeName],
	//复制组件节点
		cloneNode = node.cloneNode(true),
		nodeParent = node.parentNode;
	//复制的组件中添加子节点
	cloneNode.innerHTML = elHtml;
	//获取组件中的节点内容
	let componentNode = cloneNode.firstElementChild;
	nodeParent.replaceChild(componentNode, node);
	return componentNode;
}

export default componentHandler;