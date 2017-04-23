import { getIndex } from './../tools';

//事件绑定
function setEvent(element) {
	let prop = element.attributes
	for(let index = 0; index < Object.keys(element.attributes).length; index++) {
		let propName = prop[index] ? prop[index].name : '',
			propValue = prop[index] ? prop[index].value : '';

		if(/@.?/.test(propName)) {
			setEventHandler.apply(this, [element, propName, propValue]);
		}
	}
}

//事件处理函数
function setEventHandler(element, propName, propValue) {
	let filterpropValue = propValue.replace(/\(+\S+\)+/g, '');
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
						return getIndex.call(this, element);
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
			element.addEventListener(propName, (event) => {
				this[filterpropValue].call(this, event);
			}, false);
		}
	}
}

/*
 *	在templateData中,$index的参数会根据插入的节点对象进行返回index的值
 *	模板子对象循环添加事件
 */

function setChildTemplateEvent(el) {
	let childEls = el.childNodes;
	Object.keys(childEls).forEach((index) => {
		let el = childEls[index]
		if(el.nodeType == 1) {
			if(el.childNodes.length > 0) {
				setChildTemplateEvent.call(this, el);
			}
			setEvent.call(this, el);
		}
	});
}

export {
	setEvent,
	setChildTemplateEvent,
	setEventHandler
}