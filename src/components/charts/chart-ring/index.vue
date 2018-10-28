<template>
<div id="chart_ring" class="chart-ring">
</div>
</template>

<script>
import echarts from 'echarts'
import { percentString } from '@/extends/math.js'
import { getBatteryStatusByParams } from '@/data'
const placeholder = {
  value: 40,
  itemStyle: {
    normal: {
      color: 'transparent',
      borderColor: 'transparent'
    }
  }
}
export default {
  data() {
    return {
      chart: null,
      data: null,
      itemStyle: {
        normal: {
          borderWidth: 5,
          borderColor: '#D6B469'
        }
      }
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById('chart_ring'))
      this.getBatteryStatusData()
      setInterval(this.getBatteryStatusData, 600000)
    },
    getBatteryStatusData() {
      getBatteryStatusByParams().then(result => {
        this.data = result
        this.setChartOption()
      })
    },
    getFormattedStatusName(statusName, statusNum, totalNum) {
      return statusName + ' ： ' + statusNum + ' （ ' + percentString(statusNum, totalNum) + ' )'
    },
    setChartOption() {
      this.chart.setOption({
        backgroundColor: 'transparent',
        series: [
          {
            type: 'pie',
            radius: [95, 100],
            hoverAnimation: false,
            data: this.dataFormatted
          }
        ]
      })
    }
  },
  computed: {
    dataFormatted() {
      let data = []
      data.push(
        {
          name: this.getFormattedStatusName('放置', this.data.shunt, this.data.total),
          value: this.data.shunt,
          itemStyle: this.itemStyle,
          label: {
            color: '#fff'
          },
          labelLine: {
            lineStyle: {
              color: '#D6B469'
            }
          }
        },
        placeholder
      )
      data.push(
        {
          name: this.getFormattedStatusName('充电', this.data.charging, this.data.total),
          value: this.data.charging,
          itemStyle: this.itemStyle,
          label: {
            color: '#fff'
          },
          labelLine: {
            lineStyle: {
              color: '#D6B469'
            }
          }
        },
        placeholder
      )
      data.push(
        {
          name: this.getFormattedStatusName('放电', this.data.discharge, this.data.total),
          value: this.data.discharge,
          itemStyle: this.itemStyle,
          label: {
            color: '#fff'
          },
          labelLine: {
            lineStyle: {
              color: '#D6B469'
            }
          }
        },
        placeholder
      )
      data.push(
        {
          name: this.getFormattedStatusName('未知', this.data.unknown, this.data.total),
          value: this.data.unknown,
          itemStyle: this.itemStyle,
          label: {
            color: '#fff'
          },
          labelLine: {
            lineStyle: {
              color: '#D6B469'
            }
          }
        },
        placeholder
      )

      return data
    }
  },
  mounted() {
    this.initChart()
  }
}
</script>

<style scoped>
.chart-ring {
  text-align: center;
  width: 600px;
  height: 255px;
}
</style>
