# View
###创建实例对象
`new View(options);`

####options参数:
**el**:为需要解析的element对象的id
```javascript
var app = new View({
	el:'app'
});	
```
**template**:为绑定模板的id,template和el不能同时存在(即是绑定更新功能和模板只能选择一个使用)
```javascript
var app = new View({
	el:'app'
});	
```
####有关template的使用:
先定义模板格式，使用<template></template>:
```html
<div id="app"></div>
<template id="template">
	<div @click="hello">
		{{templateData.id}}-{{templateData.name}}-{{templateData.src}}
	</div>
</template>
```
先假设数据是
```javascript
var data = {
	list: [{
			id: 1,
			name: 'blue',
			src:'src1'
		}, {
			id: 2,
			name: 'blue2',
			src:'src2'
		}, {
			id: 3,
			name: 'blue3',
			src:'src3'
		}
	]
}
var app = new View({
	template:'template', //绑定模板
	data:{},				//必须定义
	methods:{
		hello:function(){
			//todo
		}
	}
});
app.createTemplate(data['list'], 'app');
```
这里说一下createTemplate方法(实例对象上的方法)第一个参数为需要
遍历添加的数据对象,第二个为app为append进去的dom对象id

运行上面的代码,结果如下
```html
1-blue-src1
2-blue2-src2
3-blue3-src3
```
PS:模板内也是可以使用View-属性初始化，支持事件绑定,模板中不支持
数据流更新以及属性绑定更新。


**data**:绑定的数据
```html
<div id="app">
	{{msg}}    <!--这里通过数据绑定变为msg的值1-->
</div>

	
var app = new View({
	el:'app',
	data:{
		msg:1
	}
});
```
也可以通过多层绑定
```html
<div id="app">
	{{msg.someMsg}}    <!--这里通过数据绑定变为 hello View -->
</div>

	
var app = new View({
	el:'app',
	data:{
		msg:{
			someMsg:'hello View'
		}
	}
});
```
**methods**:为实例对象上的方法,methods中的this永远指向的都是View的实例对象
```js
<div id="app" @click='{{hello}}'> 	<!--这里通过@加事件名可以绑定事件,对应的val为methods中的方法-->
	{{msg.someMsg}}    <!--这里通过数据绑定变为 hello View -->
</div>
var app = new View({
	el:'app',
	data:{
		msg:{
			someMsg:'hello View'
		}
	},
	methods:{
		hello:function(){
			alert('hello View');
		}
	}
});
```

####watch：
用来监听数据流中主key的流变化,主key的回调函数有个参数值，为当前主键的新值；
```
var app = new View({
	el:'app',
	data:{
		msg:{
			someMsg:'hello View',
			someData:{
				data:{
					data1:1
				}
			}
		}
	},
	watch:{
		'someMsg':function(newVal){
			console.log(newVal);
		},
		'somgData':function(newVal){
			console.log(newVal);
		}
	}
});
```
************************************
####事件绑定:
**通过@加上事件名绑定事件，DOM2的事件绑定，支持绑定多个事件，
绑定事件的处理函数指methods中的方法（方法中的this指向View中的实例对象），
向同一事件只能绑定一次,只限于@属性绑定上）,
事件方法中可以传递参数$index和$event，
这两个对应的是当前时间对象的所在父级中对应的索引，
以及event对象；
**
```js
<div id="app" @click='clickHandler' @change="changeHandler"> 	<!--这里通过@加事件名可以绑定事件,对应的val为methods中的方法-->
	{{msg.someMsg}} 
</div>
var app = new View({
	el:'app',
	data:{
		msg:{
			someMsg:'hello View'
		}
	},
	methods:{
		clickHandler:function(){
			//todo
		},
		changeHandler:function(){
			//todo
		}
	}
});
```
####View-属性
**\View-for**属性，循环遍历element，遍历次数为数据的长度，
View-for中的值为(item in data),item为遍历到当前的值，data为需要遍历的数据对象，
在dom中绑定需要以for开始绑定数据，如：{{item.id}};
```html
<div id="app">
	<div View-for="item in msg.list">
		{{item.id}}-{{item.name}}
	</div>
</div>

<script>
var app = new View({
	el:'app',
	data:{
		msg:{
			list:[
				{id:123456,name:blue},
				{id:456789,name:blue1}
			]
		}
	}
});
</script>
```
结果为：
```html
123456-blue
456789-blue1
```
这样使用也是可以的，循环的只是对应的
```html
<div id="app">
	for操作只允许有一个绑定值存在:
	<div View-for="key in {{forData}}">{{key.id}}</div>
	遍历直接量的对象:
	<div View-for="key in {a:1,b:2}">{{key}}</div>
	for允许添加数组绑定进行迭代:
	<div View-for="key in {{forData_1}}">{{key}}</div>
	for允许添加数组进行迭代:
	<div View-for="key in [{id:6},{id:7}]">{{key.id}}</div>
	for允许添加数组直接量进行迭代:
	<div View-for="key in [1,2,3,4]">{{key}}</div>
</div>
<script type="text/javascript">
	app = new View({
		el:"app", 
		data:{
			forData:[
				{id:1},
				{id:2},
				{id:3},
				{id:4},
				{id:5}
			],
			forData_0:{
				id:1,
				id_0:2,
				ds:3
			},
			forData_1:[1,3,4,7,8,9]
		}
	});
</script>
```

