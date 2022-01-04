import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'

import Staffs from '../components/User/Staffs.vue'
import Customers from '../components/User/Customers.vue'

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
    { path: '/admin/customers', component: Customers }
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
