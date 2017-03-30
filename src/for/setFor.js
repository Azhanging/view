//一直往上找for父节点中是否存在for
function findParentForUpdateKey(parent) {
	if(parent.forUpdateKey) {
		return parent;
	} else if(parent.id == this.$element || parent.parentNode == null) {
		return false;
	} else {
		return findParentForUpdateKey.call(this,parent.parentNode);
	}
}

function setFor(el, propValue) {
	let [forKey,forVal] = propValue.split(' in ');
	let getForVal = this.expr(forVal,'for');
	let seize = document.createTextNode('');
	
	this.data[forKey] = {};
	
	el.parentNode.insertBefore(seize,el);
	el.removeAttribute('_v-for');
	
	Object.keys(getForVal).forEach((i)=>{
		let cloneNode = el.cloneNode(true);
		seize.parentNode.insertBefore(cloneNode,seize.nextSibling);
	});
	
	el.remove();
};

export { setFor };