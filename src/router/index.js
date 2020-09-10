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
const MoreList = () => import('@/views/moreList/MoreList')
const MoreListDetail = () =>
	import('@/views/moreList/moreListDetail/MoreListDetail')
const MoreSongs = () => import('@/views/browse/moreSongs/MoreSongs')
const MoreRank = () => import('@/views/browse/moreRank/MoreRank')
const Artist = () => import('@/views/artist/Artist')
const Comment = () => import('@/views/comment/Comment')
const Search = () => import('@/views/search/Search')
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
				path: '/listdetail',
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
				path: '/mldetail',
				component: MoreListDetail,
				props: true,
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
				path: '/artist',
				component: Artist,
			},
			{
				name: 'Comment',
				path: '/comment/:id',
				component: Comment,
			},
			{
				name: 'Search',
				path: '/search',
				component: Search,
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
