<template>
  <v-menu
    offset-y
    origin="center center"
    :nudge-right="140"
    :nudge-bottom="10"
    transition="scale-transition"
  >
    <template  v-slot:activator="{ on }">
      <v-btn icon large v-on="on">
        <v-avatar size="30px">
          <img :src="avatar" :alt="name" />
        </v-avatar>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        @click="item.click"
      >
        <v-list-item-icon v-if="item.icon">
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'user-menu',
  data() {
    return {
      items: [
        {
          icon: 'mdi-shield-account',
          href: '#',
          title: 'Member Area',
          click: (e) => {
            this.$router.push('/member')
          }
        },
        {
          icon: 'mdi-bookmark',
          href: '#',
          title: 'Bookmark',
          click: (e) => {
            this.$router.push('/bookmark')
          }
        },
        {
          icon: 'mdi-settings',
          href: '#',
          title: 'Settings',
          click: (e) => {
            this.$router.push('/member/settings')
          }
        },
        {
          icon: 'mdi-fullscreen-exit',
          href: '#',
          title: 'Logout',
          click: () => {
            this.logout()
          },
        }
      ],
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'username',
      'avatar',
    ])
  },
  methods: {
    logout() {
      this.$auth.logout()
    }
  }
}
</script>
