<template>
  <div class="d-inline">
    <v-btn
      class="text-capitalize px-0"
      text
      color="brown"
      @click="bookmarkProcess()"
    >
      <v-icon class="mr-2" v-if="processedBookmark === true">mdi-bookmark</v-icon>
      <v-icon class="mr-2" v-else>mdi-bookmark-outline</v-icon>
    </v-btn>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'bookmarker',
  props: {
    bookmarked: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      processedBookmark: this.bookmarked
    }
  },
  methods: {
    bookmarkProcess() {
      if (!this.$store.state.auth.loggedIn) {
        Cookies.set('auth.redirect', this.$route.path)
        this.$router.push('/login')
      } else {
        this.$api.processArticleBookmark(this.articleId)
          .then(({ data }) => {
            this.processedBookmark = !this.processedBookmark
          })
      }

    }
  }
}
</script>
