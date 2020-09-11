<template>
	<div class="main-bar">
		<div class="main-bar-p" ref="mainBar">
			<div class="block" ref="library" @click="libraryClick">
				<span class="iconfont icon-librarymusic"></span>
				<p>资料库</p>
			</div>
			<div class="block" ref="recommend" @click="recommendClick">
				<span class="iconfont icon-heart"></span>
				<p>为你推荐</p>
			</div>
			<div class="block" ref="browse" @click="browseClick">
				<span class="iconfont icon-musicnote"></span>
				<p>浏览</p>
			</div>
			<div class="block" ref="MV" @click="MVClick">
				<span class="iconfont icon-tubiaozhizuomobanyihuifu-"></span>
				<p>MV</p>
			</div>
			<!-- 评论功能 -->
		</div>
		<div class="comment" v-if="commentPath" @click="showInput">
			<span class="iconfont icon-edit"></span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'MainBar',
	components: {},
	props: {},
	data() {
		return {}
	},
	computed: {
		commentPath() {
			if (this.$parent.$refs.player && this.$parent.$refs.player.open)
				return false
			return this.$route.name == 'Comment'
		},
	},
	methods: {
		libraryClick() {
			this.removeRed()
			this.$tap('library')
			if (this.$route.path == '/library') this.$emit('scrollTop')

			this.$router.push('/library')
		},
		recommendClick() {
			this.removeRed()
			this.$tap('recommend')
			if (this.$route.path == '/recommend') this.$emit('scrollTop')
			this.$router.push('/recommend')
		},
		browseClick() {
			this.removeRed()
			this.$tap('browse')
			if (this.$route.path == '/browse') this.$emit('scrollTop')
			this.$router.push('/browse')
		},
		MVClick() {
			this.removeRed()
			this.$tap('MV')
			if (this.$route.path == '/mv') this.$emit('scrollTop')
			this.$router.push('/mv')
		},
		showInput() {
			this.$parent.$refs.view.reply()
		},
		removeRed() {
			;[...this.$refs.mainBar.querySelectorAll('.red')].forEach(v => {
				v.classList.remove('red')
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.main-bar-p {
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 4rem;
	border-top: 1px solid #8a898e65;
	padding: 0.3rem 0;
	background-color: #fff;
	overflow: hidden;
	.iconfont {
		font-size: 2.3rem;
	}
	.block {
		width: 15%;
		text-align: center;
		position: relative;
		p {
			font-size: 1rem;
		}
	}
	.red span {
		color: #ff2c55;
	}
	.red p {
		color: #ff2c55;
	}
}
.comment {
	position: absolute;
	bottom: 10.5rem;
	color: #ff2c55;
	right: 2rem;
	background-color: #fff;
	width: 3rem;
	height: 3rem;
	padding: 0.5rem;
	border-radius: 50%;
	border: 1px solid #8a898e65;
	box-shadow: 0 0 5px 1px #8a898e65;
	text-align: center;
	line-height: 3rem;
	z-index: -10;
	span {
		font-size: 2rem;
	}
}
</style>
