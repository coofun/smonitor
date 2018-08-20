<template>
<div class="city-map-container">
    <baidu-map class="map" :center="center" :zoom="zoom" :mapStyle="mapStyle" :scroll-wheel-zoom="true" @ready="ready">
        <bm-marker v-for="point of points" :key="point.battery.city" :position="point" :icon="{url: 'static/images/point.png', size: {width: 30, height: 30}}" @click="battery=point.battery">
        </bm-marker>
    </baidu-map>
    <div v-if="battery != null" class="popup">
        <i class="el-icon-close" @click="clearBattery"></i>
        <div class="popup-title">{{ battery.batchNo }}</div>
        <div class="popup-status">
            <div class="popup-status-charging">放电</div>
        </div>
        <div class="popup-data">
            <div class="popup-data-item"><span class="num">{{ battery.soc }}</span>%<br> 电量
            </div>
            <div class="popup-data-item"><span class="num">{{ battery.zdy }}</span>V<br> 总电压
            </div>
            <div class="popup-data-item"><span class="num">{{ battery.zdl }}</span>A<br> 总电流
            </div>
            <div class="popup-data-item"><span class="num">{{ battery.wdmin }}</span>℃～<span class="num">{{ battery.wdmax }}</span>℃<br> 温度
            </div>
        </div>
        <div class="popup-info">
            <div class="popup-info-item">服务器时间<br> {{ formattedTime }} </div>
            <div class="popup-info-item">电池编号<br> {{ battery.zdid }} </div>
            <div class="popup-info-item">电池节数<br> {{ battery.zdjs }}节 </div>
        </div>
        <div class="popup-time">
            <el-row>
                <el-col :span="6">
                    <strong>请选择回放时间</strong>
                </el-col>
                <el-col :span="18">
                    <el-button-group>
                        <el-button type="warning" @click="trackRecentOneHour">前一小时</el-button>
                        <el-button type="warning" @click="trackToday">今天</el-button>
                        <el-button type="warning" @click="trackYestoday">昨天</el-button>
                        <el-button type="warning" @click="trackDayBeforYestoday">前天</el-button>
                    </el-button-group>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    &nbsp;
                </el-col>
                <el-col :span="18">
                    <el-date-picker v-model="trackDay" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-col>
            </el-row>
        </div>
    </div>
</div>
</template>

