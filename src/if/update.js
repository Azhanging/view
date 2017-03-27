/*更新if*/
function ifUpdate(mainKey) {
	//初始化
	if(mainKey === undefined || mainKey === '') {
		Object.keys(this.ifEls).forEach((key,index)=>{
			updateFn.call(this, this.ifEls[key]);
		});

		//主key
		/*for(var i in this.ifEls) {
			var keyObj = this.ifEls[i];
			updateFn.call(this, keyObj);
		}*/
	} else {
		var keyObj = this.ifEls[mainKey] ? this.ifEls[mainKey] : [];
		updateFn.call(this, keyObj);
	}

	function updateFn(keyObj) {
		//if集合中的if和else/elseif
		keyObj.forEach((item, index)=>{
			for(var j = 0; j < item.length; j++) {
				var obj = this.expr(item[j]['ifStatus']);
				if(obj) {
					item.forEach((el,_index)=>{
						el.style.display = 'none';
					})
					//初始化所有的对象隐藏,当前的对象显示
					item[j].style.display = 'block';
					break;
				}
				if(j == item.length - 1) {
					item.forEach((el,_index)=>{
						el.style.display = 'none';
					})
				}
			}
		});




		/*keyObj.forEach(function(item, index) {
			for(var j = 0; j < item.length; j++) {
				var obj = this.expr(item[j]['ifStatus']);
				if(obj) {
					for(var l = 0; l < item.length; l++) {
						item[l].style.display = 'none';
					}
					//初始化所有的对象隐藏,当前的对象显示
					item[j].style.display = 'block';
					break;
				}
				if(j == item.length - 1) {
					for(var l = 0; l < item.length; l++) {
						item[l].style.display = 'none';
					}
				}
			}
		}.bind(this));*/
	}
};

export {ifUpdate};
