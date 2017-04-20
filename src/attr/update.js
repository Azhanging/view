//属性更新
function attrUpdate(key) {
	//初始化
	if(key === undefined || key === '') {
		Object.keys(this.__ob__.attr).forEach((keyLine, index) => {
			updateFn.call(this,keyLine);
		});
	}else{
		//如果不存在键值，不执行更新
		if(!this.__ob__.attr[key]){
			return;
		}
		updateFn.call(this,key);
	}

	function updateFn(keyLine) {
		let attrNodes = this.__ob__.attr[keyLine];
		attrNodes.forEach((element, index)=>{
			let attrs = element.__attrs__;
			Object.keys(attrs).forEach((propName,index)=>{
				let propValue = attrs[propName];
				element.setAttribute(propName,this.expr(propValue,element));
			});			
		});
	}
}

export { attrUpdate };