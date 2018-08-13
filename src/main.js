import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from 'echarts'

import '@/styles/index.scss' // global css

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

/* eslint-disable no-extend-native */
Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}
Date.prototype.getSomeDay = function(offset) {
  this.setTime(this.getTime() + 1000 * 60 * 60 * 24 * offset)

  return this
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
