<template>
  <v-layout>
    <v-container>
      <h1 class="headline grey--text text-darken-4">Manage Files</h1>
      <div class="mt-6">
        <div class="text-right">
          <v-btn color="primary" to="/admin/files/add">
            <v-icon class="mr-2">mdi-plus-box</v-icon>
            File Upload
          </v-btn>
        </div>

        <div class="mt-6 mb-2 mb-md-n6">
          <form @submit.prevent="fetchFiles()">
            <v-row no-gutters>
              <v-col cols="12" md="4" class="pr-2">
                <v-text-field
                  type="text"
                  label="Name"
                  color="red accent-2"
                  dense
                  outlined
                  v-model="formData.Filter.name"
                ></v-text-field>
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
            :items="files"
            :options.sync="options"
            :loading="loading"
            :server-items-length="meta.total"
            :footer-props="footerOptions"
            fixed-header
          >
            <template v-slot:item.thumbnail="{ item }">
              <v-avatar width="70" height="70" tile>
                <v-img :src="item.thumbnail"></v-img>
              </v-avatar>
            </template>

            <template v-slot:item.name="{ item }">
              {{ item.name }}
              <v-text-field type="text" :value="item.thumbnail" dense outlined disabled></v-text-field>
              <!-- <router-link :to="{ name:'admin-tags-edit-id', params: { id: item.id}}"> -->
              <!-- </router-link> -->
            </template>

            <!-- <template v-slot:item.response="{ item }">
              <router-link :to="{ name:'article-id-slug', params: { id: item.article.id, slug: item.article.slug}}">
                {{ item.article.title }}
              </router-link>
            </template> -->

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
                    :to="{ name:'admin-files-edit-id', params: { id: item.id}}"
                    v-on="on"
                  >
                    <v-icon>mdi-circle-edit-outline</v-icon>
                  </v-btn>
                </template>
                <span>Edit File</span>
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
                    @click="deleteFile(item.id)"
                    v-on="on"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete File</span>
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
      files: [],
      formData: {
        Filter: {
          name: null,
        }
      },
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
        { text: 'Thumbnail', value: 'thumbnail', sortable: false, filterable: false },
        { text: 'Name', value: 'name' },
        { text: 'Username', value: 'user.username' },
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
        this.fetchFiles()
      },
      deep: true,
    },
  },
  created() {
    this.fetchFiles()
  },
  methods: {
    fetchFiles() {
      this.loading = true
      let order = this.options.sortBy[0]
      let dir = (this.options.sortDesc[0]) ? 'desc' : 'asc'

      let params = {
        page: this.options.page,
        order: order,
        dir: dir,
        name: this.formData.Filter.name
      }

      this.$api.adminGetFiles(params)
        .then(res => {
          this.files = res.data.data
          this.meta = res.data.meta
          this.loading = false
        })
    },
    deleteFile(fileId) {
      if (confirm('Are you sure to delete this item?')) {
        this.$api.adminDeleteFile(fileId)
          .then(res => {
              this.fetchFiles()
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
      this.formData.Filter.name = null
      this.fetchFiles()
    }
  }
}
</script>
