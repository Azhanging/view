//观察者
class Observer {
	constructor(data, keyLine, _this) {
		this.element = data;
		this.view = _this;
		this.bind(keyLine);
	}
	bind(_keyLine = '') {
		if(this.isObject(this.element)) {
			var _this = this;
			Object.keys(this.element).forEach((key, index) => {
				//对于的数据链
				let keyLine = _keyLine == '' ? key : (_keyLine + '.' + key);

				//查看对象是否为顶层对象，然后保存主键
				if(this.isObject(this.element[key])) {
					new Observer(this.element[key], keyLine, _this.view);
					Object.defineProperties(this.element[key], {
						__keyLine__: {
							enumerable: false,
							configurable: false,
							value: keyLine
						}
					});
				}

				//闭包内值代理
				let val = this.element[key];
				let view = _this.view;

				Object.defineProperty(this.element, key, {
					enumerable: true,
					configurable: true,
					get: function() {
						return val;
					},
					set: function(newVal) {
						//数据流没有任何变化,跳出set
						if(val === newVal) {
							return;
						}
						//数据类型改变
						if(!(newVal.__keyLine__) && newVal instanceof Object){
							Object.defineProperties(newVal, {
								__keyLine__: {
									enumerable: false,
									configurable: false,
									value: keyLine
								}
							});
						}
						//设置对象或数组对象
						_this.setVal(newVal, keyLine, view);
						//设置新值
						val = newVal;
						//更新
						view.dep(keyLine);
					}
				});
			});
		}
	}
	isObject(data) {
		return(data instanceof Object) || (data instanceof Array);
	}
	setVal(data, keyLine) {
		if(this.isObject(data)) {
			new Observer(data, keyLine,this.view);
		}
	}
}

export default Observer;