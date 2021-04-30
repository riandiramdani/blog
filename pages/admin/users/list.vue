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

        <div class="mt-6 mb-n6">
          <form @submit.prevent="fetchUsers()">
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
          </form>
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
            <!-- <template v-slot:item.thumbnail="{ item }">
              <v-avatar width="70" height="70" tile>
                <v-img :src="item.thumbnail"></v-img>
              </v-avatar>
            </template> -->

            <template v-slot:item.username="{ item }">
              <router-link
                target="_blank"
                :to="{ name:'author-username', params: { username: item.username}}"
              >
                {{ item.username }}
              </router-link>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    depressed
                    icon
                    fab
                    dark
                    color="primary"
                    small
                    :to="{ name:'admin-users-edit-id', params: { id: item.id}}"
                    v-on="on"
                  >
                    <v-icon>mdi-circle-edit-outline</v-icon>
                  </v-btn>
                </template>
                <span>Edit Users</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    depressed
                    icon
                    fab
                    dark
                    color="pink"
                    small
                    @click="deleteUser(item.id)"
                    v-on="on"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete User</span>
              </v-tooltip>
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
        { text: 'ID', value: 'id' },
        { text: 'Username', value: 'username', sortable: false, filterable: false },
        { text: 'Status', value: 'status' },
        { text: 'Email', value: 'email' },
        { text: 'Login IP', value: 'login_ip' },
        { text: 'Register IP', value: 'register_ip' },
        { text: 'Updated At', value: 'updated_at' },
        { text: 'Created At', value: 'created_at' },
        { text: 'Actions', value: 'actions', width: 120, sortable: false, filterable: false },
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
        id: this.formData.Filter.id,
        username: this.formData.Filter.username,
        status: this.formData.Filter.status,
        email: this.formData.Filter.email,
        login_ip: this.formData.Filter.login_ip,
        register_ip: this.formData.Filter.register_ip,
      }

      this.$api.adminGetUsers(params)
        .then(res => {
          this.users = res.data.data
          this.meta = res.data.meta
          this.loading = false
        })
    },
    deleteUser(userId) {
      if (confirm('Are you sure to delete this item?')) {
        this.$api.adminDeleteUser(userId)
          .then(res => {
              this.fetchUsers()
              this.snackbarMessage = res.data.response_message
              this.isError = false
              this.snackbar = true
          })
          .catch(err => {
            const error = err.response
            this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText
            this.isError = true
            this.snackbar = true
          })
      }
    },
    resetFilter() {
      this.formData.Filter.id = '';
      this.formData.Filter.username = '';
      this.formData.Filter.status = '';
      this.formData.Filter.email = '';
      this.formData.Filter.login_ip = '';
      this.formData.Filter.register_ip = '';
      this.fetchUsers()
    }
  }
}
</script>