<script>
import {
  getBatteryDataByCity,
  getBatteryTrackByParams
} from '@/api/battery_data.js'
export default {
  name: 'city-map',
  props: {
    currentCity: String
  },
  data() {
    return {
      BMap: null,
      map: null,
      battery: null,
      zoom: 15,
      mapStyle: {
        features: ['point', 'road', 'water', 'land', 'building'],
        style: 'dark'
      },
      points: [],
      trackDay: null,
      trackPointList: [],
      trackPointIndex: 0,
      trackOverLayers: [],
      trackTimer: null
    }
  },
  methods: {
    ready(event) {
      let _self = this

      _self.BMap = event.BMap
      _self.map = event.map

      getBatteryDataByCity(this.currentCity).then(resp => {
        if (resp && resp.status === 200 && resp.data) {
          resp.data.forEach(element => {
            _self.points.push({
              lng: element.jd,
              lat: element.wd,
              battery: element
            })
          })
        }
      })
    },
    clearBattery() {
      let _self = this
      _self.battery = null
      _self.resetTrack()
      _self.map.reset()
    },
    trackRecentOneHour() {
      let oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000)
      let start = oneHourAgo.format('yyyy-MM-dd hh:mm:ss')
      let end = new Date().format('yyyy-MM-dd hh:mm:ss')
      this.replay(start, end)
    },
    trackToday() {
      let start = new Date().format('yyyy-MM-dd 00:00:00')
      let end = new Date().format('yyyy-MM-dd 23:59:59')
      this.replay(start, end)
    },
    trackYestoday() {
      let yestoday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      let start = yestoday.format('yyyy-MM-dd 00:00:00')
      let end = yestoday.format('yyyy-MM-dd 23:59:59')
      this.replay(start, end)
    },
    trackDayBeforYestoday() {
      let currntTime = new Date().getTime()
      let dayBeforYestoday = new Date(currntTime - 2 * 24 * 60 * 60 * 1000)
      let start = dayBeforYestoday.format('yyyy-MM-dd 00:00:00')
      let end = dayBeforYestoday.format('yyyy-MM-dd 23:59:59')
      this.replay(start, end)
    },
    replay(startTime, endTime) {
      let _self = this
      _self.resetTrack()
      getBatteryTrackByParams(this.battery.zdid, startTime, endTime).then(
        resp => {
          if (resp && resp.status === 200 && resp.data) {
            resp.data.forEach(item => {
              _self.trackPointList.push(item)
            })
            _self.play.call()
          }
        }
      )
    },
    play() {
      let _self = this
      if (!_self.trackPointList || !_self.trackPointList.length) {
        return
      }

      let point = new _self.BMap.Point(
        _self.trackPointList[_self.trackPointIndex].x,
        _self.trackPointList[_self.trackPointIndex].y
      )
      let prePoint = _self.trackPointIndex > 0 ? new _self.BMap.Point(_self.trackPointList[_self.trackPointIndex - 1].x, _self.trackPointList[_self.trackPointIndex - 1].y) : null

      if (_self.trackPointIndex === 0) {
        let startMarker = new _self.BMap.Marker(point)
        _self.map.addOverlay(startMarker)
        _self.trackOverLayers.push(startMarker)
      }

      if (prePoint) {
        let overlay = new _self.BMap.Polyline([prePoint, point], {
          strokeColor: 'red',
          strokeWeight: 5,
          strokeOpacity: 0.5
        })
        _self.map.addOverlay(overlay)
        _self.trackOverLayers.push(overlay)
      }

      if (_self.trackPointIndex === _self.trackPointList.length - 1) {
        let endMarker = new _self.BMap.Marker(point)
        _self.map.addOverlay(endMarker)
        _self.trackOverLayers.push(endMarker)
      }

      if (_self.trackPointIndex < _self.trackPointList.length - 1) {
        _self.trackTimer = setTimeout(() => {
          _self.play()
        }, 500)
      } else {
        window.clearInterval(_self.trackTimer)
        _self.trackTimer = null
      }

      _self.map.centerAndZoom(point, 15)
      _self.map.panTo(point)
      _self.trackPointIndex++
    },
    resetTrack() {
      let _self = this
      if (_self.trackTimer) {
        window.clearInterval(_self.trackTimer)
      }

      _self.trackTimer = null
      _self.trackPointIndex = 0

      while (_self.trackPointList.length > 0) {
        _self.trackPointList.pop()
      }

      while (_self.trackOverLayers.length > 0) {
        _self.map.removeOverlay(_self.trackOverLayers.pop())
      }
    }
  },
  computed: {
    center() {
      return this.currentCity
    },
    formattedTime() {
      let date = new Date()
      date.setTime(this.battery.jssj.time)
      return date.format('yyyy-MM-dd hh:mm:ss')
    }
  },
  watch: {
    trackDay(date) {
      this.resetTrack()
      if (date) {
        let start = date.format('yyyy-MM-dd 00:00:00')
        let end = date.format('yyyy-MM-dd 23:59:59')
        this.replay(start, end)
      }
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
    .el-icon-close {
      position: absolute;
      top: 5px;
      right: 5px;
      color: #ffaf3d;
    }
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
      margin-top: 220px;
      padding-left: 20px;
      color: #fff;
      vertical-align: center;
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
      margin-top: 150px;
      text-align: center;
      padding-left: 80px;
      &-item {
        color: #fff;
        text-align: center;
        height: 38px;
        float: left;
        margin-left: 10px;
        margin-right: 10px;
      }
    }
  }
}
</style>

<style>
.el-button--warning {
  color: #fff;
  background-color: transparent;
  border-color: #d6b469;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 180px;
}

.el-input--prefix .el-input__inner {
  color: #fff;
  margin-top: 8px;
  background-color: transparent;
  border-color: #d6b469;
}
</style>
