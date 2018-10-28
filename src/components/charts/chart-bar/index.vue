<template>
<div id="chart_bar" class="chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    batteryData: Array
  },
  data() {
    return {
      chart: null
    }
  },
  methods: {
    setOption: function() {
      let xData = []
      let yData = []
      if (this.batteryData) {
        for (let i = 0; i < this.batteryData.length; i++) {
          xData.push(this.batteryData[i].city)
        }
        for (let j = 0; j < xData.length; j++) {
          yData.push(
            this.batteryData.find(city => {
              return city.city === xData[j]
            }).total
          )
        }
      }
      this.chart.setOption({
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
      })
    }
  },
  watch: {
    batteryData: function(list) {
      this.setOption()
    }
  },
  mounted() {
    this.chart = echarts.init(document.getElementById('chart_bar'))
    this.setOption()
  }
}
</script>

<style scoped>
.chart-bar {
  height: 200px;
}
</style>
