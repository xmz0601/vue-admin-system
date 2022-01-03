import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/admin',
  redirect: '/admin/login'
}, {
  path: '/admin/login',
  component: Login
}, {
  path: '/admin/home',
  component: Home
}]

const router = new VueRouter({
  routes
})

export default router
