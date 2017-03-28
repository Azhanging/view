/*拆解绑定的信息*/
import { disassembly, getDisassemblyKey } from './../tools';
import { setShow } from './../show';
import { setIf } from './../if';
import { setModel } from './../model';
/*查找element对象中的属性*/
function setAttr(element, vdom) {

	for(let _index in Object.keys(element.attributes)) {
		let prop = element.attributes,
			propName = prop[_index].name,
			propValue = prop[_index].value;

		if(/:.?/.test(propName)) {
			//删除当前绑定到真实attr上的属性
			//清除:号
			propName = propName.replace(':', '');
			//给vdom加上属性
			vdom.props[propName] = propValue;
			let attrKeys = getDisassemblyKey(disassembly(propValue));
			attrKeys.forEach((val, index) => {
				if(!this.__ob__.attr[val]) {
					this.__ob__.attr[val] = [];
				}
				//设置attrs的expr
				if(!(element.__attrs__ instanceof Object)) {
					element.__attrs__ = {};
				}
				//给element元素加上__attrs__依赖
				element.__attrs__[propName] = propValue;
				//在__ob__设置attr的依赖
				this.__ob__.attr[val].push(element);
			});
		}

		if(/_v-.?/.test(propName)) {
			//删除绑定属性
			propName = propName.replace('_v-', '');
			//获取到主Key的数组
			switch(propName) {
				//				case 'for':
				//					setFor.call(this, el, attrVal);
				//					break;
				case 'show':
					setShow.call(this, element, propValue);
					break;
				case 'if':
					setIf.call(this, element, propName, propValue);
					break;
				case 'model':
					setModel.call(this, element, propValue);
				default:
					;
			}
		}
	}
}

export { setAttr };