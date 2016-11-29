import Vue from 'vue'
import App from './samples/main.vue'
window.tether = require('tether')
/* eslint-disable no-new */
new Vue({
	el: '#app',
	template: '<App/>',
	components: { App },
})
