<template>
  <v-slide-group multiple :show-arrows="showArrow" class="pb-3">
    <v-slide-item class="mr-3">
      <v-btn text link replace to="/" small dark>Home</v-btn>
    </v-slide-item>
    <v-slide-item
      v-for="(item, i) in categories"
      :key="i"
      class="mr-3"
    >
      <v-btn text link :to="{ name: 'category-slug', params: { slug: item.slug }}" small dark>{{ item.name }}</v-btn>
      <!-- <router-link to="#" style="text-decoration: none; color: #fff; font-weight: normal; font-size: 18px;">

      </router-link> -->
    </v-slide-item>
  </v-slide-group>
  <!-- <v-tabs align-with-title>
    <v-tab  v-for="(item, i) in items" :key="i">
      <router-link to="#">
        item.title
      </router-link>
    </v-tab>
  </v-tabs> -->
</template>

<script>
export default {
  name: 'top-menu',
  data() {
    return {
      showArrow: true
    }
  },
  computed: {
    categories() {
      return this.$store.getters.categories
    }
  },
  created() {
    this.checkClient()
  },
  methods: {
    checkClient() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': this.showArrow = false
        case 'sm': this.showArrow = false
        case 'md': this.showArrow = true
        case 'lg': this.showArrow = true
        case 'xl': this.showArrow = true
        default: this.showArrow = true
      }
    }
  },
}
</script>
