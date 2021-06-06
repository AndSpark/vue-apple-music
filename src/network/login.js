import axios from '@/network/axios'

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