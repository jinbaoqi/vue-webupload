<template>
    <div class="mt40">
        <span class="btn btn-default" v-tooltip="'woshishabi'">我是tooltip</span>
        <button class="btn btn-info" v-multipicupload="multi">点我上传</button>
        <div>
            <ul>
                <li v-for="(item,index) in imgList" :key="index">
                    <img :src="item.url" alt="">
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import tooltip from '../directives/tooltip/tooltip'
    import {multipicupload} from '../directives/multipuploader'
    import {event} from '../utils/event'
    export default{
    	name:'sample',
        directives:{tooltip,multipicupload},
        created(){
//    		console.dir(tooltip)
        },
        mounted(){
        	let _this = this
            event.on('MUP',(...arg) => {
	            var obj = {}
	            let [img] = arg
	            obj.id = img.id
	            obj.file = img.file
	            if(img.url){
		            obj.url = img.url
	            }
	            _this.imgList.push(obj)
            })
        },
        data(){
        	return {
        		multi:{
        			name:'test0',
			        fileNumLimit: 10
                },
                imgList:[]
            }
        }
    }
</script>
<style>
    .mt40{
        margin-top: 1rem;
    }
</style>