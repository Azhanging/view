import { createTextNodes, replaceTextNode } from './../dom';
import Vdom from './../vdom';

function forUpdate(key) {
	//初始化
	if(key === undefined || key === '') {
		Object.keys(this.__ob__.for).forEach((keyLine, index) => {
			updateFn.call(this, keyLine);
		});	
	} else {
		//如果不存在键值，不执行更新
		if(!this.__ob__.for[key]) {
			return;
		}
		updateFn.call(this, key);
	}
}

function updateFn(key) {
	let vdom = new Vdom();
	let _this = this;
	let updateKeys = [];
	//获取element节点
	let elements = this.__ob__.for[key];
	let forItem = '';

	elements.forEach((element) => {
		forItem = element.__forItem__;
		//获取当前的作用域链数据
		let getData = this._get(key, element);
		//如果当前值是null，返回空数组循环
		if(getData === null || getData === '' || getData === undefined) {
			getData = [];
			//判断是否通过数字来循环的
			if(element.isNumFor) {
				getData = element.__forValue__;
			}
		}

		//IE下Object.keys不识别字符串
		if(typeof getData === 'string') {
			getData = getData.split('');
		}

		let dataLength = Object.keys(getData).length;
		//当前循环组内的append的循环节点
		let forElementGroup = element.__forElementGroup__;
		let forElementGroupLength = forElementGroup.length;
		//存储移除数据的节点文档片段
		let fragment = document.createDocumentFragment();
		//相同数据数量更新数据流
		if(dataLength == forElementGroupLength) {
			for(let index = 0; index < forElementGroupLength; index++) {
				if(forElementGroup[index].__for__.isAppend == false) {
					forElementGroup[index].__for__.isAppend = true;
					fragment.appendChild(forElementGroup[index]);
				}
			}
			//添加到实际的dom中
			element.__parentNode__.insertBefore(fragment, element.__presentSeize__);
			
			if(updateKeys.indexOf(element.__forKey__) === -1){
				updateKeys.push(element.__forKey__);
			}

		} else if(dataLength < forElementGroupLength) {
			let _fragment = document.createDocumentFragment();
			//移除已添加的节点
			for(let index = dataLength; index < forElementGroupLength; index++) {
				if(forElementGroup[index].__for__.isAppend == true) {
					forElementGroup[index].__for__.isAppend = false;
					fragment.appendChild(forElementGroup[index]);
				}
			}

			for(let index = 0; index < dataLength; index++) {
				if(forElementGroup[index].__for__.isAppend == false) {
					forElementGroup[index].__for__.isAppend = true;
					_fragment.appendChild(forElementGroup[index]);
				}
			}
			//添加到实际的dom中
			element.__parentNode__.insertBefore(_fragment, element.__presentSeize__);
			
			if(updateKeys.indexOf(element.__forKey__) === -1){
				updateKeys.push(element.__forKey__);
			}

		} else if(dataLength > forElementGroupLength) {

			let cloneNodeElements = [];
			let getDataKeys = Object.keys(getData);
			let _element = element;

			//先把原来隐藏的节点打开
			for(let index = 0; index < forElementGroupLength; index++) {
				if(forElementGroup[index].__for__.isAppend == false) {
					forElementGroup[index].__for__.isAppend = true;
					fragment.appendChild(forElementGroup[index]);
				}
			}
			//增加数据数量更新数据流
			for(let index = forElementGroupLength, len = getDataKeys.length; index < len; index++) {
				let cloneNode = element.__self__.cloneNode(true);
				cloneNode.__for__ = {
					forItem: element.__forItem__,
					forKey: getDataKeys[index],
					index: index,
					keyLine: key + '.' + getDataKeys[index],
					isAppend: true
				};
				cloneNode.$index = index;
				element.__forElementGroup__.push(cloneNode);
				fragment.appendChild(cloneNode);
				cloneNodeElements.push(cloneNode);
			}

			//添加到实际的dom中
			element.__parentNode__.insertBefore(fragment, element.__presentSeize__);
			//解析新添加的节点
			cloneNodeElements.forEach((element) => {
				//解析节点
				vdom.resolve(element, this);
				//设置键值的作用域
				Object.defineProperty(element.$scope, element.__for__.forItem, {
					get() {
						return _this._get(element.__for__.keyLine, element);
					}
				});
				//设置索引的作用域
				Object.defineProperty(element.$scope, '$index', {
					get() {
						return element.__for__.index;
					}
				});
				//设置key的作用域
				if(_element.__forKey__) {
					Object.defineProperty(element.$scope, _element.__forKey__, {
						get() {
							return element.__for__.forKey;
						}
					});
				}
			});

			//创建存在绑定的文本节点
			createTextNodes.call(this);
			//新建和替换绑定的文本节点信息
			replaceTextNode.call(this);
		}
	});
	
	updateKeys.forEach((key)=>{
		this.dep(key);	
	});
}

export {
	forUpdate
};