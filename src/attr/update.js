import Filter from './../filter';

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
				let propValue = attrs[propName].__bind__;
				let data = new Filter(this.expr(propValue,element),attrs[propName].__filter__).runFilter();
				//表单处理
				if(/input|textarea|select/.test(element.tagName.toLocaleLowerCase()) && propName == 'value'){
					formElements.apply(this,[element,keyLine,data]);
				}else{					
					element.setAttribute(propName,data);
				}
			});			
		});
	}
}

//表单的处理
function formElements(element,keyLine,data){
	//没有绑定正确的值跳出
	if(!data){
		return;
	}
	let type = element.type;
	//check类型
	if(/checkbox|radio/.test(type)){
		let diffFormElement = [];
		let checkboxName = element.name;
		//查找不同的form对象
		this.__ob__.attr[keyLine].forEach((element)=>{
			if(diffFormElement.indexOf(element.form) === -1){
				diffFormElement.push(element.form);	
			}
		});
		
		//设置绑定的对象
		diffFormElement.forEach((form)=>{
			let index = 0;
			this.__ob__.attr[keyLine].forEach((element)=>{
				if(element.form == form){
					element.checked = data[index++];
				}
			});
		});
	}else if(/select-one|select-multiple/.test(type)){
		for(let index = 0;index < element.childNodes.length;index++){
			let children = element.childNodes;
			for(let _index = 0;_index < data.length;_index++){
				if(children[index].nodeType === 1 && children[index].nodeName === 'OPTION' && children[index].value == data[_index]){
					children[index].selected = true;
					break;
				}else{
					children[index].selected = false;
				}
			}
		}
	}else{
		element.value = data;
	}
}

export { attrUpdate };