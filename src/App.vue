<template>
<div id="app">
    <div class="banner"></div>
    <div class="tab">
        <div class="home">首页</div>
        <div class="map">地图</div>
    </div>
    <div class="neirong">
        <tab-vertical></tab-vertical>
        <battery-china-map></battery-china-map>
        <div class="tongji">
            <chart-ring :city-list="cityList" :current-city="currentCity"></chart-ring>
            <div class="tongji_tit">电池状态统计</div>
            <battery-amount-bar :city-list="cityList"></battery-amount-bar>
            <div class="tongji_tit">全国各省份电池数量统计</div>
            <battery-alarm-line :current-city="currentCity"></battery-alarm-line>
            <div class="tongji_tit">电池报警数量</div>
        </div>
    </div>
    <city-list :city-list="cityList" :current-city="currentCity" @select-city="selectCity"></city-list>
    <router-view/>
</div>
</template>

<script>
import { getBatteryData } from '@/api/battery_data.js'
import TabVertical from '@/components/tab-vertical.vue'
import BatteryChinaMap from '@/components/battery-china-map.vue'
import ChartRing from '@/components/chart/ring.vue'
import BatteryAmountBar from '@/components/chart/battery-amount-bar.vue'
import BatteryAlarmLine from '@/components/chart/battery-alarm-line.vue'
import CityList from '@/components/city-list.vue'

export default {
  name: 'App',
  components: {
    TabVertical,
    BatteryChinaMap,
    ChartRing,
    BatteryAmountBar,
    BatteryAlarmLine,
    CityList
  },
  data() {
    return {
      cityList: [],
      currentCity: null
    }
  },
  methods: {
    selectCity(city) {
      this.currentCity = city
    }
  },
  mounted() {
    getBatteryData().then(response => {
      if (response.data && response.data.length > 0) {
        this.cityList = response.data
        this.currentCity = response.data[0]
      }
    })

    this.$on('select-city')
  }
}
</script>

<style scoped>
#app {
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
