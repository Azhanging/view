/*
 * 对过滤对象进行处理 
 * */

export default class Filter{
	constructor(data,filter,view) {
	    this.data = data;
	    this.filter = filter;
	    this.view = view;
	}
	runFilter(){
		this.filter.forEach((filter)=>{
			this.data = View.filter[filter](this.data);
		});
		return this.data;
	}
}
