<template>
  <v-layout>
    <v-container>
      <h1 class="headline grey--text text-darken-4">Manage Categories</h1>
      <div class="mt-6">
        <div class="text-right">
          <v-btn color="primary" to="/admin/categories/add">
            <v-icon class="mr-2">mdi-plus-box</v-icon>
            Add Category
          </v-btn>
        </div>

        <v-card class="mt-3">
          <v-data-table
            :headers="headers"
            :items="categories"
            fixed-header
          >
            <template v-slot:item.name="{ item }">
              <router-link :to="{ name:'admin-categories-edit-id', params: { id: item.id}}">
                {{ item.name }}
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
                    :to="{ name:'admin-categories-edit-id', params: { id: item.id}}"
                    v-on="on"
                  >
                    <v-icon>mdi-circle-edit-outline</v-icon>
                  </v-btn>
                </template>
                <span>Edit Category</span>
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
                    @click="deleteCategory(item.id)"
                    v-on="on"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete Category</span>
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
      categories: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Slug', value: 'slug' },
        { text: 'Status', value: 'status_text' },
        { text: 'Updated At', value: 'updated_at' },
        { text: 'Created At', value: 'created_at' },
        { text: 'Actions', value: 'actions' },
      ],
      snackbar: false,
      snackbarMessage: '',
      isError: false,
    }
  },
  created() {
    this.fetchCategories()
  },
  methods: {
    fetchCategories() {
      this.$api.adminGetCategories()
        .then(res => {
          this.categories = res.data.data
        })
    },
    deleteCategory(categoryId) {
      if (confirm('Are you sure to delete this item?')) {
        this.$api.adminDeleteCategory(categoryId)
          .then(res => {
            this.categories = this.categories.filter(function(el) {
              return el.id != categoryId
            })
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
