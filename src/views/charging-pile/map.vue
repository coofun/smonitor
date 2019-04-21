<template>
<div class="map-wrapper">
    <div id="map-container"></div>
    <div class="popup" v-if="pile">
        <button type="button" class="icon-close" @click="pile = null">×</button>
        <div class="popup-title">{{ pile.name }}</div>
        <div class="popup-content">
            <div class="popup-content-item">
                <div>充电</div>
                <div class="popup-content-item-value">{{ cdJackNum }}&nbsp;</div>
            </div>
            <div class="popup-content-item">
                <div>空闲</div>
                <div class="popup-content-item-value">{{ kxJackNum }}&nbsp;</div>
            </div>                      
            <div class="popup-content-item">
                <div>市电电压</div>
                <div class="popup-content-item-value">{{ pile.sddy/100 }}<span style="font-size: 18px; margin-left: 5px">V</span></div>
            </div>
            <div class="popup-content-item">
                <div>总电流</div>
                <div class="popup-content-item-value">{{ pile.zdl/1000 }}<span style="font-size: 18px; margin-left: 5px">A</span></div>
            </div>
        </div>
        <div class="popup-content">
            <div class="popup-content-item">
                <div>&nbsp;{{ serverTime }}&nbsp;</div>
                <div>服务器时间</div>
            </div>
            <div class="popup-content-item">
                <div>&nbsp;{{ pile.zcid }}&nbsp;</div>
                <div>设备编号</div>
            </div>
            <div class="popup-content-item">
                <div>&nbsp;{{ pile.city }}&nbsp;</div>
                <div>所在城市</div>
            </div>
        </div>
        <div class="popup-content">
            <div class="popup-content-item">
                <div>&nbsp;{{ pile.fixAddr }}&nbsp;</div>
                <div>安装地址</div>
            </div>
            <div class="popup-content-item">
                <div>&nbsp;{{ pile.serviceEmp }}&nbsp;</div>
                <div>维护人员</div>
            </div>
            <div class="popup-content-item">
                <div>&nbsp;{{ pile.serviceTel }}&nbsp;</div>
                <div>维护电话</div>
            </div>
        </div>
        <div class="popup-footer">
            <el-autocomplete :fetch-suggestions="searchPile" placeholder="设备编号" @select="selectPile" icon="el-icon-search">
                <i class="el-icon-search el-input__icon" slot="prefix"></i>
            </el-autocomplete>
        </div>
    </div>
    <LoginUserBar style="position: absolute; left: 50px; top: 10px; z-index: 9999"></LoginUserBar>   
</div>
</template>

<script>
import { getChargingPileByCity, login } from '@/data'
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
      markers: [],
      pile: null    
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

    // 查询地市充电设备信息
    this.getChargingPileByCity()
  },
  computed: {
    serverTime() {
      let date = new Date()
      date.setTime(this.pile.jssj.time)
      return date.format('yyyy-MM-dd hh:mm:ss')
    },
    cdJackNum() {
      let num = 0;
      if(this.pile.details) {
        this.pile.details.forEach(function(item) {
          if(item && item.cdzt === 1) {
            num++
          }
        });
      }

      return num;
    },
    kxJackNum() {
      let num = 0;
      if(this.pile.details) {
        this.pile.details.forEach(function(item) {
          if(item && item.cdzt === 0) {
            num++
          }
        });
      }

      return num;
    }
  },
  watch: {},
  methods: {
    getChargingPileByCity() {
      let _this = this
      getChargingPileByCity(this.city).then(function(result) {
        let points = []
        result.forEach(item => {
          item.value = item.zcid + ' ' + item.name

          let point = new BMap.Point(item.jd, item.wd)
          point.pile = item

          points.push(point)
        })

        _this.addMarkers(points)
      })
    },
    addMarkers(points) {
      let _this = this

      if (!(points && points.length > 0)) {
        return
      }

      for (var i = 0; i < points.length; i++) {
        let marker = new BMap.Marker(points[i], {
          icon: _this.icon
        })
        marker.pile = points[i].pile
        marker.addEventListener('click', _this.onMarkerClick)
        _this.map.addOverlay(marker)
        _this.markers.push(marker)
      }
    },
    onMarkerClick(event) {
      this.pile = event.target.pile
    },
    searchPile(queryString, cb) {
      let results = []
      if (queryString) {
        this.markers.forEach(function(marker) {
          if (marker.pile && ((marker.pile.zcid + '').startsWith(queryString) || marker.pile.name.indexOf(queryString) !== -1)) {
            results.push(marker.pile)
          }
        })
      }
      cb(results)
    },
    selectPile(pile) {
      this.pile = pile
      let marker = this.markers.find(function(item) {
        return item.pile === pile
      })
      this.map.panTo(marker.point)
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
      z-index: 999;

      &:hover {
        color: #ffaf3d;
        text-decoration: none;
        opacity: 0.75;
      }
    }

    &-title {
      position: relative;
      width: 100%;
      color: #fff;
      font-size: 20px;
      text-align: center;
      padding-top: 24px;
    }

    &-content {
      position: relative;
      width: 100%;
      text-align: center;
      padding-top: 25px;
      display: flex;
      flex-direction: row;
      justify-content: center;

      &-item {
        position: relative;
        padding: 0 13px;
        color: #fff;
        text-align: center;
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;

        &-value {
          font-size: 36px;
        }
      }
    }

    &-footer {
      position: absolute;
      bottom: 25px;
      left: 80px;
    }
  } 
}
</style>

<style>
.el-input__inner {
  background-color: transparent;
  border: 1px solid #ffaf3d
}
</style>
