<template>
  <v-carousel
    :continuous="true"
    :cycle="true"
    :show-arrows="false"
    hide-delimiter-background
    delimiter-icon="mdi-minus"
    :height="elementHeight"
    dark
  >
    <template v-if="articles.length > 0">
      <v-carousel-item
        v-for="(article, i) in articles"
        :key="i"
        :to="{ name: 'article-id-slug', params: { id: article.id, slug: article.slug }}"
      >
        <v-card
          class="mx-auto rounded-card"
          flat
          shaped
        >
          <v-img
            class="align-end"
            :src="article.meta.main_image_large_url"
            :alt="article.title"
            :height="elementHeight"
          >
            <v-card-title>{{ article.title }}</v-card-title>
            <v-card-subtitle class="mb-0 pb-0">
              <v-list-item-avatar color="white mr-1" :size="20">
                <v-img
                  class="elevation-6"
                  :src="article.meta.article_author.profile_image"
                ></v-img>
              </v-list-item-avatar>
              {{ article.meta.article_author.username }} | {{ article.published_at }}
            </v-card-subtitle>
            <!-- <v-card-actions>
                <v-btn icon>
                  <v-badge color="white text--secondary" overlap>
                    <span slot="badge">0</span>
                    <v-icon color="white accent-3">mdi-chat-outline</v-icon>
                  </v-badge>
                </v-btn>

                <v-btn icon>
                  <v-badge color="white text--secondary" overlap>
                    <span slot="badge">3</span>
                    <v-icon color="white accent-3">mdi-heart-outline</v-icon>
                  </v-badge>
                </v-btn>

                <v-btn icon>
                  <v-icon color="white accent-3">mdi-share-variant</v-icon>
                </v-btn>
              </v-card-actions> -->
          </v-img>
        </v-card>
      </v-carousel-item>
    </template>
    <template v-else>
      <v-carousel-item>
        <v-sheet
          color="grey lighten-1"
          height="100%"
        >
          <v-row
            class="fill-height px-5 py-3"
            align="center"
            justify="center"
          >
            <div class="display-1 text-center">No Content.</div>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </template>
  </v-carousel>
</template>

<script>
export default {
  name: 'article-carousel',
  props: {
    articles: {
      type: Array,
      required: true,
    },
    elementHeight: {
      type: Number,
      required: true,
    }
  },
}
</script>

<style>
  .rounded-card {
    border-radius: 24px;
    -webkit-border-radius: 24px;
    -moz-border-radius: 24px;
  }
</style>
