<template>
	<div class="comment-page">
		<div class="comment-title" v-if="song">
			<div class="left">
				<img :src="song.al.picUrl + '?param=100y100'" @load="scrollRefresh" />
				<div>
					<p class="elellipsis">{{ song.name }}</p>
					<p class="elellipsis">{{ song.ar | ar }}</p>
					<p class="elellipsis">{{ song.al.name }}</p>
				</div>
			</div>
			<div class="right">
				<span class="iconfont icon-arrowrightol" @click="playSong"></span>
			</div>
		</div>
		<div class="comment-main">
			<div class="comments">
				<div class="title-option">
					<span
						@click="titleClick(true)"
						:class="{ hot }"
						v-if="hotComments.length"
						>热门</span
					>
					<span @click="titleClick(false)" :class="{ hot: !hot }">最新</span>
				</div>
				<div
					class="comment"
					v-for="(comment, index) in showComments"
					:key="index"
				>
					<div class="top">
						<div class="left">
							<img
								:src="comment.avatar + '?param=100y100'"
								@load="scrollRefresh"
							/>
						</div>
						<div class="right">
							<div>
								<p>{{ comment.name }} :</p>
								<p class="content">{{ comment.content }}</p>
							</div>
							<div v-if="comment.beReplied" class="replied">
								<p>@{{ comment.beReplied.name }} :</p>
								<p>{{ comment.beReplied.content }}</p>
							</div>
						</div>
					</div>
					<div class="bottom">
						<p>{{ comment.time }}</p>
						<p class="reply">
							<span @click="reply(comment)">回复</span>
						</p>
						<p @click="likeClick(comment, showComments)">
							<span
								class="iconfont icon-heart"
								:class="{ liked: comment.liked }"
							></span>
							{{ comment.likedCount }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { filterList } from '@/common/util'
import {
	getComment_,
	getHotComment_,
	likeComment_,
	getSongDetail_,
} from '@/network/content'

import { getMVComment_, getMVDetail_ } from '@/network/mv'
export default {
	name: 'Comment',
	components: {},
	props: {},
	data() {
		return {
			song: null,
			hotComments: [],
			comments: [],
			hot: true,
			curPage: 0,
			hotCurPage: 0,
			scrollTimer: null,
		}
	},
	created() {
		this.getDetail().then(_ => {
			this.gethotComments().then(_ => {
				if (this.hotComments.length == 0) {
					this.hot = false
				}
			})

			this.getComment()
		})
	},
	watch: {
		id() {
			this.comments = []
			this.hotComments = []
			this.getDetail().then(_ => {
				this.gethotComments().then(_ => {
					if (this.hotComments.length == 0) {
						this.hot = false
					}
				})

				this.getComment()
			})
		},
	},
	computed: {
		type() {
			return this.$route.params.type
		},
		id() {
			return this.$route.params.id
		},
		showComments() {
			if (this.hot) return this.hotComments
			if (!this.hot) return this.comments
		},
		typeNum() {
			if (this.type == 'mv') return 1
			if (this.type == 'song') return 0
		},
	},
	methods: {
		getDetail() {
			if (this.type == 'song') {
				return getSongDetail_(this.id).then(({ songs }) => {
					return filterList(songs).then(list => {
						this.song = list[0]
					})
				})
			} else if (this.type == 'mv') {
				return getMVDetail_(this.id).then(({ data }) => {
					this.song = {
						id: data.id,
						name: data.name,
						picUrl: data.cover,
						ar: data.artists,
						al: {
							picUrl: data.cover,
							name: data.pubishTime,
						},
						mv: true,
					}
				})
			}
		},
		getComment() {
			if (this.type == 'mv') {
				return getMVComment_(this.song.id, 30, ++this.curPage).then(res => {
					this.comments.push(...this.filterComment(res.comments))
				})
			} else if (this.type == 'song') {
				return getComment_(this.song.id, 30, ++this.curPage).then(res => {
					this.comments.push(...this.filterComment(res.comments))
				})
			}
		},
		//假的,不知道为什么刷新评论要过会儿发的评论才会出来
		replyComment(comment, bereply) {
			let cmt = {
				name: comment.user.nickname,
				avatar: comment.user.avatarUrl,
				time: '刚刚',
				likedCount: 0,
				content: comment.content,
				liked: false,
				beReplied: false,
			}
			if (bereply) {
				cmt.beReplied = {
					name: bereply.name,
					content: bereply.content,
				}
			}
			this.comments.unshift(cmt)
		},
		gethotComments() {
			return getHotComment_(
				this.song.id,
				30,
				++this.hotCurPage,
				this.typeNum
			).then(res => {
				this.hotComments.push(...this.filterComment(res.hotComments))
			})
		},

		filterComment(comments) {
			return comments.map(v => {
				return {
					name: v.user.nickname,
					avatar: v.user.avatarUrl,
					time: this.formatDate(new Date(v.time)),
					likedCount: v.likedCount,
					commentId: v.commentId,
					content: v.content,
					liked: v.liked,
					beReplied: v.beReplied.length > 0 && {
						name: v.beReplied[0].user.nickname,
						content: v.beReplied[0].content,
					},
				}
			})
		},

		titleClick(v) {
			this.hot = v
			this.$emit('refresh')
		},
		likeClick(comment, comments) {
			if (comment.liked) {
				likeComment_(this.song.id, comment.commentId, 0).then(res => {
					if (res.code != 200) return this.$toast.show('取消失败')
					comments.find(v => v.commentId == comment.commentId).liked = 0
					comments.find(v => v.commentId == comment.commentId).likedCount--

					this.$toast.show('取消了点赞')
				})
			} else {
				likeComment_(this.song.id, comment.commentId, 1).then(res => {
					if (res.code != 200) return this.$toast.show('点赞失败')
					comments.find(v => v.commentId == comment.commentId).liked = 1
					comments.find(v => v.commentId == comment.commentId).likedCount++
					this.$toast.show('点赞了它!')
				})
			}
		},
		playSong() {
			this.$store.commit('playSong', {
				item: this.song,
				playlist: this.$store.state.playlist,
			})
		},
		reply(comment) {
			console.log(comment, this.song)
			this.$emit('show-comment', { comment, song: this.song })
		},
		formatDate(data, option = 'YYYY年MM月DD日 HH:mm') {
			let config = {
				YYYY: data.getFullYear(),
				MM: data.getMonth() + 1,
				DD: data.getDate(),
				HH: data.getHours(),
				mm: data.getMinutes(),
			}
			let now = new Date()
			if (config.YYYY == now.getFullYear()) {
				option = option.slice(5)
				if (config.MM == now.getMonth() + 1) {
					if (config.DD == now.getDate()) {
						option = option.slice(-5)
					}
				}
			}
			for (const key in config) {
				if (config[key] < 10) config[key] = '0' + config[key]
				option = option.replace(key, config[key])
			}

			return option
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
.comment-page {
	.comment-title {
		display: flex;
		.left {
			width: 90%;
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
				width: 60%;
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
		.right {
			display: flex;
			align-items: center;
			margin-left: -2rem;
			span {
				font-size: 3.5rem;
				color: #ff2c55;
			}
		}
	}
	.comment-main {
		.comments {
			padding: 1rem;
			padding-top: 0;
			.title-option {
				font-weight: 500;
				font-size: 1.5rem;
				padding: 1rem;
				margin-right: -1rem;
				border-bottom: 1px solid #8a898e52;
				direction: rtl;
				background-image: linear-gradient(90deg, white, white, #8a898e21);
				span {
					padding: 1rem;
				}
				.hot {
					font-weight: 700;
					color: #111;
				}
			}
			.comment {
				border-bottom: 1px solid #8a898e52;
				padding: 0.5rem;
				.top {
					display: flex;
					.left {
						img {
							width: 4rem;
							height: 4rem;
							border-radius: 5%;
							border: 1px solid #8a898e52;
						}
						padding-right: 1rem;
					}
					.right {
						width: 100%;
						div {
							p:first-of-type {
								color: #ff7675;
								padding: 0.3rem;
							}
							p:last-of-type {
								text-indent: 2.4rem;
								font-size: 1.2rem;
								color: #111;
							}
						}
						.replied {
							margin: 0.5rem;
							background-color: #f1f1f4;
							border-radius: 2%;
							padding: 0.5rem;
						}
					}
				}
				.bottom {
					padding: 1rem 0;
					display: flex;
					justify-content: space-between;
					.reply {
						flex: 1;
						direction: rtl;
						text-indent: 1rem;
					}
					.liked {
						color: #ff2c55;
					}
				}
			}
		}
	}
}
</style>
