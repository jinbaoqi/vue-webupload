<template>
    <div>
        <span class="btn btn-default" v-tooltip="'woshishabi'">我是tooltip</span>
    </div>
</template>
<script>
    import tooltip from '../directives/tooltip'
    export default{
    	name:'sample',
        directives:{tooltip},
        created(){
//    		console.dir(tooltip)
        }
    }
</script>