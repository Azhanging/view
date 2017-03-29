import {setEvent} from './../event';
import {deepCopy} from './../tools';
import _Element from './../vdom';

function forUpdate(key) {
	//创建文档片段
	let forDomBackUp = document.createDocumentFragment();
	if(key === undefined || key === '') {
		//顶层的_v-for循环
		Object.keys(this.forEls).forEach((value,index)=>{
			updateFn.call(this, this.forEls[value]);
		});

		/*for(var i in this.forEls) {
			var keyObj = this.forEls[key];
			updateFn.call(this, this.forEls[i]);
		}*/
	} else {
		let updateKeys = [];
		//插件更新值是否存在依赖if，show，attr绑定，存在绑定更新for列表数据
		if(!this.forItem[key] && (this.ifEls[key] || this.showEls[key] || this.attrBindings[key])) {
			forUpdate.call(this);
			return;
		}

		//存在key中或者key中是多层结构以及为循环的参数项，将会跳出
		if(!this.forKeyLineDate[key] && this.forItem[key]) {
			return;
		}

		//需要更新的主keys存储
		if(this.forEls[key]) {
			if(updateKeys.indexOf(key) == -1) {
				updateKeys.push(key);
			}
		}

		//依赖主键的更新
		if(Array.isArray(this.forKeyLineDate[key]) && this.forKeyLineDate[key].length > 0) {
			for(let i = 0; i < this.forKeyLineDate[key].length; i++) {
				if(updateKeys.indexOf(this.forKeyLineDate[key][i]) == -1) {
					updateKeys.push(this.forKeyLineDate[key][i]);
				}
			}
		}

		//主键依赖集合更新
		updateKeys.forEach((value, index)=>{
			updateFn.call(this, this.forEls[value]);
		});
	}

	function updateFn(keyObj) {
		keyObj.forEach((item,index)=>{
			//订阅者数据
			let {data,key:getKey,seize,appendEls,el} = item;
				data = this.expr(data, 'for');
				el = el.childNodes[0];

			//删除原有的添加的节点内容
			for(var l = 0; l < appendEls.length; l++) {
				appendEls[l].remove();
			}

			//子节点也是存在循环的
			// if(el['forChild']) {
				Object.keys(data).forEach((key,index)=>{
					forDatadDeepCopy.apply(this, [getKey, data[key]]);
					if(el['forChild']) {
						computeFor.call(this, el['forChild']);
					}
					let cloneEl = el.cloneNode(true);
					forDomBackUp.appendChild(cloneEl);
					appendEls.push(cloneEl);
					setEvent.call(this, cloneEl, index);
				});

				/*for(var j in data) {
					if(data.hasOwnProperty(j)) {
						//for迭代出来的对象是否解耦依赖
						forDatadDeepCopy.apply(this, [getKey, data[j]]);
						computeFor.call(this, el['forChild']);
						var cloneEl = el.cloneNode(true);
						forDomBackUp.appendChild(cloneEl);
						appendEls.push(cloneEl);
						setEvent.call(this, cloneEl, j);
					}
				}*/
/*			} else {
				Object.keys(data).forEach((key,index)=>{
					//设置下层的依赖数据流
					forDatadDeepCopy.apply(this, [getKey, data[key]]);
					let cloneEl = el.cloneNode(true);
					forDomBackUp.appendChild(cloneEl);
					appendEls.push(cloneEl);
					setEvent.call(this, cloneEl, index);
				});

				for(var j in data) {
					if(data.hasOwnProperty(j)) {
						//设置下层的依赖数据流
						forDatadDeepCopy.apply(this, [getKey, data[j]]);
						var cloneEl = el.cloneNode(true);
						forDomBackUp.appendChild(cloneEl);
						appendEls.push(cloneEl);
						setEvent.call(this, cloneEl, j);
					}
				}
			}*/

			var parentNode = seize.parentNode;
			parentNode.insertBefore(forDomBackUp, seize);
		});


		/*for(var k = 0; k < keyObj.length; k++) {
			//订阅者数据
			var item = keyObj[k],
				data = this.expr(item['data'], 'for'),
				getKey = item['key'],
				seize = item['seize'],
				appendEls = item['appendEls'],
				el = item['el'].childNodes[0];
			//删除原有的添加的节点内容
			for(var l = 0; l < appendEls.length; l++) {
				appendEls[l].remove();
			}

			//子节点也是存在循环的
			if(el['forChild']) {
				for(var j in data) {
					if(data.hasOwnProperty(j)) {
						//设置下层的依赖数据流

						//for迭代出来的对象是否解耦依赖
						forDatadDeepCopy.apply(this, [getKey, data[j]]);
						computeFor.call(this, el['forChild']);
						var cloneEl = el.cloneNode(true);
						forDomBackUp.appendChild(cloneEl);
						appendEls.push(cloneEl);
						setEvent.call(this, cloneEl, j);
					}
				}
			} else {
				for(var j in data) {
					if(data.hasOwnProperty(j)) {
						//设置下层的依赖数据流
						forDatadDeepCopy.apply(this, [getKey, data[j]]);
						var cloneEl = el.cloneNode(true);
						forDomBackUp.appendChild(cloneEl);
						appendEls.push(cloneEl);
						setEvent.call(this, cloneEl, j);
					}
				}
			}

			var parentNode = seize.parentNode;
			parentNode.insertBefore(forDomBackUp, seize);
		}*/
	}
}

