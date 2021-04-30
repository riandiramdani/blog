<template>
  <v-container class="pa-0 mr-0 grey lighten-4">
    <v-toolbar
      light
      flat
      dense
      class="list-article-header"
    >
      <v-icon color="#0d1137" class="mr-1">
        <!-- mdi-square -->
        mdi-stop
      </v-icon>
      <v-toolbar-title class="title">
        Komentar
      </v-toolbar-title>
    </v-toolbar>

    <v-divider></v-divider>
    <v-container :fluid="false" class="pt-1 px-4 pb-4">
      <v-row dense>
        <v-col
          :cols="12"
           v-if="!this.$store.state.auth.loggedIn"
           class="pa-3"
        >
          <v-btn
            dark
            block
            color="red accent-2"
            @click="setRedirectCookies"
            to="/login"
          >
            Login Untuk Berkomentar
          </v-btn>
        </v-col>
        <v-col v-else :cols="12" class="py-0 px-2 mt-4 text-right">
          <v-textarea
            outlined
            label="Tulis Komentar"
            v-model="formData.content"
            color="grey darken-2"
            rows="3"
            no-resize
            required
          ></v-textarea>
          <v-btn
            small
            class="mt-n9 px-5 elevation-1"
            color="grey darken-2"
            dark
            @click="addComment"
            :loading="buttonLoading"
          >
            Kirim
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="mb-5"></v-divider>

      <div>
        <comment-replies :comments="processedComments"></comment-replies>

        <div
          class="text-center"
          v-if="this.processedCommentMeta.current_page < this.processedCommentMeta.last_page"
        >
          <v-btn
            class="text-capitalize"
            text
            color="primary"
            @click="loadMoreComment"
            :loading="loadmoreButtonLoading"
          >
            Selanjutnya
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </div>
      </div>
    </v-container>
  </v-container>
</template>

<script>
import CommentReplies from '@/components/ui/CommentReplies'
import Cookies from 'js-cookie'
export default {
  name: 'article-comment',
  components: { CommentReplies },
  props: {
    articleId: {
      type: Number,
      required: true,
    },
    comments: {
      type: [Array, Object],
      required: true,
    },
    commentMeta: {
      type: Object,
      required: true,
    },
    commentLinks: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      formData: {
        articleId: this.articleId,
        content: '',
      },
      buttonLoading: false,
      loadmoreButtonLoading: false,
      processedComments: this.comments,
      processedCommentMeta: this.commentMeta
    }
  },
  methods: {
    addComment() {
      this.buttonLoading = true
      this.$api.addArticleComment(this.formData.articleId, this.formData.content)
        .then(res => {
          this.processedComments.push(res.data.data)
          this.buttonLoading = false
          this.formData.content = ''
        })
    },
    loadMoreComment() {
      this.loadmoreButtonLoading = true
      this.$api.getArticleComments(this.articleId, (this.processedCommentMeta.current_page + 1))
        .then(res => {
          this.processedComments = [...this.processedComments, ...res.data.data]
          this.processedCommentMeta = res.data.meta
          this.loadmoreButtonLoading = false
        })
    },
    setRedirectCookies() {
      Cookies.set('auth.redirect', this.$route.path)
    }
  }
}
</script>
