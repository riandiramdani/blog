<template>
  <v-layout>
    <v-container>
      <h1 class="headline grey--text text-darken-4">Manage Files</h1>
      <div class="mt-6">
        <v-card>
          <form @submit.prevent="storeFile()">
            <v-card-title class="white--text grey">Upload File</v-card-title>
            <v-card-subtitle class="mt-4">File</v-card-subtitle>
            <v-card-text>
              <v-file-input
                label="File Image"
                :disabled="disabled"
                outlined
                dense
                v-model="formData.file"
                name="file"
                color="red accent-2"
              ></v-file-input>

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
        file: null,
      },
      snackbar: false,
      snackbarMessage: '',
      isError: false,
      disabled: false,
      loading: false  ,
    }
  },
  methods: {
    storeFile() {
      this.loading = true
      this.disabled = true
      this.$api.adminStoreFile(this.formData.file)
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
      this.formData.file = null
    }
  }
}
</script>
