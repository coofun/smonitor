<template>
<div class="vertical-tab-container">
    <div class="tab-item-selected">
        <div class="tab-item-selected-title">智能电池</div>
    </div>
    <div class="tab-item">
        <div class="tab-item-title">充电柜桩</div>
    </div>
    <div class="tab-item">
        <div class="tab-item-title">换电柜</div>
    </div>
</div>
</template>

<script>
export default {
  name: 'tab-vertical',
  data() {
    return {
      tabOptions: ['智能电池', '充电柜桩', '换电柜'],
      tabCurrent: '智能电池'
    }
  }
}
</script>

<style lang="scss" scoped>
.vertical-tab-container {
  float: left;
  margin-top: 30px;
  .tab-item {
    background: url(../assets/images/tab_2.png) no-repeat;
    width: 56px;
    height: 214px;
    &-title {
      color: #d6b469;
      line-height: 24px;
      text-align: center;
      font-size: 20px;
      width: 20px;
      padding-top: 58px;
      padding-left: 15px;
      margin-top: -20px;
    }
  }
  .tab-item-selected {
    background: url(../assets/images/tab_2_1.png) no-repeat;
    width: 56px;
    height: 214px;
    &-title {
      color: #1d1d1a;
      line-height: 24px;
      text-align: center;
      font-size: 20px;
      width: 20px;
      padding-top: 58px;
      padding-left: 15px;
      margin-top: -20px;
    }
  }
}
</style>
