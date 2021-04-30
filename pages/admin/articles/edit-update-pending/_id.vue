<template>
  <v-layout>
    <v-container>
      <h1 class="headline grey--text text-darken-4">Manage Articles</h1>
      <div class="mt-6">
        <form @submit.prevent="" class="ma-0 pa-0 d-inline">
          <v-row>
            <v-col cols="12" md="9">
              <v-tabs
                v-model="tab"
              >
                <v-tab>New</v-tab>
                <v-tab>Diff</v-tab>
              </v-tabs>

              <v-tabs-items v-model="tab">
                <v-tab-item>
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

                      <v-textarea
                        v-model="formData.summary"
                        label="Summary"
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
                    </v-card-text>

                    <v-card-subtitle>SEO</v-card-subtitle>
                    <v-card-text>
                      <v-text-field
                        type="text"
                        label="SEO Title"
                        color="red accent-2"
                        dense
                        :disabled="disabled"
                        outlined
                        v-model="formData.seo.title"
                      ></v-text-field>

                      <v-text-field
                        type="text"
                        label="SEO Keywords"
                        color="red accent-2"
                        dense
                        :disabled="disabled"
                        outlined
                        v-model="formData.seo.keywords"
                      ></v-text-field>

                      <v-textarea
                        label="SEO Description"
                        color="red accent-2"
                        dense
                        :disabled="disabled"
                        outlined
                        rows="3"
                        v-model="formData.seo.description"
                        no-resize
                      ></v-textarea>

                      <v-divider></v-divider>
                      <div class="text-right">
                        <!-- <v-btn
                          color="primary"
                          type="submit"
                          class="px-8 my-6"
                          :loading="formLoading"
                        >
                          Save
                        </v-btn> -->
                      </div>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">#</th>
                          <th class="text-left w150" style="max-widht: 200px !important;">Old</th>
                          <th class="text-left w150" style="max-widht: 200px !important;">New</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Title</td>
                          <td>{{ article.title }}</td>
                          <td>{{ updateArticleData.title }}</td>
                        </tr>
                        <tr>
                          <td>slug</td>
                          <td>{{ article.slug }}</td>
                          <td>{{ updateArticleData.slug }}</td>
                        </tr>
                        <tr>
                          <td>image</td>
                          <td
                            v-if="article.meta.featured_image"
                          >{{ article.meta.featured_image.file }}</td>
                          <td v-if="updateArticleData.featured_image">{{ updateArticleData.featured_image.file }}</td>
                        </tr>
                        <tr>
                          <td>summary</td>
                          <td>{{ article.summary }}</td>
                          <td>{{ updateArticleData.summary }}</td>
                        </tr>
                        <tr>
                          <td>content</td>
                          <td>
                            <div class="w150" v-html="article.content"></div>
                          </td>
                          <td>
                            <div class="w150" v-html="updateArticleData.content"></div>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-tab-item>
              </v-tabs-items>

            </v-col>
            <v-col class="px-0">
              <v-row no-gutters="">
                <v-col cols="12">
                  <v-card width="100%">
                    <v-card-title class="white--text grey">Article Settings</v-card-title>
                    <v-card-subtitle class="mt-4">Basics</v-card-subtitle>
                    <v-card-text>
                      <v-textarea
                        v-model="formData.message"
                        :disabled="disabled"
                        label="Message To The Author"
                        color="red accent-2"
                        no-resize
                        outlined
                        rows="3"
                        dense
                      ></v-textarea>

                      <v-btn
                        type="submit"
                        @click="updateArticle(1)"
                        block
                        color="primary"
                        :loading="formLoading"
                      >
                        Approved
                      </v-btn>

                      <v-btn
                        type="submit"
                        @click="updateArticle(6)"
                        class="mt-3 mb-7"
                        block
                        color="lime"
                        dark
                        :loading="formLoading"
                      >
                        Need Improvements
                      </v-btn>

                      <v-select
                        :items="users"
                        v-model="formData.user_id"
                        label="User (*)"
                        color="red accent-2"
                        outlined
                        :disabled="disabled"
                        dense
                      ></v-select>

                      <v-text-field
                        :disabled="disabled"
                        v-model="formData.read_time"
                        type="number"
                        label="Reading Time (In seconds)"
                        color="red accent-2"
                        outlined
                        dense
                      ></v-text-field>

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

                      <div id="preview">
                        <span v-if="urlImgPreview || statusRendering && updateArticleData.main_image_url">Preview: </span>

                        <img
                          v-if="!urlImgPreview && statusRendering && updateArticleData.main_image_url !== null"
                          :src="updateArticleData.main_image_url"
                          width="100%"
                          class="elevation-3"
                        />

                        <img
                          v-if="urlImgPreview"
                          :src="urlImgPreview"
                          width="100%"
                          class="elevation-3"
                        />
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" class="mt-3">
                  <v-card width="100%">
                    <v-card-title class="white--text grey">categories</v-card-title>
                    <v-card-subtitle class="mt-4">Choose Category</v-card-subtitle>
                    <v-card-text>
                      <v-combobox
                        v-model="formData.categories"
                        :items="categories"
                        label="Categories (*)"
                        multiple
                        color="red accent-2"
                        outlined
                        dense
                        clearable
                        :disabled="disabled"
                      ></v-combobox>

                      <v-select
                        :items="categories"
                        v-model="formData.main_category"
                        :disabled="disabled"
                        label="Main Category (*)"
                        color="red accent-2"
                        outlined
                        dense
                      ></v-select>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" class="mt-3">
                  <v-card width="100%">
                    <v-card-title class="white--text grey">Tags</v-card-title>
                    <v-card-subtitle class="mt-4">Choose Tags</v-card-subtitle>
                    <v-card-text>
                      <v-combobox
                        v-model="formData.tags"
                        :items="tags"
                        outlined
                        dense
                        chips
                        small-chips
                        label="Tags"
                        multiple
                      ></v-combobox>
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
      article: {},
      updateArticleData: {},
      categories: [],
      tags: [],
      users: [],
      tab: null,
      statusOptions: [
        { text: 'Approved', value: 1 },
        { text: 'Disable', value: 2 },
        { text: 'Soft Disable', value: 7  },
      ],
      urlImgPreview: null,
      disabled: false,
      formLoading: false,
      formData: {
        title: '',
        slug: '',
        summary: '',
        content: '',
        seo: {
          title: '',
          keywords: '',
          description: '',
        },
        status: '',
        user_id: '',
        disable_earnings: '',
        main_category: '',
        categories: [],
        tags: [],
        message: '',
        read_time: '',
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
      this.$api.adminFetchUpdatePendingArticle(this.$route.params.id)
        .then(res => {
          let data = res.data.data
          this.article = data.article
          this.updateArticleData = data.article_update
          this.formData.title = data.article_update.title
          this.formData.slug = data.article_update.slug
          this.formData.summary = data.article_update.summary
          this.formData.content = data.article_update.content
          this.formData.user_id = this.article.meta.article_author.id
          this.formData.status = this.article.status
          this.formData.main_category = this.article.main_category.id
          this.formData.categories = this.article.categories_text
          this.formData.read_time = this.article.read_time
          this.formData.seo.title = this.article.meta.seo_title
          this.formData.seo.keywords = this.article.meta.seo_keywords
          this.formData.seo.description = this.article.meta.seo_description
          this.formData.tags = this.article.tags_text
          this.statusRendering = true

          this.categories = data.categories
          this.tags = data.tags
          this.users = data.users
        })
        .catch(err => {
          const error = err.response
          this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText
          this.pageError = true
          this.isError = true
          this.snackbar = true
        })
    },
    updateArticle(statuses) {
      this.formLoading = true
      this.disabled = true
      let formData = new FormData()
      formData.append('title', this.formData.title)
      formData.append('slug', this.formData.slug)
      formData.append('summary', this.formData.summary)
      formData.append('content', this.formData.content)
      formData.append('user_id', this.formData.user_id)
      formData.append('main_category', this.formData.main_category)
      formData.append('status', statuses)
      formData.append('read_time', this.formData.read_time)

      for (let index = 0; index < this.formData.categories.length; index++) {
        formData.append('categories[]', this.formData.categories[index].value)
      }

      if (this.formData.seo.keywords) {
        formData.append('seo[title]', this.formData.seo.title)
        formData.append('seo[keywords]', this.formData.seo.keywords)
        formData.append('seo[description]', this.formData.seo.description)
      }

      if (this.formData.tags.length > 0) {
        for (let index = 0; index < this.formData.tags.length; index++) {
          formData.append('tags[]', this.formData.tags[index].value)
        }
      }

      // if (this.formData.message) {
        formData.append('message', this.formData.message)
      // }

      if (this.formData.upload_featured_image) {
        let file = this.formData.upload_featured_image
        formData.append('upload_featured_image', file)
      }

      this.$api.adminUpdatePendingProccess(formData, this.article.id)
        .then(res => {
          this.snackbarMessage = res.data.response_message
          this.isError = false
          this.snackbar = true
          this.formLoading = false
          this.disabled = false
          this.$router.push('/admin/articles/update-pending')
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
    handleFeaturedImage(file) {
      this.formData.upload_featured_image = file.input[0]
    }
  }
}
</script>

<style>
  .w150 {
    max-width: 260px !important;
  }

  .w150 img {
    width: 100%;
    height: auto;
  }
</style>
