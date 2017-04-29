import Filter from './../filter';
function showUpdate(key){
	if(key === undefined || key === '') {
		Object.keys(this.__ob__.show).forEach((keyLine, index) => {
			updateFn.call(this,keyLine);
		});
	}else{
		//如果不存在键值，不执行更新
		if(!this.__ob__.show[key]){
			return;
		}
		updateFn.call(this,key);
	}
	
	function updateFn(keyLine){
		let showElements = this.__ob__.show[keyLine];
		showElements.forEach((element,index)=>{
			let showValue = new Filter(this.expr(element.__show__.__bind__,element),element.__show__.__filter__).runFilter();
			if(showValue == true || showValue.toString().toLocaleLowerCase() === 'ok') {
				showValue = '';
			} else if(showValue == false || showValue.toString().toLocaleLowerCase() === 'no') {
				showValue = 'none';
			}
			//如果有数据不相同改变				
			element.style.display = showValue;
		});
	}
}

export {showUpdate};
