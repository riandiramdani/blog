<template>
  <v-container class="pa-0 mr-0">
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
        {{ title }}
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
              <article-item-slim :article="article"></article-item-slim>
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
</template>

<script>
import ArticleItemSlim from '@/components/ui/ArticleItemSlim'
export default {
  name: 'widget-article-list-slim',
  components: { ArticleItemSlim },
  props: {
    articles: {
      type: [Array, Object],
      required: true,
    },
    title: {
      type: String,
      required: true,
    }
  }
}
</script>
