<template>
  <v-layout>
    <v-container>
      <h1 class="headline grey--text text-darken-4">Manage Articles</h1>
      <div class="mt-6">
        <div class="text-right">
          <v-btn color="primary" to="/admin/articles/add">
            <v-icon class="mr-2">mdi-plus-box</v-icon>
            Add Article
          </v-btn>
        </div>

        <div class="mt-6 mb-2 mb-md-n6">
          <form @submit.prevent="fetchArticles()">
            <v-row no-gutters>
              <v-col cols="12" md="4" class="pr-2">
                <v-text-field
                  type="text"
                  label="Title"
                  color="red accent-2"
                  dense
                  outlined
                  v-model="formData.title"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" class="pr-2">
                <v-text-field
                  v-model="formData.user_id"
                  type="text"
                  label="User ID"
                  color="red accent-2"
                  outlined
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" class="pr-2">
                <v-text-field
                  v-model="formData.slug"
                  type="text"
                  label="Slug"
                  color="red accent-2"
                  outlined
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" class="pr-2">
                <v-select
                  :items="articleStatusOptions"
                  v-model="formData.status"
                  label="Status"
                  color="red accent-2"
                  outlined
                  dense
                ></v-select>
              </v-col>

              <v-col cols="12" md="4" class="pr-2">
                <v-btn type="submit" color="primary">Submit</v-btn>
                <v-btn type="submit" text color="primary" @click="resetFilter()">Reset</v-btn>
              </v-col>
            </v-row>
          </form>
        </div>

        <v-card class="mt-3">
          <v-data-table
            :headers="headers"
            :items="articles"
            :options.sync="options"
            :loading="loading"
            :server-items-length="meta.total"
            :footer-props="footerOptions"
            fixed-header
          >
            <template v-slot:item.title="{ item }">
              <router-link
                target='_blank'
                :to="{ name:'article-id-slug', params: { id: item.id, slug: item.slug}}"
              >
                {{ item.title }}
              </router-link>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    depressed
                    icon
                    fab
                    dark
                    color="primary"
                    small
                    :to="{ name:'admin-articles-edit-id', params: { id: item.id}}"
                    v-on="on"
                  >
                    <v-icon>mdi-circle-edit-outline</v-icon>
                  </v-btn>
                </template>
                <span>Edit Article</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    depressed
                    icon
                    fab
                    dark
                    color="pink"
                    small
                    @click="deleteArticle(item.id)"
                    v-on="on"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete Article</span>
              </v-tooltip>
            </template>
          </v-data-table>
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
      articles: [],
      formData: {
        title: null,
        user_id: null,
        slug: null,
        status: null,
      },
      loading: true,
      options: {
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
      },
      footerOptions: {
        disableItemsPerPage: true,
        itemsPerPageOptions: [10, 30, 50],
      },
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Title', value: 'title' },
        { text: 'Slug', value: 'slug' },
        { text: 'Author', value: 'meta.article_author.name', sortable: false, filterable: false },
        { text: 'Status', value: 'status' },
        { text: 'Updated At', value: 'updated_at' },
        { text: 'Published At', value: 'published_at' },
        { text: 'Created At', value: 'created_at' },
        { text: 'Actions', value: 'actions', width: 120, sortable: false, filterable: false },
      ],
      articleStatusOptions: [
        {text: 'Approved', value: 1},
        {text: 'Disable', value: 2},
        {text: 'Soft Disable', value: 7},
      ],
      snackbar: false,
      snackbarMessage: '',
      isError: false,
      page: 1,
      meta: {},
      links: {},
    }
  },
  watch: {
    options: {
      handler () {
        this.fetchArticles()
      },
      deep: true,
    },
  },
  created() {
    this.fetchArticles()
  },
  methods: {
    fetchArticles() {
      this.loading = true
      let order = this.options.sortBy[0]
      let dir = (this.options.sortDesc[0]) ? 'desc' : 'asc'

      let params = {
        page: this.options.page,
        order: order,
        dir: dir,
        title: this.formData.title,
        user_id: this.formData.user_id,
        slug: this.formData.slug,
        status: this.formData.status
      }

      this.$api.adminGetArticles(params)
        .then(res => {
          this.articles = res.data.data
          this.meta = res.data.meta
          this.loading = false
        })
    },
    deleteArticle(articleId) {
      if (confirm('Are you sure to delete this item?')) {
        this.$api.adminDeleteArticle(articleId)
          .then(res => {
              this.fetchArticles()
              this.snackbarMessage = res.data.response_message
              this.isError = false
              this.snackbar = true
          })
          .catch(err => {
            const error = err.response
            this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText
            this.isError = true
            this.snackbar = true
          })
      }
    },
    resetFilter() {
      this.formData.title = null
      this.formData.user_id = null
      this.formData.slug = null
      this.formData.status = null
      this.fetchArticles()
    }
  }
}
</script>
