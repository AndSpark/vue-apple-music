<template>
	<div class="search-page">
		<div class="hot-search" v-if="showHot">
			<h2>热门搜索</h2>
			<p
				v-for="(item, index) in hots"
				:key="index"
				@click="hotSearch(item.first)"
			>
				{{ item.first }}
			</p>
		</div>
		<div class="search-item" v-for="(title, index) in order" :key="index">
			<h2>
				<span>{{ title | orderFilter }}</span>
				<span @click="searchMore(title)">查看更多</span>
			</h2>
			<div class="content" v-for="item in result[title]" :key="item.id">
				<div
					v-if="title == 'artists'"
					class="artist"
					@click="searchClick(item, title)"
				>
					<img :src="item.picUrl + '?param=60y60'" @load="scrollRefresh" />
					<p class="elellipsis">{{ item.name }}</p>
				</div>
				<div v-else class="other" @click="searchClick(item, title)">
					<img
						:src="item.coverImgUrl + '?param=100y100'"
						@load="scrollRefresh"
					/>
					<div>
						<p class="elellipsis">{{ item.name }}</p>
						<p class="elellipsis">{{ item | desc }}</p>
					</div>
				</div>
			</div>
		</div>
		<p class="noreuslt" v-show="noreuslt">抱歉，没有找到结果</p>
	</div>
</template>

<script>
import {
	getSearch_,
	getSearchHot_,
	getSearchSuggest_,
	getAlbum_,
	getSongDetail_,
} from '@/network/content'
import { filterList } from '@/common/util'
export default {
	name: 'Search',
	components: {},
	props: {
		keywords: {
			type: String,
		},
	},
	data() {
		return {
			hots: [],
			result: [],
			order: [],
			scrollTimer: null,
			delaySearch: null,
			noreuslt: false,
		}
	},
	filters: {
		orderFilter(v) {
			switch (v) {
				case 'artists':
					return '艺人'
					break
				case 'songs':
					return '音乐'
					break
				case 'albums':
					return '专辑'
					break
				case 'playlists':
					return '歌单'
					break
				default:
					break
			}
		},
		desc(v) {
			if (v.ar) {
				return v.ar.map(x => x.name).join(',')
			} else if (v.artist) {
				return v.artist.name
			} else if (v.description) {
				return v.description
			}
		},
	},
	computed: {
		showHot() {
			return this.keywords.length == 0
		},
	},
	created() {
		this.getSearchHot()
	},
	watch: {
		keywords(n, o) {
			if (n.length > 0) {
				if (this.delaySearch) clearTimeout(this.delaySearch)
				this.delaySearch = setTimeout(() => {
					this.getSearchSuggest(n).then(_ => {
						this.getImg()
						if (!this.order) {
							this.noreuslt = true
						} else {
							this.noreuslt = false
						}
					})
				}, 500)
			} else if (!n.length) {
				if (this.delaySearch) clearTimeout(this.delaySearch)
				this.order = []
			}
		},
	},
	beforeRouteLeave(to, from, next) {
		this.$emit('clearSearch')
		next()
	},
	methods: {
		async getSearchHot() {
			let { result } = await getSearchHot_()
			this.hots = result.hots
		},
		async getSearchSuggest(keywords) {
			let { result } = await getSearchSuggest_(keywords)
			if (result) {
				this.result = result
				this.order = result.order
			}
		},
		hotSearch(item) {
			this.$emit('hot-search', item)
		},
		searchMore(title) {
			switch (title) {
				case 'artists':
					this.searchAritists()
					break
				case 'songs':
					this.searchSongs()
					break
				case 'albums':
					this.searchAlbums()
					break
				case 'playlists':
					this.searchPlaylists()
					break
				default:
					break
			}
		},
		async searchSongs() {
			this.result.songs = (await getSearch_(this.keywords)).result.songs
			this.result.songs = await Promise.all(
				this.result.songs.map(async v => {
					return (async _ => {
						let { songs } = await getSongDetail_(v.id)
						let list = await filterList(songs)
						v = list[0]
						this.$set(v, 'coverImgUrl', songs[0].al.picUrl)
						return v
					})()
				})
			)
		},
		async searchAlbums() {
			this.result.albums = (await getSearch_(this.keywords, 10)).result.albums
			this.result.albums.forEach(async v => {
				let { album } = await getAlbum_(v.id)
				this.$set(v, 'coverImgUrl', album.picUrl)
			})
		},
		async searchAritists() {
			this.result.artists = (
				await getSearch_(this.keywords, 100)
			).result.artists
		},
		async searchPlaylists() {
			this.result.playlists = (
				await getSearch_(this.keywords, 1000)
			).result.playlists
		},
		searchClick(item, title) {
			switch (title) {
				case 'artists':
					this.$router.push({ name: 'Artist', params: { id: item.id } })
					break
				case 'songs':
					this.$store.commit('playSong', {
						item,
						playlist: this.$store.state.playlist,
					})
					break
				case 'albums':
					this.$router.push({ name: 'ListDetail', params: { id: item.id } })
					break
				case 'playlists':
					this.$router.push({ name: 'ListDetail', params: { id: item.id } })
					break
				default:
					break
			}
		},
		async getImg() {
			if (this.result.albums) {
				this.result.albums.forEach(async v => {
					let { album } = await getAlbum_(v.id)
					this.$set(v, 'coverImgUrl', album.picUrl)
				})
			}
			if (this.result.songs) {
				this.result.songs = await Promise.all(
					this.result.songs.map(async v => {
						return (async _ => {
							let { songs } = await getSongDetail_(v.id)
							let list = await filterList(songs)
							v = list[0]
							this.$set(v, 'coverImgUrl', songs[0].al.picUrl)
							return v
						})()
					})
				)
			}
		},
		scrollRefresh() {
			if (this.scrollTimer) clearTimeout(this.scrollTimer)
			this.scrollTimer = setTimeout(() => {
				this.$nextTick(_ => {
					this.$emit('refresh')
				})
			}, 50)
		},
	},
}
</script>

