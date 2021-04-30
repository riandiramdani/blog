<template>
  <v-layout>
    <v-container>
      <v-container>
        <form @submit.prevent="findResult()">
          <v-row dense class="pt-3 pb-5">
            <v-col cols="12">
              <v-text-field
                type="text"
                label="Pencarian"
                color="red accent-2"
                dense
                outlined
                :disabled="disabled"
                v-model="formData.q"
                required
              ></v-text-field>
              <v-btn color="red accent-2" dark type="submit" :loading="buttonLoading">
                Cari
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </v-container>
      <v-container class="px-0 pt-0">
        <v-row>
          <v-col :cols="12">
            <v-container class="pa-0 mr-0">
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
                  Hasil Pencarian
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-divider></v-divider>

              <v-container>
                <v-row dense v-scroll>
                  <template v-if="searchResult.length > 0">
                    <v-col
                      v-for="(article, i) in searchResult"
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
                    <span>Tidak Ada Hasil Pencarian.</span>
                  </v-col>
                </v-row>
              </v-container>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-layout>
</template>

<script>
import ArticleItemCompact from '@/components/ui/ArticleItemCompact'
export default {
  components: { ArticleItemCompact },
  mounted() {
    this.$store.commit('UPDATE_CONTENT_LOADING', false)
  },
  data() {
    return {
      searchResult: [],
      formData: {
        q: '',
      },
      toolbarHeight: 48,
      loading: undefined,
      loadMoreLoading: false,
      redirect: undefined,
      loading: false,
      disabled: false,
      buttonLoading: false,
      snackbar: false,
      snackbarMessage: '',
      isError: false,
      pageError: false,
      errors: [],
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
      }
      return (this.elementHeight - (this.toolbarHeight)) + 'px'
    },
    isSmallDevice() {
      if (this.$vuetify.breakpoint.name == 'sm' || this.$vuetify.breakpoint.name == 'xs') {
        return true
      }
      return false
    }
  },
  methods: {
    findResult() {
      this.disabled = true
      this.buttonLoading = true
      this.$api.search(this.formData)
        .then(res => {
          this.searchResult = res.data.data
          this.disabled = false
          this.buttonLoading = false
        })
        .catch(err => {

        })
    }
  }
}
</script>
