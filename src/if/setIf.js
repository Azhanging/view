import { setBind ,ResolveExpr,resolveKey} from './../tools';
function nextSibling(element, ifCount) {
	if(element.nodeType === 1) {
		let attributes = element.attributes;
		if(attributes.length > 0) {
			Object.keys(attributes).forEach((key, index) => {
				let propName = attributes[index]?attributes[index].name:'';
				let propValue = attributes[index]?attributes[index].value:'';
				if(/_v-.?/.test(propName)) {
					propName = propName.replace('_v-', '');
					//再遇到if就跳出
					if(propName == 'if') {
						return;
					}
					//else和elseif的对象
					if(propName == 'elseif' || propName == 'else') {
						let re = new ResolveExpr(propValue);
						let ifKeys = re.getKeys();
						let ifExpr = re.getExpr();
						let filter = re.getFilter();
						
						
						
						ifKeys.forEach((key, index) => {
							if(key) {
								key = resolveKey(key);
								if(!(this.__ob__.if[key] instanceof Array)) {
									this.__ob__.if[key] = [];
								}
								this.__ob__.if[key].push(ifCount);
							}
						});
						if(propName == 'else') {
							//因为要过match，必须为字符串类型的true
							element.__if__ = {
								__bind__:'true',
								__filter__:filter
							};
						} else {
							element.__if__ = {
								__bind__:ifExpr,
								__filter__:filter
							};
						}

						ifCount.push(element);

						if(element.nextSibling) {
							let nextElement = element.nextSibling;
							nextSibling.call(this, nextElement, ifCount);
						}
					}
				}
			});
		} else {
			if(element.nextSibling) {
				let nextElement = element.nextSibling;
				nextSibling.call(this, nextElement, ifCount);
			}
		}
	} else {
		//其他内容节点直接跳过
		if(element.nextSibling) {
			let nextElement = element.nextSibling;
			nextSibling.call(this, nextElement, ifCount);
		}
	}
}

function setIf(element, propName, propValue) {
	let ifCount;
	let re = new ResolveExpr(propValue);
	let ifKeys = re.getKeys();
	let ifExpr = re.getExpr();
	let filter = re.getFilter();
	
	ifKeys.forEach((key, index) => {
		if(key) {
			key = resolveKey(key);
			//创建绑定的ob对象
			if(!(this.__ob__.if[key] instanceof Array)) {
				this.__ob__.if[key] = [];
				setBind.call(this, key);
			}
			
			//存储当前的if组
			ifCount = [];
			element.__if__ = {
				__bind__:ifExpr,
				__filter__:filter
			};
			
			let seize = document.createTextNode('');
			let parentNode = element.parentNode?element.parentNode:element.__parentNode__;
			parentNode.insertBefore(seize,element.nextSibling);
			ifCount.__seize__ = seize;
			
			ifCount.push(element);
			if(element.nextSibling) {
				nextSibling.call(this, element.nextSibling, ifCount);
			}
			this.__ob__.if[key].push(ifCount);
		}
	});
};

export { setIf };