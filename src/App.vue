<template>
<div id="app">
    <div class="banner"></div>
    <div class="tab">
        <div class="home">首页</div>
        <div class="map">地图</div>
    </div>
    <router-view/>
</div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
#app {
  background-color: transparent;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
