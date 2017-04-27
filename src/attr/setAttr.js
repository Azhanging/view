/*拆解绑定的信息*/
import { disassembly, getDisassemblyKey,setBind ,getIndex ,trim ,getKeyLink} from './../tools';
import { setShow } from './../show';
import { setIf } from './../if';
import { setFor } from './../for';
import { setEventHandler } from './../event';
import { setModel } from './../model';
/*查找element对象中的属性*/
function setAttr(element, vdom) {
	for(let _index = 0;_index<element.attributes.length;_index++) {
		let prop = element.attributes,
			propName = prop[_index]?prop[_index].name:'',
			propValue = prop[_index]?prop[_index].value:'';

		if(/:.?/.test(propName)) {
			propValue = trim(propValue);
			//删除当前绑定到真实attr上的属性
			element.removeAttribute(propName);
			_index -= 1;
			//清除:号
			propName = propName.replace(':', '');
			//给vdom加上属性
			vdom.props[propName] = propValue;
			
			let attrKeys = getKeyLink(propValue);
			
//			attrKeys = getDisassemblyKey(disassembly(propValue));
			attrKeys.forEach((val, index) => {
				if(!this.__ob__.attr[val]) {
					this.__ob__.attr[val] = [];	
					setBind.call(this,val);
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
		}else if(/_v-.?/.test(propName)) {
			//删除当前绑定到真实attr上的属性
			element.removeAttribute(propName);
			_index -= 1;
			//删除绑定属性
			propName = propName.replace('_v-', '');
			//获取到主Key的数组
			switch(propName) {
				case 'for':
					setFor.call(this, element, propValue,_index);
					break;
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
		}else if(/@.?/.test(propName)) {
			//如果不是模板中的事件
			if(!(this.isTemplate)){
				//删除当前绑定到真实attr上的属性
				element.removeAttribute(propName);
				_index -= 1;
			}
			setEventHandler.apply(this,[element,propName,propValue]);
		}
	}
}

export { setAttr };