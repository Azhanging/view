import { disassembly, getDisassemblyKey } from './../tools';
function nextSibling(el, ifCount) {
	if(el.nodeType === 1) {
		var elAttrs = el.attributes,
			i = 0,
			len = elAttrs.length,
			attrName,
			attrVal;
		for(; i < len; i++) {
			attrName = elAttrs[i].name;
			attrVal = elAttrs[i].textContent;
			if(/_v-.?/.test(attrName)) {
				attrName = attrName.replace('_v-', '');
				//再遇到if就跳出
				if(attrName == 'if') {
					return;
				}
				//else和elseif的对象
				if(attrName == 'elseif' || attrName == 'else') {
					if(attrName == 'else') {
						el['ifStatus'] = 'true';
					} else {
						el['ifStatus'] = attrVal;
					}
					ifCount.push(el);
					if(el.nextSibling) {
						el = el.nextSibling;
						nextSibling.call(this, el, ifCount);
					}
				}
			}
		}
	} else {
		//其他内容节点直接跳过
		if(el.nextSibling) {
			el = el.nextSibling;
			nextSibling.call(this, el, ifCount);
		}
	}

}

function setIf(element, propName, propValue) {
	let ifCount;
	let ifKeys = getDisassemblyKey(disassembly(propValue));
	console.log(ifKeys);
	ifKeys.forEach((key, index)=>{
		if(key) {
			if(!(this.__ob__.if[key] instanceof Array)) {
				this.__ob__.if[key] = [];
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

export {setIf};
