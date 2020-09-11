<template>
	<div class="list-item" ref="list">
		<div
			v-for="(item, i) in playlist"
			:key="item.id"
			class="default-list"
			@click="playSong(item, i)"
		>
			<img
				:src="item.al.picUrl + '?param=50y50'"
				@load="scrollRefresh"
				v-if="showImg"
			/>
			<div
				class="item-right"
				:class="{ disable: item.url == null, borderT: i == 0 && bordertop }"
			>
				<div>
					<p class="elellipsis ar">{{ item.name }}</p>
					<p class="al">{{ item.ar | ar }}</p>
				</div>
				<span class="iconfont icon-arrowrightol"></span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ListItem',
	components: {},
	props: {
		playlist: {
			type: Array,
			default() {
				return []
			},
		},
		playlistAll: {
			type: Array,
			default() {
				return []
			},
		},
		history: {
			type: Boolean,
			default: false,
		},
		bordertop: {
			type: Boolean,
			default: false,
		},
		remove: {
			type: Boolean,
			default: false,
		},
		clear: {
			type: Boolean,
			default: false,
		},
		listDetail: {
			type: Boolean,
			default: false,
		},
		showImg: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			l: 0,
			scrollTimer: null,
		}
	},
	computed: {
		ar() {
			return Vue.filter('ar')
		},
	},
	methods: {
		playSong(item, i) {
			if (item.url == null) {
				return 0
			}

			if (this.history) {
				let playlist = [...this.$store.state.playlist]
				this.$store.commit('playSong', { item, playlist })
			} else {
				// i 手动设置第几个开始播放
				if (!i) {
					let i = this.playlist.findIndex(v => v.id == item.id)
				}

				if (this.playlistAll.length > 0) {
					let origin = this.playlistAll.filter(v => v.url != null)
					let i = origin.findIndex(v => v.id == item.id)
					let playlist = origin.slice(i + 1)
					this.$store.commit('sendPlaylist', origin)

					return this.$store.commit('playSong', {
						item,
						playlist,
					})
				}

				let origin = this.playlist.filter(v => v.url != null)
				let playlist = this.playlist.slice(i + 1).filter(v => v.url != null)
				this.$store.commit('playSong', { item, playlist })
				if (this.listDetail) {
					this.$store.commit('sendPlaylist', origin)
				}
			}
			//播放器中列表点击动画
			if (this.remove) {
				this.$refs.list.style.marginTop = `${(i + 1) * 4.5}rem`

				setTimeout(() => {
					this.$refs.list.style.transition = `0.5s`
					this.$refs.list.style.marginTop = 0
					setTimeout(() => {
						this.$refs.list.style.transition = `0s`
					}, 500)
				}, 0)
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
.default-list {
	display: flex;
	height: 4.5rem;
	img {
		height: 3.6rem;
		width: 3.6rem;
		border-radius: 0.5rem;
		border: #8a898e65 solid 1px;
		margin: 0.5rem 1rem 0.5rem 0;
	}
	.item-right {
		height: 4.5rem;
		display: flex;
		border-bottom: 1px solid #8a898e65;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		overflow: hidden;

		div {
			flex: auto;
			overflow: hidden;
			.ar {
				font-size: 1.3rem;
				color: #222;
				margin-bottom: 0.5rem;
			}
			.al {
				font-size: 1rem;
			}
		}
		span {
			font-size: 2rem;
			color: #ff2c55;
		}
	}
	.disable {
		div {
			p {
				color: #ccc !important;
			}
		}
		span {
			color: #ccc;
		}
	}
}
.borderT {
	border-top: 1px solid #8a898e65;
}
</style>
