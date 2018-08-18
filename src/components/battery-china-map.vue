<template>
<div class="map-wrapper">
    <div id="china-map" class="map-container"></div>
</div>
</template>

<script>
import 'echarts/map/js/china.js'
import 'echarts/map/js/china-contour.js'

const geoCoordMap = require('../data/geoCoordMap.json')

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
var convertData = function(data) {
  var res = []
  for (var i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name] || geoCoordMap[data[i].name + '市']
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
                return `<div class="map_tan_tit">济南市</div>
                        <div class="baojingjibie">一级报警</div>
                        <div class="dianchizhuangtai">放电</div>
                        <div class="canshu_01">
                          <div class="map_tan_canshu">放置<br/>80%</div>
                          <div class="map_tan_canshu">充电<br/>37.5V</div>
                          <div class="map_tan_canshu">放电<br/>0A</div>
                          <div class="map_tan_canshu">未知<br/>19℃～20℃</div>
                        </div>`
              }
            },
            data: convertData(data)
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
