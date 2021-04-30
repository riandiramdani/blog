<template>
  <v-layout>
    <v-container v-if="!pageError">
      <h1 class="headline grey--text text-darken-4">Manage Files</h1>
      <div class="mt-6">
        <v-card>
          <form @submit.prevent="updateFile()">
            <v-card-title class="white--text grey">Edit File</v-card-title>
            <v-card-subtitle class="mt-4">File Data</v-card-subtitle>
            <v-card-text>
              <v-text-field
                type="text"
                label="File URL"
                color="red accent-2"
                dense
                outlined
                disabled
                v-model="file.thumbnail"
              ></v-text-field>

              <v-text-field
                type="text"
                label="Name (*)"
                color="red accent-2"
                dense
                outlined
                v-model="formData.name"
                required
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
      fileId: null,
      file: {},
      formData: {
        name: null,
      },
      snackbar: false,
      snackbarMessage: '',
      isError: false,
      pageError: false
    }
  },
  created() {
    this.getFile()
  },
  methods: {
    getFile() {
      this.$api.adminFetchFile(this.$route.params.id)
        .then(res => {
          let data = res.data.data
          this.fileId = data.id
          this.file = data
          this.formData.name = data.name
        })
        .catch(err => {
          const error = err.response
          this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText
          this.pageError = true
          this.isError = true
          this.snackbar = true
        })
    },
    updateFile() {
      this.$api.adminUpdateFile(this.formData, this.fileId)
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
