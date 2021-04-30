<template>
  <v-layout>
    <v-container>
      <h1 class="headline grey--text text-darken-4">Manage Users</h1>
      <div class="mt-6">
        <v-card>
          <form @submit.prevent="storeUser()">
            <v-card-title class="white--text grey">Add User</v-card-title>
            <v-card-subtitle class="mt-4">User Data</v-card-subtitle>
            <v-card-text>
              <v-select
                :items="roleOptions"
                v-model="formData.role"
                label="Role (*)"
                color="red accent-2"
                outlined
                dense
              ></v-select>

              <v-select
                :items="statusOptions"
                v-model="formData.status"
                label="Status (*)"
                color="red accent-2"
                outlined
                dense
              ></v-select>

              <v-text-field
                v-model="formData.username"
                type="text"
                label="Username (*)"
                color="red accent-2"
                outlined
                dense
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.email"
                type="email"
                label="Email (*)"
                color="red accent-2"
                outlined
                dense
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.password"
                type="password"
                label="Password (*)"
                color="red accent-2"
                outlined
                dense
                required
              ></v-text-field>

              <v-divider></v-divider>
              <div class="text-right">
                <v-btn
                  color="primary"
                  type="submit"
                  class="px-8 my-6"
                  :loading="loading"
                >
                  Save
                </v-btn>
              </div>
            </v-card-text>
          </form>
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
      formData: {
        role: 'member',
        status: 1,
        username: '',
        email: '',
        password: '',
      },
      roleOptions: [
        { text: 'Member', value: 'member'},
        { text: 'Admin', value: 'admin'}
      ],
      statusOptions: [
        { text: 'Active', value: 1},
        { text: 'Pending', value: 2},
        { text: 'Inactive', value: 3}
      ],
      snackbar: false,
      snackbarMessage: '',
      isError: false,
      disabled: false,
      loading: false  ,
    }
  },
  methods: {
    storeUser() {
      this.loading = true
      this.disabled = true
      this.$api.adminStoreUser(this.formData)
        .then(res => {
          this.loading = false
          this.disabled = false
          this.snackbarMessage = res.data.response_message
          this.isError = false
          this.snackbar = true
          this.clearFormData()
        })
        .catch(err => {
          this.snackbarMessage = 'Error: ' + err.response.data.response_message
          this.isError = true
          this.snackbar = true
          this.loading = false
          this.disabled = false
        })
    },
    clearFormData() {
      this.formData.role = ''
      this.formData.status = ''
      this.formData.username = ''
      this.formData.email = ''
      this.formData.password = ''
    }
  }
}
</script>
