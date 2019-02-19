<template>
<div id="chart_line" class="chart-line">
    <el-dialog title="电池报警信息" :visible.sync="showAlarmList" width="50%" append-to-body :before-close="handleCloseAlarmList" style="z-index: 9999999">
        <el-table :data="alarmList" height="518" style="width: 100%">
            <el-table-column prop="zdid" label="电池编码">
            </el-table-column>
            <el-table-column prop="batchNo" label="电池条码">
            </el-table-column>
            <el-table-column prop="specification" label="电池规格">
            </el-table-column>
            <el-table-column prop="alarmName" label="报警故障类型">
            </el-table-column>
            <el-table-column prop="jssj" label="发生时间">
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-pagination background layout="prev, pager, next" :page-size="alarmListLimit" :total="alarmListTotal" @current-change="doPage">
          </el-pagination>
        </span>
    </el-dialog>
</div>
</template>

<script>
import echarts from 'echarts'
import {
    getBatteryAlarmNumBySpec,
    getBatteryAlarmListByParams
} from '@/data'

export default {
    name: 'battery-alarm-line',
    data() {
        return {
            chart: null,
            xData: [],
            yData: [],
            batterySpec: null,
            showAlarmList: false,
            alarmList: [],
            alarmListLimit: 10,
            alarmListCurPage: 1,
            alarmListTotal: 0
        }
    },
    methods: {
        iniChart() {
            let _this = this
            _this.chart = echarts.init(document.getElementById('chart_line'))
            _this.chart.on('click', function (params) {
                if (params && params.name) {
                    _this.batterySpec = params.name
                    _this.doQueryAlarmList()
                }
            });
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
                        rotate: 20,
                        color: "#FFF",
                        fontWeight: "lighter",
                        fontSize: 10
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
                series: [{
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
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
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
                }]
            })
        },
        getRecent7DaysData() {
            let xData = (this.xData = [])
            let yData = (this.yData = [])
            let startTime = new Date().getSomeDay(-6).format('yyyy-MM-dd 00:00:00')
            let endTime = new Date().format('yyyy-MM-dd 23:59:59')
            getBatteryAlarmNumBySpec()
                .then(result => {
                    result.forEach(element => {
                        xData.push(element.SPEC)
                        yData.push(element.total)
                    })
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        handleCloseAlarmList() {
            this.batterySpec = null
            this.alarmList.splice(0, this.alarmList.length)
            this.alarmListCurPage = 1
            this.alarmListTotal = 0
            this.showAlarmList = false
        },
        doQueryAlarmList() {
            let _this = this
            if (!_this.batterySpec) {
                return
            }
            getBatteryAlarmListByParams(_this.batterySpec, (_this.alarmListCurPage - 1) * _this.alarmListLimit + 1, _this.alarmListLimit).then(result => {
                _this.alarmListTotal = result.totalRow
                _this.alarmListCurPage = result.curPage
                _this.alarmList.splice(0, _this.alarmList.length)
                if (result.data) {
                    result.data.forEach(item => {
                        _this.alarmList.push({
                            zdid: item.zdid,
                            batchNo: item.batchNo,
                            specification: item.specification,
                            alarmName: item.alarmDetails && item.alarmDetails[0] && item.alarmDetails[0].alarmName,
                            jssj: item.jssj && item.jssj.time && new Date(item.jssj.time).format('yyyy-MM-dd hh:mm:ss')
                        })
                    })
                }
                _this.showAlarmList = true
            })
        },
        doPage(param) {
            let _this = this
            _this.alarmListCurPage = param
            _this.doQueryAlarmList()
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
.el-dialog__wrapper {
    z-index: 9999999 !important;
}
</style>
