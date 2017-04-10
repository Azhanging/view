import { setBind } from './../tools';

function setFor(el, propValue, propIndex) {
	let [forKey, forVal] = propValue.split(' in ');
	let filterForVal = forVal.replace(/(\{)?(\})?/g, '');
	let getForVal = this._get(filterForVal);
	let seize = document.createTextNode('');
	//现在循环列表中最后的占位节点
	let presentSeize = document.createTextNode('');
	//插入列表占位
	el.parentNode.insertBefore(presentSeize, el.nextSibling);
	
	if(!this.__ob__.for[filterForVal]) {
		this.__ob__.for[filterForVal] = [];
		setBind.call(this, filterForVal);
	}
	el.parentNode.insertBefore(seize, el.nextSibling);
	el.removeAttribute('_v-for');

	//这里是为了支持template的用法才这么使用的,默认循环中template是不存在值的
	if(getForVal == undefined || getForVal == null) {
		getForVal = [];
	}
	
	console.log(getForVal);
	
};


export { setFor};