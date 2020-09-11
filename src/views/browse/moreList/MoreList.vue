<template>
	<div class="morelist">
		<div class="list">
			<h2>歌单类型</h2>
			<p
				v-for="list in list"
				:key="list.id"
				class="my"
				@click="listClick(list.name)"
			>
				{{ list.name }}
			</p>
		</div>
	</div>
</template>

<script>
import { getHotList_ } from '@/network/content'
import MoreListDetail from '@/views/browse/moreList/moreListDetail/MoreListDetail'
export default {
	name: 'MoreList',
	components: {
		MoreListDetail,
	},
	props: {},
	data() {
		return {
			list: [],
			show: false,
		}
	},
	computed: {},
	created() {
		getHotList_().then(({ tags }) => {
			this.list = tags.map(v => {
				return {
					id: v.id,
					name: v.name,
				}
			})
		})
	},
	mounted() {
		this.$nextTick(_ => {
			this.$emit('refresh')
		})
	},
	methods: {
		listClick(title) {
			this.$router.push({
				name: 'MoreListDetail',
				params: { title },
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.morelist {
	box-sizing: border-box;
	padding: 0 1.5rem;
	.list {
		h2 {
			font-size: 2.5rem;
			color: #333;
			border-bottom: 1px solid #8a898e52;
			padding-bottom: 1rem;
		}
		.my {
			color: #ff2c55;
			font-size: 1.5rem;
			line-height: 2.5rem;
			padding: 1rem 0;
			border-bottom: 1px solid #8a898e4f;
		}
	}
}
</style>
