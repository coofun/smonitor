<template>
<div class="home">
    <div id="chart-china-map" class="chart-china-map"></div>
    <div class="statistics-wrapper">
        <div id="chart-pie" class="chart-pie">
        </div>
        <div class="statistics-item-title">设备状态统计</div>
        <div id="chart-bar" class="chart-bar"></div>
        <div class="statistics-item-title">设备数量统计</div>
        <div id="chart-line" class="chart-line"></div>
        <div class="statistics-item-title">充电服务次数统计</div>
    </div>
    <div class="right_menu">
        <div class="right_menu_tit"></div>
        <div class="diquliebiao">
            <ul>
                <router-link v-for="city in cities" :key="city" :to="'/charging-pile/map/' + city">
                    <li>
                        <img src="@/assets/images/yuan.png">{{city}}
                    </li>
                </router-link>
            </ul>
        </div>
    </div>

    <LoginUserBar style="position: absolute; left: 50px; top: 10px; z-index: 9999"></LoginUserBar>
</div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/china.js'
import 'echarts/map/js/china-contour.js'
import { debounce } from '@/utils'
import { percentString } from '@/extends/math.js'

import { getChargingPileStatusByCity, geoCoordMap, getChargingOrderNumByParams } from '@/data'
import LoginUserBar from '@/views/components/LoginUserBar.vue'

const pie_itemStyle = {
  normal: {
    borderWidth: 5,
    borderColor: '#D6B469'
  }
} 

