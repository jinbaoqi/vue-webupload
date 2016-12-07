import Vue from 'vue'
import App from './samples/main.vue'
import {event} from './utils/event'
window.tether = require('tether')
/* eslint-disable no-new */
new Vue({
	el: '#app',
	template: '<App/>',
	components: { App },
	created(){
		event.init()
	}
})
