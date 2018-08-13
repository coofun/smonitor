<template>
    <div id="chart_bar" class="tongji_pic"></div>
</template>

<script>
export default {
  name: 'battery-amount-bar',
  props: { cityList: Array },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    cityList: function(list) {
      let xData = []
      let yData = []
      if (this.cityList && this.cityList.length > 0) {
        for (let i = 0; i < this.cityList.length; i++) {
          if (this.cityList[i].city) {
            xData.push(this.cityList[i].city)
          }
        }
        for (let j = 0; j < xData.length; j++) {
          yData.push(
            this.cityList.find(city => {
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
  mounted() {
    this.chart = this.$echarts.init(document.getElementById('chart_bar'))
  }
}
</script>

<style scoped>
#chart_bar {
  min-height: 182px;
}
</style>
