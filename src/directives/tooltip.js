export default {
	bind(el, {value, modifiers}) {
		console.log(value)
		if (value==='') {
			return
		}
		el.setAttribute('j-tooltip', value)
		el.classList.add('j-tooltip')
		if (modifiers.inline) {
			el.classList.add('flex', 'inline')
		}
	},
	update(el, {value, oldValue}) {
		if (value !== oldValue) {
			el.setAttribute('j-tooltip', value)
		}
	},
	unbind(el) {
		el.removeAttribute('j-tooltip')
	}
}