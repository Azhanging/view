import { disassembly, getDisassemblyKey, setBind } from './../tools';

function nextSibling(element, ifCount) {
	if(element.nodeType === 1) {
		let attributes = element.attributes;
		if(attributes.length > 0) {
			Object.keys(attributes).forEach((key, index) => {
				let propName = attributes[index].name;
				let propValue = attributes[index].value;
				if(/_v-.?/.test(propName)) {
					propName = propName.replace('_v-', '');
					//再遇到if就跳出
					if(propName == 'if') {
						return;
					}
					//else和elseif的对象
					if(propName == 'elseif' || propName == 'else') {
						let ifKeys = getDisassemblyKey(disassembly(propValue));
						ifKeys.forEach((key, index) => {
							if(key) {
								if(!(this.__ob__.if[key] instanceof Array)) {
									this.__ob__.if[key] = [];
								}
								this.__ob__.if[key].push(ifCount);
							}
						});
						if(propName == 'else') {
							//因为要过match，必须为字符串类型的true
							element.__if__ = 'true';
						} else {
							element.__if__ = propValue;
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
	let ifKeys = getDisassemblyKey(disassembly(propValue));
	ifKeys.forEach((key, index) => {
		if(key) {
			if(!(this.__ob__.if[key] instanceof Array)) {
				this.__ob__.if[key] = [];
				setBind.call(this, key);
			}
			if(propName === 'if') {
				ifCount = [];
				element.__if__ = propValue;
				ifCount.push(element);
				if(element.nextSibling) {
					nextSibling.call(this, element.nextSibling, ifCount);
				}
			}
			this.__ob__.if[key].push(ifCount);
		}
	});
};

export { setIf };