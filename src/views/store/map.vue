<template>
<div class="map-wrapper">
    <div id="map-container"></div>
    <div class="popup" v-if="store">
        <button type="button" class="icon-close" @click="store = null">×</button>
        <div class="popup-title">{{ store.myName }}</div>
        <div class="popup-content">
            <div class="popup-content-item">
                <el-row>
                    <el-col :span="10" style="text-align: right;padding-right: 20px">客户编码</el-col>
                    <el-col :span="14" style="text-align: left">{{ store.account }}&nbsp;</el-col>
                </el-row>
            </div>
            <div class="popup-content-item">
                <el-row>
                    <el-col :span="10" style="text-align: right;padding-right: 20px">业务片区</el-col>
                    <el-col :span="14" style="text-align: left">{{ store.areaCatID }}&nbsp;</el-col>
                </el-row>
            </div>
            <div class="popup-content-item">
                <el-row>
                    <el-col :span="10" style="text-align: right;padding-right: 20px">负责人</el-col>
                    <el-col :span="14" style="text-align: left">{{ store.manager }}&nbsp;</el-col>
                </el-row>
            </div>
            <div class="popup-content-item">
                <el-row>
                    <el-col :span="10" style="text-align: right;padding-right: 20px">负责人手机</el-col>
                    <el-col :span="14" style="text-align: left">{{ store.telephone }}&nbsp;</el-col>
                </el-row>
            </div>
            <div class="popup-content-item">
                <el-row>
                    <el-col :span="10" style="text-align: right;padding-right: 20px">公司地址</el-col>
                    <el-col :span="14" style="text-align: left">{{ store.regAddress }}&nbsp;</el-col>
                </el-row>
            </div>
        </div>
        <div class="popup-footer">
            <el-autocomplete :fetch-suggestions="searchStore" placeholder="客户名称" @select="selectStore" icon="el-icon-search">
                <i class="el-icon-search el-input__icon" slot="prefix"></i>
            </el-autocomplete>
        </div>
    </div>
</div>
</template>

<script>
import { getStoreListByCondition } from '@/data'

export default {
  data() {
    return {
      city: null,
      map: null,
      icon: null,
      markers: [],
      store: null
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
    this.getStoreListByCondition()
  },
  computed: {},
  watch: {},
  methods: {
    getStoreListByCondition() {
      let _this = this
      getStoreListByCondition(this.city).then(function(result) {
        let points = []
        result.forEach(item => {
          item.value = item.myName

          let point = new BMap.Point(item.longitude, item.latitude)
          point.store = item

          points.push(point)
        })

        // 批量转换GPS坐标
        _this.translateCoord(points)
      })
    },
    translateCoord(points) {
      let _this = this

      // 批量转换GPS坐标，每次最多转换10个
      while (points && points.length > 0) {
        let tot = points.splice(0, 10)
        if (tot && tot.length > 0) {
          _this.converter.translate(tot, 1, 5, function(data) {
            _this.addMarkers(data.points, tot)
          })
        }
      }
    },
    addMarkers(points, origin) {
      let _this = this

      if (!(points && points.length > 0)) {
        return
      }

      for (var i = 0; i < points.length; i++) {
        let marker = new BMap.Marker(points[i], {
          icon: _this.icon
        })
        marker.store = origin[i].store
        marker.addEventListener('click', _this.onMarkerClick)
        _this.map.addOverlay(marker)
        _this.markers.push(marker)
      }
    },
    onMarkerClick(event) {
      this.store = event.target.store
    },
    searchStore(queryString, cb) {
      let results = []
      if (queryString) {
        this.markers.forEach(function(marker) {
          if (marker.store && marker.store.myName.indexOf(queryString) !== -1) {
            results.push(marker.store)
          }
        })
      }
      cb(results)
    },
    selectStore(store) {
      this.store = store
      let marker = this.markers.find(function(item) {
        return item.store === store
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
      flex-direction: column;
      justify-content: center;

      &-item {
        position: relative;
        padding: 10px 13px;
        color: #fff;
        font-size: 14px;
        text-align: center;
      }
    }

    &-footer {
      position: absolute;
      bottom: 25px;
      left: 100px;
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
