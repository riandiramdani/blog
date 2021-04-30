<template>
  <v-layout>
    <v-container>
      <h1 class="headline grey--text text-darken-4">Manage Tags</h1>
      <div class="mt-6">
        <v-card>
          <form @submit.prevent="storeCategory()">
            <v-card-title class="white--text grey">Add Tag</v-card-title>
            <v-card-subtitle class="mt-4">Tags Data</v-card-subtitle>
            <v-card-text>
              <v-text-field
                type="text"
                label="Name (*)"
                color="red accent-2"
                dense
                outlined
                v-model="formData.name"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.slug"
                type="text"
                label="Slug (automatic populated by backend if null.)"
                color="red accent-2"
                outlined
                dense
              ></v-text-field>

              <v-select
                :items="categoryStatusOptions"
                v-model="formData.status"
                label="Status (*)"
                color="red accent-2"
                outlined
                dense
              ></v-select>

              <v-textarea
                v-model="formData.description"
                label="Description"
                color="red accent-2"
                no-resize
                outlined
                dense
              ></v-textarea>
            </v-card-text>

            <v-card-subtitle>SEO</v-card-subtitle>
            <v-card-text>
              <v-text-field
                type="text"
                label="SEO Title"
                color="red accent-2"
                dense
                outlined
                v-model="formData.seo.title"
              ></v-text-field>

              <v-text-field
                type="text"
                label="SEO Keywords"
                color="red accent-2"
                dense
                outlined
                v-model="formData.seo.keywords"
              ></v-text-field>

              <v-textarea
                label="SEO Description"
                color="red accent-2"
                dense
                outlined
                rows="3"
                v-model="formData.seo.description"
                no-resize
              ></v-textarea>

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
      formData: {
        name: null,
        slug: null,
        status: true,
        description: null,
        seo: {
          title: null,
          keywords: null,
          description: null,
        }
      },
      categoryStatusOptions: [
        {text: 'Active', value: true},
        {text: 'Inactive', value: false},
      ],
      snackbar: false,
      snackbarMessage: '',
      isError: false,
    }
  },
  methods: {
    storeCategory() {
      console.log('categoryStored')
      this.$api.adminStoreTag(this.formData)
        .then(res => {
          this.snackbarMessage = res.data.response_message
          this.isError = false
          this.snackbar = true
          this.clearFormData()
        })
        .catch(err => {
          this.snackbarMessage = 'Error: ' + err.response.data.response_message
          this.isError = true
          this.snackbar = true
        })
    },
    clearFormData() {
      this.formData.name = null
      this.formData.slug = null
      this.formData.status = true
      this.formData.description = null
      this.formData.seo.title = null
      this.formData.seo.keywords = null
      this.formData.seo.description = null
    }
  }
}
</script>
