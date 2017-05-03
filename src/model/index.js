import { trim } from './../tools';
function setModel(element, propValue) {
	propValue = trim(propValue);
	let _this = this;
	let elTagName = element.tagName.toLocaleLowerCase();
	let type = element.type;
	//初始化值
	element.value = this._get(propValue,element);
	//绑定按键事件
	if(elTagName === 'input' || elTagName === 'textarea') {
		if(/text|number|tel|email|url|search|textarea/.test(type)){			
			element.addEventListener('keyup', function(event) {
				if(event.keyCode == 32 || event.keyCode == 34 || event.keyCode == 8 || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 99) || (event.keyCode >= 101 && event.keyCode <= 103) || (event.keyCode >= 186 && event.keyCode <= 222)) {
					let value = this.value;
					_this._set(element,propValue, value);
				}
			});
		}else if(/checkbox|radio/.test(type)){
			element.addEventListener('change', function(event) {
				let inputData = [];
				let form = element.form;
				_this.__ob__.attr[propValue].forEach((ele)=>{
					if(ele.form == form){
						inputData.push(ele.checked);
					}
				});
				_this._set(element,propValue, inputData);
			});
		}
	}else if(elTagName === 'select'){
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

export {setModel};
