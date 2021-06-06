import axios from '@/network/axios'
import Cookies from 'js-cookie'
export function getUserInfo_() {
	return axios({
		url: `/user/subcount`,
		params: {
			cookie: Cookies.get('MUSCI_U'),
			timestamp: new Date().getTime(),
		},
	})
}

export function getUserPlaylist_(uid) {
	return axios({
		url: '/user/playlist',
		params: {
			uid,
		},
	})
}

export function getAccount() {
	return axios({
		url: '/user/account',
		params: {
			timestamp: new Date().getTime(),
		},})
}
