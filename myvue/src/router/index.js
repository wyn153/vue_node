import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'
import store from '@/store'

Vue.use(VueRouter)

const map = {
  '/menu/one': {  path: 'menu/one', component: () => import('@/views/kuli2.vue') },
  '/menu/two': { path: 'menu/two', component: () => import('@/views/kuli.vue') },
  '/menu/three': { path: 'menu/three', component: () => import('@/views/meinv2.vue') },
  '/menu/four': { path: 'menu/four', component: () => import('@/views/meinv.vue') },
  '/menu/five': { path: 'menu/five', component: () => import('@/views/meinv3.vue') }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/menu/one',
    children: [
      
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
]
//前端处理 这个是霸道总裁 你把a1 拼接进去
var a1 = {

}
//中等高管 把a2 拼接进去
var a2 = {

}
//中等高管 把a3 拼接进去  后端处理就是把这三个东西都存在mongodb数据库里面
var a3 = {

}

const router = new VueRouter({
  routes
})
// 动态路由核心技术
export const initDynamicRouter = () => {
  const routes = router.options.routes
  console.log('动态路由核心技术routes',routes)
  const route = routes.find(route => route.name === 'Home')
  console.log('route route.name === Home',route)
  // 拿到后端给的 返回霸道总裁的路由  实际项目中也能写在前端 后端处理居多
  //这是后端返回动态路由的方式   前端动态路由的处理是 已经写好对象在一个一个遍历

  const rights = store.state.user.rights
  rights.forEach(right => {
    right.children.forEach(child => {
      if (map[child.path]) {
        if (!map[child.path].meta) {
          map[child.path].meta = {}
        }
        map[child.path].meta.rights = child.rights
        console.log('map[child.path].meta.rights',map[child.path])
        route.children.push(map[child.path])
        console.log('route整合过',route)
      }
    })
  })
  //重新加入路由  而此时的路由 就是带上了很多 子路由的一个路由了
  router.addRoutes(routes)
}

sessionStorage.getItem('v-user') && initDynamicRouter()

router.beforeEach((to, from, next) => {
  const user = sessionStorage.getItem('v-user') || ''
  const encrp = sessionStorage.getItem('v-encryp') || ''
  if (to.path.toLowerCase() === '/login') {
    user ? next('/') : next()
    return false
  }
  if (!user || !encrp) {
    next({
      path: '/login',
      query: {
        message: '请先登录！',
        time: +new Date()
      }
    })
  } else if (user !== decodeURIComponent(encrp)) {
    next({
      path: '/login',
      query: {
        message: 'token已失效，请重新登录！',
        time: +new Date()
      }
    })
  } else {
    next()
  }
})

const originalPush = VueRouter.prototype.push
// 重写了原型上的push方法，统一的处理了错误信息
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
