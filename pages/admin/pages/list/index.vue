<template>
  <v-layout>
    <v-container>
      <h1 class="headline grey--text text-darken-4">Manage Pages</h1>
      <div class="mt-6">
        <v-card class="mt-3">
          <v-data-table
            :headers="headers"
            :items="pages"
            :options.sync="options"
            :loading="loading"
            :server-items-length="meta.total"
            :footer-props="footerOptions"
            fixed-header
          >
            <template v-slot:item.title="{ item }">
              <router-link
                target='_blank'
                :to="'/page/'+item.slug"
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
                    :to="{ name:'admin-pages-edit-id', params: { id: item.id}}"
                    v-on="on"
                  >
                    <v-icon>mdi-circle-edit-outline</v-icon>
                  </v-btn>
                </template>
                <span>Edit Page</span>
              </v-tooltip>

              <!-- <v-tooltip bottom>
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
              </v-tooltip> -->
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
      pages: [],
      // formData: {
      //   title: null,
      //   user_id: null,
      //   slug: null,
      //   status: null,
      // },
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
        { text: 'Status', value: 'status' },
        { text: 'Updated At', value: 'updated_at' },
        { text: 'Created At', value: 'created_at' },
        { text: 'Actions', value: 'actions', width: 120, sortable: false, filterable: false },
      ],
      statusOptions: [
        {text: 'Active', value: 1},
        {text: 'Inactive', value: 0},
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
        this.fetchPages()
      },
      deep: true,
    },
  },
  created() {
    this.fetchPages()
  },
  methods: {
    fetchPages() {
      this.loading = true
      let order = this.options.sortBy[0]
      let dir = (this.options.sortDesc[0]) ? 'desc' : 'asc'

      let params = {
        page: this.options.page,
        order: order,
        dir: dir
      }

      this.$api.adminGetPages(params)
        .then(res => {
          this.pages = res.data.data
          this.meta = res.data.meta
          this.loading = false
        })
    },
    deleteArticle(articleId) {
      if (confirm('Are you sure to delete this item?')) {
        this.$api.adminDeleteArticle(articleId)
          .then(res => {
              this.fetchPages()
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
      this.fetchPages()
    }
  }
}
</script>
