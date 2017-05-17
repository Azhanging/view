/*拆解绑定的信息*/
import { setBind ,getIndex ,ResolveExpr,resolveKey,hasForAttr,findKeyLine} from './../tools';
import { setShow } from './../show';
import { setIf } from './../if';
import { setFor } from './../for';
import { setEventHandler } from './../event';
import { setModel } from './../model';
/*查找element对象中的属性*/
function setAttr(element, vdom) {
	let hasFor = hasForAttr(element);
	for(let _index = 0;_index<element.attributes.length;_index++) {
		let prop = element.attributes,
			propName = prop[_index]?prop[_index].name:'',
			propValue = prop[_index]?prop[_index].value:'';

		if(/:.?/.test(propName) && !hasFor) {
			//解析表达式
			let re = new ResolveExpr(propValue);
			let attrExpr = re.getExpr(); 
			let filter = re.getFilter();
			let attrKeys = re.getKeys();
			
			//删除当前绑定到真实attr上的属性
			element.removeAttribute(propName);
			_index -= 1;
			//清除:号
			propName = propName.replace(':', '');
			//给vdom加上属性
			vdom.props[propName] = attrExpr;
			
			attrKeys.forEach((key, index) => {
				key = findKeyLine.apply(this,[element,key]);
				key = resolveKey(key);
				if(!this.__ob__.attr[key]) {
					this.__ob__.attr[key] = [];	
					setBind.call(this,key);
				}
				if(!(element.__attrs__ instanceof Object)) {
					element.__attrs__ = {};
				}
				if(!(element.__attrs__[propName] instanceof Object)){
					element.__attrs__[propName] = {}
				}
				element.__attrs__[propName].__bind__ = attrExpr;
				element.__attrs__[propName].__filter__ = filter;
				this.__ob__.attr[key].push(element);
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
					if(hasFor) {break;}
					setShow.call(this, element, propValue);
					break;
				case 'if':
					if(hasFor) {break;}
					setIf.call(this, element, propName, propValue);
					break;
				case 'model':
					if(hasFor) {break;}
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
	return hasFor;
}

export { setAttr };