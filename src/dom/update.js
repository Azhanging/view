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
		let val = this._get(keyLine),
			textNodes = this.__ob__.dom[keyLine];
		
		textNodes.forEach((element) => {
			//是否存在过滤器
			if(element['filters'].length > 0) {
				val = filter(val, element['filters']);
			}
			element.textContent = val;
		});
	}
}

//检测绑定的对象是否存在过滤器,存在过滤器则返回过滤的值
function filter(val, filters) {
	filters.forEach((item, index)=>{
		val = View.filterHandlers[filters[index]](val);
	});
	return val;
};

export { domUpdate };