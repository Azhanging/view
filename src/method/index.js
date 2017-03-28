//methods添加到实例对象的方法(不是添加到原型链上继承)
function method() {
	var methods = this.methods;
	for(var i in methods) {
		if(methods.hasOwnProperty(i)) {
			this[i] = methods[i];
		}
	}
}

export default method;