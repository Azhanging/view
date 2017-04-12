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
		if(!this.__ob__.for[key]){
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
			let dataLength = getData.length;
			//当前循环组内的append的循环节点
			let forElementGroup = element.__forElementGroup__;
			let forElementGroupLength = forElementGroup.length;
			
			//存储移除数据的节点文档片段
			let fragment = document.createDocumentFragment();
			
			//相同数据数量更新数据流
			if(dataLength == forElementGroupLength){
				this.update(forElementGroup[0].__for__.forKey);
			}else if(dataLength <= forElementGroupLength){
			//减少数据数量更新数据流
				let diff = forElementGroupLength - dataLength;
				//移除已添加的节点
				for(let index = diff;index<forElementGroupLength;index++){
					if(forElementGroup[index].__for__.isAppend == true){
						forElementGroup[index].__for__.isAppend = false;
						fragment.appendChild(forElementGroup[index]);
						this.update(forElementGroup[index].__for__.forKey);
					}
				}
			}
		});
		
	}
}

export { forUpdate };