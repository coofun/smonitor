import Vue from 'vue'
import App from './App'
import echarts from 'echarts'
import BaiduMap from 'vue-baidu-map'
import './extends/date.js'
import '@/styles/index.scss'

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
