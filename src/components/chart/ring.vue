<template>
<div id="chart_ring" class="tongji_pic">
</div>
</template>

<script>
import { percentString } from '@/extends/math.js'
import { getBatteryStatusByParams } from '@/api/battery_data.js'
const placeholder = {
  value: 20,
  itemStyle: {
    normal: {
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      color: 'rgba(0,0,0,0)',
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)'
    }
  }
}
export default {
  name: 'chart-ring',
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
      this.chart = this.$echarts.init(document.getElementById('chart_ring'))
      this.getBatteryStatusData()
      setInterval(this.getBatteryStatusData, 600000)
    },
    getBatteryStatusData() {
      getBatteryStatusByParams().then(response => {
        if (response && response.data) {
          this.data = response.data
          this.setChartOption()
        }
      })
    },
    getFormattedStatusName(statusName, statusNum, totalNum) {
      return (
        statusName + ':' + statusNum + ':' + percentString(statusNum, totalNum)
      )
    },
    setChartOption() {
      this.chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          show: false
        },
        legend: {
          show: false
        },
        toolbox: {
          show: false
        },
        series: [
          {
            type: 'pie',
            radius: [95, 100],
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'outside',
                  color: '#FFFFFF'
                },
                labelLine: {
                  show: false
                }
              }
            },
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
          name: this.getFormattedStatusName(
            '放置',
            this.data.shunt,
            this.data.total
          ),
          value: this.data.shunt,
          itemStyle: this.itemStyle
        },
        placeholder
      )
      data.push(
        {
          name: this.getFormattedStatusName(
            '充电',
            this.data.charging,
            this.data.total
          ),
          value: this.data.charging,
          itemStyle: this.itemStyle
        },
        placeholder
      )
      data.push(
        {
          name: this.getFormattedStatusName(
            '放电',
            this.data.discharge,
            this.data.total
          ),
          value: this.data.discharge,
          itemStyle: this.itemStyle
        },
        placeholder
      )
      data.push(
        {
          name: this.getFormattedStatusName(
            '未知',
            this.data.unknown,
            this.data.total
          ),
          value: this.data.unknown,
          itemStyle: this.itemStyle
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
#chart_ring {
  min-height: 240px;
}
</style>
