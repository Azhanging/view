//属性更新
function attrUpdate(key) {
	//初始化
	if(key === undefined || key === '') {

		Object.keys(this.attrBindings).forEach((key, index) => {
			let keyObj = this.attrBindings[key];
			updateFn.call(this, keyObj);
		});

		/*for(var _key in this.attrBindings) {
			var keyObj = this.attrBindings[_key];
			updateFn.call(this, keyObj);
		}*/
	} else {
		//存在key时候更新属性
		let keyObj = this.attrBindings[key] ? this.attrBindings[key] : [];
		updateFn.call(this, keyObj);
	}

	function updateFn(keyObj) {
		keyObj.forEach((item, index)=>{
			Object.keys(item['attrbindingKey']).forEach((key, _index)=>{
				let obj = this.expr(item['attrbindingKey'][key]);
				item.setAttribute(key, obj);
				item[key] = obj;
			});
			/*for(var k in item['attrbindingKey']) {
				if(item['attrbindingKey'].hasOwnProperty(k)) {
					//表达式或者不为data绑定的值
					var obj = this.expr(item['attrbindingKey'][k]);
					item.setAttribute(k, obj);
					item.k = obj;
				}
			}*/
		});
	}
}

export { attrUpdate };