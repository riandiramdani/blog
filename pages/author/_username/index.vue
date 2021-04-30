<template>
  <v-layout>
    <v-container class="px-0 pt-0">
      <v-row>
        <v-col :cols="12" :md="7" class="ma-0 py-0" :order="2" :order-md="1">
          <v-row>
            <v-col :cols="12">
              <v-skeleton-loader
                :loading="$store.getters.contentLoading"
                transition="fade-transition"
                type="image"
              >
                <article-carousel
                  :articles="carouselArticles"
                  :element-height="elementHeight"
                ></article-carousel>
              </v-skeleton-loader>
            </v-col>
            <!-- Recent -->
            <v-col :cols="12">
              <v-container
                :class="{ 'elevation-3' : isSmallDevice == false, 'pa-0 mr-0': true }"
              >
                <v-toolbar
                  light
                  flat
                  dense
                  class="list-article-header"
                  :height="toolbarHeight"
                >
                  <v-icon color="#0d1137" class="mr-1">
                    <!-- mdi-square -->
                    mdi-stop
                  </v-icon>
                  <v-toolbar-title class="title">
                    Terbaru
                  </v-toolbar-title>
                </v-toolbar>

                <v-divider></v-divider>

                <v-container
                  :fluid="true"
                  class="pt-1"
                >
                  <v-row dense v-scroll>
                    <template v-if="recentArticles.length > 0">
                      <v-col
                        v-for="(article, i) in recentArticles"
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
                  </v-row>

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
                </v-container>
              </v-container>
            </v-col>
          </v-row>
        </v-col>
        <v-col :cols="12" :md="5" class="ma-0 py-0" :order="1" :order-md="2">
          <author class="mt-3" :author="author"></author>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
import ArticleItemCompact from '@/components/ui/ArticleItemCompact'
import ArticleCarousel from '@/components/ui/ArticleCarousel'
import Author from '@/components/widgets/Author'
export default {
  components: { Author, ArticleCarousel, ArticleItemCompact },
  async asyncData({store, params, app, error}) {
    store.commit('UPDATE_CONTENT_LOADING', true)
    try {
      const username = params.username
      let article = await app.$api.getArticlesByAuthor(username)

      return {
        articles: article.data.data,
        links: article.data.links,
        meta: article.data.meta,
        username: username,
        author: article.data.page_meta[0]
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  mounted() {
    this.$store.commit('UPDATE_CONTENT_LOADING', false)
    this.fillCarouselArticles()
  },
  data() {
    return {
      carouselArticles: [],
      trendingArticles: [],
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
      } else {
        return (this.elementHeight - (this.toolbarHeight)) + 'px'
      }
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
      this.carouselArticles = this.articles.slice(0, 3)
      this.recentArticles = this.articles.slice(3, this.articles.length)
    },
    loadMore() {
      this.loadMoreLoading = true
      this.$api.getArticlesByAuthor(this.username, this.meta.current_page + 1)
        .then(res => {
          let data = res.data
          this.meta = data.meta
          this.links = data.links
          this.recentArticles =  [...this.recentArticles, ...data.data ]
          this.loadMoreLoading = false
        })
    }
  }
}
</script>
