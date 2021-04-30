<template>
  <v-layout>
    <v-container v-if="!pageError">
      <h1 class="headline grey--text text-darken-4">Manage Comments</h1>
      <div class="mt-6">
        <v-card>
          <form @submit.prevent="updateComment()">
            <v-card-title class="white--text grey">Edit Comment</v-card-title>
            <v-card-subtitle class="mt-4">Comment Data</v-card-subtitle>
            <v-card-text>
              <client-only v-if="article !== null">
                <h2 class="title">Article</h2>
                <div style="max-width: 350px" class="mb-12 px-3 py-2 elevation-3">
                  <article-item-compact :article="article"></article-item-compact>
                </div>
              </client-only>

              <v-textarea
                v-model="formData.content"
                label="Content"
                color="red accent-2"
                no-resize
                outlined
                dense
                required
              ></v-textarea>

              <v-select
                :items="commentStatusOptions"
                v-model="formData.status"
                label="Status (*)"
                color="red accent-2"
                outlined
                dense
              ></v-select>

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
import ArticleItemCompact from '@/components/ui/ArticleItemCompact'
export default {
  layout: 'admin',
  components: { ArticleItemCompact },
  data() {
    return {
      commentId: null,
      formData: {
        status: 1,
        content: null,
      },
      commentStatusOptions: [
        {text: 'Active', value: 1},
        {text: 'Inactive', value: 2},
      ],
      article: null,
      snackbar: false,
      snackbarMessage: '',
      isError: false,
      pageError: false
    }
  },
  created() {
    this.getComment()
  },
  methods: {
    getComment() {
      this.$api.adminFetchComment(this.$route.params.id)
        .then(res => {
          let data = res.data.data
          this.commentId = data.id
          this.formData.content = data.content
          this.formData.status = data.status_state
          this.article = data.article
        })
        .catch(err => {
          const error = err.response
          this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText
          this.pageError = true
          this.isError = true
          this.snackbar = true
        })
    },
    updateComment() {
      this.$api.adminUpdateComment(this.formData, this.commentId)
        .then(res => {
          this.snackbarMessage = res.data.response_message
          this.isError = false
          this.snackbar = true
        })
        .catch(err => {
          this.snackbarMessage = 'Error: ' + err.response.data.response_message
          this.isError = true
          this.snackbar = true
        })
    }
  }
}
</script>
