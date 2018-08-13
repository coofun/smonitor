<template>
    <div class="right_menu">
      <div class="right_menu_tit"></div>
      <div class="diquliebiao">
        <ul>
          <li v-for="city in cityList" :key="city.city" @click="selectCity(city)"><img src="@/assets/images/北京.png">{{city.city}}</li>
        </ul>
      </div>
    </div>
</template>

<script>
export default {
  name: 'city-list',
  props: { cityList: Array, currentCity: Object },
  methods: {
    selectCity(city) {
      this.$emit('select-city', city)
    }
  }
}
</script>
