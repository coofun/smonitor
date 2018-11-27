<template>
<div class="map-wrapper">
    <div id="map-container"></div>
    <div class="popup" v-if="pile">
        <button type="button" class="icon-close" @click="pile = null">×</button>
        <div class="popup-title">{{ pile.name }}</div>
        <div class="popup-content">
            <div class="popup-content-item">
                <div>市电电压</div>
                <div class="popup-content-item-value">{{ pile.sddy }}&nbsp;</div>
            </div>
            <div class="popup-content-item">
                <div>总电流</div>
                <div class="popup-content-item-value">{{ pile.zdl }}&nbsp;</div>
            </div>
            <div class="popup-content-item">
                <div>总充电量</div>
                <div class="popup-content-item-value">{{ pile.zcdl }}&nbsp;</div>
            </div>
        </div>
        <div class="popup-content">
            <div class="popup-content-item">
                <div>&nbsp;{{ serverTime }}&nbsp;</div>
                <div>服务器时间</div>
            </div>
            <div class="popup-content-item">
                <div>&nbsp;{{ pile.zcid }}&nbsp;</div>
                <div>设备编号</div>
            </div>
            <div class="popup-content-item">
                <div>&nbsp;{{ pile.city }}&nbsp;</div>
                <div>所在城市</div>
            </div>
        </div>
        <div class="popup-content">
            <div class="popup-content-item">
                <div>&nbsp;{{ pile.fixAddr }}&nbsp;</div>
                <div>安装地址</div>
            </div>
            <div class="popup-content-item">
                <div>&nbsp;{{ pile.serviceEmp }}&nbsp;</div>
                <div>维护人员</div>
            </div>
            <div class="popup-content-item">
                <div>&nbsp;{{ pile.serviceTel }}&nbsp;</div>
                <div>维护电话</div>
            </div>
        </div>
        <div class="popup-footer">
            <el-autocomplete :fetch-suggestions="searchPile" placeholder="设备编号" @select="selectPile" icon="el-icon-search">
                <i class="el-icon-search el-input__icon" slot="prefix"></i>
            </el-autocomplete>
        </div>
    </div>
    <el-dialog :visible.sync="showLoginDialog" width="400px" center class="loginDialog">
        <div class="title-container">
          <h3 class="title">登录</h3>
        </div>                        
        <el-form class="login-form">
          <el-form-item label="用户名">
            <el-input type="text" v-model="username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="password" placeholder="请输入密码" @keyup.enter.native="handleLogin" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showLoginDialog = false">取消</el-button>
          <el-button type="primary" @click="handleLogin">确认</el-button>
        </span>
    </el-dialog>
    <div style="position: absolute; right: 50px; top: 5px; z-index: 9999">
      <el-dropdown v-if="$user.name"  @command="handleCommand" style="color: #ffaf3d; font-size: 18px">
        <span class="el-dropdown-link">
          欢迎您，{{ $user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button plain v-else @click="showLoginDialog=true" style="background-color: transparent; border-color: transparent; color: #ffaf3d; font-size: 18px">登录</el-button>
    </div>     
</div>
</template>

<script>
import { getChargingPileByCity, login } from '@/data'

export default {
  data() {
    return {
      city: null,
      map: null,
      icon: null,
      markers: [],
      pile: null,
      showLoginDialog: false,
      username: null,
      password: null      
    }
  },
  created() {
    this.city = this.$route.params.city
    this.icon = new BMap.Icon('static/images/point.png', new BMap.Size(30, 30))
  },
  mounted() {
    // 创建Map实例
    this.map = new BMap.Map('map-container')

    // 初始化地图,设置中心点坐标和地图级别
    this.map.centerAndZoom(this.city, 15)

    // 设置地图显示的城市
    this.map.setCurrentCity(this.city)

    // 设置地图样式
    this.map.setMapStyle({
      features: ['point', 'road', 'water', 'land', 'building'],
      style: 'dark'
    })

    // 开启鼠标滚轮缩放
    this.map.enableScrollWheelZoom(true)

    // 坐标转换
    this.converter = new BMap.Convertor()

    if (!this.$user.id) {
      this.showLoginDialog = true
    }
    else {
      // 查询地市充电设备信息
      this.getChargingPileByCity()
    }
  },
  computed: {
    serverTime() {
      let date = new Date()
      date.setTime(this.pile.jssj.time)
      return date.format('yyyy-MM-dd hh:mm:ss')
    }
  },
  watch: {},
  methods: {
    getChargingPileByCity() {
      let _this = this
      getChargingPileByCity(this.city).then(function(result) {
        let points = []
        result.forEach(item => {
          item.value = item.zcid + ' ' + item.name

          let point = new BMap.Point(item.jd, item.wd)
          point.pile = item

          points.push(point)
        })

        // 批量转换GPS坐标
        _this.translateCoord(points)
      })
    },
    translateCoord(points) {
      let _this = this

      // 批量转换GPS坐标，每次最多转换10个
      while (points && points.length > 0) {
        let tot = points.splice(0, 10)
        if (tot && tot.length > 0) {
          _this.converter.translate(tot, 1, 5, function(data) {
            _this.addMarkers(data.points, tot)
          })
        }
      }
    },
    addMarkers(points, origin) {
      let _this = this

      if (!(points && points.length > 0)) {
        return
      }

      for (var i = 0; i < points.length; i++) {
        let marker = new BMap.Marker(points[i], {
          icon: _this.icon
        })
        marker.pile = origin[i].pile
        marker.addEventListener('click', _this.onMarkerClick)
        _this.map.addOverlay(marker)
        _this.markers.push(marker)
      }
    },
    onMarkerClick(event) {
      this.pile = event.target.pile
    },
    searchPile(queryString, cb) {
      let results = []
      if (queryString) {
        this.markers.forEach(function(marker) {
          if (marker.pile && ((marker.pile.zcid + '').startsWith(queryString) || marker.pile.name.indexOf(queryString) !== -1)) {
            results.push(marker.pile)
          }
        })
      }
      cb(results)
    },
    selectPile(pile) {
      this.pile = pile
      let marker = this.markers.find(function(item) {
        return item.pile === pile
      })
      this.map.panTo(marker.point)
    },
    handleLogin() {
      let _this = this
      if (!this.username) {
        this.$message({
          message: '请输入用户名.',
          type: 'error'
        })

        return
      }

      if (!this.password) {
        this.$message({
          message: '请输入密码.',
          type: 'error'
        })

        return
      }

      login(this.username, this.password).then(function(result) {
        if (result.id) {
          Object.assign(_this.$user, result)
          _this.showLoginDialog = false
          localStorage.setItem('user', JSON.stringify(_this.$user))
          _this.$message({
            message: '登录成功.',
            type: 'success'
          })
          // 查询地市充电设备信息
          _this.getChargingPileByCity()          
        } else {
          _this.$message({
            message: '登录失败，请重新登录.',
            type: 'error'
          })
        }
      })
    },
    handleCommand(command) {
      this.$user = {}
      localStorage.removeItem('user')
      this.$forceUpdate()
    }    
  }
}
</script>

<style lang="scss" scoped>
.map-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  #map-container {
    width: 100%;
    height: 100%;
  }

  .popup {
    background: url(../../assets/images/popup_bg.png) no-repeat;
    position: absolute;
    top: 187px;
    right: 87px;
    width: 479px;
    height: 364px;

    .icon-close {
      background-color: transparent;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1;
      color: #ffaf3d;
      text-shadow: 0 1px 0 #fff;
      border: 0;
      opacity: 0.5;
      cursor: pointer;
      z-index: 999;

      &:hover {
        color: #ffaf3d;
        text-decoration: none;
        opacity: 0.75;
      }
    }

    &-title {
      position: relative;
      width: 100%;
      color: #fff;
      font-size: 20px;
      text-align: center;
      padding-top: 24px;
    }

    &-content {
      position: relative;
      width: 100%;
      text-align: center;
      padding-top: 25px;
      display: flex;
      flex-direction: row;
      justify-content: center;

      &-item {
        position: relative;
        padding: 0 13px;
        color: #fff;
        text-align: center;
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;

        &-value {
          font-size: 36px;
        }
      }
    }

    &-footer {
      position: absolute;
      bottom: 25px;
      left: 80px;
    }
  }

  .loginDialog {
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        margin: 0px auto 12px auto;
        text-align: center;
        font-weight: bold;
      }
    }
  }  
}
</style>

<style>
.el-input__inner {
  background-color: transparent;
  border: 1px solid #ffaf3d
}
</style>
