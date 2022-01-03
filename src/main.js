import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
// import icon font
import './assets/fonts/iconfont.css'

// config axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:3000/'

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
