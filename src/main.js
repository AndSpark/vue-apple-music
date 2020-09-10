import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Toast from './components/common/toast'

import VueLazyLoad from 'vue-lazyload'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

Vue.use(VueAwesomeSwiper /* { default options with global component } */)
Vue.use(Toast)
Vue.use(VueLazyLoad, {
	preLoad: 1.3,
	error: '@/assets/logo.png',
	loading: '@/assets/logo.png',
	attempt: 1,
})

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

Vue.prototype.$tap = function(ref) {
	if (this.$route.path == `/${ref}`) {
		this.$refs[ref].classList.add('clickRed', 'red')
		setTimeout(() => {
			if (this.$refs[ref]) this.$refs[ref].classList.remove('clickRed')
		}, 500)
	} else {
		this.$refs[ref].classList.add('click', 'red')
		setTimeout(() => {
			if (this.$refs[ref]) this.$refs[ref].classList.remove('click')
		}, 500)
	}
}

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')

Vue.filter('ar', function(v) {
	return v.map(v => v.name).join(',')
})
