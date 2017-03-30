import { setBind } from './../tools';
//一直往上找for父节点中是否存在for
function findParentForUpdateKey(parent) {
	if(parent.forUpdateKey) {
		return parent;
	} else if(parent.id == this.$element || parent.parentNode == null) {
		return false;
	} else {
		return findParentForUpdateKey.call(this, parent.parentNode);
	}
}

function setFor(el, propValue,propIndex) {
	let [forKey, forVal] = propValue.split(' in ');
	let filterForVal =  forVal.replace(/(\{)?(\})?/g, '');
	let getForVal = this.expr(forVal, 'for');
	let seize = document.createTextNode('');

	if(!this.__ob__.for[filterForVal]) {
		this.__ob__.for[filterForVal] = [];	
		setBind.call(this,filterForVal);
	}
	el.parentNode.insertBefore(seize, el.nextSibling);
	el.removeAttribute('_v-for');

	Object.keys(getForVal).forEach((key,index) => {
		let cloneNode = el.cloneNode(true);
		cloneNode.__for__ = {
			forKey: key,
			forKeyLine: getForVal.__keyLine__+'.'+key
		};
		//设置索引
		cloneNode.$index = index;
		seize.parentNode.insertBefore(cloneNode, seize);
		replateForKey.call(this,cloneNode,forKey,getForVal.__keyLine__+'.'+key);
	});
	let oldElSeize = document.createTextNode('');
	el.parentNode.replaceChild(oldElSeize, el);
};

//替换下面对应依赖中绑定的数据
function replateForKey(element,forKey,keyLine){
	let innerHTML = element.innerHTML;
	let newHTML = innerHTML.replace('{{'+forKey,'{{'+keyLine);
	element.innerHTML = newHTML; 
}

export { setFor };