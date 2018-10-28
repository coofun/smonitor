<template>
<div class="header">
    <div class="title"></div>
    <div class="tab">
        <router-link :to="homeLink">
            <div :class="homeTabClass" @click="switchTab('Home')">首页</div>
        </router-link>
        <router-link :to="mapLink">
            <div :class="mapTabClass" style="margin-left: -20px" @click="switchTab('Map')">地图</div>
        </router-link>
    </div>
</div>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    currentTab: {
      type: String,
      default: 'Home'
    },
    currentPage: {
      type: String,
      default: 'battery'
    },
    currentCity: {
      type: String
    }
  },
  computed: {
    homeTabClass() {
      return this.currentTab === 'Home' ? 'tab-item tab-item-selected' : 'tab-item'
    },
    mapTabClass() {
      return this.currentTab === 'Map' ? 'tab-item tab-item-selected' : 'tab-item'
    },
    homeLink() {
      return '/' + this.currentPage
    },
    mapLink() {
      return '/' + this.currentPage + '/map' + '/' + this.currentCity
    }
  },
  methods: {
    switchTab(tab) {
      this.$emit('switch-tab', tab)
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;

  .title {
    background-image: url(../assets/images/banner.png);
    width: 780px;
    height: 77px;
    margin: auto;
  }

  .tab {
    margin-top: 10px;
    margin-left: 56px;
    height: 40px;

    &-item {
      background: url(../assets/images/tab.png) no-repeat;
      width: 145px;
      height: 40px;
      float: left;
      color: #d6b469;
      line-height: 40px;
      text-align: center;
      font-size: 24px;
      cursor: pointer;

      &-selected {
        background: url(../assets/images/tab_1.png) no-repeat;
        color: #1d1d1a;
      }
    }
  }
}
</style>
