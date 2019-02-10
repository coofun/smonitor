<template>
<div id="app">
    <AppHeader :currentTab="menu" :currentPage="page" :currentCity="city"></AppHeader>
    <LeftSideTab :currentPage="page"></LeftSideTab>
    <router-view @init-city="initCity" />
</div>
</template>

<script>
import AppHeader from './views/header'
import LeftSideTab from './views/left-side-tab'

export default {
    name: 'App',
    components: {
        AppHeader,
        LeftSideTab
    },
    data() {
        return {
            page: 'battery',
            menu: 'Home',
            city: ''
        }
    },
    methods: {
        initCity(city) {
            this.city = this.city ? this.city : city
        }
    },
    watch: {
        $route(to, from, next) {
            let paths = to.path.split('/')

            if (paths.length > 1) {
                this.page = paths[1]
                if (to.path.indexOf('map') > 0) {
                    this.menu = 'Map'
                    this.city = paths[3]
                } else {
                    this.menu = 'Home'
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#app {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