**\_if**属性，绑定_if中的值，如果_if绑定的值为true，则会设置为渲染出来，
同时也支持_elseif语法，如果_if为false，则判定_elseif的值，如果也是false，则不显示，再来页支持else，只有一个else存在，如果if和elseif都不是true则显示else的内容，页支持修改data中的值，更新状态。
```html
<div id="app">
	<div View-if="{{ifData.0}}">1</div>
	<div View-elseif="{{ifData.1}}">2</div>
	<div View-else>3</div>
	
	<div View-if="{{ifData_1.0}} == 2">1</div>
	<div View-elseif="{{ifData.1}} === 1">2</div>
	<div View-else>3</div>
</div>

<script>
var app = new View({
	el:'app',
	data:{
		ifData:[true,false,false],
		ifData_1:['1','2','3']
	}
});
</script>
```
结果为：
```html
1
```
修改ifData中的值改为
```
[false,true,true]
```
结果为：
```html
2
```
修改ifData中的值改为
```
[false,false,true]
```
结果为：
```html
3
``` 

**\_show**属性，绑定_show中的值，View-show中的值为'none','no'.false则为隐藏，
'block',true,'ok'为显示；
```html
<div id="app">
	<div View-show="status.0">1</div>
	<div View-show="status.1">2</div>
	<div View-show="status.2">3</div>
</div>

<script>
var app = new View({
	el:'app',
	data:{
		status:['block','none','block']
	}
});
</script>
```
结果为：
```html
1
3
```
####组件
通过components来定义组件，object类型，key为在dom中定义为自定义dom组件的名称(写法为my-comp这种类型的写法)，而value为组件的dom内容，value有两种使用方法:
+ 可以通过<template></template>来定义组件，在components中绑定template中的id;
```html
<div id="app">
	<my-comp></my-comp>
</div>
<template id="app_comp">
	<div>
		{{msg.name}}--{{msg.id}}
	</div>
</template>
<script>
var app = new View({
	el:'app',
	data:{
		mag:{
			name:'blue',
			id:9527
		}
	},
	components:{
		'my-comp':"app_comp"
	}
});
</script>
```
结果为：
```html
blue--9527
```
+ 可以通过字符串的dom来使用;	
```html
<div id="app">
	<my-comp></my-comp>
</div>
<script>
var app = new View({
	el:'app',
	data:{
		mag:{
			name:'blue',
			id:9527
		}
	},
	components:{
		'my-comp':"<div>{{msg.name}}--{{msg.id}}</div>"
	}
});
</script>
```
结果为：
```html
blue--9527
```
两种使用方法都是相同的，适用方式由你自己决定。
PS:组件内也是可以使用View-属性，以及事件绑定。


####过滤器
通过 View.setFilter(filterName, handler)设置新的逻辑过滤器;每个过滤器都是返回值，返回过滤后的数据；
内部常用过滤器：trim，upper，lower，length，html；

#####使用：在dom数据绑定中使用 | 来定义过滤器
| 后可以带多个过滤器.如果下（除了html的过滤器不要再使用其他的内容过器）：
{{data | trim length}}
 
特别说明一下html的过滤器，因为默认的数据绑定都是指向textNode的节点，
所以html的过滤器会把指定的dom字符串转化为dom节点进行渲染更新；
当然，如果默认使用过滤器生成的dom，在更新这个dom字符串的时候变为节点字符也是可以的；
还有一种插入dom的数据可以为[domElement,domElement],同样支持上面的用法；


####数组的一些方法,在实例对象上调用
+ push(data,pushData):data{string}，数组的line字符串，
pushData可以为数组，也可以为单独的数据；
+ pop(data):data{string}，移除最后一个索引值，返回这个索引的值；
+ unshift(data,pushData):data{string}，数组的line字符串，
pushData可以为数组，也可以为单独的数据；
+ shift(data):data{string}，移除第一个索引值，返回这个索引的值；

####钩子函数
存在三个钩子函数：
+ init()创建开始的时候开始调用，可以在options中定义这个函数;
+ created()为dom节点都重新创建完毕后开始调用，可以在options中定义这个函数;
+ ready()为所有都准备完毕后调用；

####再说两句：一些方法
+ .update(mainKey) 可以直接更新所有数据流，然后更新view层，存在一个参数，data中的第一层对象的key值，可以根据key来更新响应依赖的dom对象view层；
+ .forUpdate(mainKey) 和update方法用法一样，更新的数据流为绑定for属性的View层；
+ .ifUpdate(mainKey) 和update方法用法一样，更新的数据流为绑定if属性的View层；
+ .showUpdate(mainKey) 和update方法用法一样，更新的数据流为绑定if属性的View层；
+ .attrUpdate(mainKey) 和update方法用法一样，更新的数据流为绑定if属性的View层；
+ .tab(el,data,className) 封装好的选项卡功能，el为选项卡对象id，data为数组，定义className的数组，className为替换的class名；

+ .getElIndex(el) 返回el对象在父级中所载的索引位置；
+ .\_set(dataLink,val,key) dataLink为data对应的key链，string类型；val为新值；key为可选值，如果存在，则会新建key在keyLink中，并且创建object.defineProperty
+ .\_get(keyLink) 返回data中keyLink中对应的值，不存在则返回空字符串；








	

	
	
