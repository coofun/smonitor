<template>
<div class="city-map-container">
    <baidu-map class="map" :center="center" :zoom="zoom" :mapStyle="mapStyle" :scroll-wheel-zoom="true" @ready="mapReady">
        <bm-marker v-for="point of points" :key="point.battery.city" :position="point" :icon="{url: 'static/images/point.png', size: {width: 30, height: 30}}" @click="battery=point.battery">
        </bm-marker>
    </baidu-map>
    <div :model="battery" v-if="battery != null" class="popup">
        <i class="el-icon-close" @click="clearBattery"></i>
        <div class="popup-title">{{ battery.zdid }}电池</div>
        <div class="popup-status">
            <div class="popup-status-alarm">一级报警</div>
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
            <div class="popup-info-item">电池编号<br> {{ battery.batchNo }} </div>
            <div class="popup-info-item">电池节数<br> {{ battery.zdjs }}节 </div>
        </div>
        <div class="popup-time">
            <el-row>
                <el-col :span="6">
                    <strong>请选择回放时间</strong>
                </el-col>
                <el-col :span="18">
                    <el-button-group>
                        <el-button type="warning" @click="replayRecentOneHour">前一小时</el-button>
                        <el-button type="warning" @click="replayToday">今天</el-button>
                        <el-button type="warning" @click="replayYestoday">昨天</el-button>
                        <el-button type="warning" @click="replayDayBeforYestoday">前天</el-button>
                    </el-button-group>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    &nbsp;
                </el-col>
                <el-col :span="18">
                    <el-date-picker v-model="replayDate" type="date" placeholder="选择日期">
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
      replayDate: null,
      trackList: [],
      pause: false,
      index: 0,
      timer: null
    }
  },
  methods: {
    mapReady(event) {
      this.BMap = event.BMap
      this.map = event.map
    },
    clearBattery() {
      this.battery = null
    },
    replayRecentOneHour() {
      let oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000)
      let start = oneHourAgo.format('yyyy-MM-dd hh:mm:ss')
      let end = new Date().format('yyyy-MM-dd hh:mm:ss')
      this.replay(start, end)
    },
    replayToday() {
      let start = new Date().format('yyyy-MM-dd 00:00:00')
      let end = new Date().format('yyyy-MM-dd 23:59:59')
      this.replay(start, end)
    },
    replayYestoday() {
      let yestoday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      let start = yestoday.format('yyyy-MM-dd 00:00:00')
      let end = yestoday.format('yyyy-MM-dd 23:59:59')
      this.replay(start, end)
    },
    replayDayBeforYestoday() {
      let currntTime = new Date().getTime()
      let dayBeforYestoday = new Date(currntTime - 2 * 24 * 60 * 60 * 1000)
      let start = dayBeforYestoday.format('yyyy-MM-dd 00:00:00')
      let end = dayBeforYestoday.format('yyyy-MM-dd 23:59:59')
      this.replay(start, end)
    },
    replay(startTime, endTime) {
      this.loadBatteryTrack(startTime, endTime)
    },
    loadBatteryTrack(startTime, endTime) {
      let trackList = (this.trackList = [])
      let play = this.play
      getBatteryTrackByParams(this.battery.zdid, startTime, endTime).then(
        resp => {
          if (resp && resp.status === 200 && resp.data) {
            resp.data.forEach(item => {
              trackList.push(item)
            })
            play.call()
          }
        }
      )
    },
    play() {
      if (this.pause || !this.trackList || !this.trackList.length) {
        return
      }

      if (this.index < this.trackList.length) {
        // eslint-disable-next-line
        let point = new this.BMap.Point(
          this.trackList[0].x,
          this.trackList[0].y
        )
        let prePoint = null
        if (this.index > 0) {
          // eslint-disable-next-line
          prePoint = new BMap.Point(
            this.trackList[this.index - 1].x,
            this.trackList[this.index - 1].y
          )
        }

        let marker = null

        if (this.index === 0) {
          // this.map.clearOverlays()
          // eslint-disable-next-line
          marker = new this.BMap.Marker(point, {
            icon: this.iconStart
          })
          this.timer = setTimeout(() => {
            this.play()
          }, 500)
        } else if (this.index === this.trackList - 1) {
          // eslint-disable-next-line
          marker = new BMap.Marker(point, { icon: this.iconEnd })

          window.clearInterval(this.timer)
          this.timer = null
        } else {
          this.map.addOverlay(
            // eslint-disable-next-line
            new BMap.Polyline([prePoint, point], {
              strokeColor: 'red',
              strokeWeight: 5,
              strokeOpacity: 0.5
            })
          )
        }
        if (marker) {
          this.map.addOverlay(marker)
        }
        this.map.centerAndZoom(point, 16)

        if (!this.map.getBounds().containsPoint(point)) {
          this.map.panTo(point)
        }

        this.index++
      } else {
        this.pause = true
      }
    }
  },
  mounted() {
    let points = (this.points = [])
    getBatteryDataByCity(this.currentCity).then(resp => {
      if (resp && resp.status === 200 && resp.data) {
        resp.data.forEach(element => {
          points.push({
            lng: element.jd,
            lat: element.wd,
            battery: element
          })
        })
      }
    })
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
      padding-left: 5px;
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
