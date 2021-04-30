<template>
  <v-layout>
    <v-container class="py-0">
      <client-only>
        <div class="mb-3">
          <span>Your Referral URL: </span>
          <router-link :to="{ name: 'referrals-username', params: { username: $store.state.auth.user.username }}">{{ baseUrl + '/' + $store.state.auth.user.username }}</router-link>
        </div>
      </client-only>
      <v-card>
        <v-data-table
          :headers="headers"
          :items="users"
          :options.sync="options"
          :loading="loading"
          :server-items-length="meta.total"
          :footer-props="footerOptions"
          fixed-header
        >
          <template v-slot:item.username="{ item }">
            <router-link
              target="_blank"
              :to="{ name:'author-username', params: { username: item.username}}"
            >
              {{ item.username }}
            </router-link>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  layout: 'member',
  components: {},
  data() {
    return {
      users: [],
      options: {
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
      },
      loading: true,
      footerOptions: {
        disableItemsPerPage: true,
        itemsPerPageOptions: [10, 30, 50],
      },
      headers: [
        { text: 'Username', value: 'username' },
        { text: 'Date', value: 'created_at' }
        // { text: 'Referred By', value: 'reffered_by.username' },
      ],
      snackbar: false,
      snackbarMessage: '',
      isError: false,
      page: 1,
      meta: {},
      links: {},
    }
  },
  watch: {
    options: {
      handler () {
        this.fetchUsers()
      },
      deep: true,
    },
  },
  created() {
    this.fetchUsers()
  },
  computed: {
    baseUrl() {
      return process.env.BASE_URL
    }
  },
  methods: {
    fetchUsers() {
      this.loading = true
      let order = this.options.sortBy[0]
      let dir = (this.options.sortDesc[0]) ? 'desc' : 'asc'

      let params = {
        page: this.options.page,
        order: order,
        dir: dir,
      }

      this.$api.memberGetReferralUser(params)
        .then(res => {
          this.users = res.data.data
          this.meta = res.data.meta
          this.loading = false
        })
    },
  }
}
</script>
