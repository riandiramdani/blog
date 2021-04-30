<template>
  <v-layout>
    <v-container>
      <h1 class="headline grey--text text-darken-4">Manage Users</h1>
      <div class="mt-6">
        <div class="text-right">
          <v-btn color="primary" to="/admin/users/add">
            <v-icon class="mr-2">mdi-plus-box</v-icon>
            Add User
          </v-btn>
        </div>

        <div class="mt-6">
          <!-- <form @submit.prevent="fetchUsers()">
            <v-row no-gutters>
              <v-col cols="12" md="4" class="pr-2">
                <v-text-field
                  type="text"
                  label="ID"
                  color="red accent-2"
                  dense
                  outlined
                  v-model="formData.Filter.id"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" class="pr-2">
                <v-select
                  :items="statusOptions"
                  v-model="formData.Filter.status"
                  label="Status"
                  color="red accent-2"
                  outlined
                  dense
                ></v-select>
              </v-col>

              <v-col cols="12" md="4" class="pr-2">
                <v-text-field
                  type="text"
                  label="Username"
                  color="red accent-2"
                  dense
                  outlined
                  v-model="formData.Filter.username"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" class="pr-2">
                <v-text-field
                  type="email"
                  label="email"
                  color="red accent-2"
                  dense
                  outlined
                  v-model="formData.Filter.email"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" class="pr-2">
                <v-text-field
                  type="text"
                  label="Login IP"
                  color="red accent-2"
                  dense
                  outlined
                  v-model="formData.Filter.login_ip"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" class="pr-2">
                <v-text-field
                  type="text"
                  label="Register IP"
                  color="red accent-2"
                  dense
                  outlined
                  v-model="formData.Filter.register_ip"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" class="pr-2 mb-6">
                <v-btn type="submit" color="primary">Submit</v-btn>
                <v-btn type="submit" text color="primary" @click="resetFilter()">Reset</v-btn>
              </v-col>
            </v-row>
          </form> -->
        </div>

        <v-card class="mt-3">
          <v-data-table
            :headers="headers"
            :items="users"
            :options.sync="options"
            :loading="loading"
            :server-items-length="meta.total"
            :footer-props="footerOptions"
            fixed-header
          >
            <template v-slot:item.user.username="{ item }">
              <router-link
                target="_blank"
                :to="{ name:'author-username', params: { username: item.user.username}}"
              >
                {{ item.user.username }}
              </router-link>
            </template>

            <template v-slot:item.reffered_by.username="{ item }">
              <router-link
                target="_blank"
                :to="{ name:'author-username', params: { username: item.reffered_by.username}}"
              >
                {{ item.reffered_by.username }}
              </router-link>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-container>
    <v-snackbar
      v-model="snackbar"
      :multi-line="false"
    >
      <span :class="{'red--text': isError}">{{ snackbarMessage }}</span>
      <v-btn
        color="red"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
export default {
  layout: 'admin',
  data() {
    return {
      users: [],
      formData: {
        Filter: {
          id: '',
          username: '',
          status: '',
          email: '',
          login_ip: '',
          register_ip: '',
        }
      },
      statusOptions: [
        { text: 'Active', value: 1},
        { text: 'Pending', value: 2},
        { text: 'Inactive', value: 3}
      ],
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
        { text: 'Username', value: 'user.username' },
        { text: 'Referred By', value: 'reffered_by.username' },
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

      this.$api.adminGetReferralUser(params)
        .then(res => {
          this.users = res.data.data
          this.meta = res.data.meta
          this.loading = false
        })
    },
  }
}
</script>
