import Axios from 'axios'
import store from '@/store'
export default function(option) {
	return new Promise((resolve, reject) => {
		const instance = Axios.create({
			baseURL: process.env.VUE_APP_URL,
			timeout: 5000,
			withCredentials: true,
		})
		let timer = null
		instance.interceptors.request.use(
			config => {
				timer = setTimeout(() => {
					store.commit('startLoading')
				}, 100)
				return config
			},
			err => {
				return err
			}
		)

		instance.interceptors.response.use(
			response => {
				clearTimeout(timer)
				store.commit('endLoading')
				setTimeout(() => {
					store.commit('endLoading')
				}, 100)
				return response.data
			},
			err => {
				clearTimeout(timer)
				store.commit('endLoading')
				setTimeout(() => {
					store.commit('endLoading')
				}, 200)
				return err
			}
		)

		instance(option)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
