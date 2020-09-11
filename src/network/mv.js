import axios from '@/network/axios'

export function getHotMV_(limit = 10, offset, area) {
	return axios({
		url: '/top/mv',
		params: {
			limit,
			area,
			offset,
		},
	})
}

export function getFirstMV_(limit = 10, area) {
	return axios({
		url: '/mv/first',
		params: {
			limit,
			area,
		},
	})
}

export function getMVDetail_(mvid) {
	return axios({
		url: '/mv/detail',
		params: {
			mvid,
		},
	})
}

export function getMVUrl_(id) {
	return axios({
		url: '/mv/url',
		params: {
			id,
		},
	})
}

export function getMVComment_(id, limit, offset) {
	return axios({
		url: '/comment/mv',
		params: {
			id,
			limit,
			offset,
		},
	})
}

export function getArtistMV_(id) {
	return axios({
		url: '/artist/mv',
		params: {
			id,
		},
	})
}
