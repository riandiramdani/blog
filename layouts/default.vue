<template>
  <v-app dark>
    <navigation-drawer></navigation-drawer>

    <app-toolbar></app-toolbar>

    <v-content style="padding-top: 100px;">
      <v-container :fluid="false" style="min-height: 600px">
        <nuxt />
        <bottom-navigation></bottom-navigation>
      </v-container>
    </v-content>
    <footer-el></footer-el>
  </v-app>
</template>

<script>
import AppToolbar from '@/components/AppToolbar'
import NavigationDrawer from '@/components/NavigationDrawer'
import FooterEl from '@/components/ui/Footer'
import BottomNavigation from '@/components/ui/BottomNavigation'
export default {
  components: { AppToolbar, NavigationDrawer, FooterEl, BottomNavigation },
  data () {
    return {}
  },
}
</script>
