import Vue from 'vue'
import Element from 'element-ui'
import App from './App'
import echarts from 'echarts'
import BaiduMap from 'vue-baidu-map'

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'

import './extends/date.js'

Vue.use(Element)

Vue.use(BaiduMap, {
  ak: 'nZYfEpsS72XnqVpdQBzREXzvSE9FxYyD'
})
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

/* eslint-disable no-new */
Promise.all([]).then(function(data) {
  new Vue({
    el: '#app',
    components: { App },
    template: '<App/>'
  })
})
