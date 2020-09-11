<template>
	<div class="mv-page">
		<h2 class="mv-title">MV</h2>
		<div class="mv-first">
			<swiper-list
				:swiperOption="swiperOption"
				:list="firstMV"
				imgSize="?param=500y250"
				titleL="最新"
				@itemClick="playMV"
			></swiper-list>
			<swiper-list
				:swiperOption="swiperOption"
				:list="HotMV"
				imgSize="?param=500y250"
				titleL="热门"
				@itemClick="playMV"
			></swiper-list>
		</div>
	</div>
</template>

<script>
import { getFirstMV_, getMVUrl_, getHotMV_ } from '@/network/mv'
import { filterListMV } from '@/common/util'
import SwiperList from '@/components/content/swiperList/SwiperList'
export default {
	name: 'MV',
	components: {
		SwiperList,
	},
	props: {},
	data() {
		return {
			swiperOption: {
				slidesPerView: '1',
				observer: true,
				observeParents: true,
			},
			firstMV: [],
			HotMV: [],
		}
	},
	computed: {},
	created() {
		this.getFirstMV()
		this.getHotMV()
	},
	methods: {
		async getFirstMV() {
			let { data } = await getFirstMV_()
			this.firstMV = await filterListMV(data)
		},
		async getHotMV() {
			let { data } = await getHotMV_(10, 1)
			this.HotMV = await filterListMV(data)
		},
		playMV(item) {
			let i = this.firstMV.findIndex(v => v.id == item.id)
			let originList = this.firstMV
			let playlist = this.firstMV.slice(i + 1)
			this.$store.commit('sendPlaylist', originList)
			this.$store.commit('playSong', { item, playlist })
		},
	},
}
</script>

<style lang="scss" scoped>
.mv-page {
	.mv-title {
		font-size: 3rem;
		color: #111;
		padding: 0 1.5rem 1.5rem;
	}
}
</style>
