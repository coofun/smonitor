<template>
  <div id="dashboard">
    <div class="neirong">
        <battery-china-map :cities="cities" :batteryData="batteryData"></battery-china-map>
        <div class="tongji">
            <chart-ring></chart-ring>
            <div class="tongji_tit">电池状态统计</div>
            <battery-amount-bar :batteryData="batteryData"></battery-amount-bar>
            <div class="tongji_tit">电池数量统计</div>
            <battery-alarm-line></battery-alarm-line>
            <div class="tongji_tit">电池报警数量</div>
        </div>
    </div>
    <city-list :cities="cities" :current-city="currentCity" @select-city="selectCity"></city-list>
  </div>
</template>

<script>
import BatteryChinaMap from '@/components/battery-china-map.vue'
import ChartRing from '@/components/chart/ring.vue'
import BatteryAmountBar from '@/components/chart/battery-amount-bar.vue'
import BatteryAlarmLine from '@/components/chart/battery-alarm-line.vue'
import CityList from '@/components/city-list.vue'

export default {
  name: 'home',
  props: {
    cities: Array,
    batteryData: Array
  },
  components: {
    BatteryChinaMap,
    ChartRing,
    BatteryAmountBar,
    BatteryAlarmLine,
    CityList
  },
  data() {
    return {
      currentCity: null
    }
  },
  methods: {
    selectCity(city) {
      this.$emit('select-city', city)
    }
  }
}
</script>

<style lang="scss" scoped>
#dashboard {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  .neirong {
    margin-top: 77px;
    width: 100%;
    height: 100%;
    .tongji {
      position: absolute;
      top: 97px;
      right: 261px;
      width: 560px;
      height: 100%;
      .tongji_tit {
        color: #d6b469;
        font-size: 22px;
        text-align: center;
        width: 560px;
        margin-top: 8px;
      }
    }
  }
}
</style>
