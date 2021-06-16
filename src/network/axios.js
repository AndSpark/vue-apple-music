import Axios from 'axios'
import loadingBar from '@/utils/loadingBar'
const instance = Axios.create({
	baseURL: process.env.VUE_APP_URL,
	timeout: 5000,
	withCredentials: true,
})

instance.interceptors.request.use(
	config => {
		loadingBar.start()
		return config
	},
	err => {
		return err
	}
)

instance.interceptors.response.use(
	response => {
		loadingBar.end()
		return response.data
	},
	err => {
		return err
	}
)

export default function (option) {
	
	return new Promise((resolve, reject) => {
		
		
		instance(option)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
