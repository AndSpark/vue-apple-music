import Axios from 'axios'

const instance = Axios.create({
	baseURL: process.env.VUE_APP_URL,
	timeout: 5000,
	withCredentials: true,
})

instance.interceptors.response.use(
	response => {
		return response.data
	},
	err => {
		return err
	}
)

const axios = (option) => {
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



export function userLogin_(phone,password){
  return axios({
    method:'post',
    url:`/login/cellphone`,
    data:{
      phone,
      password
    }
  })
}

export function _getQrKey() {
	return axios({
		url: `/login/qr/key`,
		params: {
			timestamp: new Date().getTime(),
		}
  })
}

export function _getQrCode(key) {
	return axios({
		url: `/login/qr/create`,
		params: {
			key,
			qrimg: 1,
			timestamp: new Date().getTime(),
		}
  })
}

export function _checkQrCode(key) {
	return axios({
		url: `/login/qr/check`,
		params: {
			key,
			timestamp: new Date().getTime(),
		}
  })
}