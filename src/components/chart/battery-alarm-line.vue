<template>
    <div id="chart_line" class="tongji_pic"></div>
</template>

<script>
import { getBatteryAlarmNum } from '@/api/battery_data.js'

const startSuffix = ' 00:00:01'
const endSuffix = ' 24:00:00'

function getChineseDay(day) {
  switch (day) {
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
    case 0:
      return '周日'
    default:
      return '未知'
  }
}

export default {
  name: 'battery-alarm-line',
  props: { currentCity: Object },
  data() {
    return {
      chart: null,
      xData: [],
      yData: []
    }
  },
  methods: {
    refreshChart() {
      this.chart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xData,
          axisTick: {
            show: false
          }
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
            data: this.yData,
            type: 'line',
            showSymbol: false,
            smooth: true,
            itemStyle: {
              normal: {
                color: '#D6B469'
              }
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
            }
          }
        ]
      })
    }
  },
  watch: {
    currentCity(city) {
      this.xData = []
      this.yData = []
      for (let i = -7; i < 0; i++) {
        let day = new Date().getSomeDay(i)
        let fmt = day.format('yyyy-MM-dd')
        let query = {
          city: city.city,
          startTime: fmt + startSuffix,
          endTime: fmt + endSuffix
        }
        this.xData.push(getChineseDay(day.getDay()))
        let yData = this.yData
        getBatteryAlarmNum(query)
          .then(response => {
            yData.push(response.data.total)
          })
          .catch(function(error) {
            console.log(error)
            yData.push(day.getDay() * 100)
          })
      }
    },
    yData(data) {
      this.refreshChart()
    }
  },
  mounted() {
    this.chart = this.$echarts.init(document.getElementById('chart_line'))
  }
}
</script>

<style scoped>
#chart_line {
  min-height: 188px;
}
</style>
