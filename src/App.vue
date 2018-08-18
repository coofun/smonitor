<template>
<div id="app">
    <div class="banner"></div>
    <div class="tab">
        <div class="home" @click="currentView = 'home'">首页</div>
        <div class="map" @click="currentView = 'citymap'">地图</div>
    </div>
    <component :is="currentView" :cities="cities" :batteryData="batteryData"></component>
</div>
</template>

<script>
import { getBatteryData } from '@/api/battery_data.js'

import home from './views/dashboard.vue'
import citymap from './views/city-map.vue'

export default {
  name: 'App',
  components: { home, citymap },
  data() {
    return {
      currentView: 'home',
      cities: [],
      batteryData: []
    }
  },
  mounted() {
    let cities = (this.cities = [])
    let batteryData = (this.batteryData = [])
    getBatteryData().then(function(resp) {
      if (resp && resp.status === 200 && resp.data) {
        resp.data.forEach(function(item) {
          if (item.city) {
            cities.push(item.city)
            batteryData.push({
              city: item.city,
              total: item.total,
              shunt: item.shunt,
              charging: item.charging,
              discharge: item.discharge,
              unkonwn: item.unknown
            })
          }
        })
      }
    })
  }
}
</script>

<style scoped>
#app {
  background-color: transparent;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
