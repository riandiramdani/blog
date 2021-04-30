<template>
  <v-app light>
    <app-drawer></app-drawer>
    <app-toolbar></app-toolbar>

    <!-- Content -->
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AppDrawer from '@/components/admin/AppDrawer'
import AppToolbar from '@/components/admin/AppToolbar'
export default {
  name: 'Admin',
  middleware: ['auth'],
  components: { AppDrawer, AppToolbar },
  data () {
    return {
      fixed: false,
      title: 'Admin'
    }
  }
}
</script>
