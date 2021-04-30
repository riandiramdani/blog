<template>
  <v-layout>
    <v-container class="py-0">
      <form @submit.prevent="updateArticle()" class="ma-0 pa-0 d-inline">
      <v-card width="100%">
        <v-card-title class="white--text grey">Edit Article</v-card-title>
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

          <!-- <v-select
            v-model="formData.main_category"
            :items="categories"
            label="Category (*)"
            color="red accent-2"
            outlined
            dense
            :disabled="disabled"
          ></v-select> -->

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
            <span v-if="urlImgPreview || statusRendering && article.meta.main_image_url">Preview: </span>

            <img
              v-if="!urlImgPreview && statusRendering && article.meta.main_image_url"
              :src="article.meta.main_image_url"
              width="100%"
              class="elevation-3"
            />

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
      article: {},
      articleId: null,
      urlImgPreview: null,
      formData: {
        title: '',
        summary: '',
        content: '',
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
      this.$api.memberFetchArticle(this.$route.params.id)
        .then(res => {
          let data = res.data.data
          this.categories = data.categories
          this.article = data.article
          this.articleId = this.article.id
          this.formData.title = this.article.title
          this.formData.summary = this.article.summary
          this.formData.content = this.article.content
          this.formData.main_category = this.article.main_category.id
          this.formData.category = this.article.categories_text
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
    updateArticle() {
      this.formLoading = true
      this.disabled = true
      let formData = new FormData()
      formData.append('title', this.formData.title)
      formData.append('slug', this.formData.slug)
      formData.append('summary', this.formData.summary)
      formData.append('content', this.formData.content)
      formData.append('reason', this.formData.reason)

      if (this.formData.upload_featured_image) {
        let file = this.formData.upload_featured_image
        formData.append('upload_featured_image', file)
      }

      this.$api.memberUpdateArticle(formData, this.articleId)
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
    },
  }
}
</script>
