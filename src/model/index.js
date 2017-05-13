import { trim ,setBind} from './../tools';


function setModel(element, propValue) {
	propValue = trim(propValue);
	let _this = this;
	let elTagName = element.tagName.toLocaleLowerCase();
	let type = element.type;
	//绑定按键事件
	if(/input|textarea|select/.test(elTagName)) {
		//设置model订阅者
		setModelData.apply(this,[propValue,element]);
		setBind.call(this,propValue);
		
		if(/text|number|tel|email|url|search|textarea/.test(type)){			
			element.addEventListener('keyup', function(event) {
				if(event.keyCode == 32 || event.keyCode == 34 || event.keyCode == 8 || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || (event.keyCode >= 186 && event.keyCode <= 222)) {
					let value = this.value;
					_this._set(element,propValue, value);
				}
			});
		}else if(/checkbox|radio/.test(type)){
			element.addEventListener('change',(function(){
				if(/checkbox/.test(type)){					
					return function(event) {
						let inputData = [];
						let form = element.form;
						_this.__ob__.model[propValue].forEach((ele)=>{
							if(ele.form == form && ele.checked){
								inputData.push(ele.value);
							}
						});
						_this._set(element , propValue, inputData);
					}		
				}else if(/radio/.test(type)){
					return function(event) {
						let form = element.form;
						let inputData = '';
						_this.__ob__.model[propValue].forEach((ele)=>{
							if(ele.form == form && ele.checked){
								inputData = ele.value;
								return;
							}
						});
						_this._set(element , propValue, inputData);
					}
				}
			})());
		}else if(/select-one|select-multiple/.test(type)){
			element.addEventListener('change', function(event) {
				let inputData = [];
				for(let index = 0;index < element.childNodes.length;index++){
					let children = element.childNodes;
					if(children[index].nodeType === 1 && children[index].nodeName === 'OPTION' && children[index].selected){
						inputData.push(children[index].value);
					}
				}
				_this._set(element,propValue, inputData);
			});
		}
	}
}

//设置model观察者
function setModelData(key,element){
	if(!(this.__ob__.model[key] instanceof Array)){
		this.__ob__.model[key] = [];
	}
	this.__ob__.model[key].push(element);
}

/*初始化绑定数据*/
function modelUpdate(key){
	//初始化
	if(key === undefined || key === '') {
		Object.keys(this.__ob__.model).forEach((keyLine, index) => {
			updateFn.call(this,keyLine);
		});
	}else{
		//如果不存在键值，不执行更新
		if(!this.__ob__.model[key]){
			return;
		}
		updateFn.call(this,key);
	}
	
	function updateFn(key){
		let model = this.__ob__.model[key];
		Object.keys(model).forEach((_key,index)=>{
			let element = model[_key]; 
			let data = this._get(key,element);
			formElements.apply(this,[element,key,data]);
		});
	}
}

//表单的处理
function formElements(element,keyLine,data){
	//没有绑定正确的值跳出
	if(data == null){
		return;
	}
	let type = element.type;
	//check类型
	if(/checkbox|radio/.test(type)){
		let diffFormElement = [];
		let checkboxName = element.name;
		//查找不同的form对象
		this.__ob__.model[keyLine].forEach((element)=>{
			if(diffFormElement.indexOf(element.form) === -1){
				diffFormElement.push(element.form);	
			}
		});
		
		//设置绑定的对象
		diffFormElement.forEach((form)=>{
			let index = 0;
			this.__ob__.model[keyLine].forEach((element)=>{
				if(element.form == form){
					data = !isNaN(data)?(data.toString()):data;
					//当前的对象值是否等于
					let keys = Object.keys(data);
					for(let index = 0;index < keys.length;index++){
						if(element.value == data[keys[index]]){
							element.checked = true;
							break;
						}else{
							element.checked = false;
						}	
					}
				}
			});
		});
	}else if(/select-one|select-multiple/.test(type)){
		for(let index = 0;index < element.childNodes.length;index++){
			let children = element.childNodes;
			if(data.length > 0){
				for(let _index = 0;_index < data.length;_index++){
					if(children[index].nodeType === 1 && children[index].nodeName === 'OPTION' && children[index].value == data[_index]){
						children[index].selected = true;
						break;
					}else{
						children[index].selected = false;
					}
				}
			}else{
				for(let _index = 0;_index <children.length;_index++){
					children[_index].selected = false;
				}
			}
		}
	}else{
		element.value = data;
	}
}

export {setModel , formElements ,modelUpdate};
