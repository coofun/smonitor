import Vue from 'vue'

import 'normalize.css/normalize.css'

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'

import './extends/date.js'

import Element from 'element-ui'
import App from './App'
import router from './router'

Vue.use(Element)

Vue.prototype.$user = {}

let user = localStorage.getItem('user')

if (user) {
  Object.assign(Vue.prototype.$user, JSON.parse(user))
}

Vue.config.productionTip = true

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
