<template>
  <v-layout>
    <v-container class="py-0">
      <v-card v-if="!user.username" class="mb-6">
        <form @submit.prevent="setUsername()">
          <v-card-title class="white--text grey">Set Username</v-card-title>
          <v-card-subtitle class="mt-4">User Data</v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-model="formDataUsername.username"
              type="text"
              :disabled="disabled"
              label="Username"
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
                :loading="buttonLoading"
              >
                Save
              </v-btn>
            </div>
          </v-card-text>
        </form>
      </v-card>

      <v-card>
        <form @submit.prevent="updateSettings()">
          <v-card-title class="white--text grey">Settings</v-card-title>
          <v-card-subtitle class="mt-4">User Data</v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-if="user.username"
              :value="user.username"
              type="text"
              label="Username"
              color="red accent-2"
              disabled
              outlined
              dense
            ></v-text-field>

            <v-text-field
              v-model="formDataSettings.name"
              :disabled="disabled"
              type="text"
              label="Name (*)"
              color="red accent-2"
              outlined
              dense
              required
            ></v-text-field>

            <v-textarea
              v-model="formDataSettings.description"
              :disabled="disabled"
              label="Biography"
              color="red accent-2"
              no-resize
              rows="4"
              outlined
              dense
            ></v-textarea>

            <div class="d-flex justify-space-between">
              <v-img class="mb-6" width="90px" max-width="90px" :src="user.profile_image"></v-img>

              <v-file-input
                label="Profile Picture"
                :disabled="disabled"
                outlined
                dense
                v-model="formDataSettings.upload_image"
                name="file"
                color="red accent-2"
              ></v-file-input>
            </div>
          </v-card-text>

          <v-card-subtitle class="mt-4">Social Networks</v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-model="formDataSettings.social_networks.facebook"
              type="text"
              label="Facebook"
              color="red accent-2"
              :disabled="disabled"
              outlined
              dense
            ></v-text-field>

            <v-text-field
              v-model="formDataSettings.social_networks.instagram"
              type="text"
              label="Instagram"
              color="red accent-2"
              :disabled="disabled"
              outlined
              dense
            ></v-text-field>

            <v-text-field
              v-model="formDataSettings.social_networks.twitter"
              type="text"
              label="Twitter"
              color="red accent-2"
              :disabled="disabled"
              outlined
              dense
            ></v-text-field>

            <v-divider></v-divider>
            <div class="text-right">
              <v-btn
                color="primary"
                type="submit"
                class="px-8 my-6"
                :loading="buttonLoading"
              >
                Save
              </v-btn>
            </div>
          </v-card-text>
        </form>
      </v-card>

      <!-- Password Change -->
      <v-card class="mt-6">
        <form @submit.prevent="updatePassword()">
          <v-card-title class="white--text grey">Password Change</v-card-title>
          <v-card-subtitle class="mt-4">User Password</v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-model="formDataPasswordChange.current_password"
              type="password"
              label="Current Password (*)"
              color="red accent-2"
              :disabled="disabled"
              outlined
              required
              dense
            ></v-text-field>

            <v-text-field
              v-model="formDataPasswordChange.new_password"
              type="password"
              label="New Password (*)"
              color="red accent-2"
              outlined
              required
              dense
            ></v-text-field>

            <v-text-field
              v-model="formDataPasswordChange.new_password_confirmation"
              type="password"
              label="New Password Confirmation (*)"
              color="red accent-2"
              outlined
              required
              dense
            ></v-text-field>

            <v-divider></v-divider>
            <div class="text-right">
              <v-btn
                color="primary"
                type="submit"
                class="px-8 my-6"
                :loading="buttonLoading"
              >
                Save
              </v-btn>
            </div>
          </v-card-text>
        </form>
      </v-card>
    </v-container>
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
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  layout: 'member',
  components: {},
  data() {
    return {
      user: {},
      formDataSettings: {
        name: '',
        description: '',
        upload_image: null,
        social_networks: {
          facebook: '',
          twitter: '',
          instagram: '',
        }
      },
      formDataPasswordChange: {
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      },
      formDataUsername: {
        username: '',
      },
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
    this.getUser()
  },
  methods: {
    getUser() {
      this.$api.memberFetchUser()
        .then(res => {
          let data = res.data.data
          this.user = data
          this.formDataSettings.name = data.name
          this.formDataSettings.description = data.description
          this.formDataSettings.social_networks.facebook = data.social_networks.facebook
          this.formDataSettings.social_networks.instagram = data.social_networks.instagram
          this.formDataSettings.social_networks.twitter = data.social_networks.twitter
        })
        .catch(err => {
          const error = err.response
          this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText
          this.pageError = true
          this.isError = true
          this.snackbar = true
        })
    },
    updateSettings() {
      this.buttonLoading = true
      this.formLoading = true
      this.disabled = true
      let formData = new FormData()
      formData.append('name', this.formDataSettings.name)
      formData.append('description', this.formDataSettings.description)
      formData.append('social_networks[facebook]', this.formDataSettings.social_networks.facebook)
      formData.append('social_networks[instagaram]', this.formDataSettings.social_networks.instagaram)
      formData.append('social_networks[twitter]', this.formDataSettings.social_networks.twitter)
      if (this.formDataSettings.upload_image) {
        let file = this.formDataSettings.upload_image
        formData.append('upload_image', this.formDataSettings.upload_image)
      }

      this.$api.memberUpdateSettings(formData)
        .then(res => {
          this.snackbarMessage = res.data.response_message
          this.isError = false
          this.snackbar = true
          this.formLoading = false
          this.buttonLoading = false
          this.disabled = false
          this.getUser()
        })
        .catch(err => {
          // console.log(error)
          const error = err.response
          this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText

          if (error.status == 422) {
            let errors = Object.values(Object.values(error.data.errors))

            this.snackbarMessage = 'Error: ' + error.status + '<br>'
            for (let index = 0; index < errors.length; index++) {
              this.snackbarMessage += errors[index]
              if (index !== errors.length - 1) {
                this.snackbarMessage += '<br>'
              }
            }
          }

          this.pageError = true
          this.isError = true
          this.snackbar = true
          this.formLoading = false
          this.buttonLoading = false
          this.disabled = false
        })
    },
    updatePassword() {
      this.buttonLoading = true
      this.formLoading = true
      this.disabled = true
      this.$api.memberUpdatePassword(this.formDataPasswordChange)
        .then(res => {
          this.snackbarMessage = res.data.response_message
          this.isError = false
          this.snackbar = true
          this.formLoading = false
          this.buttonLoading = false
          this.disabled = false
          this.getUser()
          this.clearPasswordForm()
        })
        .catch(err => {
          // console.log(error)
          const error = err.response
          this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText

          if (error.status == 422) {
            let errors = Object.values(Object.values(error.data.errors))

            this.snackbarMessage = 'Error: ' + error.status + '<br>'
            for (let index = 0; index < errors.length; index++) {
              this.snackbarMessage += errors[index]
              if (index !== errors.length - 1) {
                this.snackbarMessage += '<br>'
              }
            }
          }

          this.pageError = true
          this.isError = true
          this.snackbar = true
          this.formLoading = false
          this.buttonLoading = false
          this.disabled = false
        })
    },
    setUsername() {
      this.buttonLoading = true
      this.formLoading = true
      this.disabled = true
      this.$api.memberSetUsername(this.formDataUsername)
        .then(res => {
          this.snackbarMessage = res.data.response_message
          this.isError = false
          this.snackbar = true
          this.formLoading = false
          this.buttonLoading = false
          this.disabled = false
          this.getUser()
          this.$auth.fetchUser()
        })
        .catch(err => {
          // console.log(error)
          const error = err.response
          this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText

          if (error.status == 422) {
            let errors = Object.values(Object.values(error.data.errors))

            this.snackbarMessage = 'Error: ' + error.status + '<br>'
            for (let index = 0; index < errors.length; index++) {
              this.snackbarMessage += errors[index]
              if (index !== errors.length - 1) {
                this.snackbarMessage += '<br>'
              }
            }
          }

          this.pageError = true
          this.isError = true
          this.snackbar = true
          this.formLoading = false
          this.buttonLoading = false
          this.disabled = false
        })
    },
    clearPasswordForm() {
      this.formDataPasswordChange.current_password = ''
      this.formDataPasswordChange.new_password = ''
      this.formDataPasswordChange.new_password_confirmation = ''
    }
  }
}
</script>
