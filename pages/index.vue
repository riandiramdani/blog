<template>
  <v-layout>
    <v-container class="px-0 pt-0">
      <v-row>
        <v-col cols="12" md="6">
          <v-skeleton-loader
            :loading="$store.getters.contentLoading"
            transition="fade-transition"
            type="image"
          >
            <article-carousel
              :articles="popularArticles"
              :element-height="elementHeight"
            ></article-carousel>
          </v-skeleton-loader>
        </v-col>

        <v-col cols="12" md="6">
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
                Pilihan
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <!-- <v-btn
                v-if="popularArticles2 > 5"
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
                <template v-if="popularArticles2.length > 0">
                  <v-col
                    v-for="(article, i) in popularArticles2"
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

        <template v-for="(item, i) in popularCategoriesArticles">
          <v-col cols="12" md="6" :key="i">
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
                  mdi-stop
                </v-icon>
                <v-toolbar-title class="title">
                  {{ item.category.name }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  link
                  text
                  class="body-1 pa-0 text-capitalize"
                  color="red accent-2"
                  :to="'/category/'+item.category.slug"
                >
                  Lihat Lainnya
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-toolbar>

              <v-divider></v-divider>

              <v-container
                :fluid="true"
                :class="{ 'overflow-y-auto' : isSmallDevice == false, 'pt-1': true}"
                :style="{ height: containerHeight }"
              >
                <v-row dense v-scroll>
                  <template v-if="item.articles.length > 0">
                    <v-col
                      v-for="(article, i) in item.articles"
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
        </template>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
import ArticleItemCompact from '@/components/ui/ArticleItemCompact'
import ArticleCarousel from '@/components/ui/ArticleCarousel'
export default {
  components: { ArticleCarousel, ArticleItemCompact },
  head () {
    return {
      title: this.$store.state.siteOptions.meta.title,
      meta: [
        { hid: 'description', name: 'description', content: this.$store.state.siteOptions.meta.description }
      ]
    }
  },
  async asyncData({store, params, app, error}) {
    store.commit('UPDATE_CONTENT_LOADING', true)
    try {
      let popularArticles = await app.$api.getPopularArticles(1)
      let popularArticles2 = await app.$api.getPopularArticles(2)
      let popularCategoriesArticles = await app.$api.getPopularCategoriesArticles()

      return {
        popularArticles: popularArticles.data.data,
        popularArticles2: popularArticles2.data.data,
        popularCategoriesArticles: popularCategoriesArticles.data.data,
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
      loadMoreLoading: false,
      toolbarHeight: 48,
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

  }
}
</script>
