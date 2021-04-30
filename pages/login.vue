<template>
  <v-layout>
    <v-flex class="text-center">
      <v-card class="mx-auto mt-xs-0 mt-sm-5" max-width="400px" flat>
        <h2 class="display-1 text-center d-none d-sm-block">Login</h2>
        <v-container fluid>
          <form @submit.prevent="login()">
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
              <v-col class="text-center">
                <v-btn color="red accent-2" dark type="submit" :loading="buttonLoading">
                  Login
                </v-btn>
              </v-col>
            </v-row>
          </form>

          <v-divider class="mt-2 mb-6"></v-divider>

          <v-row dense="">
            <v-col cols="12">
              <v-btn color="red accent-2" text small dark to="/password-reset">
                Lupa Sandi?
              </v-btn>
            </v-col>
            <v-col cols="12">
              <span>Belum punya akun? </span>
              <v-btn color="red accent-2" small dark to="/register">
                Daftar
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn color="blue darken-3" small dark @click="fbLogin()">
                <v-icon class="mr-2" small>mdi-facebook</v-icon>
                Login Dengan Facebook
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn color="red" small dark @click="googleLogin()">
                <v-icon class="mr-2" small>mdi-google</v-icon>
                Login Dengan Google
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
  layout: 'default',
  data() {
    return {
      formData: {
        email: null,
        password: null,
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
    async login() {
      try {
        this.disabled = true
        this.buttonLoading = true
        await this.$auth.loginWith('local', {
          data: this.formData
        })
          .catch(err => {
            const error = err.response
            this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText

            if (error.status == 401 && error.data.response_code == 40102) {
              this.$store.commit('SET_EMAIL_VERIFY', this.formData.email)
              this.$router.push('/email-verify')
            } else if (error.status == 401) {
              let errors = error.data.response_message

              this.snackbarMessage = 'Error: ' + error.status + ':'
              this.snackbarMessage += errors
            }

            this.isError = true
            this.snackbar = true
            this.disabled = false
            this.buttonLoading = false
          });

        if (this.$auth.loggedIn) {
          this.disabled = false
          this.buttonLoading = false
        }
      } catch (e) {
          // this.$toast.error('Username or Password wrong', {icon: "error"});
      }
    },
    fbLogin() {
      try {
        this.$auth.loginWith('facebook')
      } catch (e) {
          // this.$toast.error('Username or Password wrong', {icon: "error"});
      }
    },
    googleLogin() {
      try {
        this.$auth.loginWith('google')
      } catch (e) {
          // this.$toast.error('Username or Password wrong', {icon: "error"});
      }
    },
    check(){
      console.log(this.$auth.loggedIn)
    },
    logout() {
      this.$auth.logout()
    },
  }
}
</script>
