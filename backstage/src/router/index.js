import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '../components/Index/Index.vue'
import Home from '../components/Home.vue'
import Login from '../components/Index/Login.vue'
import UserInfo from '../components/Info/userInfo.vue'
import CheckerInfo from '../components/Info/checkerInfo.vue'
import AreaInfo from '../components/Area/AreaInfo.vue'
import Map from '../components/Map/Map.vue'
import Baishan from '../components/baishan/baishan.vue'
import Welcome from '../components/Welcome.vue'
import CheckTask from '../components/Task/CheckTask'
import CleanTask from '../components/Task/CleanTask'
import ActivityCheck from '../components/Activity/ActivityCheck.vue'
const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index', component: Index },
  { path: '/login', component: Login },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      {
        path: '/userInfo',
        component: UserInfo
      },
      {
        path: '/checkerInfo',
        component: CheckerInfo
      },
      {
        path: '/areaInfo',
        component: AreaInfo
      },
      { path: '/checkTask', component: CheckTask },
      { path: '/cleanTask', component: CleanTask },
      { path:'/activityCheck', component: ActivityCheck}
    ],

  },
  { path: '/map', component: Map },
  { path: '/baishan', component: Baishan }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' || to.path !== '/home') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (to.path === '/login' && !tokenStr) return next()
  if (to.path === '/login') {
    if (tokenStr) return next('/home')
  }
  if (!tokenStr) return next('/login')
  next()
})
export default router
