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
import Report from '../components/Data/Report.vue'

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
    { path: '/admin/goods/edit/:gid', component: EditGoods },
    { path: '/admin/reports', component: Report }
  ]
}]

const router = new VueRouter({
  routes
})

// mount a nav guard
const jwt = require('jsonwebtoken')
router.beforeEach((to, from, next) => {
  var tokenStr = window.sessionStorage.getItem('token')
  if (to.path === '/admin/login') {
    // check if this user has logined
    if (!tokenStr) return next()
    // verify token
    jwt.verify(tokenStr, 'secretkey', function(err, decoded) {
      if (err) return next()
      return next('/admin/home')
    })
  }

  if (!tokenStr) return next('/admin/login')
  // verify token
  jwt.verify(tokenStr, 'secretkey', function(err, decoded) {
    if (err) return next('/admin/login')
    return next()
  })
})

export default router
