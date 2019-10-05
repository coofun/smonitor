import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      redirect: '/battery'
    },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/battery',
      component: () => import('@/views/battery/index.vue'),
      meta: {
        requireLogin: true
      }
    },
    {
      path: '/battery/map/:city',
      component: () => import('@/views/battery/map.vue'),
      meta: {
        requireLogin: true
      }
    },
    {
      path: '/charging-pile',
      component: () => import('@/views/charging-pile/index.vue'),
      meta: {
        requireLogin: true
      }
    },
    {
      path: '/charging-pile/map/:city',
      component: () => import('@/views/charging-pile/map.vue'),
      meta: {
        requireLogin: true
      }
    },
    {
      path: '/exchange',
      component: () => import('@/views/exchange/index.vue'),
      meta: {
        requireLogin: true
      }
    },
    {
      path: '/exchange/map/:city',
      component: () => import('@/views/exchange/map.vue'),
      meta: {
        requireLogin: true
      }
    },    
    {
      path: '/store',
      component: () => import('@/views/store/index.vue'),
      meta: {
        requireLogin: true
      }
    },
    {
      path: '/store/map/:city',
      component: () => import('@/views/store/map.vue'),
      meta: {
        requireLogin: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(route => route.meta.requireLogin)) {
    let user = localStorage.getItem("user")

    if (!user) {
        next({
            path: '/login',
            query: {
                redirect: to.fullPath
            }
        })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router