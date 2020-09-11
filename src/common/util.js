import { getSong_ } from '@/network/content'
import { getMVUrl_ } from '@/network/mv'

export function debounce(func, delay) {
	let timer = null
	return (...args) => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			func.apply(this, args)
		}, delay)
	}
}

export async function filterList(list, listId, listName) {
	let { data } = await getSong_(list.map(v => (v = v.id)).join(','))
	return list.map(item => {
		return {
			id: item.id,
			name: item.name,
			ar: item.ar,
			al: item.al,
			url: data.find(v => v.id == item.id).url,
			listId: listId ? listId : null,
			listName: listName ? listName : null,
		}
	})
}

//歌单过滤
export function filterList2(list) {
	return list.map(v => {
		return {
			name: v.name,
			creator: v.creator.nickname,
			picUrl: v.picUrl ? v.picUrl : v.coverImgUrl,
			desc: v.copywriter || v.description,
			id: v.id,
		}
	})
}

export async function filterList3(list) {
	let { data } = await getSong_(list.map(v => (v = v.id)).join(','))
	return list.map(item => {
		return {
			id: item.id,
			name: item.name,
			ar: item.artists,
			al: item.album,
			url: data.find(v => v.id == item.id).url,
		}
	})
}

export function filterList4(list) {
	return list.map(v => {
		return {
			creator: new Date(v.publishTime).getFullYear(), // 第二个标题
			name: v.name,
			picUrl: v.picUrl,
			id: v.id,
		}
	})
}

export async function filterListFM(list) {
	let { data } = await getSong_(list.map(v => (v = v.id)).join(','))
	return list.map(item => {
		return {
			id: item.id,
			name: item.name,
			ar: item.artists,
			al: item.album,
			url: data.find(v => v.id == item.id).url,
			FMMode: true,
		}
	})
}

export async function filterListMV(list) {
	return await Promise.all(
		list.map(async v => {
			let { data } = await getMVUrl_(v.id)
			return {
				id: v.id,
				name: v.name,
				picUrl: v.cover || v.imgurl,
				ar: v.artists || [v.artist],
				al: {
					picUrl: v.cover || v.imgurl,
				},
				url: data.url,
				mv: true,
			}
		})
	).then(res => {
		return res.filter(v => v.url)
	})
}
