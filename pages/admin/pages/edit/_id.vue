<template>
  <v-layout>
    <v-container>
      <h1 class="headline grey--text text-darken-4">Manage Pages</h1>
      <div class="mt-6">
        <form @submit.prevent="updatePage()" class="ma-0 pa-0 d-inline">
          <v-row>
            <v-col cols="12" md="9">
              <v-card width="100%">
                <v-card-title class="white--text grey">Edit Page</v-card-title>
                <v-card-subtitle class="mt-4">Page Data</v-card-subtitle>
                <v-card-text>
                  <v-text-field
                    type="text"
                    label="Title (*)"
                    color="red accent-2"
                    dense
                    outlined
                    v-model="formData.title"
                    required
                    :disabled="disabled"
                  ></v-text-field>

                  <v-text-field
                    type="text"
                    label="Slug (*)"
                    color="red accent-2"
                    dense
                    outlined
                    v-model="formData.slug"
                    required
                    :disabled="disabled"
                  ></v-text-field>

                  <editor
                    :content="formData.content"
                    @content-changed="formData.content = $event"
                  ></editor>

                  <v-divider></v-divider>
                  <div class="text-right">
                    <v-btn
                      color="primary"
                      type="submit"
                      class="px-8 my-6"
                      :loading="formLoading"
                    >
                      Save
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col class="px-0">
              <v-row no-gutters="">
                <v-col cols="12">
                  <v-card width="100%">
                    <v-card-title class="white--text grey">Page Settings</v-card-title>
                    <v-card-subtitle class="mt-4">Basics</v-card-subtitle>
                    <v-card-text>
                      <v-select
                        :items="statusOptions"
                        :disabled="disabled"
                        v-model="formData.status"
                        label="Status (*)"
                        color="red accent-2"
                        outlined
                        dense
                      ></v-select>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </form>
      </div>
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
import Editor from '@/components/ui/Editor'
export default {
  layout: 'admin',
  components: { Editor },
  data() {
    return {
      page: {},
      statusOptions: [
        { text: 'Active', value: 1 },
        { text: 'Inactive', value: 2 },
      ],
      disabled: false,
      formLoading: false,
      formData: {
        title: null,
        slug: null,
        status: null,
        content: '',
      },
      snackbar: false,
      snackbarMessage: '',
      isError: false,
      pageError: false,
      errors: [],
      statusRendering: false,
    }
  },
  created() {
    this.fetchPage()
  },
  methods: {
    fetchPage() {
      this.$api.adminFetchPage(this.$route.params.id)
        .then(res => {
          let data = res.data.data
          this.page = data
          this.formData.title = this.page.title
          this.formData.slug = this.page.slug
          this.formData.content = this.page.content
          this.formData.status = this.page.status
          this.statusRendering = true
        })
        .catch(err => {
          const error = err.response
          this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText
          this.pageError = true
          this.isError = true
          this.snackbar = true
        })
    },
    updatePage() {
      this.formLoading = true
      this.disabled = true
      this.$api.adminUpdatePage(this.formData, this.page.id)
        .then(res => {
          this.snackbarMessage = res.data.response_message
          this.isError = false
          this.snackbar = true
          this.formLoading = false
          this.disabled = false
          this.fetchPage()
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
          this.disabled = false
        })
    }
  }
}
</script>
