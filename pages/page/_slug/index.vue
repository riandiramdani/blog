<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-container style="max-width: 1000px">
      <v-row>
        <v-col>
          <v-card width="100%">
            <v-card-title class="headline text-center">
              {{ page.title }}
            </v-card-title>
            <v-card-text v-html="page.content"></v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  layout: 'default',
  components: {},
  async asyncData({store, params, app, error}) {
    try {
      store.commit('UPDATE_CONTENT_LOADING', true)
      const slug = params.slug
      let page = await app.$api.getPage(slug)
      return {
        page: page.data.data,
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  data() {
    return {
      //
    }
  },
  mounted() {
    this.$store.commit('UPDATE_CONTENT_LOADING', false)
  }
}
</script>
