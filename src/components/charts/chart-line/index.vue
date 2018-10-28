<template>
<div id="chart_line" class="chart-line"></div>
</template>

<script>
import echarts from 'echarts'
import { getBatteryAlarmNumByParams } from '@/data'

export default {
  name: 'battery-alarm-line',
  data() {
    return {
      chart: null,
      xData: [],
      yData: []
    }
  },
  methods: {
    iniChart() {
      this.chart = echarts.init(document.getElementById('chart_line'))
    },
    setChartOption() {
      this.chart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel: {
            rotate: 30
          },
          data: this.xData
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
                label : {
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
            data: this.yData
          }
        ]
      })
    },
    getRecent7DaysData() {
      let xData = (this.xData = [])
      let yData = (this.yData = [])
      let startTime = new Date().getSomeDay(-6).format('yyyy-MM-dd 00:00:00')
      let endTime = new Date().format('yyyy-MM-dd 23:59:59')
      getBatteryAlarmNumByParams(null, startTime, endTime)
        .then(result => {
          result.forEach(element => {
            xData.push(element.dateTime)
            yData.push(element.total)
          })
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  },
  watch: {
    xData() {
      this.setChartOption()
    }
  },
  mounted() {
    this.iniChart()
    this.getRecent7DaysData()
    setInterval(this.getRecent7DaysData, 100000)
  }
}
</script>

<style scoped>
.chart-line {
  height: 200px;
}
</style>
