<template>
    <v-card
      flat
      :to="{ name: 'article-id-slug', params: { id: article.id, slug: article.slug}}"
      :color="color ? color : 'white'"
    >
      <div class="d-flex flex-no-wrap justify-space-between">
        <div>
          <!-- Title -->
          <v-card-title
            class="body-2 font-weight-medium px-0 pt-2"
            v-text="article.title"
          ></v-card-title>
          <v-card-subtitle class="pa-0">
            <span class="grey--text text--darken-2">
              @{{ article.meta.article_author.username }}
            </span>
            <v-chip x-small outlined :color="article.category.color || 'secondary'" dark>
              {{ article.category.name }}
            </v-chip>
          </v-card-subtitle>

          <!-- Hits & Published At -->
          <v-card-subtitle
            class="body-2 px-0 pt-0"
          >
            <v-icon small>mdi-eye-outline</v-icon>
            <span class="caption">{{article.hits}}</span> |
            <v-icon small>mdi-clock-outline</v-icon>
            <span class="caption">{{ article.published_short }}</span>
          </v-card-subtitle>
          <!--  -->
        </div>

        <!-- featured preview -->
        <v-avatar
          size="70"
          tile
          class="my-3 ml-3 mr-0 rounded"
        >
          <v-img :src="article.meta.main_image_thumbnail_url"></v-img>
        </v-avatar>
      </div>
    </v-card>
</template>

<script>
export default {
  name: 'article-item-slim',
  props: {
    article: {
      type: [Array, Object],
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: null,
    }
  }
}
</script>

<style>
  .subtitle-3 {
    font-size: 1rem !important;
    font-weight: bold;
    letter-spacing: 0.0081428571em !important;
    line-height: 1.645rem;
    font-family: "Roboto", sans-serif !important;
    word-break: normal;
  }
  .rounded {
    border-radius: 0.500rem;
    -webkit-border-radius: 0.500rem;
    -moz-border-radius: 0.500rem;
  }
  .list-article-header .v-toolbar__content {
    padding-left: 0;
    padding-right: 0;
  }
</style>
