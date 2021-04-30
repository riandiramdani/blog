<template>
  <v-layout>
    <v-flex class="text-center">
      <v-card class="mx-auto mt-3 mt-sm-5" max-width="600px" flat>
        <h2 class="display-1 text-center">Registrasi User</h2>
        <v-container fluid>
          <form @submit.prevent="registerUser()">
            <v-row dense class="pt-3 pb-5">
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  type="text"
                  label="Name"
                  color="red accent-2"
                  dense
                  outlined
                  :disabled="disabled"
                  v-model="formData.name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  type="text"
                  label="Username"
                  color="red accent-2"
                  dense
                  outlined
                  :disabled="disabled"
                  v-model="formData.username"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="email"
                  label="Email"
                  color="red accent-2"
                  dense
                  outlined
                  :disabled="disabled"
                  v-model="formData.email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="password"
                  label="Password"
                  color="red accent-2"
                  dense
                  outlined
                  :disabled="disabled"
                  v-model="formData.password"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="password"
                  label="Password Confirmation"
                  color="red accent-2"
                  dense
                  outlined
                  :disabled="disabled"
                  v-model="formData.password_confirmation"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="text-center">
                <v-btn color="red accent-2" dark type="submit" :loading="buttonLoading">
                  Daftar
                </v-btn>
              </v-col>
            </v-row>
          </form>

          <v-divider class="mt-2 mb-6"></v-divider>

          <v-row dense="">
            <v-col cols="12">
              <span>Sudah punya akun? </span>
              <v-btn color="red accent-2" small dark to="/login">
                Masuk
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-flex>
    <v-snackbar
      v-model="snackbar"
      :multi-line="true"
    >
      <span :class="{'red--text': isError}" v-html="snackbarMessage"></span>
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
import Cookies from 'js-cookie'
export default {
  layout: 'default',
  data() {
    return {
      formData: {
        email: null,
        username: null,
        password: null,
        password_confirmation: null,
        name: null,
        referred_by_username: '',
      },
      redirect: undefined,
      loading: false,
      disabled: false,
      buttonLoading: false,
      snackbar: false,
      snackbarMessage: '',
      isError: false,
      pageError: false,
      errors: [],
    }
  },
  mounted() {
    let ref = Cookies.get('ref')

    if (ref !== undefined) {
      console.log(ref)
      this.formData.referred_by_username = ref
    }
  },
  methods: {
    registerUser() {
      this.disabled = true
      this.buttonLoading = true
      this.$api.register(this.formData)
        .then(res => {
          this.disabled = false
          this.buttonLoading = false
          this.isError = false
          this.pageError = false
          this.snackbar = true
          this.snackbarMessage = res.data.response_message
          this.formData.password = ''
          this.formData.password_confirmation = ''
        })
        .catch(err => {
          const error = err.response
          this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText

          if (error.status == 422) {
            if (error.data.errors) {
              let errors = Object.values(Object.values(error.data.errors))
              this.snackbarMessage = 'Error: ' + error.status + '<br>'
              for (let index = 0; index < errors.length; index++) {
                this.snackbarMessage += errors[index]
                if (index !== errors.length - 1) {
                  this.snackbarMessage += '<br>'
                }
              }
            } else {
              this.snackbarMessage = 'Error: ' + error.status + ':'
              this.snackbarMessage += error.data.response_message
            }
          }

          this.isError = true
          this.snackbar = true
          this.disabled = false
          this.buttonLoading = false
        })
    },
  }
}
</script>
