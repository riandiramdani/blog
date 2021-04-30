<template>
<div>
  <v-expansion-panels :value="panel">
    <v-expansion-panel>
      <v-expansion-panel-header>ACTIONS</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list shaped>
          <v-list-item-group v-model="item" color="primary">
            <v-list-item
              color="red accent-2"
              v-for="(item, i) in items"
              :key="i"
              :to="item.href"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              color="red accent-2"
              @click="logout"
            >
              <v-list-item-icon>
                <v-icon>mdi-fullscreen-exit</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</div>
</template>

<script>
export default {
  name: 'member-menu',
  data() {
    return {
      panel: 0,
      item: 1,
      items: [
        { text: 'Dahsboard', icon: 'mdi-view-dashboard-outline', href: '/member/dashboard' },
        { text: 'Feed', icon: 'mdi-rss', href: '/member/feeds' },
        { text: 'My Articles', icon: 'mdi-file-multiple-outline', href: '/member/articles/list' },
        { text: 'Add Article', icon: 'mdi-file-document-edit-outline', href: '/member/articles/add' },
        { text: 'Refferals', icon: 'mdi-arrow-collapse', href: '/member/referrals' },
        { text: 'Settings', icon: 'mdi-settings', href: '/member/settings' }
      ],
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
    }
  }
}
</script>

<style>
  .v-expansion-panel-content__wrap {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
</style>
