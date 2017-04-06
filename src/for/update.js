import _Element from './../vdom';
import { createTextNodes, replaceTextNode } from './../dom';

function forUpdate(keyLine) {
	//初始化数据链跳出
	if(keyLine === undefined) {
		return;
	}
	//查找当前的数据链绑定的对象
	let LineElement = this.__ob__.for[keyLine];
	//如果当前的数据不是for循环中的数据，跳出
	if(LineElement == undefined) {
		return;
	}

	//获取for绑定的数据
	let getVal = this._get(keyLine);

	if(getVal instanceof Array || getVal instanceof Object) {
		//获取当前值得数组化对象
		let valLength = Object.keys(getVal);

		for(let index = 0; index < LineElement.length; index++) {
			let element = LineElement[index];
			if(element.__forElement__) {
				//初始化空数组的节点
				if(element.isReplace == true && valLength.length > 0) {
					let seize = element.__seize__;
					let parentNode = seize.parentNode;
					element.isReplace = false;
					if(!(getVal instanceof Array) && getVal instanceof Object) {
						element.innerHTML = '';
					}

					//特殊情况，如果父节里面多层嵌套，子节点重新带入渲染，那么默认储存的节点信息会存在空的父级节点
					if(parentNode == null) {
						LineElement.splice(LineElement.indexOf(element), 1);
						continue;
					}
					parentNode.replaceChild(LineElement[index], seize);
				}

				let forLineElement = element.__forElement__;
				//新增数组数据
				if(valLength.length > forLineElement.length) {
					let diff = valLength.length - forLineElement.length;
					let parentNode = forLineElement[0].parentNode;
					let fragment = document.createDocumentFragment();
					let tempElement = document.createElement('div');
					let lastIndex = forLineElement[forLineElement.length - 1].$index;

					//如果数据长于现有的节点数，添加新的节点
					for(let i = 0; i < diff; i++) {
						let replaceKeyLine;

						if(getVal instanceof Array) {
							replaceKeyLine = keyLine + '.' + (++lastIndex);
						} else if(getVal instanceof Object) {
							replaceKeyLine = keyLine + '.' + valLength[lastIndex + 1];
							++lastIndex;
						}

						let outerHTML = forLineElement[forLineElement.length - 1].__html__;
						let seize = document.createTextNode('');
						outerHTML = outerHTML.replace(new RegExp(keyLine + '\\.\\d* |' + keyLine + '\\.[0-9 A-z]*', 'g'), replaceKeyLine);
						tempElement.innerHTML = outerHTML;
						let _element = tempElement.firstElementChild;
						this.__ob__.for[keyLine].push(_element);
						_element.__html__ = _element.outerHTML;
						seize.__seize__ = _element;
						_element.isReplace = false;
						_element.__seize__ = seize;
						_element.$index = lastIndex;
						//当前是否模板中的循环，设置dataset中的index
						if(this.isTemplate) {
							_element.dataset['index'] = lastIndex;
						}
						//是否初始化的Object循环
						if(forLineElement[0].isNullStart) {
							forLineElement.splice(0, 1);
							_element.__forElement__ = forLineElement;
							_element.__forElement__.push(_element);
							_element.__presentSeize__ = element.__presentSeize__;
							diff++;
							lastIndex = 0;
							LineElement.push(_element);
							LineElement.splice(LineElement.indexOf(element), 1);
							element.remove();
						}
						fragment.appendChild(_element);
					}

					//重新渲染子循环的列表
					Object.keys(fragment.childNodes).forEach((index) => {
						if(forLineElement.indexOf(fragment.childNodes[index]) === -1) {
							forLineElement.push(fragment.childNodes[index]);
						}
						new _Element().resolve(fragment.childNodes[index], this);
					});

					//更新旧数据
					for(let index = 0; index < forLineElement.length; index++) {
						let element = forLineElement[index];
						//当前的节点是显示的，则隐藏
						if(element.isReplace === true) {
							let parentNode = element.__seize__.parentNode;
							let seize = element.__seize__;
							element.isReplace = false;
							seize.__seize__ = element;
							parentNode.replaceChild(element, seize);
						}
					}
					
					
					//添加到当前循环组的占位节点中
					parentNode.insertBefore(fragment, forLineElement[0].__presentSeize__);
					//创建存在绑定的文本节点
					createTextNodes.call(this);
					//新建和替换绑定的文本节点信息
					replaceTextNode.call(this);
					//更新一次
					this.update();
				}
				//如果当前的数据小于节点循环节点的长度,考虑到如果默认为空数组，赋值的时候节点长度大于0了，不存在parentNode，报错
				else if(valLength.length < forLineElement.length && forLineElement[0].isReplace == false) {
					//更新节点的替换
					for(let index = 0; index < valLength.length; index++) {
						let element = forLineElement[index];
						//当前的节点是显示的，则隐藏
						if(element.isReplace === true) {
							let parentNode = element.__seize__.parentNode;
							let seize = element.__seize__;
							element.isReplace = false;
							seize.__seize__ = element;
							parentNode.replaceChild(element, seize);
						}
					}
					//替换没有数据的节点
					for(let index = valLength.length; index < forLineElement.length; index++) {
						let element = forLineElement[index];
						//当前的节点是显示的，则隐藏
						if(element.isReplace === false) {
							let parentNode = element.parentNode;
							let seize = element.__seize__;
							element.isReplace = true;
							seize.__seize__ = element;
							parentNode.replaceChild(seize, element);
						}
					}
				} else if(valLength.length == forLineElement.length) {
					for(let index = 0; index < forLineElement.length; index++) {
						let element = forLineElement[index];
						if(element.isReplace === true) {
							let seize = element.__seize__;
							let parentNode = seize.parentNode;
							element.isReplace = false;
							parentNode.replaceChild(element, seize);
						}
					}
				}
			}
		}
	} else {
		//数据结构被修改了
		LineElement.forEach((element) => {
			if(element.__forElement__) {
				let forLineElement = element.__forElement__;
				for(let index = 0; index < forLineElement.length; index++) {
					let element = forLineElement[index];
					//当前的节点是显示的，则隐藏
					if(element.isReplace === false) {
						let parentNode = element.parentNode;
						let seize = element.__seize__;
						element.isReplace = true;
						seize.__seize__ = element;
						parentNode.replaceChild(seize, element);
					}
				}
			}
		});

	}
}

export { forUpdate };