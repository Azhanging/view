import Filter from './../filter';
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
		let fragment= document.createDocumentFragment();
		//if集合中的if和else/elseif
		ifNodes.forEach((elements, index)=>{
			let seize = elements.__seize__;
			let parentNode = seize.parentNode;
			for(var j = 0; j < elements.length; j++) {
				var obj = new Filter(this.expr(elements[j].__if__.__bind__,elements[j]),elements[j].__if__.__filter__).runFilter();
				if(obj) {
					elements.forEach((el,_index)=>{
						if(_index != j){							
							fragment.appendChild(el);
						}
					});
					//初始化所有的对象隐藏,当前的对象显示
					parentNode.insertBefore(elements[j],seize);
					break;
				}
				if(j == elements.length - 1) {
					elements.forEach((el,_index)=>{
						fragment.appendChild(el);
					});
				}
			}
		});
	}
};

export {ifUpdate};
