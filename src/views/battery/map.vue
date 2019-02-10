<template>
<div class="map-wrapper">
    <div id="map-container"></div>
    <div class="popup" v-if="battery">
        <button type="button" class="icon-close" @click="closePopup">×</button>
        <div class="popup-title">
          {{ battery.batchNo }}<span v-if="batteryStatus"> {{ batteryStatus }}</span>
        </div>
        <div class="popup-subtitle">
            <div class="popup-subtitle-alarm" v-if="battery.alarmDetails && battery.alarmDetails[0]">{{ battery.alarmDetails[0].alarmName }}</div>
            <div class="popup-subtitle-info" v-if="battery.telephone"> {{ battery.telephone }}</div>
            <div class="popup-subtitle-info" v-if="battery.receiver"> {{ battery.receiver }}</div>
            <div class="popup-subtitle-info" v-if="battery.myName"> {{ battery.myName }}</div>
        </div>
        <div class="popup-content">
            <div class="popup-content-item"><span class="popup-content-item-value">{{ battery.soc }}</span>%<br>电量</div>
                <div class="popup-content-item"><span class="popup-content-item-value">{{ battery.zdy }}</span>V<br>总电压</div>
                    <div class="popup-content-item"><span class="popup-content-item-value">{{ battery.zdl }}</span>A<br>总电流</div>
                        <div class="popup-content-item"><span class="popup-content-item-value">{{ battery.wdmin }}</span>℃～<span class="popup-content-item-value">{{ battery.wdmax }}</span>℃<br>温度</div>
                        </div>
                        <div class="popup-info">
                            <div class="popup-info-item">服务器时间<br> {{ serverTime }} </div>
                            <div class="popup-info-item">电池编号<br> {{ battery.zdid }} </div>
                            <div class="popup-info-item">电池节数<br> {{ battery.zdjs }}节 </div>
                        </div>
                        <div class="popup-footer">
                            <el-row>
                                <el-col :span="16">
                                    <el-autocomplete :fetch-suggestions="searchBattery" placeholder="电池条码" @select="selectBattery" icon="el-icon-search">
                                        <i class="el-icon-search el-input__icon" slot="prefix"></i>
                                    </el-autocomplete>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="warning" plain style="background: transparent" @click="showTrackMap=true">回放轨迹</el-button>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <el-dialog :visible.sync="showTrackMap" width="80%" :before-close="closeDialog" @opened="onOpenDialog" @close="onCloseDialog">
                        <el-row>
                            <el-col style="height: auto; position: absolute; left: 20px; top: 20px; z-index: 998">
                                <el-radio-group v-model="trackTime">
                                    <el-radio-button label="recent-one-hour">前一小时</el-radio-button>
                                    <el-radio-button label="today">今天</el-radio-button>
                                    <el-radio-button label="yestoday">昨天</el-radio-button>
                                    <el-radio-button label="day-before-yestoday">前天</el-radio-button>
                                </el-radio-group>
                                <el-date-picker v-model="trackDate" type="date" placeholder="选择日期" style="margin-left: 10px">
                                </el-date-picker>
                                <el-time-picker v-model="trackDateStartTime" placeholder="开始时间" style="margin-left: 10px">
                                </el-time-picker>
                                <el-time-picker arrow-control v-model="trackDateEndTime" placeholder="结束时间" style="margin-left: 10px; margin-right: 50px">
                                </el-time-picker>                                
                                <el-button v-if="canPlay" @click="play">播放</el-button>
                                <el-button v-if="canPause" @click="playPause">暂停</el-button>
                                <el-button v-if="canContinue" @click="playContinue">播放</el-button>
                                <el-button v-if="canReset" @click="playReset">重置</el-button>
                            </el-col>
                        </el-row>
                        <el-row v-if="trackStatus === 'playing' || trackStatus === 'pause' || trackStatus === 'over'" style="height: auto; position: absolute; left: 20px; top: 70px; z-index: 998; color: #ffaf3d; font-size: 14px; width: 100%">
                            <el-col :span="2">
                                速度: {{ speed }}
                            </el-col> 
                            <el-col :span="2">
                                里程: {{ (trackDistance/1000).toFixed(2) }}KM
                            </el-col>                                                    
                            <el-col :span="4">
                                定位时间: {{ locationTime }}
                            </el-col>
                        </el-row>
                        <div id="map-track"></div>
                    </el-dialog>
                    <LoginUserBar style="position: absolute; left: 50px; top: 10px; z-index: 9999"></LoginUserBar>                 
                </div>
</template>

<script>
import { getBatteryDataByCity, getBatteryTrackByParams, login } from '@/data'
import LoginUserBar from '@/views/components/LoginUserBar.vue'

