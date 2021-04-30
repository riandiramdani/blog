<template>
  <v-layout>
    <v-container>
      <h1 class="headline grey--text text-darken-4">Manage Comments</h1>
      <div class="mt-6">
        <v-card class="">
          <v-data-table
            :headers="headers"
            :items="comments"
            :options.sync="options"
            :loading="loading"
            :server-items-length="meta.total"
            :footer-props="footerOptions"
            fixed-header
          >
            hide-default-footer
            <template v-slot:item.name="{ item }">
              <router-link :to="{ name:'admin-categories-edit-id', params: { id: item.id}}">
                {{ item.name }}
              </router-link>
            </template>

            <template v-slot:item.response="{ item }">
              <router-link target="_blank" :to="{ name:'article-id-slug', params: { id: item.article.id, slug: item.article.slug}}">
                {{ item.article.title }}
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
                    :to="{ name:'admin-comments-edit-id', params: { id: item.id}}"
                    v-on="on"
                  >
                    <v-icon>mdi-circle-edit-outline</v-icon>
                  </v-btn>
                </template>
                <span>Edit Comment</span>
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
                    @click="deleteComment(item.id)"
                    v-on="on"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete Comment</span>
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
      comments: [],
      options: {
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
      },
      loading: true,
      footerOptions: {
        disableItemsPerPage: true,
        itemsPerPageOptions: [10, 30, 50],
      },
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Author', value: 'user.username', sortable: false, filterable: false },
        { text: 'Status', value: 'status', sortable: false, filterable: false },
        { text: 'Content', value: 'content', sortable: false, filterable: false },
        { text: 'In Response To', value: 'response', sortable: false, filterable: false },
        { text: 'Updated At', value: 'updated_at' },
        { text: 'Created At', value: 'created_at' },
        { text: 'Actions', value: 'actions', width: 120, sortable: false, filterable: false },
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
        this.fetchComments()
      },
      deep: true,
    },
  },
  created() {
    this.fetchComments()
  },
  methods: {
    fetchComments() {
      this.loading = true
      let order = this.options.sortBy[0]
      let dir = (this.options.sortDesc[0]) ? 'desc' : 'asc'

      this.$api.adminGetComments(this.options.page, order, dir)
        .then(res => {
          this.comments = res.data.data
          this.meta = res.data.meta
          this.loading = false
        })
    },
    deleteComment(commentId) {
      if (confirm('Are you sure to delete this item?')) {
        this.$api.adminDeleteComment(commentId)
          .then(res => {
              this.fetchComments()
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
    }
  }
}
</script>
