<template>
  <v-layout>
    <v-container class="px-0 pt-0">
      <v-row>
        <v-col cols="12" md="6">
          <v-container
            class="pa-0 mr-0"
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
                Bookmark
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
              :class="{'pt-1': true}"
            >
              <v-row dense v-scroll>
                <template v-if="bookmarkArticles.length > 0">
                  <v-col
                    v-for="(article, i) in bookmarkArticles"
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
                  <span>Belum ada berita yang disimpan.</span>
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
  </v-layout>
</template>

<script>
import ArticleItemCompact from '@/components/ui/ArticleItemCompact'
// import ArticleCarousel from '@/components/ui/ArticleCarousel'
export default {
  middleware: ['auth'],
  components: { ArticleItemCompact },
  async asyncData({store, params, app, error}) {
    store.commit('UPDATE_CONTENT_LOADING', true)
    try {
      let bookmarkArticles = await app.$api.getBookmarkArticles()

      return {
        bookmarkArticles: bookmarkArticles.data.data,
        meta: bookmarkArticles.data.meta
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
    loadMore() {
      this.loadMoreLoading = true
      this.$api.getBookmarkArticles(this.meta.current_page + 1)
        .then(res => {
          let data = res.data
          this.meta = data.meta
          this.links = data.links
          this.bookmarkArticles =  [...this.bookmarkArticles, ...data.data ]
          this.loadMoreLoading = false
        })
    }
  }
}
</script>
