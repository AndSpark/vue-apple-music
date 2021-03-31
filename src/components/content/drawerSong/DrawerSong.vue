<template>
	<drawer ref="drawer">
		<div class="drawer-song" ref="drawerSong">
			<div class="song-title">
				<img :src="song.al.picUrl" @load="refreshDrawer" />
				<div>
					<p class="elellipsis">{{ song.name }}</p>
					<p class="elellipsis">{{ song.ar | ar }}</p>
					<p class="elellipsis">{{ song.al.name }}</p>
				</div>
			</div>
			<div class="song-main">
				<p class="elellipsis" @click="toComment">
					<span class="iconfont icon-comment"></span>
					<span>前往评论</span>
					<span>{{ song.name }}</span>
				</p>
				<p
					v-for="(ar, index) in song.ar"
					:key="index"
					class="elellipsis"
					@click="toAr(ar.id)"
				>
					<span class="iconfont icon-head"></span>
					<span>前往艺人</span>
					<span>{{ ar.name }}</span>
				</p>
				<p class="elellipsis" @click="toAl" v-if="!song.mv">
					<span class="iconfont icon-CD"></span>
					<span>前往专辑</span>
					<span>{{ song.al.name }}</span>
				</p>
				<p @click="addList" v-if="!song.mv">
					<span class="iconfont icon-list"></span>
					<span>添加到我的歌单</span>
				</p>
				<p @click="removeList" v-if="inMyLists">
					<span class="iconfont icon-delete"></span>
					<span>从歌单中删除</span>
					<span>{{ song.listName }}</span>
				</p>
			</div>

			<swiper-list
				:list="songs"
				:small="true"
				@refresh="refreshDrawer"
				titleL="相似音乐"
				@itemClick="playSong"
				v-if="songs.length > 0"
			></swiper-list>
			<div class="no-music" v-if="songs.length == 0">
				<h2>暂无相似音乐</h2>
			</div>
			<div class="like" v-if="$store.state.user && !song.mv">
				<p @click="likeClick">
					<span
						class="iconfont icon-heart"
						:class="{ red: likeSongStatus }"
					></span>
					<span>喜欢</span>
				</p>
			</div>
		</div>
	</drawer>
</template>

