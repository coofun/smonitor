<template>
<div class="right_menu">
    <div class="right_menu_tit"></div>
    <div class="diquliebiao">
        <ul>
            <li v-for="city in cities" :key="city" @click="selectCity(city)"><img src="@/assets/images/北京.png">{{city}}</li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
  name: 'city-list',
  props: {
    cities: Array
  },
  methods: {
    selectCity(city) {
      this.$emit('select-city', city)
    }
  }
}
</script>

<style lang="scss" scoped>
.right_menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 261px;
  height: 100%;
  z-index: 999;
  background: url(../assets/images/Rectangle22.png);
}
.right_menu_tit {
  background: url(../assets/images/right_menu_tit.png);
  width: 231px;
  height: 48px;
  margin-left: 30px;
}
.diquliebiao li {
  list-style-type: none;
  color: #d6b469;
  font-size: 20px;
  width: 261px;
  height: 56px;
  margin-bottom: 20px;
  line-height: 56px;
  cursor: pointer;
}
.diquliebiao li img {
  margin-right: 30px;
  vertical-align: middle;
  margin-left: 80px;
}
.diquliebiao li:hover {
  list-style-type: none;
  color: #2b281c;
  font-size: 20px;
  background: url(../assets/images/right_menu_bg.png) no-repeat;
  width: 261px;
  line-height: 56px;
  cursor: pointer;
}
</style>
