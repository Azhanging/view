import { getIndex } from './../tools';

//事件绑定
function setEvent(el) {
	let prop = el.attributes
	for(let index = 0; index < Object.keys(el.attributes).length; index++) {
		let propName = prop[index]?prop[index].name:'',
			propValue = prop[index]?prop[index].value:'';

		if(/@.?/.test(propName)) {
			let filterAttrVal = propValue.replace(/\(+\S+\)+/g, '');
			propName = propName.replace('@', '');
			//存在这个方法
			if(this[filterAttrVal]) {
				//存在参数值
				if(propValue.match(/\(\S+\)/) instanceof Array) {
					let args = propValue.match(/\(\S+\)/)[0].replace(/\(?\)?/g, '').split(',');
					//绑定事件
					el.addEventListener(propName, (event) => {
						//对数组内的数据查看是否存在的数据流进行过滤
						let filterArgs = args.map((item, index) => {
							//如果传入的对象是$index,获取当前父级中所在的索引
							if(item === '$index') {
								return getIndex.call(this, el);
							} else if(item === '$event') {
								return event;
							} else {
								//解析data中的值
								return this.expr(item).toString();
							}
						});

						//运行绑定的event
						this[filterAttrVal].apply(this, filterArgs);
					}, false);

				} else {
					//不存在参数值过滤掉空的括号
					el.addEventListener(propName, (event) => {
						this[filterAttrVal].call(this, event);
					}, false);
				}
			}
		}
	}
}

/*_v-for对象循环添加事件*/
function setForEvent(el, index) {
	var childEls = el.childNodes,
		childElsLen = childEls.length;
	if(el.nodeType === 1) {
		//这里为查看是否通过数组循环出来的，添加index到当前循环对象
		if(!isNaN(index)) {
			//如果使用的是模板，cloneNode中无法赋值私有的属性，通过data-index设置所有值
			if(this.isTemplate) {
				el.dataset['index'] = index;
			} else {
				el.$index = index;
			}
		}
		//绑定循环中的事件
		setEvent.call(this, el);
		if(childElsLen > 0) {
			Object.keys(childEls).forEach((index) => {
				if(childEls[index].nodeType == 1) {
					setEvent.call(this, childEls[index]);
				}
			});
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

export { setEvent, setForEvent, setChildTemplateEvent }