<template>
  <v-app dark>
    <navigation-drawer></navigation-drawer>

    <app-toolbar></app-toolbar>

    <v-content style="padding-top: 100px;">
      <v-container :fluid="false" style="min-height: 600px">
        <v-layout>
          <v-container class="mt-3">
            <v-row>
              <v-col cols="12" sm="4" md="3">
                <v-btn
                  v-if="$store.state.auth.user.role === 'admin'"
                  block
                  color="red accent-2"
                  dark
                  class="mb-5"
                  height="50"
                  to="/admin/dashboard"
                >Admin Page</v-btn>
                <member-menu></member-menu>
              </v-col>

              <v-col cols="12" sm="8" md="9">
                <nuxt />
                <bottom-navigation></bottom-navigation>
              </v-col>
            </v-row>
          </v-container>
        </v-layout>
      </v-container>
    </v-content>
    <footer-el></footer-el>
  </v-app>
</template>

<script>
import AppToolbar from '@/components/AppToolbar'
import MemberMenu from '@/components/MemberMenu'
import FooterEl from '@/components/ui/Footer'
import NavigationDrawer from '@/components/NavigationDrawer'
import BottomNavigation from '@/components/ui/BottomNavigation'
export default {
  components: { AppToolbar, NavigationDrawer, MemberMenu, BottomNavigation, FooterEl },
  middleware: ['auth'],
  data () {
    return {}
  },
}
</script>
