<template>
  <v-layout>
    <v-container class="px-0 pt-0">
      <!-- v-if="articles.length > 0" -->
      <v-row>
        <v-col :cols="12" :md="7">
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
        <v-col :cols="12" :md="5">
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
              <v-icon color="red accent-2" class="mr-1">
                <!-- mdi-square -->
                mdi-stop
              </v-icon>
              <v-toolbar-title class="title red--text text-accent-2">
                Trending
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <!-- <v-btn
                v-if="popularArticles > 8"
                link
                text
                class="body-1 pa-0 text-capitalize"
                color="red accent-2"
              >
                Lihat Lainnya
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn> -->
            </v-toolbar>

            <v-divider></v-divider>

            <v-container
              :fluid="true"
              :class="{ 'overflow-y-auto' : isSmallDevice == false, 'pt-1': true}"
              :style="{ height: containerHeight }"
            >
              <v-row dense v-scroll>
                <template v-if="trendingArticles.length > 0">
                  <v-col
                    v-for="(article, i) in trendingArticles"
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
                  <span>Belum ada berita populer.</span>
                </v-col>
              </v-row>
            </v-container>
          </v-container>
        </v-col>
        <!-- Recent -->
        <v-col :cols="12" :md="7">
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
    </v-container>
    <!-- <v-container v-else>
      <v-card>

      </v-card>
      <h1 class="text--secondary">No Content</h1>
    </v-container> -->
  </v-layout>
</template>

<script>
import ArticleItemCompact from '@/components/ui/ArticleItemCompact'
import ArticleCarousel from '@/components/ui/ArticleCarousel'
export default {
  components: { ArticleCarousel, ArticleItemCompact },
  head () {
    return {
      title: this.page_meta.seo.title,
      meta: [
        { hid: 'description', name: 'description', content: this.page_meta.seo.description }
      ]
    }
  },
  async asyncData({store, params, app, error}) {
    store.commit('UPDATE_CONTENT_LOADING', true)
    try {
      const tagId = params.id
      let article = await app.$api.getArticlesByTag(tagId)
      let popularArticles = await app.$api.getPopularArticlesByTag(tagId)

      return {
        articles: article.data.data,
        popularArticles: popularArticles.data.data,
        links: article.data.links,
        meta: article.data.meta,
        page_meta: article.data.page_meta,
        tagId: tagId
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
      if (this.popularArticles.length > 0 && this.articles.length >= 8) {
        this.carouselArticles = this.popularArticles.slice(0, 3)
        this.trendingArticles = this.popularArticles.slice(3, 8)
        this.recentArticles = this.articles
      } else if (this.popularArticles.length >= 3 && this.articles.length <= 8) {
        this.carouselArticles = this.popularArticles.slice(0, 3)
        this.trendingArticles = this.popularArticles.slice(3, (this.articles.length))
        this.recentArticles = this.articles
      } else if (this.popularArticles.length > 0 && this.popularArticles.length <= 3) {
        this.carouselArticles = this.popularArticles
        this.trendingArticles = this.popularArticles
        this.recentArticles = this.articles
      } else {
        if (this.articles.length > 0 && this.articles.length >= 3) {
          this.carouselArticles = this.articles.slice(0, 3)
          this.trendingArticles = []
          this.recentArticles = this.articles.slice(3, (this.articles.length))
        } else {
          this.carouselArticles = this.articles
          this.trendingArticles = []
          this.recentArticles = this.articles
        }
      }
    },
    loadMore() {
      this.loadMoreLoading = true
      this.$api.getArticlesByTag(this.tagId, this.meta.current_page + 1)
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
