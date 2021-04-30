<template>
  <v-footer color="grey lighten-4" light :fixed="false" class="pa-0">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" class="d-none d-md-block">
          <!-- <article-list-slim title="Recent" :articles="articles"></article-list-slim> -->
          <v-container class="pa-0 mr-0">
            <v-toolbar
              light
              flat
              dense
              class="list-article-header"
              color="grey lighten-4"
              tile
            >
              <v-icon color="#0d1137" class="mr-1">
                <!-- mdi-square -->
                mdi-stop
              </v-icon>
              <v-toolbar-title class="title">
                Terbaru & Populer
              </v-toolbar-title>
            </v-toolbar>

            <v-divider></v-divider>

            <v-container :fluid="false" class="pt-1 px-0">
              <v-row dense>
                <template v-if="articles && articles.length > 0">
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
                      <article-item-slim :article="article" color="grey lighten-4"></article-item-slim>
                      <v-divider v-if="articles && i !== articles.length - 1"></v-divider>
                    </v-skeleton-loader>
                  </v-col>
                </template>
                <v-col v-else>
                  <span>Belum ada berita.</span>
                </v-col>
              </v-row>
            </v-container>
          </v-container>
        </v-col>
        <v-col cols="12" md="4" class="d-none d-md-block">
          <v-container class="pa-0 mr-0">
                        <v-toolbar
              light
              flat
              dense
              class="list-article-header"
              color="grey lighten-4"
              tile
            >
              <v-icon color="#0d1137" class="mr-1">
                <!-- mdi-square -->
                mdi-stop
              </v-icon>
              <v-toolbar-title class="title">
                Useful Link
              </v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <v-container class="px-0 mr-0 pl-5 pt-5 ">
              <v-list  color="grey lighten-4" class="py-0">
                <v-list-item
                  v-for="(item) in $store.state.siteOptions.pages" :key="item.name"
                  :to="'/page/'+item.slug"
                  dense
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-container>
          </v-container>
        </v-col>
        <v-col cols="12" md="4" class="d-none d-md-block">
          <v-container class="pa-0 mr-0">
            <v-toolbar
              light
              flat
              dense
              class="list-article-header"
              color="grey lighten-4"
              tile
            >
              <v-icon color="#0d1137" class="mr-1">
                <!-- mdi-square -->
                mdi-stop
              </v-icon>
              <v-toolbar-title class="title">
                Socials
              </v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <v-container class="pa-0 mr-0">
              <v-list color="grey lighten-4">
                <v-list-item
                  class="px-0"
                  v-for="(item) in $store.state.siteOptions.socials" :key="item.name"
                >
                  <v-btn
                    link
                    text
                    target="_blank"
                    :href="item.url"
                  >
                    <v-icon class="mr-2">mdi-{{ item.name }}</v-icon>
                    {{ item.name }}
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-container>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
      <!-- <span>&copy; {{ new Date().getFullYear() }}</!-->
  </v-footer>
</template>

<script>
import ArticleListSlim from '@/components/widgets/ArticleListSlim'
import ArticleItemSlim from '@/components/ui/ArticleItemSlim'
export default {
  components: { ArticleListSlim, ArticleItemSlim },
  data() {
    return {
      articles: [],
    }
  },
  mounted() {
    this.getRecentArticle()
  },
  methods: {
    getRecentArticle() {
      this.$api.getPopularArticles()
        .then(res => {
          this.articles = res.data.data
          this.$store.commit('UPDATE_CONTENT_LOADING', false)
        })
    },
  }
}
</script>
