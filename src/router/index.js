import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'

import Staffs from '../components/User/Staffs.vue'
import Customers from '../components/User/Customers.vue'
import Cate from '../components/Category/Cate.vue'
import Goods from '../components/Goods/List.vue'
import AddGoods from '../components/Goods/Add.vue'
import EditGoods from '../components/Goods/Edit.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/admin',
  redirect: '/admin/login'
}, {
  path: '/admin/login',
  component: Login
}, {
  path: '/admin/home',
  redirect: '/admin/welcome',
  component: Home,
  children: [
    { path: '/admin/welcome', component: Welcome },
    { path: '/admin/staffs', component: Staffs },
    { path: '/admin/customers', component: Customers },
    { path: '/admin/categories', component: Cate },
    { path: '/admin/goods', component: Goods },
    { path: '/admin/goods/add', component: AddGoods },
    { path: '/admin/goods/edit/:gid', component: EditGoods }
  ]
}]

const router = new VueRouter({
  routes
})

// mount a nav guard
router.beforeEach((to, from, next) => {
  if (to.path === '/admin/login') {
    return next()
  }
  var tokenStr = window.sessionStorage.getItem('token')
  if (tokenStr) {
    return next()
  }
  next('/admin/login')
})

export default router
