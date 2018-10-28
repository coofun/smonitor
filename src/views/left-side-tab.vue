<template>
<div class="left-side-tab">
    <router-link v-for="tab in tabs" :key="tab.key" :to="'/' + tab.key">
        <div class="left-side-tab-item" :class="currentPage === tab.key ? 'left-side-tab-item-selected' : ''" @click="switchPage(tab.key)">
            <div class="left-side-tab-item-content" :class="currentPage === tab.key ? 'left-side-tab-item-content-selected' : ''">{{ tab.value }}</div>
        </div>
    </router-link>
</div>
</template>

<script>
export default {
  name: 'LeftSideTab',
  props: {
    currentPage: {
      type: String,
      default: 'battery'
    }
  },
  data() {
    return {
      tabs: [
        {
          key: 'battery',
          value: '智能电池'
        },
        {
          key: 'charging-pile',
          value: '智能充电'
        },
        {
          key: 'exchange',
          value: '智能换电'
        },
        {
          key: 'store',
          value: '客户分布'
        }
      ]
    }
  },
  methods: {
    switchPage(page) {
      this.$emit('switch-page', page)
    }
  }
}
</script>

<style lang="scss" scoped>
.left-side-tab {
  position: absolute;
  top: 157px;
  left: 0;
  z-index: 999;

  &-item {
    background: url(../assets/images/tab_2.png) no-repeat;
    width: 56px;
    height: 214px;
    cursor: pointer;

    &-content {
      color: #d6b469;
      line-height: 24px;
      text-align: center;
      font-size: 20px;
      width: 20px;
      padding-top: 58px;
      padding-left: 15px;
      margin-top: -20px;

      &-selected {
        color: #1d1d1a;
      }
    }

    &-selected {
      background: url(../assets/images/tab_2_1.png) no-repeat;
    }
  }
}
</style>
