import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/Welcome.vue'
import users from '../components/user/users.vue'
import roles from '../components/power/roles.vue'
import rights from '../components/power/rights.vue'
import goodsCate from '../components/goods/goods_cate.vue'
import goodsParams from '../components/goods/goods_params.vue'
import goods from '../components/goods/goods.vue'
import add from '../components/goods/add.vue'
import order from '../components/order/order.vue'
import report from '../components/report/report.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: welcome },
        { path: '/users', component: users },
        { path: '/rights', component: rights },
        { path: '/roles', component: roles },
        { path: '/categories', component: goodsCate },
        { path: '/params', component: goodsParams },
        { path: '/goods', component: goods },
        { path: '/goods/add', component: add },
        { path: '/orders', component: order },
        { path: '/reports', component: report }
      ]
    }
  ]
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 请求来自于
  // next 函数：放行  1、next（） 2、next（’/home')
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
