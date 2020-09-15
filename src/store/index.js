import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
Vue.use(Vuex)

if (Cookies.get('profile')) {
	var profile = JSON.parse(Cookies.get('profile'))
}

export default new Vuex.Store({
	state: {
		loading: false,
		user: profile
			? {
					uid: profile.userId,
					nickname: profile.nickname,
			  }
			: null,
		song: null,
		originPlaylist: [], // 初始播放列表，用于切歌到上一首
		myLists: [],
		likelistIds: [],
		playlist: [],
		songHistory: [],
		refreshList: 0, // 修改歌单后需要刷新的歌单ID
	},
	mutations: {
		userAdd(state) {
			let profile1 = JSON.parse(Cookies.get('profile'))
			state.user = { uid: profile1.userId, nickname: profile1.nickname }
		},
		userClear(state) {
			state.user = null
		},
		startLoading(state) {
			state.loading = true
		},
		endLoading(state) {
			state.loading = false
		},
		sendMyLists(state, lists) {
			state.myLists = lists
		},
		//喜欢操作
		sendLikeList(state, ids) {
			state.likelistIds = ids
		},
		likeIt(state, id) {
			state.likelistIds.push(id)
		},
		unLikeIt(state, id) {
			let i = state.likelistIds.findIndex(v => v == id)
			state.likelistIds.splice(i, 1)
		},
		sendPlaylist(state, playlist) {
			state.originPlaylist = playlist
		},
		randomList(state, playlist) {
			state.playlist = playlist
		},
		playSong(state, { item, playlist }) {
			let exit = null
			if (localStorage.getItem('songHistory')) {
				state.songHistory = JSON.parse(localStorage.getItem('songHistory'))
				if (state.song) {
					exit = state.songHistory.find(v => v.id == state.song.id)
				}

				if (!exit) {
					if (state.song) state.songHistory.push(state.song)
				} else {
					let i = state.songHistory.findIndex(v => v.id == state.song.id)
					state.songHistory.splice(i, 1)
					state.songHistory.push(state.song)
				}
			} else {
				if (state.song) {
					state.songHistory.push(state.song)
				}
			}
			localStorage.setItem('songHistory', JSON.stringify(state.songHistory))

			state.song = item
			state.playlist = playlist
		},
		clearHistory(state) {
			localStorage.clear()
			state.songHistory = []
		},
		needRefreshList(state, listId) {
			state.refreshList = listId
		},
		clearRefreshList(state) {
			state.refreshList = 0
		},
	},
	actions: {},
	modules: {},
})
