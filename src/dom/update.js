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
			let val = this._get(keyLine,element);
			//如果当前的对象获取到的为null，返回一个空的字符串
			val = (val == null?'':val);
			//是否存在过滤器
			if(element['filters'].length > 0) {
				val = filter(val, element['filters']);
			}
			//如果返回的是节点
			if(val instanceof Array && val.length > 0 && val[0].nodeType) {
				//走接点过滤处理
				htmlNode(val, element);
			} else {
				//检查是否存在过滤器或者数组插入的dom节点
				isTextNodePrevSibline(element);
				//直接为数据节点
				if(element.textContent !== val){
					element.textContent = val;
				}
			}
		});
	}
}

//检测绑定的对象是否存在过滤器,存在过滤器则返回过滤的值
function filter(val, filters) {
	filters.forEach((item, index)=>{
		val = View.filter[filters[index]](val);
	});
	return val;
};

//处理过滤器html内容
function htmlNode(domNodes, item) {
	//存在过节点
	isTextNodePrevSibline(item);
	//把新的dom插入到对应的节点中
	domNodes.forEach(function(dom, index) {
		dom.htmlNode = true;
		item.parentNode.insertBefore(dom, item);
		item.appendNode = (item.appendNode instanceof Array ? item.appendNode : []);
		item.appendNode.push(dom);
	});

	//清空占位文本节点的内容
	item.textContent !== "" ? (item.textContent = '') : false;
}

//查看文本节点中是否存在插入式的dom对象
function isTextNodePrevSibline(item) {
	if(item.previousSibling != null && !!(item.previousSibling.htmlNode)) {	
		for(let i = 0, len = item.appendNode.length; i < len; i++) {
			let dom = item.appendNode.shift();
			item.parentNode.removeChild(dom);
		}
	}
}

export { domUpdate };