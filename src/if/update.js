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
		ifNodes.forEach((elements, index)=>{
			for(var j = 0; j < elements.length; j++) {
				var obj = this.expr(elements[j].__if__,elements[j]);
				if(obj) {
					elements.forEach((el,_index)=>{
						el.style.display = 'none';
					});
					//初始化所有的对象隐藏,当前的对象显示
					if(obj == 'inlineBlock'){
						elements[j].style.display = 'inlineBlock';
					}else{						
						elements[j].style.display = 'block';
					}
					break;
				}
				if(j == elements.length - 1) {
					elements.forEach((el,_index)=>{
						el.style.display = 'none';
					});
				}
			}
		});
	}
};

export {ifUpdate};
