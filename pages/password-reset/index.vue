<template>
  <v-layout>
    <v-flex class="text-center">
      <v-card class="mx-auto mt-xs-0 mt-sm-5" max-width="400px" flat>
        <h2 class="display-1 text-center d-sm-block pt-5 pt-sm-0">Forgot Password</h2>
        <v-container fluid>
          <form @submit.prevent="sendPasswordReset()">
            <v-row dense class="pt-3 pb-5">
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
              <v-col class="text-center">
                <v-btn color="red accent-2" dark type="submit" :loading="buttonLoading">
                  Reset Password
                </v-btn>
              </v-col>
            </v-row>
          </form>

          <v-divider class="mt-2 mb-6"></v-divider>

          <v-row dense="">
            <v-col cols="12">
              <v-btn color="red accent-2" small dark to="/login">
                Login
              </v-btn>
              <v-btn color="red accent-2" small dark to="/register">
                Daftar
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
export default {
  data() {
    return {
      formData: {
        email: null,
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
  methods: {
    sendPasswordReset() {
      this.disabled = true
      this.buttonLoading = true
      this.$api.passwordResetGetEmail(this.formData)
        .then(res => {
          this.disabled = false
          this.buttonLoading = false
          this.isError = false
          this.pageError = false
          this.snackbar = true
          this.snackbarMessage = res.data.response_message
          this.formData.email = ''
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
