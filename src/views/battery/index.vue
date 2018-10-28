<template>
<div class="home">
    <chart-china-map :batteryData="batteryData"></chart-china-map>
    <div class="statistics-wrapper">
        <ChartRing></ChartRing>
        <div class="statistics-item-title">电池状态统计</div>
        <ChartBar :batteryData="batteryData"></ChartBar>
        <div class="statistics-item-title">电池数量统计</div>
        <ChartLine></ChartLine>
        <div class="statistics-item-title">电池报警数量</div>
    </div>
    <div class="right_menu">
        <div class="right_menu_tit"></div>
        <div class="diquliebiao">
            <ul>
                <router-link v-for="item in batteryData" :key="item.city" :to="'/battery/map/' + item.city">
                    <li @click="selectCity(item.city)">
                        <img src="@/assets/images/yuan.png">{{item.city}}
                    </li>
                </router-link>
            </ul>
        </div>
    </div>
</div>
</template>

<script>
import { getBatteryData, geoCoordMap } from '@/data'

import ChartChinaMap from '@/components/charts/chart-china-map'
import ChartRing from '@/components/charts/chart-ring'
import ChartBar from '@/components/charts/chart-bar'
import ChartLine from '@/components/charts/chart-line'

export default {
  components: {
    ChartChinaMap,
    ChartRing,
    ChartBar,
    ChartLine
  },
  data() {
    return {
      batteryData: []
    }
  },
  computed: {
    cities() {
      let cities = []
      this.batteryData.forEach(function(item) {
        cities.push(item.city)
      })
      return cities
    }
  },
  mounted() {
    let _this = this
    getBatteryData().then(function(result) {
      if (result) {
        result.sort(function(a, b) {
          return b.total - a.total
        })

        _this.$emit('init-city', result[0] ? result[0].city : '')

        result.forEach(function(item) {
          if (!item.city) {
            result.splice(result.indexOf(item), 1)
          } else {
            item.value = geoCoordMap[_this.getCityName(item.city)]
          }
        })
        _this.batteryData.splice(0, _this.batteryData.length)
        _this.batteryData.push(...result)
      }
    })
  },
  methods: {
    getCityName(city) {
      if (city) {
        return city.endsWith('市') ? city.substring(0, city.length - 1) : city
      }
    },
    selectCity(city) {
      this.$emit('switch-city', city)
    }
  }
}
</script>

<style lang="scss">
.home {
  position: relative;
  width: calc(100% - 600px);
  height: calc(100% - 77px);
  padding-top: 77px;
  padding-right: 600px;
  float: left;

  .statistics-wrapper {
    background-color: transparent;
    position: absolute;
    top: 127px;
    right: 261px;
    z-index: 999;

    .statistics-item-title {
      color: #d6b469;
      font-size: 22px;
      text-align: center;
      width: 390px;
      margin-top: 5px;
      margin-bottom: 10px;
      padding-left: 105px;
    }
  }

  .right_menu {
    position: absolute;
    top: 0;
    right: 0;
    background: url(../../assets/images/Rectangle22.png);
    width: 261px;
    height: 100%;
    z-index: 9999;

    .right_menu_tit {
      background: url(../../assets/images/right_menu_tit.png);
      width: 231px;
      height: 48px;
      margin-left: 30px;
    }

    .diquliebiao {
      ul {
        padding: 0px;

        li {
          list-style-type: none;
          color: #d6b469;
          font-size: 20px;
          width: 261px;
          height: 56px;
          margin-bottom: 20px;
          line-height: 56px;

          img {
            margin-right: 30px;
            vertical-align: middle;
            margin-left: 80px;
          }

          &:hover {
            list-style-type: none;
            color: #2b281c;
            font-size: 20px;
            background: url(../../assets/images/right_menu_bg.png) no-repeat;
            width: 261px;
            line-height: 56px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