<style lang="scss" scoped>
.search-page {
	.hot-search {
		padding: 1.5rem;
		h2 {
			font-size: 1.8rem;
			color: #111;
			padding: 1.5rem 0;
			border-bottom: 1px solid #8a898e23;
		}
		p {
			color: #ff2c55;
			font-size: 1.5rem;
			line-height: 2rem;
			padding: 0.8rem 0;
			border-bottom: 1px solid #8a898e23;
		}
	}
	.search-item {
		border-bottom: 1px solid #8a898e23;
		&:first-of-type {
			h2 {
				border-top: 1px solid #8a898e23;
				margin-top: 1rem;
			}
		}
		h2 {
			display: flex;
			justify-content: space-between;
			padding: 1rem;
			font-size: 1.6rem;
			font-weight: 500;
			color: #111;
			background-color: #f3f2f7;
			span:last-of-type {
				font-size: 1.3rem;
				color: #ff2c55;
			}
			border-top: 1px solid #8a898e23;
			border-bottom: 1px solid #8a898e23;
		}

		.content {
			padding: 1rem;
			border-top: 1px solid #8a898e23;
			.artist {
				display: flex;
				align-items: center;
				img {
					border-radius: 50%;
					border: 1px solid #8a898e23;
				}
				p {
					font-size: 1.6rem;
					text-align: center;
					color: #111;
					padding-left: 1rem;
				}
			}
			.other {
				display: flex;
				img {
					height: 5.5rem;
					box-sizing: border-box;
					border-radius: 5%;
					border: #8a898e65 solid 1px;
				}
				div {
					display: flex;
					flex-direction: column;
					padding: 0.4rem;
					width: 60%;
					p {
						flex: 1;
						font-size: 1.3rem;
						padding: 0.5rem;
					}
					p:first-of-type {
						color: #111;
					}
					p:nth-of-type(2) {
						color: #ff2c55;
					}
				}
			}
		}
	}
	.noreuslt {
		padding: 1rem;
		font-size: 2rem;
		color: #111;
		margin-top: 5rem;
		text-align: center;
	}
}
</style>
