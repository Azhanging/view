import { setBind } from './../tools';

function setFor(el, propValue, propIndex) {
	//拆解数据
	let [forKey, forVal] = propValue.split(' in ');
	//移除花括号数据
	let filterForVal = forVal.replace(/(\{)?(\})?/g, '');
	//获取当前的作用域链数据
	let getForVal = this._get(filterForVal);
	let seize = document.createTextNode('');

	//插入当前的列表占位
	let presentSeize = document.createTextNode('');
	el.parentNode.insertBefore(presentSeize, el.nextSibling);

	//设置键值 
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
	


};


export { setFor};