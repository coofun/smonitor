<template>
<div class="map-wrapper">
    <div class="map_tan">
        <div class="map_tan_tit">61704006257<br/>
            <span class="map_time">2018-06-15 15:12:32</span></div>
        <div class="baojingjibie">一级报警</div>
        <div class="dianchizhuangtai">放电</div>
        <div class="canshu_01">
            <div class="map_tan_canshu">电量<br/>80%</div>
            <div class="map_tan_canshu">总电压<br/>37.5V</div>
            <div class="map_tan_canshu">总电流<br/>0A</div>
            <div class="map_tan_canshu">温度<br/>19℃～20℃</div>
        </div>
    </div>
    <div id="china-map" class="map-container"></div>
</div>
</template>

<script>
import 'echarts/map/js/china.js'

export default {
  name: 'battery-china-map',
  data() {
    return {
      map: null
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      this.map = this.$echarts.init(document.getElementById('china-map'))
      let option = {
        series: [
          {
            type: 'map',
            mapType: 'china',
            label: {
              normal: {
                // 不显示省份标签
                show: false
              },
              emphasis: {
                // 不使用省份标签鼠标悬浮效果
                show: false
              }
            },
            itemStyle: {
              normal: {
                // 地图区域颜色
                areaColor: 'transparent',
                // 地图描边线宽
                borderWidth: 0.5,
                // 地图描边颜色
                borderColor: 'rgba(214,180,105,0.20)'
              },
              emphasis: {
                areaColor: 'transparent'
              }
            }
          }
        ]
      }
      this.map.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.map-wrapper {
  width: 1213px;
  height: 949px;
  float: left;
  .map-container {
    width: 100%;
    height: 100%;
  }
}
</style>