export default {
  components: {
    LoginUserBar
  },  
  data() {
    return {
      city: null,
      map: null,
      icon: null,
      points: [],
      pointsMarked: [],
      markers: [],
      battery: null,
      selectedMarkerPoint: null,
      queryString: null,
      showTrackMap: false,
      trackTime: 'recent-one-hour',
      trackDate: null,
      trackDateStartTime: null,
      trackDateEndTime: null,
      trackStatus: null,
      trackPoints: [],
      trackIndex: 0,
      trackTask: null,
      trackStartIcon: new BMap.Icon('static/images/trace_start.png', new BMap.Size(40, 57)),
      trackEndIcon: new BMap.Icon('static/images/trace_end.png', new BMap.Size(40, 57)),
      trackDistance: 0
    }
  },
  created() {
    this.city = this.$route.params.city
    this.icon = new BMap.Icon('static/images/point.png', new BMap.Size(30, 30))
  },
  mounted() {
    // 创建Map实例
    this.map = new BMap.Map('map-container')

    // 初始化地图,设置中心点坐标和地图级别
    this.map.centerAndZoom(this.city, 15)

    // 设置地图显示的城市
    this.map.setCurrentCity(this.city)

    // 设置地图样式
    this.map.setMapStyle({
      features: ['point', 'road', 'water', 'land', 'building'],
      style: 'dark'
    })

    // 开启鼠标滚轮缩放
    this.map.enableScrollWheelZoom(true)

    // 坐标转换
    this.converter = new BMap.Convertor()

    // 监听地图拖拽事件
    this.map.addEventListener('moveend', this.markPoints)

    // 监听地图放大缩小事件
    this.map.addEventListener('zoomend', this.markPoints)

    // 获取当前城市电池信息, 并初始化
    getBatteryDataByCity(this.city, this.$user.uid, this.$user.team).then(this.init)
  },
  computed: {
    batteryStatus() {
      if (!this.battery || !this.battery.bmszt) {
        return null
      }

      switch (this.battery.bmszt) {
        case '0': {
          return '放置'
        }
        case '1': {
          return '放电'
        }
        case '2': {
          return '充电'
        }
        default: {
          return '未知'
        }
      }
    },
    serverTime() {
      let date = new Date()
      date.setTime(this.battery.jssj.time)
      return date.format('yyyy-MM-dd hh:mm:ss')
    },
    trackTimeZone() {
      if (this.trackTime) {
        switch (this.trackTime) {
          case 'recent-one-hour': {
            let oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000)
            return {
              startTime: oneHourAgo.format('yyyy-MM-dd hh:mm:ss'),
              endTime: new Date().format('yyyy-MM-dd hh:mm:ss')
            }
          }
          case 'today': {
            return {
              startTime: new Date().format('yyyy-MM-dd 00:00:00'),
              endTime: new Date().format('yyyy-MM-dd 23:59:59')
            }
          }
          case 'yestoday': {
            let yestoday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
            return {
              startTime: yestoday.format('yyyy-MM-dd 00:00:00'),
              endTime: yestoday.format('yyyy-MM-dd 23:59:59')
            }
          }
          case 'day-before-yestoday': {
            let dayBeforYestoday = new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
            return {
              startTime: dayBeforYestoday.format('yyyy-MM-dd 00:00:00'),
              endTime: dayBeforYestoday.format('yyyy-MM-dd 23:59:59')
            }
          }
          default: {
            return null
          }
        }
      } else {
        return {
          startTime: this.trackDateStartTime.format('yyyy-MM-dd hh:mm:ss'),
          endTime: this.trackDateEndTime.format('yyyy-MM-dd hh:mm:ss')
        }
      }
    },
    canPlay() {
      return !this.trackStatus
    },
    canPause() {
      return this.trackStatus === 'playing'
    },
    canContinue() {
      return this.trackStatus === 'pause'
    },
    canReset() {
      return this.trackStatus === 'pause' || this.trackStatus === 'over'
    },
    locationTime() {
      if(this.trackPoints && this.trackPoints[this.trackIndex]) {
        return new Date(this.trackPoints[this.trackIndex].jssj.time).format('yyyy-MM-dd hh:mm:ss')
      }
      return ''
    },
    speed() {
      if(this.trackPoints && this.trackPoints[this.trackIndex]) {
        return this.trackPoints[this.trackIndex].speed + " KM/H"
      }
      return ''
    }
  },
  watch: {
    trackTime(newVal, oldVal) {
      if (newVal) {
        this.trackDate = null
        this.trackDateStartTime = null
        this.trackDateEndTime = null
      }
    },
    trackDate(newVal, oldVal) {
      if (newVal) {
        this.trackTime = null

        this.trackDateStartTime = new Date(newVal.getTime())
        this.trackDateStartTime.setHours(0)
        this.trackDateStartTime.setMinutes(0)
        this.trackDateStartTime.setSeconds(0)

        this.trackDateEndTime = new Date(newVal.getTime())
        this.trackDateEndTime.setHours(23)
        this.trackDateEndTime.setMinutes(59)
        this.trackDateEndTime.setSeconds(59)        
      }
    },
    points(newVal, oldVal) {
      this.markPoints()
    },
    battery(newVal, oldVal) {
      if (this.selectedMarker) {
        this.map.removeOverlay(this.selectedMarker)
        this.selectedMarker = null
      }

      if (this.battery && this.selectedMarkerPoint) {
        this.selectedMarker = new BMap.Marker(this.selectedMarkerPoint)
        this.map.addOverlay(this.selectedMarker)
      }
    }
  },
  methods: {
    init(data) {
      let _this = this

      _this.points.splice(0, _this.points.length)

      let points = []

      data.forEach(item => {
        let point = new BMap.Point(item.jd, item.wd)
        point.battery = item
        item.value = item.batchNo

        points.push(point)
      })

      // 批量转换GPS坐标，每次最多转换10个
      while (points.length > 0) {
        let toTrans = points.splice(0, 10)
        if (toTrans && toTrans.length > 0) {
          _this.converter.translate(toTrans, 1, 5, function(data) {
            if (data && data.points) {
              for (let i = 0; i < data.points.length; i++) {
                data.points[i].battery = toTrans[i].battery
              }
              _this.points.push(...data.points)
            }
          })
        }
      }
    },
    markPoints() {
      let _this = this

      // 地图可视区域
      let bounds = _this.map.getBounds()

      _this.points.forEach(item => {
        if (_this.pointsMarked.indexOf(item) === -1 && bounds.containsPoint(item)) {
          let marker = new BMap.Marker(item, {
            icon: _this.icon
          })
          marker.battery = item.battery
          marker.addEventListener('click', _this.onMarkerClick)
          _this.map.addOverlay(marker)
          _this.markers.push(marker)
          _this.pointsMarked.push(item)
        }
      })
    },
    onMarkerClick(event) {
      this.battery = event.target.battery
      this.selectedMarkerPoint = event.target.point
    },
    closePopup() {
      this.battery = null
    },
    searchBattery(queryString, cb) {
      let results = []
      if (queryString) {
        this.markers.forEach(function(marker) {
          if (marker.battery && -1 !== marker.battery.batchNo.indexOf(queryString.toUpperCase())) {
            results.push(marker.battery)
          }
        })
      }
      cb(results)
    },
    selectBattery(battery) {
      this.battery = battery
      let marker = this.markers.find(function(item) {
        return item.battery === battery
      })
      this.selectedMarkerPoint = marker.point
      this.map.panTo(marker.point)
    },
    onOpenDialog() {
      // 创建Map实例
      this.trackMap = new BMap.Map('map-track')

      // 设置地图显示的城市
      this.trackMap.setCurrentCity(this.city)

      //开启鼠标滚轮缩放
      this.trackMap.enableScrollWheelZoom(true)

      // 初始化地图,设置中心点坐标和地图级别
      this.trackMap.centerAndZoom(this.city, 16)

      //设置地图样式
      this.trackMap.setMapStyle({
        features: ['point', 'road', 'water', 'land', 'building'],
        style: 'dark'
      })
    },
    onCloseDialog() {
      if (this.trackMap) {
        this.playReset()
        this.trackMap = null
      }
      this.trackTime = 'recent-one-hour'
    },
    closeDialog(done) {
      done()
    },
    play() {
      this.playReset()

      getBatteryTrackByParams(this.battery.zdid, this.trackTimeZone.startTime, this.trackTimeZone.endTime).then(result => {
        result.forEach(item => {
          this.trackPoints.push(item)
        })
        this.playStart()
      })
    },
    playStart() {
      let _this = this
      _this.trackStatus = 'playing'

      if (!_this.trackPoints || !_this.trackPoints.length || _this.trackIndex >= _this.trackPoints.length) {
        _this.playOver()
        return
      }

      let point = new BMap.Point(_this.trackPoints[_this.trackIndex].x, _this.trackPoints[_this.trackIndex].y)

      if (_this.trackIndex === 0) {
        let startMarker = new BMap.Marker(point, {
          icon: _this.trackStartIcon
        })
        startMarker.setOffset(new BMap.Size(0, -25))
        _this.trackMap.addOverlay(startMarker)
      } else {
        if (_this.lineEnder) {
          _this.trackMap.removeOverlay(_this.lineEnder)
          _this.lineEnder = null
        }
        let prePoint = new BMap.Point(_this.trackPoints[_this.trackIndex - 1].x, _this.trackPoints[_this.trackIndex - 1].y)

        _this.trackDistance += _this.trackMap.getDistance(prePoint, point)

        let polyline = new BMap.Polyline([prePoint, point], {
          strokeColor: 'red',
          strokeWeight: 5,
          strokeOpacity: 1
        })

        _this.trackMap.addOverlay(polyline)

        if (_this.trackIndex === _this.trackPoints.length - 1) {
          let endMarker = new BMap.Marker(point, {
            icon: _this.trackEndIcon
          })
          endMarker.setOffset(new BMap.Size(0, -25))
          _this.trackMap.addOverlay(endMarker)

          _this.playOver()

          return
        } else {
          _this.lineEnder = new BMap.Marker(point)
          _this.trackMap.addOverlay(_this.lineEnder)
        }
      }

      if (!_this.trackMap.getBounds().containsPoint(point)) {
        _this.trackMap.panTo(point)
      }

      _this.trackIndex++

      _this.trackTask = setTimeout(() => {
        _this.playStart()
      }, 500)
    },
    playPause() {
      window.clearInterval(this.trackTask)
      this.trackTask = null
      this.trackStatus = 'pause'
    },
    playContinue() {
      this.playStart()
    },
    playReset() {
      this.playPause()
      this.trackPoints.splice(0, this.trackPoints.length)
      this.trackIndex = 0
      this.trackStatus = null
      this.trackDistance = 0
      this.trackMap.clearOverlays()
    },
    playOver() {
      this.playPause()
      this.trackStatus = 'over'
    }
  }
}
</script>