//for迭代出来的对象是否解耦依赖
function forDatadDeepCopy(getKey, data) {
	if(data instanceof Array || data instanceof Object) {
		this.data[getKey] = deepCopy(data);
	} else {
		//如果只是字符串，数字对象，直接赋值
		this.data[getKey] = data;
	}
}

//递归计算for
function computeFor(forChild, updateKeys) {
	//创建文档片段
	let forDomBackUp = document.createDocumentFragment();

	forChild.forEach((item,index)=>{

		let {data,key:getKey,seize,appendEls,el} = item;
			data = this.expr(data, 'for');
			el = el.childNodes[0];

		//删除原有的添加的节点内容
		for(var l = 0; l < appendEls.length; l++) {
			appendEls[l].remove();
		}

		//子节点也是存在循环的
		Object.keys(data).forEach((key,index)=>{
			forDatadDeepCopy.apply(this, [getKey, data[key]]);
			if(el['forChild']) {
				computeFor.call(this, el['forChild'], updateKeys);
			}
			let cloneEl = el.cloneNode(true);
			forDomBackUp.appendChild(cloneEl);
			appendEls.push(cloneEl);
			setEvent.call(this, cloneEl, index);
		});
		var parentNode = seize.parentNode;
		parentNode.insertBefore(forDomBackUp, seize);
	});

	//[]子节点
	/*for(var i = 0; i < forChild.length; i++) {
		//订阅者数据
		var item = forChild[i],
			data = this.expr(item['data'], 'for'),
			getKey = item['key'],
			seize = item['seize'],
			appendEls = item['appendEls'],
			el = item['el'].childNodes[0];
		//删除原有的添加的节点内容
		for(var l = 0; l < appendEls.length; l++) {
			appendEls[l].remove();
		}

		//子节点也是存在循环的
		if(el['forChild']) {
			for(var j in data) {
				if(data.hasOwnProperty(j)) {
					//设置下层的依赖数据流
					forDatadDeepCopy.apply(this, [getKey, data[j]]);
					computeFor.call(this, el['forChild'], updateKeys);
					var cloneEl = el.cloneNode(true);
					forDomBackUp.appendChild(cloneEl);
					appendEls.push(cloneEl);
					setEvent.call(this, cloneEl, j);
				}
			}
		} else {
			//子节点不存在循环
			for(var j in data) {
				if(data.hasOwnProperty(j)) {
					//设置下层的依赖数据流
					forDatadDeepCopy.apply(this, [getKey, data[j]]);
					var cloneEl = el.cloneNode(true);
					forDomBackUp.appendChild(cloneEl);
					appendEls.push(cloneEl);
					setEvent.call(this, cloneEl, j);
				}
			}
		}

		var parentNode = seize.parentNode;
		parentNode.insertBefore(forDomBackUp, seize);
	}*/
}

export {forUpdate};
