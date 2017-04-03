import _Element from './../vdom';
import { createTextNodes, replaceTextNode } from './../dom';

function forUpdate(keyLine) {
	let getVal = this._get(keyLine);
	if(getVal instanceof Array) {
		
		//查找当前的数据链绑定的对象
		let LineElement = this.__ob__.for[keyLine];
		
		//如果当前的数据不是for循环中的数据，跳出
		if(LineElement == undefined){
			return;
		}
		
		let diffLenth = getVal.length - LineElement.length;

		LineElement.forEach((element) => {
			if(element.__forElement__) {
				//初始化空数组的节点
				if(element.isReplace == true && getVal.length > 0){
					let element = LineElement[0]; 
					let seize = element.__seize__;
					let parentNode = seize.parentNode;
					element.isReplace = false;
					parentNode.replaceChild(LineElement[0],seize);
				}
				
				let forLineElement = element.__forElement__; 
				//新增数组数据
				if(getVal.length > forLineElement.length) {
					let diff = getVal.length - this.__ob__.for[keyLine].length;
					let parentNode = forLineElement[0].parentNode;
					let fragment = document.createDocumentFragment();
					let tempElement = document.createElement('div');
					let lastIndex = forLineElement[forLineElement.length - 1].$index;

					//如果数据长于现有的节点数，添加新的节点
					for(let i = 0; i < diff; i++) {
						let replaceKeyLine = keyLine + '.' + (++lastIndex);
						let outerHTML = forLineElement[forLineElement.length - 1].__html__;
						let seize = document.createTextNode('');
						outerHTML = outerHTML.replace(new RegExp(keyLine + '\\.\\d*', 'g'), replaceKeyLine);
						tempElement.innerHTML = outerHTML;
						let element = tempElement.firstElementChild;
						this.__ob__.for[keyLine].push(element);
						element.__html__ = element.outerHTML;
						seize.__seize__ = element;
						element.isReplace = false;
						element.__seize__ = seize;
						element.$index = lastIndex;
						fragment.appendChild(element);
					}

					Object.keys(fragment.childNodes).forEach((index) => {
						forLineElement.push(fragment.childNodes[index]);
						new _Element().resolve(fragment.childNodes[index], this);
					});
					
					//更新旧数据
					for(let index = 0; index < getVal.length; index++) {
						console.log(getVal.length);
						let element = forLineElement[index];
						//当前的节点是显示的，则隐藏
						if(element.isReplace === true){
							let parentNode = element.__seize__.parentNode; 
							let seize = element.__seize__;
							element.isReplace = false;
							seize.__seize__ = element;
							parentNode.replaceChild(element, seize);
						}
					}
					
					parentNode.appendChild(fragment);
					//创建存在绑定的文本节点
					createTextNodes.call(this);
					//新建和替换绑定的文本节点信息
					replaceTextNode.call(this);
					//更新一次
					this.update();
				} 
				//如果当前的数据小于节点循环节点的长度,考虑到如果默认为空数组，赋值的时候节点长度大于0了，不存在parentNode，报错
				else if(getVal.length < forLineElement.length && forLineElement[0].isReplace == false) {				
					//更新节点的替换
					for(let index = 0; index < getVal.length; index++) {
						console.log(getVal.length);
						let element = forLineElement[index];
						//当前的节点是显示的，则隐藏
						if(element.isReplace === true){
							let parentNode = element.__seize__.parentNode; 
							let seize = element.__seize__;
							element.isReplace = false;
							seize.__seize__ = element;
							parentNode.replaceChild(element, seize);
						}
					}
					//替换没有数据的节点
					for(let index = getVal.length;index<forLineElement.length;index++){
						let element = forLineElement[index];
						//当前的节点是显示的，则隐藏
						if(element.isReplace === false){
							let parentNode = element.parentNode; 
							let seize = element.__seize__;
							element.isReplace = true;
							seize.__seize__ = element;
							parentNode.replaceChild(seize, element);
						}
					}
				}
				else if(getVal.length == forLineElement.length) {
					for(let index = 0; index < forLineElement.length; index++) {
						let element = this.__ob__.for[keyLine][index];
						if(element.isReplace === true) {
							let seize = element.__seize__;
							let parentNode = seize.parentNode;
							element.isReplace = false;
							parentNode.replaceChild(element, seize);
						}
					}
					//更新一次
					this.update();
				}
			}
		})
	}
}

export { forUpdate };