import { trim } from './../tools';
function setModel(element, propValue) {
	propValue = trim(propValue);
	console.log(propValue);
	let _this = this;
	let resolveVal = propValue.replace(/\{?\}?/g, '')
	let elTagName = element.tagName.toLocaleLowerCase();
	//初始化值
	element.value = this._get(resolveVal,element);
	//绑定按键事件
	if(elTagName === 'input' || elTagName === 'textarea') {
		element.addEventListener('keyup', function(event) {
			if(event.keyCode == 32 || event.keyCode == 34 || event.keyCode == 8 || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 99) || (event.keyCode >= 101 && event.keyCode <= 103) || (event.keyCode >= 186 && event.keyCode <= 222)) {
				let value = this.value;
				_this._set(element,resolveVal, value);
			}
		});
	}
}

export {setModel};
