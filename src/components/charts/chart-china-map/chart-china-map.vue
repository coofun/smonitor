<template>
<div :id="id" :class="className"></div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/china.js'
import 'echarts/map/js/china-contour.js'

import resize from '../mixins/resize'

export default {
  name: 'ChartChinaMap',
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'chart-china-map'
    },
    className: {
      type: String,
      default: 'chart-china-map'
    },
    batteryData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      chart: null,
      hoverIndex: 0
    }
  },
  computed: {
    chartOption() {
      return {
        tooltip: {
          trigger: 'item'
        },
        geo: [
          {
            map: 'china-contour',
            roam: false,
            silent: true,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor: 'transparent',
                borderWidth: 3,
                borderColor: '#D6B469'
              },
              emphasis: {
                areaColor: 'transparent'
              }
            }
          },
          {
            map: 'china',
            roam: false,
            silent: true,
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
                borderWidth: 1,
                // 地图描边颜色
                borderColor: 'rgba(214,180,105,0.20)'
              },
              emphasis: {
                areaColor: 'transparent'
              }
            }
          }
        ],
        series: [
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            symbolSize: 10,
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: false,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: '#FFAF3D'
              }
            },
            tooltip: {
              trigger: 'item',
              position: 'top',
              backgroundColor: 'transparent',
              formatter: function(params, ticket, callback) {
                return `<div class="map_popup">
                            <div class="map_popup_title">${params.data.city}</div>
                            <div class="baojingjibie"></div>
                            <div class="dianchizhuangtai"></div>
                            <div class="map_popup_content">
                                <div class="map_popup_content_item">放置<br/>${params.data.shunt}</div>
                                <div class="map_popup_content_item">充电<br/>${params.data.charging}</div>
                                <div class="map_popup_content_item">放电<br/>${params.data.discharge}</div>
                                <div class="map_popup_content_item">未知<br/>${params.data.unknown}</div>
                            </div>
                        </div>`
              }
            },
            data: this.batteryData
          }
        ]
      }
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption(this.chartOption)
      setTimeout(this.autoHover, 500)
    },
    autoHover() {
      let _this = this

      if(!_this.chart) {
        setTimeout(_this.autoHover, 500)

        return
      }

      if (_this.hoverIndex > _this.batteryData.length) {
        _this.hoverIndex = 0
      }

      _this.chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: _this.hoverIndex
      })

      _this.hoverIndex++

      setTimeout(_this.autoHover, 5000)
    }
  },
  watch: {
    batteryData() {
      let _this = this
      this.chart.setOption(this.chartOption)
    }
  }
}
</script>

<style lang="scss">
.chart-china-map {
  width: 100%;
  height: 100%;
}
.map_popup {
  background: url(../../../assets/images/map_popup_bg.png) no-repeat;
  width: 294px;
  height: 117px;
  &_title {
    color: #fff;
    font-size: 14px;
    margin-top: 10px;
    margin-left: 20px;
    float: left;
    width: 139px;
    height: 30px;
  }
  .baojingjibie {
    color: #171717;
    width: 64px;
    height: 25px;
    float: right;
    line-height: 25px;
    text-align: center;
    margin-top: 16px;
    margin-right: 10px;
  }
  .dianchizhuangtai {
    color: #ffffff;
    width: 42px;
    height: 25px;
    float: right;
    line-height: 25px;
    text-align: center;
    margin-top: 16px;
    margin-right: 10px;
  }
  &_content {
    margin-top: 60px;
    text-align: center;
    &_item {
      height: 38px;
      float: left;
      margin-top: 20px;
      margin-left: 13px;
      margin-right: 13px;
      color: #fff;
      text-align: center;
    }
  }
}
</style>
