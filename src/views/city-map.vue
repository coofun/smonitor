<template>
<div class="city-map-container">
    <baidu-map class="map" :center="center" :zoom="zoom" :mapStyle="mapStyle">
        <bm-marker v-for="point of points" :key="point" :position="point" :icon="{url: 'static/images/point.png', size: {width: 30, height: 30}}">
        </bm-marker>
    </baidu-map>
    <div class="popup">
        <div class="popup-title">61704006257电池</div>
        <div class="popup-status">
            <div class="popup-status-alarm">一级报警</div>
            <div class="popup-status-charging">放电</div>
        </div>
        <div class="popup-data">
            <div class="popup-data-item"><span class="num">80</span>%<br> 电量
            </div>
            <div class="popup-data-item"><span class="num">37.5</span>V<br> 总电压
            </div>
            <div class="popup-data-item"><span class="num">0</span>A<br> 总电流
            </div>
            <div class="popup-data-item"><span class="num">19</span>℃～<span class="num">20</span>℃<br> 温度
            </div>
        </div>
        <div class="popup-time">
            <div class="popup-time-start">开始时间<br>
                <input type="date" class="popup-time-date">
            </div>
            <div class="popup-time-end">结束时间<br>
                <input type="date" class="popup-time-date">
            </div>
        </div>
        <div class="popup-info">
            <div class="popup-info-item">服务器时间<br> 64752354589 </div>
            <div class="popup-info-item">电池编号<br> 64752354589 </div>
            <div class="popup-info-item">电池节数<br> 64节 </div>
        </div>
    </div>
</div>
</template>

<script>
import { getBatteryDataByCity } from '@/api/battery_data.js'
export default {
  name: 'city-map',
  props: {
    currentCity: String
  },
  data() {
    return {
      zoom: 15,
      mapStyle: {
        features: ['point', 'road', 'water', 'land', 'building'],
        style: 'dark'
      },
      points: []
    }
  },
  mounted() {
    let points = (this.points = [])
    getBatteryDataByCity(this.currentCity).then(resp => {
      if (resp && resp.status === 200 && resp.data) {
        resp.data.forEach(element => {
          points.push({
            lng: element.jd,
            lat: element.wd
          })
        })
      }
    })
  },
  computed: {
    center() {
      return this.currentCity
    }
  }
}
</script>

<style lang="scss" scoped>
.city-map-container {
  background-color: transparent;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  .map {
    background-color: transparent;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
  .popup {
    position: fixed;
    background: url(../assets/images/2_tanchu_bg.png) no-repeat;
    width: 479px;
    height: 364px;
    right: 87px;
    top: 187px;
    &-title {
      color: #fff;
      font-size: 20px;
      text-align: center;
      margin-top: 24px;
    }
    &-status {
      width: 146px;
      margin: auto;
      &-alarm {
        color: #171717;
        width: 64px;
        height: 25px;
        background: #f9fa9e;
        float: right;
        line-height: 25px;
        text-align: center;
        margin-top: 16px;
        margin-right: 10px;
      }
      &-charging {
        color: #ffffff;
        width: 42px;
        height: 25px;
        background: #2a8700;
        float: right;
        line-height: 25px;
        text-align: center;
        margin-top: 16px;
        margin-right: 10px;
      }
    }
    &-data {
      margin-top: 60px;
      text-align: center;
      padding-left: 40px;
      &-item {
        color: #fff;
        text-align: center;
        height: 38px;
        float: left;
        margin-left: 13px;
        margin-right: 13px;
        .num {
          font-size: 36px;
        }
      }
    }
    &-time {
      margin-top: 150px;
      &-start {
        width: 240px;
        color: #fff;
        text-align: center;
        float: left;
      }
      &-end {
        width: 238px;
        color: #fff;
        text-align: center;
        float: left;
      }
      &-date {
        background: none;
        border: solid 1px;
        color: #fff;
        font-size: 14px;
        margin-top: 10px;
        height: 30px;
      }
    }
    &-info {
      margin-top: 240px;
      text-align: center;
      padding-left: 80px;
      &-item {
        color: #fff;
        text-align: center;
        height: 38px;
        float: left;
        margin-left: 13px;
        margin-right: 13px;
      }
    }
  }
}
</style>
