import { setBind, ResolveExpr, resolveKey, findKeyLine } from './../tools';

function setShow(element, propValue) {
	let re = new ResolveExpr(propValue);
	let showKeys = re.getKeys();
	let showExpr = re.getExpr();
	let filter = re.getFilter();

	showKeys.forEach((key, index) => {
		key = findKeyLine.apply(this, [element, key]);
		//		key = resolveKey(key);
		if(!(this.__ob__.show[key] instanceof Array)) {
			this.__ob__.show[key] = [];
			setBind.call(this, key);
		}
		//给element元素加上__attrs__依赖
		element.__show__ = {
			__bind__: showExpr,
			__filter__: filter
		};
		//在__ob__设置attr的依赖
		this.__ob__.show[key].push(element);
	});
}

export {
	setShow
};