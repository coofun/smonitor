<template>
<div class="map-wrapper">
    <div id="china-map" class="map-container"></div>
</div>
</template>

<script>
import 'echarts/map/js/china.js'
import 'echarts/map/js/china-contour.js'

var data = [
  {
    name: '齐齐哈尔'
  },
  {
    name: '盐城'
  },
  {
    name: '青岛'
  },
  {
    name: '金昌'
  },
  {
    name: '泉州'
  },
  {
    name: '拉萨'
  },
  {
    name: '上海浦东'
  },
  {
    name: '攀枝花'
  },
  {
    name: '威海'
  },
  {
    name: '承德'
  },
  {
    name: '汕尾'
  },
  {
    name: '克拉玛依'
  },
  {
    name: '重庆市'
  }
]
var geoCoordMap = {
  齐齐哈尔: [123.97, 47.33],
  盐城: [120.13, 33.38],
  青岛: [120.33, 36.07],
  金昌: [102.188043, 38.520089],
  泉州: [118.58, 24.93],
  拉萨: [91.11, 29.97],
  上海浦东: [121.48, 31.22],
  攀枝花: [101.718637, 26.582347],
  威海: [122.1, 37.5],
  承德: [117.93, 40.97],
  汕尾: [115.375279, 22.786211],
  克拉玛依: [84.77, 45.59],
  重庆市: [108.384366, 30.439702]
}
var convertData = function(data) {
  var res = []
  for (var i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name]
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value)
      })
    }
  }
  return res
}
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
                return `<div class="map_tan_tit">61704006257<br/>
                          <span class="map_time">2018-06-15 15:12:32</span>
                        </div>
                        <div class="baojingjibie">一级报警</div>
                        <div class="dianchizhuangtai">放电</div>
                        <div class="canshu_01">
                          <div class="map_tan_canshu">电量<br/>80%</div>
                          <div class="map_tan_canshu">总电压<br/>37.5V</div>
                          <div class="map_tan_canshu">总电流<br/>0A</div>
                          <div class="map_tan_canshu">温度<br/>19℃～20℃</div>
                        </div>`
              }
            },
            data: convertData(data)
          }
        ]
      }
      this.map.setOption(option)
      var counts = option.series[0].data.length
      var dataIndex = 0
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
        setInterval(autoHoverTip, counts * 1000)
      }, 500)
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
