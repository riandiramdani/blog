<template>
  <v-app-bar
      :clipped-left="true"
      fixed
      color="#0d1137"
      flat
      dark
      height="70"
      class="px-md-12"
      :extension-height="30"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="hidden-sm-and-up"/>
      <router-link to="/" class="" style="line-height: normal;">
        <img src="/logo-otaku.png" :height="logoHeight" alt="otaku.co.id Logo">
      </router-link>
      <v-spacer />

      <v-btn icon class="mr-2 d-none d-md-flex" to="/search">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <!-- Notifications -->
      <notifications  v-if="$auth.loggedIn"></notifications>
      <user-menu v-if="$auth.loggedIn"></user-menu>
      <template v-else>
        <!-- <v-btn to="/register" small color="red accent-2" outlined dark class="mr-2">Register</v-btn> -->
        <v-btn to="/login" small color="orange darken-3" dark>Write Story</v-btn>
      </template>
      <template v-slot:extension class="px-0">
        <top-menu></top-menu>
      </template>
    </v-app-bar>
</template>

<script>
import UserMenu from '@/components/admin/UserMenu'
import TopMenu from '@/components/TopMenu'
import Notifications from '@/components/ui/Notifications'
export default {
  name: 'default-toobar',
  components: { UserMenu, TopMenu, Notifications },
  data() {
    return {
      items: [
        {
          icon: 'mdi-account-circle',
          href: '#',
          title: 'Profile',
          click: (e) => {
            console.log(e);
          }
        },
        {
          icon: 'mdi-settings',
          href: '#',
          title: 'Settings',
          click: (e) => {
            console.log(e);
          }
        },
        {
          icon: 'mdi-fullscreen-exit',
          href: '#',
          title: 'Logout',
          click: (e) => {
            console.log(e);
          }
        }
      ],
    }
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.defaultDrawer
      },
      set(val) {
        this.$store.commit('defaultDrawer', val)
      }
    },
    logoHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 36
        case 'sm': return 36
        case 'md': return 45
        case 'lg': return 45
        case 'xl': return 45
        default: return 36
      }
    }
  }
}
</script>

<style>
  .v-toolbar__extension {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
</style>
