<template>
  <baidu-map class="map" :center="center" :zoom="zoom" :mapStyle="mapStyle"></baidu-map>
</template>

<script>
export default {
  name: 'city-map',
  data() {
    return {
      center: '济南市',
      zoom: 15,
      mapStyle: {
        features: ['point', 'road', 'water', 'land', 'building'],
        style: 'dark'
      }
    }
  }
}
</script>

<style scoped>
.map {
  background-color: transparent;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
