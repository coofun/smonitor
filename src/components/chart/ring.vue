<template>
    <div id="chart_ring" class="tongji_pic"></div>
</template>

<script>
const placeholder = {
  value: 4,
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
      chart: null
    }
  },
  props: { cityList: Array, currentCity: Object },
  watch: {
    currentCity: function(city) {
      let data = []
      // 放置数量
      data.push(
        {
          name:
            (
              Math.round(this.currentCity.shunt * 100) / this.currentCity.total
            ).toFixed(2) + '%',
          value: this.currentCity.shunt,
          itemStyle: {
            normal: {
              borderWidth: 5,
              borderColor: '#D6B469'
            }
          }
        },
        placeholder
      )
      // 报警数量
      data.push(
        {
          name:
            (
              Math.round(this.currentCity.alarm * 100) / this.currentCity.total
            ).toFixed(2) + '%',
          value: this.currentCity.alarm,
          itemStyle: {
            normal: {
              borderWidth: 5,
              borderColor: '#D6B469'
            }
          }
        },
        placeholder
      )
      // 充电数量
      data.push(
        {
          name:
            (
              Math.round(this.currentCity.charging * 100) /
              this.currentCity.total
            ).toFixed(2) + '%',
          value: this.currentCity.charging,
          itemStyle: {
            normal: {
              borderWidth: 5,
              borderColor: '#D6B469'
            }
          }
        },
        placeholder
      )
      // 放电数量
      data.push(
        {
          name:
            (
              Math.round(this.currentCity.discharge * 100) /
              this.currentCity.total
            ).toFixed(2) + '%',
          value: this.currentCity.discharge,
          itemStyle: {
            normal: {
              borderWidth: 5,
              borderColor: '#D6B469'
            }
          }
        },
        placeholder
      )
      // 未知状态数量
      data.push(
        {
          name:
            (
              Math.round(this.currentCity.unknown * 100) /
              this.currentCity.total
            ).toFixed(2) + '%',
          value: this.currentCity.unknown,
          itemStyle: {
            normal: {
              borderWidth: 5,
              borderColor: '#D6B469'
            }
          }
        },
        placeholder
      )

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
            data: data
          }
        ]
      })
    }
  },
  mounted() {
    this.chart = this.$echarts.init(document.getElementById('chart_ring'))
  }
}
</script>

<style scoped>
#chart_ring {
  min-height: 240px;
}
</style>