<script>
import Drawer from '@/components/common/drawer/Drawer'
import { filterList3, filterList2 } from '@/common/util'
import {
	getSimiSong_,
	getLikeList_,
	likeSong_,
	playlistTracks_,
} from '@/network/content'
import SwiperList from '@/components/content/swiperList/SwiperList'
export default {
	name: 'DrawerSong',
	components: {
		SwiperList,
		Drawer,
	},
	props: {},
	data() {
		return {
			songs: [],
			h: 0,
		}
	},
	computed: {
		ar() {
			return Vue.filter('ar')
		},
		song() {
			return this.$store.state.song
		},
		likeIds() {
			return this.$store.state.likelistIds
		},
		liekListId() {
			return this.$store.state.myLists[0]
		},
		likeSongStatus() {
			return this.likeIds.find(v => v == this.song.id)
		},
		inMyLists() {
			return this.$store.state.myLists.find(v => v.id == this.song.listId)
		},
	},
	created() {
		this.getSimi()
		this.getLikeList()
	},
	watch: {
		song(n) {
			this.getSimi()
		},
	},
	methods: {
		getSimi() {
			getSimiSong_(this.song.id).then(({ songs }) => {
				filterList3(songs).then(list => {
					this.songs = list
				})
			})
		},
		getLikeList() {
			if(!this.$store.state.user) return
			getLikeList_(this.$store.state.user.uid).then(({ ids }) => {
				this.$store.commit('sendLikeList', ids)
			})
		},
		playSong(item) {
			this.$store.commit('playSong', {
				item,
				playlist: this.$store.state.playlist,
			})
		},
		toAr(id) {
			this.hideDrawer()
			this.$router.push({ name: 'Artist', params: { id } })
		},
		toAl() {
			this.hideDrawer()
			this.$router.push({
				name: 'ListDetail',
				params: { id: this.song.al.id },
			})
		},
		refreshDrawer() {
			this.$refs.drawer.refresh()
		},
		hideDrawer() {
			this.$refs.drawer.bs.scrollTo(0, 0, 500)
			this.$parent.$refs.player.$refs.scroll.scroll.scrollTo(0, 0)
		},
		showDrawer() {
			this.$refs.drawer.showDrawer()
		},
		//相同的操作会被缓存 2分钟
		likeClick() {
			if (this.likeSongStatus) {
				likeSong_(this.song.id, false).then(res => {
					if (res.code == 200) {
						this.$toast.show('取消喜欢！')
						this.$store.commit('unLikeIt', this.song.id)
						//刷新页面
						this.$store.commit('needRefreshList', this.liekListId)
						if (this.$route.name == 'ListDetail') {
							this.$parent.$refs.view.getListDetail().then(_ => {
								this.$store.commit('needRefreshList', this.liekListId)
							})
						}
					} else {
						this.$toast.show('取消失败了')
					}
				})
			} else {
				likeSong_(this.song.id).then(res => {
					if (res.code == 200) {
						this.$toast.show('喜欢了它！')
						this.$store.commit('likeIt', this.song.id)
						//刷新页面
						this.$store.commit('needRefreshList', this.liekListId)
						if (this.$route.name == 'ListDetail') {
							this.$parent.$refs.view.getListDetail().then(_ => {
								this.$store.commit('needRefreshList', this.liekListId)
							})
						}
					} else {
						this.$toast.show('喜欢失败了')
					}
				})
			}
		},
		toComment() {
			let type = 'song'
			this.hideDrawer()
			if (this.song.mv) type = 'mv'
			this.$router.push({
				name: 'Comment',
				params: { type, id: this.song.id },
			})
		},
		addList() {
			this.$emit('add-list', this.song.id)
		},
		async removeList() {
			let res = await playlistTracks_('del', this.song.listId, this.song.id)
			if (res.status != 200) {
				this.hideDrawer()
				return this.$toast.show('删除失败')
			} else if (res.body.code != 200) {
				this.hideDrawer()
				return this.$toast.show(res.body.message)
			}
			this.$toast.show('删除成功')
			this.$store.commit('needRefreshList', this.song.listId)
			this.$parent.$refs.view.getListDetail()
			this.hideDrawer()
		},
	},
}
</script>

<style lang="scss" scoped>
.drawer-song {
	background-color: #fff;
	.song-title {
		height: 8rem;
		display: flex;
		border-bottom: 1px solid #8a898e65;
		img {
			height: 80%;
			box-sizing: border-box;
			margin: 1rem;
			border-radius: 5%;
			border: #8a898e65 solid 1px;
		}
		div {
			display: flex;
			flex-direction: column;
			padding: 1rem;
			padding-left: 0.5rem;
			width: 50%;
			p {
				flex: 1;
				font-size: 1.3rem;
				padding: 0.5rem 0;
			}
			p:first-of-type {
				font-weight: 700;
				color: #111;
			}
			p:nth-of-type(2) {
				color: #ff2c55;
			}
			p:nth-of-type(3) {
				color: #111;
			}
		}
	}
	.song-main {
		padding: 0.5rem 1rem;
		span {
			font-size: 1.3rem;
		}
		//
		p {
			padding: 0.5rem 0;
			width: 100%;
			:nth-child(1) {
				color: #ff2c55;
				font-size: 2rem;
				padding-right: 1.5rem;
			}
			:nth-child(2) {
				color: #111;
				padding-right: 1rem;
			}
			:nth-child(3) {
				color: #ff7675;
				font-size: 1.3rem;
			}
		}
	}
	.like {
		height: 3rem;
		box-shadow: 0 -1px 3px 1px #8a898e65;
		padding: 0.5rem;
		text-align: center;
		p {
			display: flex;
			justify-content: center;
			width: 8rem;
			margin: 0 auto;
			line-height: 3rem;
			span {
				font-size: 2.5rem;
			}
			:last-child {
				font-size: 1.5rem;
			}
		}

		.red {
			color: #ff2c55;
		}
	}
}
.no-music {
	box-sizing: border-box;
	height: calc(25vw + 83px);
	background-color: #fff;
	text-align: center;
	padding-top: 3rem;

	h2 {
		font-size: 1.8rem;
		color: #111;
	}
}
</style>
