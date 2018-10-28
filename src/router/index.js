import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/battery'
    },
    {
      path: '/battery',
      redirect: '/battery/index.html'
    },
    {
      path: '/battery/index.html',
      component: () => import('@/views/battery/index.vue')
    },
    {
      path: '/battery/map/:city',
      component: () => import('@/views/battery/map.vue')
    },
    {
      path: '/charging-pile',
      component: () => import('@/views/charging-pile/index.vue')
    },
    {
      path: '/charging-pile/map/:city',
      component: () => import('@/views/charging-pile/map.vue')
    },
    {
      path: '/store',
      component: () => import('@/views/store/index.vue')
    },
    {
      path: '/store/map/:city',
      component: () => import('@/views/store/map.vue')
    }
  ]
})
