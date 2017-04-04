/*拆解绑定的信息*/
import { disassembly, getDisassemblyKey,setBind ,getIndex } from './../tools';
import { setShow } from './../show';
import { setIf } from './../if';
import { setFor } from './../for';
import { setModel } from './../model';
/*查找element对象中的属性*/
function setAttr(element, vdom) {
	for(let _index = 0;_index<element.attributes.length;_index++) {
		let prop = element.attributes,
			propName = prop[_index].name,
			propValue = prop[_index].value;

		if(/:.?/.test(propName)) {
			//删除当前绑定到真实attr上的属性
			element.removeAttribute(propName);
			_index -= 1;
			//清除:号
			propName = propName.replace(':', '');
			//给vdom加上属性
			vdom.props[propName] = propValue;
			let attrKeys = getDisassemblyKey(disassembly(propValue));
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
		}

		if(/_v-.?/.test(propName)) {
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
		}
		if(/@.?/.test(propName)) {
			let filterpropValue = propValue.replace(/\(+\S+\)+/g, '');
			if(!(this.isTemplate)){
				//删除当前绑定到真实attr上的属性
				element.removeAttribute(propName);
				_index -= 1;
			}
			
			propName = propName.replace('@', '');
			//存在这个方法
			if(this[filterpropValue]) {
				//存在参数值
				if(propValue.match(/\(\S+\)/) instanceof Array) {
					let args = propValue.match(/\(\S+\)/)[0].replace(/\(?\)?/g, '').split(',');
					//绑定事件
					element.addEventListener(propName, (event) => {
						//对数组内的数据查看是否存在的数据流进行过滤
						let filterArgs = args.map((item, index) => {
							//如果传入的对象是$index,获取当前父级中所在的索引
							if(item === '$index') {
								return getIndex.call(this,element);
							} else if(item === '$event') {
								return event;
							} else {
								//解析data中的值
								return this.expr(item).toString();
							}
						});
						//运行绑定的event
						this[filterpropValue].apply(this, filterArgs);
					}, false);

				} else {
					//不存在参数值过滤掉空的括号
					el.addEventListener(propName, (event) => {
						this[filterpropValue].call(this, event);
					}, false);
				}
			}
		}
	}
}

export { setAttr };