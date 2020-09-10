export const refresh = {
	data() {
		return {
			scrollTimer: null,
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
}
