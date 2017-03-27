/*更新if*/
function ifUpdate(key) {
	//初始化
	if(key === undefined || key === '') {
		Object.keys(this.__ob__.if).forEach((keyLine,index)=>{
			updateFn.call(this,keyLine);
		});
	} else {
		//如果不存在键值，不执行更新
		if(!this.__ob__.if[key]){
			return;
		}
		updateFn.call(this,key);
	}

	function updateFn(keyLine) {
		let ifNodes =  this.__ob__.if[keyLine];
		//if集合中的if和else/elseif
		ifNodes.forEach((keyLineItem, index)=>{
			for(var j = 0; j < keyLineItem.length; j++) {
				var obj = this.expr(keyLineItem[j].__if__);
				if(obj) {
					keyLineItem.forEach((el,_index)=>{
						el.style.display = 'none';
					})
					//初始化所有的对象隐藏,当前的对象显示
					keyLineItem[j].style.display = 'block';
					break;
				}
				if(j == keyLineItem.length - 1) {
					keyLineItem.forEach((el,_index)=>{
						el.style.display = 'none';
					})
				}
			}
		});
	}
};

export {ifUpdate};
