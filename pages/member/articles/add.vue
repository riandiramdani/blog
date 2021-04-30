<template>
  <v-layout>
    <v-container class="py-0">
      <form @submit.prevent="storeArticle()" class="ma-0 pa-0 d-inline">
      <v-card width="100%">
        <v-card-title class="white--text grey">Add New Article</v-card-title>
        <v-card-subtitle class="mt-4">Article Data</v-card-subtitle>
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

          <v-select
            v-model="formData.main_category"
            :items="categories"
            label="Category (*)"
            color="red accent-2"
            outlined
            dense
            :disabled="disabled"
          ></v-select>

          <v-textarea
            v-model="formData.summary"
            label="Summary (*)"
            color="red accent-2"
            no-resize
            required
            outlined
            dense
            :disabled="disabled"
          ></v-textarea>

          <editor
            :content="formData.content"
            @content-changed="formData.content = $event"
          ></editor>

          <v-textarea
            label="Message To Riviewer (*)"
            color="red accent-2"
            dense
            :disabled="disabled"
            outlined
            rows="3"
            v-model="formData.reason"
            no-resize
            class="mt-6"
          ></v-textarea>

          <v-file-input
            label="Featured Image"
            :disabled="disabled"
            outlined
            dense
            v-model="formData.upload_featured_image"
            name="file"
            color="red accent-2"
            @change="onFeatureImageChange()"
          ></v-file-input>

          <v-col cols="12" md="4" id="preview" class="pt-0">
            <span v-if="urlImgPreview">Preview: </span>
            <img
              v-if="urlImgPreview"
              :src="urlImgPreview"
              width="100%"
              class="elevation-3"
            />
          </v-col>

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
      </form>
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
  layout: 'member',
  components: { Editor },
  data() {
    return {
      disabled: false,
      formLoading: false,
      categories: [],
      urlImgPreview: null,
      formData: {
        title: '',
        summary: '',
        content: '',
        main_category: 1,
        category: this.main_category,
        reason: '',
        upload_featured_image: null,
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
    this.fetchArticle()
  },
  methods: {
    fetchArticle() {
      this.$api.memberCreateArticle()
        .then(res => {
          this.statusRendering = true
          let data = res.data.data
          this.categories = data.categories
        })
        .catch(err => {
          const error = err.response
          this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText
          this.pageError = true
          this.isError = true
          this.snackbar = true
        })
    },
    storeArticle() {
      this.formLoading = true
      this.disabled = true
      let formData = new FormData()
      formData.append('title', this.formData.title)
      formData.append('summary', this.formData.summary)
      formData.append('content', this.formData.content)
      formData.append('main_category', this.formData.main_category)
      formData.append('category', this.formData.main_category)
      formData.append('reason', this.formData.reason)

      if (this.formData.upload_featured_image) {
        let file = this.formData.upload_featured_image
        formData.append('upload_featured_image', file)
      }

      this.$api.memberStoreArticle(formData)
        .then(res => {
          this.snackbarMessage = res.data.response_message
          this.isError = false
          this.snackbar = true
          this.formLoading = false
          this.disabled = false
          this.$router.push('/member/articles/list')
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
    },
    onFeatureImageChange(e) {
      if (this.formData.upload_featured_image) {
        this.urlImgPreview = URL.createObjectURL(this.formData.upload_featured_image);
      } else {
        this.urlImgPreview = null
      }
    }
  }
}
</script>
