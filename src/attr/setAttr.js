//import {getKeys} from './../tools'; 
//import {setFor} from './../for'; 
//import {setIf} from './../if'; 
//import {setShow} from './../show'; 
//import {setModel} from './../model'; 

/*查找element对象中的属性*/
function setAttr(el) {
	let elAttrs = el.attributes,
		attrName,
		attrVal,
		key,
		splitKeys;

	for(let i = 0; i < elAttrs.length; i++) {
		attrName = elAttrs[i].name;
		attrVal = elAttrs[i].textContent;
		if(/:.?/.test(attrName)) {
			//删除绑定属性
			el.removeAttribute(attrName);
			i -= 1;

			attrName = attrName.replace(':', '');
			//获取到主Key的数组
			key = getKeys.call(this, attrVal);
			//存在数据绑定,不存在数据绑定的值无意义,不进行计算,则不会添加属性
			key.forEach((item, index)=>{
				if(item) {
					if(!(this.attrBindings[item])) {
						this.attrBindings[item] = [];
					}
					if(!(el['attrbindingKey'] instanceof Object)) {
						el['attrbindingKey'] = {};
					}
					el['attrbindingKey'][attrName] = attrVal;
					this.attrBindings[item].push(el);
				}
			});
			
			/*key.forEach(function(item, index) {
				if(item) {
					if(!(this.attrBindings[item])) {
						this.attrBindings[item] = [];
					}
					if(!(el['attrbindingKey'] instanceof Object)) {
						el['attrbindingKey'] = {};
					}
					el['attrbindingKey'][attrName] = attrVal;
					this.attrBindings[item].push(el);
				}
			}.bind(this));*/
		}
		if(/_v-.?/.test(attrName)) {
			//删除绑定属性
			el.removeAttribute(attrName);
			i -= 1;

			attrName = attrName.replace('_v-', '');
			//获取到主Key的数组
			key = getKeys.call(this, attrVal);
			switch(attrName) {
				case 'for':
					setFor.call(this, el, attrVal);
					break;
				case 'if':
					setIf.call(this, el, key, attrName, attrVal);
					break;
				case 'show':
					setShow.call(this, el, key, attrVal);
					break;
				case 'model':
					setModel.call(this, el, attrVal);
				default:
					;
			}
		}
	}
}

export {setAttr};