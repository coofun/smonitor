<template>
<div id="app">
    <div class="header">
        <div class="title-banner"></div>
    </div>
    <div class="horizontal-tab-container">
        <div :class="homeClass" @click="currentView = 'home'">首页</div>
        <div :class="citymapClass" @click="currentView = 'citymap'">地图</div>
    </div>
    <div class="vertical-tab-container">
        <div class="tab-item-selected">
            <div class="tab-item-selected-title">智能电池</div>
        </div>
        <div class="tab-item">
            <div class="tab-item-title">充电柜桩</div>
        </div>
        <div class="tab-item">
            <div class="tab-item-title">换电柜</div>
        </div>
    </div>
    <component :is="currentView" :cities="cities" :currentCity="currentCity || cities[0]" :batteryData="batteryData" @select-city="selectCity"></component>
</div>
</template>

<script>
import { getBatteryData } from '@/api/battery_data.js'

import home from './views/dashboard.vue'
import citymap from './views/city-map.vue'

export default {
  name: 'App',
  components: {
    home,
    citymap
  },
  data() {
    return {
      currentCity: null,
      currentView: 'home',
      cities: [],
      batteryData: []
    }
  },
  methods: {
    selectCity(city) {
      this.currentCity = city
      this.currentView = 'citymap'
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
  },
  computed: {
    homeClass() {
      return this.currentView === 'home'
        ? 'horizontal-tab-item-selected'
        : 'horizontal-tab-item'
    },
    citymapClass() {
      return this.currentView === 'citymap'
        ? 'horizontal-tab-item-selected'
        : 'horizontal-tab-item'
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  background-color: transparent;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    .title-banner {
      background: url(./assets/images/banner.png);
      width: 780px;
      height: 77px;
      margin: auto;
    }
  }
  .horizontal-tab-container {
    position: fixed;
    top: 87px;
    left: 112px;
    height: 40px;
    z-index: 999;
    cursor: pointer;
    .horizontal-tab-item {
      background: url(./assets/images/tab.png) no-repeat;
      width: 145px;
      height: 40px;
      float: left;
      margin-left: -20px;
      color: #d6b469;
      line-height: 40px;
      text-align: center;
      font-size: 24px;
      z-index: 999;
    }
    .horizontal-tab-item-selected {
      background: url(./assets/images/tab_1.png) no-repeat;
      width: 145px;
      height: 40px;
      float: left;
      color: #1d1d1a;
      line-height: 40px;
      text-align: center;
      font-size: 24px;
    }
  }
  .vertical-tab-container {
    position: fixed;
    top: 107px;
    left: 0;
    z-index: 999;
    float: left;
    .tab-item {
      background: url(./assets/images/tab_2.png) no-repeat;
      width: 56px;
      height: 214px;
      &-title {
        color: #d6b469;
        line-height: 24px;
        text-align: center;
        font-size: 20px;
        width: 20px;
        padding-top: 58px;
        padding-left: 15px;
        margin-top: -20px;
      }
    }
    .tab-item-selected {
      background: url(./assets/images/tab_2_1.png) no-repeat;
      width: 56px;
      height: 214px;
      &-title {
        color: #1d1d1a;
        line-height: 24px;
        text-align: center;
        font-size: 20px;
        width: 20px;
        padding-top: 58px;
        padding-left: 15px;
        margin-top: -20px;
      }
    }
  }
}
</style>
