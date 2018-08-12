<template>
  <div id="app">
    <div class="banner"></div>
    <div class="tab">
      <div class="home">首页</div>
      <div class="map">地图</div>
    </div>
    <div class="neirong">
      <div class="tab2">
        <div class="xuanzhong_2">
          <div class="neirong1">智能电池</div>
        </div>
        <div class="weixuanzhong_2">
          <div class="neirong2">充电柜桩</div>
        </div>
        <div class="weixuanzhong_2">
          <div class="neirong2">换电柜</div>
        </div>
      </div>
      <div class="map_1">
        <div class="map_tan">
          <div class="map_tan_tit">61704006257<br/>
            <span class="map_time">2018-06-15 15:12:32</span></div>
          <div class="baojingjibie">一级报警</div>
          <div class="dianchizhuangtai">放电</div>
          <div class="canshu_01"><div class="map_tan_canshu">电量<br/>80%</div><div class="map_tan_canshu">总电压<br/>37.5V</div><div class="map_tan_canshu">总电流<br/>0A</div><div class="map_tan_canshu">温度<br/>19℃～20℃</div></div>
        </div>
        <div class="map_weizhi"><img src="@/assets/images/map_01.png"></div>
      </div>
      <div class="tongji">
        <!--
        <div class="tongji_pic"><img src="@/assets/images/Group 26.png"></div>
        -->
        <chart-ring></chart-ring>
        <div class="tongji_tit">电池状态统计</div>
        <div class="tongji_pic"><img src="@/assets/images/Group.png"></div>
        <div class="tongji_tit">全国各省份电池数量统计</div>
        <div class="tongji_pic"><img src="@/assets/images/x.png"></div>
        <div class="tongji_tit">电池报警数量</div>
      </div>
    </div>
    <div class="right_menu">
      <div class="right_menu_tit"></div>
      <div class="diquliebiao">
        <ul>
          <li v-for="city in cityList" :key="city.city"><img src="@/assets/images/北京.png">{{city.city}}</li>
        </ul>
      </div>
    </div>
    <div class="baojing_list">
      <div class="line"></div>
      <div class="baojing_neirong">
        <ul>
          <li><img src="@/assets/images/yuan.png">山东省 济南市 1234号 高温报警</li>
          <li><img src="@/assets/images/yuan.png">山东省 济南市 1234号 高温报警</li>
          <li><img src="@/assets/images/yuan.png">山东省 济南市 1234号 高温报警</li>
        </ul>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { getBatteryData } from '@/api/battery_data.js'
import ChartRing from '@/components/chart/ring.vue'

export default {
  name: 'App',
  components: {
    ChartRing
  },
  data() {
    return {
      cityList: []
    }
  },
  mounted() {
    getBatteryData().then(response => {
      this.cityList = response.data
    })
  }
}
</script>

<style scoped>
#app {
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
