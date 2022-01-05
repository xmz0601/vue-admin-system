import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
// import icon font
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
// import rich text editor
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// config axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:3000/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

// time filter
Vue.filter('dateFormat', function(val) {
  return val.split('T')[0]
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
