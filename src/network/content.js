import axios from '@/network/axios'
export function getListDetail_(id, timestamp = 0) {
	return axios({
		url: '/playlist/detail',
		params: {
			id,
			timestamp,
		},
	})
}
export function getSongDetail_(ids) {
	return axios({
		url: '/song/detail',
		params: {
			ids,
		},
	})
}

export function getSong_(id) {
	return axios({
		url: '/song/url',
		params: {
			id,
		},
	})
}

export function checkSong_(id) {
	return axios({
		url: '/check/music',
		params: {
			id,
		},
	})
}

export function getLyric_(id) {
	return axios({
		url: '/lyric',
		params: {
			id,
		},
	})
}

export function getRecommendResource_() {
	return axios({
		url: '/recommend/resource',
	})
}
export function getRecommendSongs_() {
	return axios({
		url: '/recommend/Songs',
	})
}

export function getBanner_() {
	return axios({
		url: 'banner?type=2',
	})
}

export function getHighQualityList_(cat, limit = 10) {
	return axios({
		url: '/top/playlist/highquality',
		params: {
			cat,
			limit,
		},
	})
}

export function getRelatedList_(id) {
	return axios({
		url: '/related/playlist',
		params: {
			id,
		},
	})
}

export function getHotList_() {
	return axios({
		url: '/playlist/hot',
	})
}

export function getNewSongs_(type) {
	return axios({
		url: '/top/song',
		params: {
			type,
		},
	})
}

export function getTopList_() {
	return axios({
		url: '/toplist/detail',
	})
}

export function getSimiSong_(id) {
	return axios({
		url: '/simi/song',
		params: {
			id,
		},
	})
}
export function getSimiList_(id) {
	return axios({
		url: '/simi/playlist',
		params: {
			id,
		},
	})
}

export function getAlbum_(id) {
	return axios({
		url: '/album',
		params: {
			id,
		},
	})
}

export function getArtists_(id) {
	return axios({
		url: '/artists',
		params: {
			id,
		},
	})
}
export function getArtistsAlbum_(id, limit = 50) {
	return axios({
		url: '/artist/album',
		params: {
			id,
			limit,
		},
	})
}
//  获取喜欢列表，2分钟一次，
export function getLikeList_(uid) {
	return axios({
		url: '/likelist',
		params: {
			uid,
		},
	})
}

export function likeSong_(id, like = true) {
	return axios({
		url: '/like',
		params: {
			id,
			like,
		},
	})
}

export function getComment_(id, limit = 20, offset) {
	return axios({
		url: '/comment/music',
		params: {
			id,
			limit,
			offset,
			timestamp: new Date().getTime(),
		},
	})
}
export function getHotComment_(id, limit = 20, offset, type = 0) {
	return axios({
		url: '/comment/hot',
		params: {
			id,
			limit,
			offset,
			type,
		},
	})
}
export function likeComment_(id, cid, t) {
	return axios({
		url: '/comment/like',
		params: {
			id,
			cid,
			t,
			type: 0,
		},
	})
}

export function getSearchHot_() {
	return axios({
		url: '/search/hot',
	})
}
export function getSearch_(keywords, type = 1) {
	return axios({
		url: '/search',
		params: {
			keywords,
			type,
		},
	})
}
export function getSearchSuggest_(keywords) {
	return axios({
		url: '/search/suggest',
		params: {
			keywords,
		},
	})
}

export function sendComment_(t, type, id, content, commentId) {
	return axios({
		url: '/comment',
		params: {
			t,
			type,
			id,
			content,
			commentId,
		},
	})
}

export function getPersonalFM_() {
	return axios({
		url: '/personal_fm',
		params: {
			timestamp: new Date().getTime(),
		},
	})
}

///对歌单添加或删除歌曲
export function playlistTracks_(op, pid, tracks) {
	return axios({
		url: '/playlist/tracks',
		params: {
			op,
			pid,
			tracks,
		},
	})
}
