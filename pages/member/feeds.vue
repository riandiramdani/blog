<template>
  <v-layout>
    <v-container class="px-0 pt-0">
      <v-card class="px-6 py-5">
        <v-row>
          <template v-if="articles.length > 0">
            <v-col
              v-for="(article, i) in articles"
              :key="i"
              :cols="12"
            >
              <v-skeleton-loader
                :loading="$store.getters.contentLoading"
                height="94"
                type="list-item-avatar-three-line"
              >
                <article-item-compact
                  :article="article"
                ></article-item-compact>
                <v-divider></v-divider>
              </v-skeleton-loader>
            </v-col>
          </template>
          <v-col v-else>
            <span>Belum ada berita.</span>
          </v-col>

          <v-btn
            block
            class="mt-3"
            color="red accent-2"
            dark
            v-if="meta.current_page < meta.last_page"
            :loading="loadMoreLoading"
            @click="loadMore"
          >
            Tampilkan Lainnya
          </v-btn>
        </v-row>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>
import ArticleItemCompact from '@/components/ui/ArticleItemCompact'
export default {
  layout: 'member',
  components: { ArticleItemCompact },
  async asyncData({store, params, app, error}) {
    store.commit('UPDATE_CONTENT_LOADING', true)
    try {
      let article = await app.$api.memberGetFeeds()

      return {
        articles: article.data.data,
        links: article.data.links,
        meta: article.data.meta,
        page_meta: article.data.page_meta
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  mounted() {
    this.$store.commit('UPDATE_CONTENT_LOADING', false)
  },
  data() {
    return {
      recentArticles: [],
      toolbarHeight: 48,
      loading: undefined,
      loadMoreLoading: false,
    }
  },
  computed: {
    elementHeight () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 300
        case 'sm': return 400
        case 'md': return 420
        case 'lg': return 420
        case 'xl': return 420
        default: return 300
      }
    },
    containerHeight() {
      if (this.$vuetify.breakpoint.name == 'sm' || this.$vuetify.breakpoint.name == 'xs') {
          return 'auto'
      }
      return (this.elementHeight - (this.toolbarHeight)) + 'px'
    },
    isSmallDevice() {
      if (this.$vuetify.breakpoint.name == 'sm' || this.$vuetify.breakpoint.name == 'xs') {
        return true
      }
      return false
    }
  },
  methods: {
    fillCarouselArticles() {

    },
    loadMore() {
      this.loadMoreLoading = true
      this.$api.memberGetFeeds({ page: this.meta.current_page + 1})
        .then(res => {
          let data = res.data
          this.meta = data.meta
          this.links = data.links
          this.articles =  [...this.articles, ...data.data ]
          this.loadMoreLoading = false
        })
    }
  }
}
</script>
