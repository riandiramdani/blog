<template>
    <v-app-bar
      :clipped-left="false"
      fixed
      app
    >
      <!-- Drawer Toggle -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-app-bar-nav-icon @click.stop="toggleDrawer()" v-on="on" />
        </template>
        <span v-if="drawer">Hide Drawer</span>
        <span v-else>Show Drawer</span>
      </v-tooltip>

      <!-- Mini Variant Toggle -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon @click.stop="toggleMiniVariant()">
            <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
          </v-btn>
        </template>
        <span>Mini Variant</span>
      </v-tooltip>

      <!-- Title -->
      <v-toolbar-title v-text="'Admin Area'" class="ml-4" />
      <v-spacer />

      <!-- <v-btn to="/" class="mr-2" depressed color="primary">Member Area</v-btn> -->

      <notifications v-if="$auth.loggedIn"></notifications>

      <!-- Profile -->
      <user-menu></user-menu>
    </v-app-bar>
</template>

<script>
import UserMenu from '@/components/admin/UserMenu'
import Notifications from '@/components/ui/Notifications'
export default {
  name: 'admin-toolbar',
  components: { UserMenu, Notifications },
  data() {
    return {
      title: this.$route.name,
    }
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer
      },
      set(val) {
        this.$store.commit('drawer', val)
      }
    },
    miniVariant: {
      get() {
        return this.$store.state.miniVariant
      },
      set(val) {
        this.$store.commit('miniVariant', val)
      }
    }
  },
  methods: {
    toggleDrawer() {
      this.$store.commit('toggleDrawer')
    },
    toggleMiniVariant() {
      this.$store.commit('toggleMiniVariant')
    }
  }
}
</script>
