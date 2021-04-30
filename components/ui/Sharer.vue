<template>
  <div class="text-center">
    <v-bottom-sheet>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" class="text-capitalize" text color="primary">
          <v-icon class="mr-2">mdi-share-variant</v-icon> Bagikan
        </v-btn>
      </template>
      <v-sheet height="auto" class="pa-2">
        <v-container class="elevation-3 py-2 px-3">
          <article-item-compact :article="article"></article-item-compact>
        </v-container>

        <v-divider class="mt-2 mb-3"></v-divider>

        <social-sharing :url="sharedUrl"
          :title="article.title"
          :description="article.meta.seo_description"
          :quote="null"
          :hashtags="tags"
          twitter-user="Blog"
          inline-template
        >
          <v-slide-group :show-arrows="false">
              <v-slide-item class="mr-2 text-center">
                <network network="facebook">
                  <v-card width="65" class="pa-3 d-flex">
                    <v-img src="/facebook.png" width="75%"></v-img>
                  </v-card>
                  <span class="caption">Facebook</span>
                </network>
              </v-slide-item>
              <v-slide-item class="mr-2 text-center">
                <network network="twitter">
                  <v-card width="65" class="pa-3 d-flex">
                    <v-img src="/twitter.png" width="75%"></v-img>
                  </v-card>
                  <span class="caption">Twitter</span>
                </network>
              </v-slide-item>
              <v-slide-item class="mr-2 text-center">
                <network network="line">
                  <v-card width="65" class="pa-3 d-flex">
                    <v-img src="/zip-line.png" width="75%"></v-img>
                  </v-card>
                  <span class="caption">Line</span>
                </network>
              </v-slide-item>
              <v-slide-item class="mr-2 text-center">
                <network network="whatsapp">
                  <v-card width="65" class="pa-3 d-flex">
                    <v-img src="/whatsapp.png" width="75%"></v-img>
                  </v-card>
                  <span class="caption">Whatsapp</span>
                </network>
              </v-slide-item>
            <!-- </div> -->
          </v-slide-group>
        </social-sharing>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import ArticleItemCompact from '@/components/ui/ArticleItemCompact'
export default {
  name: 'sharer',
  components: { ArticleItemCompact },
  props: {
    article: Object,
    required: true,
  },
  computed: {
    sharedUrl() {
      return process.env.BASE_URL + this.$route.path
    },
    tags() {
      let tags = ''
      this.article.tags.forEach((item, key) => {
        (tags === '')
          ? tags = item.name
          : tags = tags + ',' + item.name
      });
      return tags
    }
  },
  data() {
    return {

    }
  }
}
</script>
