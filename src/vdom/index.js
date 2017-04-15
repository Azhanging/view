import { setDom } from './../dom';
import component from './../component';
import { setAttr } from './../attr';
import { setEvent } from './../event';
import { getIndex ,setScope} from './../tools';

//状态
const REPLACE = 0;
const REORDER = 1;
const PROPS = 2;
const TEXT = 3;

class _Element {
	constructor(context) {
		this.id = 0;
		this.elementList = {};
		this.context = context;
	}
	render(options) {
		let el;
		if(options.tagName) {
			el = document.createElement(options.tagName);
			//设置属性
			for(let key of Object.keys(options.props)) {
				let value = options.props[key];
				el.setAttribute(key, value);
			}
			//设置子节点
			for(let children of options.childrens) {
				let createElement;
				if(children instanceof Object) {
					createElement = this.render(children);
				} else {
					createElement = document.createTextNode(children);
				}
				el.appendChild(createElement);
			}
		} else {
			el = document.createTextNode(options.textContent);
		}

		return el;
	}
	resolve(element, _this) {
		let vdom;
		//dom节点
		if(element.nodeType === 1) {
			//当前的ELement是否为组件
			if(_this.components[element.tagName.toLowerCase()] && element.tagName.indexOf('-') > -1) {
				element = component.call(_this, element);
			}
			vdom = {
				tagName: element.tagName.toLowerCase(),
				props: {},
				childrens: [],
				index: this.id,
				el: element
			};
			//设置作用域
			setScope.call(_this,element);
			
			//设置属性的绑定
			setAttr.call(_this, element, vdom);
			
			for(let el of element.childNodes){
				if(el.nodeType === 1 || el.nodeType === 3){
					this.id++;
					vdom.childrens.push(this.resolve(el, _this));		
				}
			}
		} else if(element.nodeType === 3){
			//设置文本节点绑定的更新
			setDom.call(_this, element);
			//文本节点
			vdom = {
				textContent: element.textContent,
				index: this.id,
				el: element
			};
		}
		//给当前的链路中添加
		this.elementList[vdom.index] = vdom;

		//如果递归到最开始的节点，index的值返回到0
		if(vdom.id == 0) {
			this.id = 0;
		}

		return vdom;
	}
	diff(oldTree, newTree) {
		let patched = [];
		this.diffTag(oldTree, newTree, patched);
		return patched;
	}
	/*判断节点和之前的节点是否相同*/
	diffTag(oldTree, newTree, patched) {
		//先计算出属性的差异性
		if(!oldTree.textContent) {
			let getProps = this.diffProps(oldTree, newTree);
			//主节点不同,完全替换
			if(oldTree.tagName != newTree.tagName) {
				patched.push({
					type: REPLACE,
					node: newTree,
					index: oldTree.index
				});
			} else if(Object.keys(getProps.props).length > 0) {
				/*从对比的差异中查看是否有差异*/
				patched.push(getProps);
			}
			/*查看当前的节点中是否存在子节点*/
			if(oldTree.childrens.length > 0) {
				this.diffChildNode(oldTree, newTree, patched);
			}
		} else {
			this.diffTextNode(oldTree, newTree, patched);
		}
	}
	/*判断属性是否有增加或者属性时候是否进行过修改*/
	diffProps(oldTree, newTree) {
		let props = {};
		for(let key of Object.keys(newTree.props)) {
			let value = newTree.props[key];
			//如果当前的属性存在，值不相同，存值
			if(Reflect.has(oldTree.props, key) && !(oldTree.props[key] === value)) {
				props[key] = value;
			} else if(!Reflect.has(oldTree.props, key)) {
				props[key] = newTree.props[key];
			}
		}
		//添加修改过属性内容
		return {
			type: PROPS,
			props: props,
			index: oldTree.index
		}

	}
	/*判断当前的文本节点是够改变了*/
	diffTextNode(oldTree, newTree, patched) {
		if(oldTree.textContent != newTree.textContent) {
			patched.push({
				type: TEXT,
				content: newTree.textContent,
				index: oldTree.index
			});
		}
	}

	/*给子节点进行递归*/
	diffChildNode(oldTree, newTree, patched) {
		oldTree.childrens.forEach((childNode, _index) => {
			this.diffTag(childNode, newTree.childrens[_index], patched);
		});
	}
}

export default _Element;