/**
 * Created by matt_jin on 22/11/2016.
 */
import Vue from 'vue'
import {event,merge} from '../utils/event'
let defaults = {
	auto:true,//是否自动上传
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
	duplicate:false,
	thumb:{
		// 图片质量，只有type为`image/jpeg`的时候才有效。
		quality: 100,

		// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
		allowMagnify: true,

		// 是否允许裁剪。
		crop: true,

		// 为空的话则保留原有图片格式。
		// 否则强制转换成指定的类型。
		type: 'image/jpeg'
	},
	server:utils.getParams('/tenant/fileupload/image')

}
const makePointer = (()=>{
	let el,cb
	return{
		init(...arg){//第一参数是dom元素，第二参数是callback
			[el,cb] = arg
			if(!el){
				console.warn('需要传递一个dom对象给该函数')
			}
			$(el).css('cursor','pointer')
			cb && cb(el)//可以配置传递的option对象更改当前dom的样式
			return this
		}
	}
})()
const afterFileQueued = (()=>{
	let obj={},_uploader,cb
	return {
		init(...arg){//第一参数是uploader实例，第二参数是callback
			[_uploader,cb] = arg
			if(!_uploader){
				console.error('请调用m_uploader方法的getUploader()传递一个uploader给你')
				return
			}

			return this
		},
		setObj(...arg){////第一参数是callback
			let [cb] = arg
			//解耦逻辑清楚些
			// obj.id = _file.id
			// obj.url = _file.src
			// obj.file = _file
			cb && cb(obj)
			// console.log(obj)
			return this
		},
		setCallBack(_cb){////第一参数是callback
			cb = _cb
			return this
			//cb && cb()
		},
		callCb(){
			cb && cb()
			return this
		},
		getFileLength(...arg){//第一参数是callback
			let[cb] = arg
			let num = -1
			num = _uploader.getFiles().length
			cb && cb(num)
			// console.log(num)
			return this
		},
		getFiles(...arg){//第一参数是callback
			let[cb] = arg
			let arr = null
			arr = _uploader.getFiles()
			cb && cb(arr)
			return this
		}
	}
})()
const m_uploader = (() =>{
	let el,dom,label,uploader,file,options
	let _  = WebUploader

	/**
	 * 生成对应的webuploader dom
	 */
	function makeDom() {
		if(el){
			dom = document.createElement('button')
			dom.style.display='none'
			dom.style.visibility='hidden'
			dom.innerHTML=`WebUploader_Btn`
			el.appendChild(dom)
			// console.log(el,dom)
		}
	}

	/**
	 *
	 * @param arg
	 */
	function renderUploader(...arg) {
		console.dirxml(dom,'wowowowowo')
		if(dom){
			console.log(uploader)
			if(!uploader){
				let [option] = arg
				options = merge({},defaults,options,option)
				uploader = _.create(options)
				afterFileQueued.init(uploader)
			}
			label = $(el).find('label')//还没有渲染webuploader
			// console.log(label)
			uploader.on('error',function (type) {
				switch (type.toString().toUpperCase()){
					case 'F_EXCEED_SIZE':
						console.warn('超过5M，请重新选择')
						break;
					case 'Q_EXCEED_NUM_LIMIT':
						alert('超出数量限制')
						break;
					default:
						alert(type)
				}

			})
			uploader.on('uploadAccept',(obj,ret) => {
				// console.log(ret)
				utils.filterResponse(ret)
			})
			/**
			 * 当filequeued的时候，生成thumb图像，并将当前生成的thumb图片的id,url,file文件传递到父组件上
			 */
			uploader.on('fileQueued',function (_file) {
				file = _file
				// console.dir(file)
				uploader.makeThumb(file,(err,src) => {
					if(err){
						afterFileQueued.setObj((obj) => {
							obj.id = file.id
							obj.url = ''
							obj.file = file
						})
						return
					}
					afterFileQueued.getFileLength().getFiles(function (files) {
						// console.dir(files)
					}).setObj(function (obj) {
						obj.id = file.id
						obj.file = file
						obj.uploader = uploader
						obj.url = src
						obj.name = options.name
						event.emit('MUP',obj)
						// console.dir(obj)
					})
				})


			})
			uploader.on('uploadSuccess',(_file,res) => {
				// console.log(_file)
				// console.dir(res)
				let data=merge({},{id:_file.id},res)
				event.emit('MUP::SUCCESS',data)
				// console.dir(uploader)
				uploader.reset()
				uploader.removeFile(_file,true)
			})
		}
	}
	function addEvent(...arg) {
		let [cb] = arg
		if(label){
			$(el).on('click',() => {
				// console.log('clicked')
				label.click()
			})
		}else{
			console.warn('no label')
		}
	}
	return {
		init(...arg){//第一参数是el
			[el] = arg
			return this
		},
		makeInstance(...arg){//第一参数是callback
			let [cb] = arg
			makeDom()
			renderUploader({
				pick:{
					id:dom,
					multiple:true
				},
			})
			// addEvent()此时添加时间并没有什么卵用，还没有在document的dom树上，只在v-DOMSS上挂着而已
			cb&&cb(dom)
			return this
		},
		/**
		 *
		 * @param arg
		 */
		makeUpload(...arg){//第一参数是callback
			let [cb] = arg
			cb && cb(label)
			// console.log(label)
			return this
		},
		mergeOptions(...arg){//第一参数是配置对象，第二参数是callback(options)
			let[option,cb] = arg
			options = merge({},options,option)
			cb && cb(options)
			return this
		},
		getUploader(){
			if(uploader){
				return uploader
			}
		},
		destroyUploader(){
			if(uploader){
				uploader.request('destroy')
				uploader = null
			}
		}
	}
})()
const bindEvent = (() => {
	let el,label
	return {
		init(...arg){//第一参数是dom对象
			[el] = arg
			if(!el) {
				console.warn('请现在init方法传递el的实参')
			}
			return this
		},
		bindEv(){
			if(el){
				label=$(el).find('label')
			}
			$(el).on('click',function (e) {
				// console.log('label')
				if(label.get(0)){
					label.get(0).click()
				}else{
					console.error('no laebel')
				}

			})
			return this
		},
		unbindEv(){
			$(el).off('click')
			return this
		}
	}
})()
let timer = null
const multipicupload = {
	bind(el,binding,vnode){
		//let listData = el.dataset.list
		console.log('binding...')
		m_uploader.init(el)
		makePointer.init(el)
	},
	update(el,binding,vnode){
		console.log('updating...')
		m_uploader.init(el)
		makePointer.init(el)
	},
	inserted(el,binding,vnode){
		m_uploader.init(el)
		makePointer.init(el)
		console.log('inserteding...')
		// console.dir(binding)
		let {value} = binding
		if(!value.name){
			console.warn('需要给directive绑定一个name值')
		}
		m_uploader.mergeOptions(value,() => {
			console.log('mergeOver')
		}).makeInstance(function (...arg) {
			let [dom] = arg
			console.dirxml(dom)
		}).makeUpload(function (...arg) {
			// let [label] = arg
			// console.dir(label)
		})

		Vue.nextTick(()=>{
			console.log(el)
			let label = $(el).find('label').get(0)
			let a = 1
			let t = +new Date
			if(!label){
				timer = setInterval(() =>{
					if(label){
						clearInterval(timer)
						// console.log(label)
						bindEvent.init(el).bindEv()
						return
					}
					if((+new Date())-t>10000){
						clearInterval(timer)
						console.error('超过时间没有获得数据')
						return
					}
					console.log(a++)
					label = $(el).find('label').get(0)
				},300)
			}
			//bindEvent.init(el).bindEv()
		})
	},
	unbind(el){
		console.log('unbind....')
		console.log(m_uploader.getUploader())
		m_uploader.getUploader().request('destroy')
		m_uploader.destroyUploader()
		// m_uploader.getUploader() && m_uploader.getUploader().destroy()
		// bindEvent.unbindEv()
	}
}

export {multipicupload}
