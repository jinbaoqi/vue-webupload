# 指令 v-multipicupload
## 引入资源
```javascript
import {multipicupload} from "'../../directives/multiPicUpload'"
directives:{multipicupload},//在export语句内加入该directive声明
```
## 配置项
```html
<div v-multipicupload="config">hello world</div>
<ul>
       <li v-for="(item,index) in listImage">
            <img :src="item.url" alt="" width="100" height="100">
       </li>
</ul>
```
```javascript
data(){
	return {
	config:{
		name:'xxx'//可选，但会在控制台打印warn，最好给一个唯一的标识符
		fileNumLimit:2//上传图片限制个数的大小
		...//其余图片上传的配置项，可以在webuploader的官网上查找
	}，
	listImage:[]//传回数据push进的数组
	}
}
//在组件的mounted钩子上注册事件
//可以通过arg传递的name属性，判断是将返回的数据挂载在那个obj上
var _this = this
event.on('MUP',(...arg)=>{

	var obj = {}
	let [img] = arg
	obj.id = img.id
	obj.file = img.file
	if(img.url){
		obj.url = img.url
	}
	//可以通过switch(img.name)方式来选择性地将数据派送给你想传递的数据对象内
	_this.listImage.push(obj)
})
```
## 默认配置项
`可以通过指令绑定的value对象来覆写默认配置项`
```javascript
defaults = {
	auto:false,//是否自动上传
	accept: {
		title: 'Images',
		extensions: 'gif,jpg,jpeg,png',
		mimeTypes: 'image/*'
	},
	sendAsBinary: true,
	disableGlobalDnd: true,
	fileNumLimit: 1,//采取可配置的方式进行
	fileSingleSizeLimit: 5 * 1024 * 1024,   // 5 M
	resize:false,
	duplicate:false,//不允许上传相同的图片，如果需要请覆写
	thumb:{
		// 图片质量，只有type为`image/jpeg`的时候才有效。
		quality: 100,

		// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
		allowMagnify: false,

		// 是否允许裁剪。
		crop: true,

		// 为空的话则保留原有图片格式。
		// 否则强制转换成指定的类型。
		type: 'image/jpeg'
	}
}
```
`默认选项` 默认是多文件上传，可以添加 pick:{multiple:false}来关闭这个选项
##事件
`@MUP::SUCCESS`该事件会在图片上传成功后，返回对应信息给父级,通过返回值的id来找到对应的dom节点
```json
{
    code:0,
    data:{
        image_domain:"https://i.zenpage.cn",
        image_id:"1109",
		image_url_origin:"/upload/tenant/images/201611/148009944431021109.png"
    },
    id:"WU_FILE_0",
    status:1,
}
```

