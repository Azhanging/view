import { setBind } from './../tools';

function setFor(el, propValue, propIndex) {
	let [forKey, forVal] = propValue.split(' in ');
	let filterForVal = forVal.replace(/(\{)?(\})?/g, '');
	let getForVal = this.expr(forVal, 'for');
	let seize = document.createTextNode('');

	if(!this.__ob__.for[filterForVal]) {
		this.__ob__.for[filterForVal] = [];
		setBind.call(this,filterForVal);
	}
	el.parentNode.insertBefore(seize, el.nextSibling);
	el.removeAttribute('_v-for');

	Object.keys(getForVal).forEach((key, index) => {
		let cloneNode = el.cloneNode(true);	
		cloneNode.__for__ = {
			forKey: key,
			forKeyLine: getForVal.__keyLine__ + '.' + key
		};
		//设置索引
		cloneNode.$index = index;
		let forSeize = document.createTextNode('');
		cloneNode.__seize__ = forSeize;
		cloneNode.isReplace = false;
		forSeize.__seize__ = cloneNode;

		this.__ob__.for[filterForVal].push(cloneNode);
		seize.parentNode.insertBefore(cloneNode, seize);
		replateForKey.call(this, cloneNode, forKey, getForVal.__keyLine__ + '.' + key);
		cloneNode.__html__ = cloneNode.outerHTML;
		
		//如果当前的元素是第一个，存储下面的兄弟节点
		if(index === 0){
			cloneNode.__forElement__ = [cloneNode];
		}else{
			setForElement(cloneNode,cloneNode);
		}
	});
	
	let oldElSeize = document.createTextNode('');

	//如果为一个空数组数据
	if(this.__ob__.for[filterForVal].length === 0) {
		let cloneNode = el.cloneNode(true);	
		cloneNode.__for__ = {
			forKey: 0,
			forKeyLine: getForVal.__keyLine__ + '.' + 0
		};
		//设置索引
		cloneNode.$index = 0;
		let forSeize = document.createTextNode('');
		cloneNode.__seize__ = forSeize;
		cloneNode.isReplace = true;
		forSeize.__seize__ = cloneNode;
		let parentNode = seize.parentNode;
		this.__ob__.for[filterForVal].push(cloneNode);
		//替换空数据节点
		parentNode.insertBefore(cloneNode, seize);
		//初始是空数组还是字符串类型，创建数据链的字符串结构
		if(getForVal.__keyLine__){
			replateForKey.call(this, cloneNode, forKey, getForVal.__keyLine__ + '.' + 0);
		}else{
			replateForKey.call(this, cloneNode, forKey, filterForVal + '.' + 0);
		}
		cloneNode.__html__ = cloneNode.outerHTML;
		
		//如果当前的元素是第一个，存储下面的兄弟节点
		cloneNode.__forElement__ = [cloneNode];
	}
	
	el.parentNode.replaceChild(oldElSeize, el);
};
	

function setForElement(element,_pushElement){
	let prevElement = element.previousElementSibling; 
	if(prevElement.__forElement__){
		prevElement.__forElement__.push(_pushElement);
	}else{
		setForElement(prevElement,_pushElement);
	}
}

//替换下面对应依赖中绑定的数据
function replateForKey(element, forKey, keyLine) {
	//匹配
	const REGEXP_TYPE_1 = new RegExp('\\{\\{' + forKey + '( ?\\|.*)?\\}\\}', 'g');
	
	const REGEXP_TYPE_2 = new RegExp('\\{\\{' + forKey + '\\.(.*?)', 'g');

	let innerHTML = element.innerHTML;
	
	let newHTML = '';

	if(REGEXP_TYPE_1.test(innerHTML)) {
		newHTML = innerHTML.replace(REGEXP_TYPE_1, '{{' + keyLine + RegExp.$1 + '}}');
	}
	if(REGEXP_TYPE_2.test(innerHTML)) {
		newHTML = innerHTML.replace(REGEXP_TYPE_2, '{{' + keyLine + '.' + RegExp.$1);
	}
	
	//获取当前的节点
	let attrList = element.attributes;
	
	Object.keys(attrList).forEach((index) => {
		if(/^_v-/.test(attrList[index].name)) {
			let attrValue = attrList[index].value;
			if(REGEXP_TYPE_1.test(attrValue)) {
				element.setAttribute(attrList[index].name, attrValue.replace(REGEXP_TYPE_1, '{{' + keyLine + RegExp.$1 + '}}'));
			}
			if(REGEXP_TYPE_2.test(attrValue)) {
				element.setAttribute(attrList[index].name, attrValue.replace(REGEXP_TYPE_2, '{{' + keyLine + '.' + RegExp.$1));
			}
		}
	});

	element.innerHTML = newHTML !== '' ? newHTML : innerHTML;
}

function testForNullArray(){
	Object.keys(this.__ob__.for).forEach((index)=>{
		for(let element of this.__ob__.for[index]){
			if(element.isReplace === true && element.parentNode != null){
				let parentNode = element.parentNode;
				element.isReplace = true;
				parentNode.replaceChild(element.__seize__,element);
			}
		}
	})
}


export { setFor , testForNullArray};