<template>
  <div class="d-flex align-start mb-3">
    <div>
      <v-list-item-avatar size="28" class="mt-1 mr-3">
        <v-img :src="processedComment.user.image_url"></v-img>
      </v-list-item-avatar>
    </div>
    <v-container class="pa-0 ma-0">
      <!-- <v-list-item-content class="pa-0"> -->
      <h3 class="subtitle-2 mb-0">{{ processedComment.user.name }}</h3>
      <p style="color: #444;" class="pa-0 ma-0" v-html="processedComment.content"></p>
      <div>
        <span class="caption grey--text">{{ processedComment.created_at }}</span>
        <v-btn text small color="grey" class="text-capitalize font-weight-bold" height="24" @click="replyCommentButton">Balas</v-btn>
      </div>
      <div :class="{'mt-2': true, 'd-none': show}">
        <form @submit.prevent="replyComment">
          <v-textarea
            :ref="'comment-'+processedComment.id"
            outlined
            label="Balas Komentar"
            v-model="formData.content"
            color="grey darken-2"
            rows="2"
            no-resize
            required
          ></v-textarea>
          <v-btn
            type="submit"
            small
            class="mt-n9 px-5 elevation-1"
            color="grey darken-2"
            dark
            :loading="buttonLoading"
          >
            Kirim
          </v-btn>
        </form>
      </div>
    </v-container>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'comment-item',
  props: {
    comment: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      formData: {
        article_id: this.comment.article_id,
        parent_id: this.comment.id,
        content: '',
      },
      processedComment: this.comment,
      buttonLoading: false,
      show: true,
    }
  },
  methods: {
    replyComment() {
      this.buttonLoading = true
      this.$api.addArticleCommentReply(
        this.formData.article_id,
        this.formData.parent_id,
        this.formData.content
      )
        .then(res => {
          this.processedComment.replies.push(res.data.data)
          this.buttonLoading = false
          this.show=true
          this.formData.content = ''
        })
    },
    replyCommentButton() {
      if (!this.$store.state.auth.loggedIn) {
        Cookies.set('auth.redirect', this.$route.path)
        this.$router.push('/login')
      } else {
        this.show = !this.show
      }
    }
  }
}
</script>
