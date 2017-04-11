import _Element from './../vdom';
import { createTextNodes, replaceTextNode } from './../dom';

function forUpdate(key) {
	//初始化
	if(key === undefined || key === '') {
		Object.keys(this.__ob__.for).forEach((keyLine, index) => {
			updateFn.call(this,keyLine);
		});
	}else{
		//如果不存在键值，不执行更新
		if(!this.__ob__.attr[key]){
			return;
		}
		updateFn.call(this,key);
	}

	function updateFn(key) {
		//获取element节点
		let elements = this.__ob__.for[key];
		
		elements.forEach((element)=>{
			//获取当前的作用域链数据
			let getData = this._get(key,element);
		});
		
	}
}

export { forUpdate };