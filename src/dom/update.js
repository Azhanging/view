import Filter from './../filter';

function domUpdate(key) {
	//初始化
	if(key === undefined || key === '') {
		Object.keys(this.__ob__.dom).forEach((keyLine, index) => {
			updateFn.call(this,keyLine);
		});
	}else{
		//如果不存在键值，不执行更新
		if(!this.__ob__.dom[key]){
			return;
		}
		updateFn.call(this,key);
	}
	
	function updateFn(keyLine){
		let textNodes = this.__ob__.dom[keyLine];
		textNodes.forEach((element) => {
			let data = new Filter(this.expr(element.__dom__.__bind__,element.parentNode),element.__dom__.__filter__).runFilter();
			element.textContent = data;
		});
	}
}

/*------------移除html过滤器-------------*/

export { domUpdate };