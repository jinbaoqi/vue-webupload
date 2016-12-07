/**
 * Created by matt_jin on 14/11/2016.
 */
import Vue from 'vue'

const event = {
	bus: null,

	init() {
		if (!this.bus) {
			this.bus = new Vue()
		}
		return this
	},

	emit(name, ...args) {
		this.bus.$emit(name, ...args)
		return this
	},

	on() {
		if (arguments.length === 2) {
			this.bus.$on(arguments[0], arguments[1])
		} else {
			Object.keys(arguments[0]).forEach(key => {
				this.bus.$on(key, arguments[0][key])
			})
		}

		return this
	}
}
const merge = function (target) {
	for (let i = 1, j = arguments.length; i < j; i++) {
		let source = arguments[i] || {}
		for (let prop in source) {
			if (source.hasOwnProperty(prop)) {
				let value = source[prop]
				if (value !== undefined) {
					target[prop] = value
				}
			}
		}
	}

	return target
}
const getParams = (...arg) => {
	let [api] = arg
	let mark = api.indexOf('?') > -1 ? '' : '?'
	return `${API_ROOT}${api}${mark}${SESSION_KEY}=${Cookies.get(SESSION_KEY, {domain: SESSION_DOMAIN})}&${LS_TOKEN_KEY}=${LS_TOKEN}`
}

const getAnchorPosition = (el,...arg) => {
	const rect = el.getBoundingClientRect()
	const a = {
		top:rect.top,
		left:rect.left,
		width:el.offsetWidth,
		height:el.offsetHeight
	}
	a.right = rect.right||a.left+a.width
	a.bottom = rect.bottom||a.top+a.height
	a.middle = a.left+(a.right-a.left)/2
	a.center = a.top+(a.bottom-a.top)/2
	let [cb] = arg
	cb && cb(el)
	return a
}
export {event, merge, getParams,getAnchorPosition}
