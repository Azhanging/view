import { disassembly, getDisassemblyKey ,setBind,trim} from './../tools';

function setShow(element,propValue){
	propValue = trim(propValue);
	console.log(propValue);
	let attrKeys = getDisassemblyKey(disassembly(propValue));
	attrKeys.forEach((val, index) => {
		if(!(this.__ob__.show[val] instanceof Array)) {
			this.__ob__.show[val] = [];
			setBind.call(this,val);
		}
		//给element元素加上__attrs__依赖
		element.__show__ = propValue;
		//在__ob__设置attr的依赖
		this.__ob__.show[val].push(element);
	});
}

export {setShow};