<style lang="scss" scoped>
.map-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  #map-container {
    width: 100%;
    height: 100%;
  }

  .popup {
    background: url(../../assets/images/popup_bg.png) no-repeat;
    position: absolute;
    top: 187px;
    right: 87px;
    width: 479px;
    height: 364px;

    .icon-close {
      background-color: transparent;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1;
      color: #ffaf3d;
      text-shadow: 0 1px 0 #fff;
      border: 0;
      opacity: 0.5;
      cursor: pointer;

      &:hover {
        color: #ffaf3d;
        text-decoration: none;
        opacity: 0.75;
      }
    }

    &-title {    
      color: #fff;
      font-size: 20px;
      text-align: center;
      margin-top: 24px;

      span {
        text-align: center;
        margin-left: 20px;
        padding: 5px;
        color: #fff;
        font-size: 16px;
        background: #2a8700;
      }      
    }

    &-subtitle {
      display: flex;
      flex-direction: row-reverse;
      justify-content: center;

      &-alarm {
        color: #171717;
        width: auto;
        height: 25px;
        background: #f9fa9e;
        float: right;
        line-height: 25px;
        text-align: center;
        margin-top: 16px;
        margin-right: 10px;
      }

      &-info {
        color: #fff;
        width: auto;
        height: 25px;
        float: right;
        line-height: 25px;
        text-align: center;
        margin-top: 16px;
        margin-right: 10px;
      }      
    }

    &-content {
      margin-top: 40px;
      text-align: center;
      display: flex;
      flex-direction: row;
      justify-content: center;

      &-item {
        height: 38px;
        float: left;
        margin-left: 13px;
        margin-right: 13px;
        color: #fff;
        text-align: center;

        &-value {
          font-size: 36px;
        }
      }
    }

    &-info {
      margin-top: 40px;
      text-align: center;
      display: flex;
      flex-direction: row;
      justify-content: center;

      &-item {
        height: 38px;
        float: left;
        margin-left: 13px;
        margin-right: 13px;
        color: #fff;
        text-align: center;
      }
    }

    &-footer {
      margin-top: 40px;
      padding-left: 45px;
    }
  }

  #map-track {
    width: 100%;
    height: 800px;
  }
}
</style><style>
.el-dialog {
  border: 2px solid #ffaf3d;
}

.el-dialog__header {
  padding: 0;
}

.el-dialog__header .el-dialog__headerbtn {
  z-index: 999;
}

.el-dialog__body {
  padding: 0;
}

.el-dialog__headerbtn .el-dialog__close {
  color: #ffaf3d;
}

.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: #fff;
  background-color: #ffaf3d;
  border-color: #ffaf3d;
  -webkit-box-shadow: -1px 0 0 0 #ffaf3d;
}

.el-autocomplete {
  width: 90%;
}

.el-input__inner {
  background-color: transparent;
  border: 1px solid #ffaf3d;
  color: #ffaf3d;
}
</style>
