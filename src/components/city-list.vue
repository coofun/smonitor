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
  props: { cities: Array, currentCity: Object },
  methods: {
    selectCity(city) {
      this.$emit('select-city', city)
    }
  }
}
</script>
