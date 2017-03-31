import _Element from './../vdom';
import { createTextNodes, replaceTextNode } from './../dom';

function forUpdate(keyLine) {
	let getVal = this._get(keyLine); 
	if(getVal instanceof Array){
		let LineElement = this.__ob__.for[keyLine];
		let diffLenth = getVal.length - LineElement.length; 
		if(getVal.length > LineElement.length){
			let diff = getVal.length - this.__ob__.for[keyLine].length;
			let parentNode = LineElement[LineElement.length-1].parentNode;
			let fragment = document.createDocumentFragment();
			let tempElement = document.createElement('div');
			
			for(let i = 0;i<diff;i++){
				let replaceKeyLine = keyLine+'.'+(diffLenth++);
				let outerHTML = parentNode.lastElementChild.__html__;
				outerHTML = outerHTML.replace(new RegExp(keyLine+'\\.\\d*','g'),replaceKeyLine);
				tempElement.innerHTML = outerHTML; 
				this.__ob__.for[keyLine].push(tempElement.firstElementChild);
				tempElement.firstElementChild.__html__ = tempElement.firstElementChild.outerHTML; 
				fragment.appendChild(tempElement.firstElementChild);
			}

			Object.keys(fragment.childNodes).forEach((index)=>{
				new _Element().resolve(fragment.childNodes[index],this);
			});
			parentNode.appendChild(fragment);
			//创建存在绑定的文本节点
			createTextNodes.call(this);
			//新建和替换绑定的文本节点信息
			replaceTextNode.call(this);
			//更新一次
			this.update();
		}
	}
}

export {forUpdate};
