<template>
  <v-layout>
    <v-container v-if="!pageError">
      <h1 class="headline grey--text text-darken-4">Manage User</h1>
      <div class="mt-6">
        <v-card>
          <form @submit.prevent="updateUser()">
            <v-card-title class="white--text grey">Edit User</v-card-title>
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
                v-model="formData.name"
                type="text"
                label="Name"
                color="red accent-2"
                outlined
                dense
              ></v-text-field>

              <v-textarea
                v-model="formData.description"
                label="Biography"
                color="red accent-2"
                no-resize
                rows="4"
                outlined
                dense
              ></v-textarea>

              <v-text-field
                v-model="formData.password"
                type="password"
                label="Password (*)"
                color="red accent-2"
                outlined
                dense
              ></v-text-field>

              <v-divider></v-divider>
              <div class="text-right">
                <v-btn
                  color="primary"
                  type="submit"
                  class="px-8 my-6"
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
      userId: null,
      formData: {
        role: 'member',
        status: 1,
        username: '',
        description: '',
        name: '',
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
      pageError: false
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.$api.adminFetchUser(this.$route.params.id)
        .then(res => {
          let data = res.data.data
          this.userId = data.id
          this.formData.role = data.role
          this.formData.status = data.status
          this.formData.username = data.username
          this.formData.name = data.name
          this.formData.description = data.description
          this.formData.email = data.email
        })
        .catch(err => {
          const error = err.response
          this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText
          this.pageError = true
          this.isError = true
          this.snackbar = true
        })
    },
    updateUser() {
      this.$api.adminUpdateUser(this.formData, this.userId)
        .then(res => {
          this.snackbarMessage = res.data.response_message
          this.isError = false
          this.snackbar = true
        })
        .catch(err => {
          this.snackbarMessage = 'Error: ' + err.response.data.response_message
          this.isError = true
          this.snackbar = true
        })
    }
  }
}
</script>
