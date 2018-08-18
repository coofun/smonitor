<template>
<div class="map-wrapper">
    <div id="china-map" class="map-container"></div>
</div>
</template>

<script>
import 'echarts/map/js/china.js'
import 'echarts/map/js/china-contour.js'

const geoCoordMap = require('../data/geoCoordMap.json')

export default {
  name: 'battery-china-map',
  props: { cities: Array, batteryData: Array },
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
      this.setOption()
    },
    setOption() {
      let option = {
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
              extraCssText:
                'background: url(static/map_popup_bg.png) no-repeat; width: 294px; height: 117px; padding: 0',
              formatter: function(params, ticket, callback) {
                return (
                  '<div class="map_tan_tit">' +
                  params.data.name +
                  '</div>' +
                  '<div class="canshu_01">' +
                  '<div class="map_tan_canshu">放置<br/>' +
                  params.data.shunt +
                  '</div>' +
                  '<div class="map_tan_canshu">充电<br/>' +
                  params.data.charging +
                  '</div>' +
                  '<div class="map_tan_canshu">放电<br/>' +
                  params.data.discharge +
                  '</div>' +
                  '<div class="map_tan_canshu">未知<br/>' +
                  params.data.unknown +
                  '</div>' +
                  '</div>'
                )
              }
            },
            data: this.cityBatteryDataList
          }
        ]
      }
      this.map.setOption(option)
      var counts = option.series[0].data.length
      let chart = this.map
      let autoHoverTip = function() {
        for (var i = 0; i < counts; i++) {
          ;(function(i) {
            setTimeout(function() {
              chart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: i
              })
            }, 5000 * i)
          })(i)
        }
      }
      setTimeout(function() {
        autoHoverTip()
        setInterval(autoHoverTip, 10000)
      }, 500)
    },
    getCityName(city) {
      return city.endsWith('市') ? city.substring(0, city.length - 1) : city
    }
  },
  watch: {
    batteryData() {
      this.setOption()
    }
  },
  computed: {
    cityBatteryDataList() {
      let data = []
      if (this.batteryData) {
        this.batteryData.forEach(item => {
          data.push({
            name: item.city,
            total: item.total || 0,
            shunt: item.shunt || 0,
            charging: item.charging || 0,
            discharge: item.discharge || 0,
            unknown: item.unknown || 0,
            value: geoCoordMap[this.getCityName(item.city)]
          })
        })
      }

      return data
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
