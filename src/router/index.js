import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

const Home = () => import('@/views/home/Home')
const Library = () => import('@/views/library/Library')
const Recommend = () => import('@/views/recommend/Recommend')
const Login = () => import('@/views/login/Login')
const User = () => import('@/views/user/User')
const ListDetail = () => import('@/views/listDetail/ListDetail')
const Browse = () => import('@/views/browse/Browse')
const MoreList = () => import('@/views/browse/moreList/MoreList')
const MoreListDetail = () =>
	import('@/views/browse/moreList/moreListDetail/MoreListDetail')
const MoreSongs = () => import('@/views/browse/moreSongs/MoreSongs')
const MoreRank = () => import('@/views/browse/moreRank/MoreRank')
const Artist = () => import('@/views/artist/Artist')
const ArtistAlbums = () => import('@/views/artist/artistAlbums/ArtistAlbums')
const Comment = () => import('@/views/comment/Comment')
const Search = () => import('@/views/search/Search')
const MV = () => import('@/views/mv/MV')
Vue.use(VueRouter)

const routes = [
	{
		path: '',
		redirect: '/login',
	},
	{
		name: 'Home',
		path: '/home',
		component: Home,
		children: [
			{
				name: 'Login',
				path: '/login',
				component: Login,
			},
			{
				name: 'User',
				path: '/user',
				component: User,
			},
			{
				name: 'Library',
				path: '/library',
				component: Library,
			},
			{
				name: 'Recommend',
				path: '/recommend',
				component: Recommend,
			},

			{
				name: 'ListDetail',
				path: '/listdetail/:id',
				component: ListDetail,
			},
			{
				name: 'Browse',
				path: '/browse',
				component: Browse,
			},
			{
				name: 'MoreList',
				path: '/morelist',
				component: MoreList,
			},
			{
				name: 'MoreListDetail',
				path: '/mldetail/:title',
				component: MoreListDetail,
			},
			{
				name: 'MoreSongs',
				path: '/moresongs',
				component: MoreSongs,
			},
			{
				name: 'MoreRank',
				path: '/morerank',
				component: MoreRank,
			},
			{
				name: 'Artist',
				path: '/artist/:id',
				component: Artist,
			},
			{
				name: 'ArtistAlbums',
				path: '/artist/ablums/:id',
				component: ArtistAlbums,
			},
			{
				name: 'Comment',
				path: '/comment/:type/:id',
				component: Comment,
			},
			{
				name: 'Search',
				path: '/search',
				component: Search,
			},
			{
				name: 'MV',
				path: '/mv',
				component: MV,
			},
		],
	},
]

const router = new VueRouter({
	routes,
})

router.beforeEach((to, from, next) => {
	if (store.state.loading) {
		store.commit('endLoading')
	}

	next()
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}
export default router