export default {
  components: {
    LoginUserBar
  },  
  data() {
    return {
      pileStatusStat: [],
      chartChinaMapHoverIndex: 0
    }
  },
  computed: {
    // 计算城市列表
    cities() {
      let cities = []
      this.pileStatusStat.forEach(function(item) {
        cities.push(item.city)
      })
      return cities
    },
    chartChinaMapOption() {
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
                                <div class="map_popup_content_item">空闲数量<br/>${params.data.kxNum}</div>
                                <div class="map_popup_content_item">充电数量<br/>${params.data.cdNum}</div>
                                <div class="map_popup_content_item">故障数量<br/>${params.data.gzNum}</div>
                            </div>
                        </div>`
              }
            },
            data: this.pileStatusStat
          }
        ]
      }
    },
    chartPieOption() {
      return {
        backgroundColor: 'transparent',
        series: [
          {
            type: 'pie',
            radius: [95, 100],
            hoverAnimation: false,
            data: this.chartPieData
          }
        ]
      }      
    },
    chartPieData() {
      let data = []

      if(this.pileStatusStat.length === 0){
        return data
      }

      let total = 0, kxNum = 0, cdNum = 0, gzNum = 0

      this.pileStatusStat.forEach(function(item){
        total += item.kxNum + item.cdNum + item.gzNum
        kxNum += item.kxNum
        cdNum += item.cdNum
        gzNum += item.gzNum
      })

      let pie_placeholder = {
        value: total / 50 + 1,
        itemStyle: {
          normal: {
            color: 'transparent',
            borderColor: 'transparent'
          }
        }
      }

      data.push(
        {
          name: '空闲数量 ： ' + kxNum + ' （ ' + percentString(kxNum, total) + ' )',
          value: kxNum,
          itemStyle: pie_itemStyle,
          label: {
            color: '#fff'
          },
          labelLine: {
            lineStyle: {
              color: '#D6B469'
            }
          }
        },
        pie_placeholder
      )
      data.push(
        {
          name: '充电数量 ： ' + cdNum + ' （ ' + percentString(cdNum, total) + ' )',
          value: cdNum,
          itemStyle: pie_itemStyle,
          label: {
            color: '#fff'
          },
          labelLine: {
            lineStyle: {
              color: '#D6B469'
            }
          }
        },
        pie_placeholder
      )      

      data.push(
        {
          name: '故障数量 ： ' + gzNum + ' （ ' + percentString(gzNum, total) + ' )',
          value: gzNum,
          itemStyle: pie_itemStyle,
          label: {
            color: '#fff'
          },
          labelLine: {
            lineStyle: {
              color: '#D6B469'
            }
          }
        },
        pie_placeholder
      )

      return data
    },
    chartBarOption() {
      let xData = []
      let yData = []
      if (this.pileStatusStat) {
        this.pileStatusStat.forEach(function(item){
          xData.push(item.city)
        })
        xData.forEach(item => {
          yData.push(this.pileStatusStat.find(pile => { return pile.city === item }).total)          
        })
      }
      return {
        backgroundColor: 'transparent',
        xAxis: {
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 10,
            textStyle: {
              color: 'rgba(255,255,255,.54)'
            }
          },
          data: xData
        },
        yAxis: {
          show: false,
          max: 'dataMax'
        },
        series: {
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#D6B469',
              barBorderRadius: 100,
              label: {
                show: true,
                position: 'top',
                color: '#FFFFFF'
              }
            }
          },
          barWidth: 19.6,
          data: yData
        }
      }      
    }
  },
  mounted() {
    let _this = this

    // 初始化充电设备状态饼图
    _this.chartPie = echarts.init(document.getElementById('chart-pie'))

    // 初始化充电设备按地市统计数量柱状图
    this.chartBar = echarts.init(document.getElementById('chart-bar'))

    // 初始化订单数量统计折线图
    this.chartLine = echarts.init(document.getElementById('chart-line'))

    // 查询充电桩状态统计信息
    getChargingPileStatusByCity().then(result => {
      if (result) {
        _this.pileStatusStat.splice(0, _this.pileStatusStat.length)
        _this.pileStatusStat.push(...result)

        _this.pileStatusStat.forEach(function(item) {
          if (!item.city) {
            _this.pileStatusStat.splice(_this.pileStatusStat.indexOf(item), 1)
          } else {
            item.value = geoCoordMap[_this.getCityName(item.city)]
          }
        })

        _this.pileStatusStat.sort(function(a, b) {
          return b.total - a.total
        })

        _this.$emit('init-city', _this.pileStatusStat[0] ? _this.pileStatusStat[0].city : '')

        _this.initChartChinaMap()

        _this.chartPie.setOption(_this.chartPieOption)

        _this.chartBar.setOption(_this.chartBarOption)
      }
    })

    // 查询最近七天的订单数量
    _this.getRecent7DaysData()

    this.__resizeHanlder = debounce(() => {
      if (this.chartChinaMap) {
        this.chartChinaMap.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  methods: {
    getCityName(city) {
      if (city) {
        return city.endsWith('市') ? city.substring(0, city.length - 1) : city
      }
    },
    initChartChinaMap() {
      this.chartChinaMap = echarts.init(document.getElementById('chart-china-map'))
      this.chartChinaMap.setOption(this.chartChinaMapOption)
      setTimeout(this.chartChinaMapAutoHover, 500)
    },
    chartChinaMapAutoHover() {
      let _this = this

      if (!_this.chartChinaMap) {
        setTimeout(_this.chartChinaMapAutoHover, 500)
        return
      }

      if (_this.chartChinaMapHoverIndex > _this.pileStatusStat.length) {
        _this.chartChinaMapHoverIndex = 0
      }

      _this.chartChinaMap.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: _this.chartChinaMapHoverIndex
      })

      _this.chartChinaMapHoverIndex++

      setTimeout(_this.chartChinaMapAutoHover, 5000)
    },
    getRecent7DaysData() {
      let xData = []
      let yData = []
      let startTime = new Date().getSomeDay(-6).format('yyyy-MM-dd 00:00:00')
      let endTime = new Date().format('yyyy-MM-dd 23:59:59')
      getChargingOrderNumByParams(null, startTime, endTime).then(result => {
        result.forEach(item => {
          xData.push(item.dateTime)
          yData.push(item.total)
        })
        this.setChartLineOption(xData, yData)
      }).catch(function(error) {
        console.log(error)
      })
    },
    setChartLineOption(xData, yData) {
      this.chartLine.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel: {
            rotate: 30
          },
          data: xData
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'solid',
              color: 'rgba(255, 255, 255, .12)'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            type: 'line',
            showSymbol: true,
            smooth: true,
            itemStyle: {
              normal: {
                color: '#D6B469',
                label: {
                  show: true
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#D6B469'
                  },
                  {
                    offset: 1,
                    color: '#FFF'
                  }
                ])
              }
            },
            data: yData
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss">
.home {
  position: relative;
  width: calc(100% - 600px);
  height: calc(100% - 77px);
  padding-top: 77px;
  padding-right: 600px;
  float: left;

  .statistics-wrapper {
    background-color: transparent;
    position: absolute;
    top: 127px;
    right: 261px;
    z-index: 999;

    .statistics-item-title {
      color: #d6b469;
      font-size: 22px;
      text-align: center;
      width: 390px;
      margin-top: 5px;
      margin-bottom: 10px;
      padding-left: 105px;
    }

    .chart-pie {
      text-align: center;
      width: 600px;
      height: 255px;
    }

    .chart-bar {
      height: 200px;
    }    

    .chart-line {
      height: 200px;
    }    
  }

  .right_menu {
    position: absolute;
    top: 0;
    right: 0;
    background: url(../../assets/images/Rectangle22.png);
    width: 261px;
    height: 100%;
    z-index: 9999;

    .right_menu_tit {
      background: url(../../assets/images/right_menu_tit.png);
      width: 231px;
      height: 48px;
      margin-left: 30px;
    }

    .diquliebiao {
      ul {
        padding: 0px;

        li {
          list-style-type: none;
          color: #d6b469;
          font-size: 20px;
          width: 261px;
          height: 56px;
          margin-bottom: 20px;
          line-height: 56px;

          img {
            margin-right: 30px;
            vertical-align: middle;
            margin-left: 80px;
          }

          &:hover {
            list-style-type: none;
            color: #2b281c;
            font-size: 20px;
            background: url(../../assets/images/right_menu_bg.png) no-repeat;
            width: 261px;
            line-height: 56px;
            cursor: pointer;
          }
        }
      }
    }
  }

  .chart-china-map {
    width: 100%;
    height: 100%;
  }

  .map_popup {
    background: url(../../assets/images/map_popup_bg.png) no-repeat;
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
}
</style>
