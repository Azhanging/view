import _ELement from './../vdom';

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
	let vdom = new _ELement();
	let oldTree = vdom.resolve(el,this);
	console.log(oldTree);
};

export { setFor };