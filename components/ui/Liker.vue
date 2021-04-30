<template>
  <div class="text-center">
    <v-btn
      class="text-capitalize px-0"
      text
      color="red accent-2"
      @click="likeProcess"
    >
      <v-icon class="mr-2" v-if="processedLiked">mdi-heart</v-icon>
      <v-icon class="mr-2" v-else>mdi-heart-outline</v-icon>
      {{ processedCounts }}
    </v-btn>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'liker',
  props: {
    counts: {
      type: Number,
      required: true
    },
    liked: {
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
      processedCounts: this.counts,
      processedLiked: this.liked
    }
  },
  methods: {
    likeProcess() {
      if (!this.$store.state.auth.loggedIn) {
        Cookies.set('auth.redirect', this.$route.path)
        this.$router.push('/login')
      } else {
        this.$api.processArticleLike(this.articleId)
          .then(({ data }) => {
            if (this.processedLiked === true) {
              this.processedCounts = this.processedCounts - 1
            } else {
              this.processedCounts = this.processedCounts + 1
            }
            this.processedLiked = !this.processedLiked
          })
      }

    }
  }
}
</script>
