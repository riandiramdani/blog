<template>
  <v-layout>
    <v-container class="py-0 px-3 px-sm-12 px-md-0">
      <v-row>
        <v-col :cols="12" :md="8" class="pr-md-7">
          <v-container class="ma-0 pa-0">
            <v-row>
              <v-col :cols="12" class="py-0">
                <v-sheet>
                  <article>
                    <h1 class="headline mt-0 mt-sm-2"> {{ article.title }} </h1>
                    <section class="mt-2 mb-3 grey--text text--darken-1">
                      <v-chip
                        class="text-capitalize mr-2"
                        small
                        outlined
                        :color="article.category.color"
                        :to="{ name: 'category-slug', params: { slug: article.category.slug}}"
                      >
                        {{ article.category.name }}
                      </v-chip>
                      <div class="d-inline mr-2">
                        <v-icon small>mdi-eye-outline</v-icon>
                        <span class="caption">{{ article.hits }}</span>
                      </div>
                      <div class="d-inline mr-2">
                        <v-icon small>mdi-clock-outline</v-icon>
                        <span class="caption">{{ article.published_at }}</span>
                      </div>
                    </section>

                    <v-list-item class="pa-0 d-block">
                      <div class="d-flex flex-no-wrap justify-end">
                        <v-list-item-avatar color="grey" class="mr-2" size="45">
                          <v-img :src="article.meta.article_author.profile_image"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title class="subtitle-2">
                            <router-link
                              :to="{ name: 'author-username', params: {username: article.meta.article_author.username}}"
                              class="black--text"
                              style="text-decoration: none; cursor: pointer;"
                            >
                              {{ article.meta.article_author.name }}
                            </router-link>
                          </v-list-item-title>
                          <v-list-item-subtitle class="caption">
                            <router-link
                              :to="{ name: 'author-username', params: {username: article.meta.article_author.username}}"
                              class="black--text"
                              style="text-decoration: none; cursor: pointer;"
                            >
                              @{{ article.meta.article_author.username }}
                            </router-link>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action class="text-right">
                          <template v-if="isSameUser === false">
                            <v-btn
                              color="#0d1137"
                              @click="followProccess"
                              small
                              dark
                              class="px-7 text-capitalize"
                              :loading="followButtonLoading"
                            >
                              <span v-if="article.has_followed_this_author">Batal Ikuti</span>
                              <span v-else>Ikuti</span>
                            </v-btn>
                          </template>
                        </v-list-item-action>
                      </div>
                    </v-list-item>

                    <v-divider class="mt-3 mb-6"></v-divider>

                    <v-img
                      :src="article.meta.main_image_large_url"
                      v-if="article.meta.main_image_large_url"
                      class="mt-4 mb-6"
                      :alt="article.title"
                    ></v-img>

                    <v-sheet class="body-1" v-html="article.content"></v-sheet>
                  </article>

                  <section id="tags">
                    <bookmarker :bookmarked="article.has_bookmark_this_article" :article-id="article.id"></bookmarker>

                    <v-icon color="#0d1137" class="mr-1">
                      mdi-tag-multiple
                    </v-icon>
                    <v-chip
                      v-for="(tag, i) in article.tags"
                      :key="i"
                      class="small text-capitalize"
                      color="red accent-2"
                      dark
                      small
                      :to="{ name: 'tag-id-slug', params: { id: tag.id, slug: tag.slug}}"
                    >
                      {{ tag.name }}
                    </v-chip>
                  </section>
                </v-sheet>
              </v-col>

              <!-- Like & Share -->
              <v-col :cols="12" class="mt-6">
                <v-container class="py-0 grey lighten-4" style="border-radius: 5px; border: 1px solid #ddd;">
                  <v-row>
                    <v-col class="py-2">
                      <liker
                        :counts="article.like_count"
                        :liked="article.has_like_this_article"
                        :article-id="article.id"
                      ></liker>
                    </v-col>
                    <!-- <v-col class="py-2">
                      <v-container class="pa-0 text-center">
                        <v-btn text color="brown darken-1" class="text-capitalize">
                          <v-icon class="mr-2">mdi-bookmark-outline</v-icon> Simpan Artikel
                        </v-btn>
                      </v-container>
                    </v-col> -->
                    <v-col class="py-2">
                      <sharer :article="article"></sharer>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>

              <v-col :cols="12" class="mt-4">
                <article-comment
                  :article-id="article.id"
                  :comments="comments"
                  :comment-meta="commentMeta"
                  :comment-links="commentLinks"
                >
                </article-comment>
              </v-col>

              <!-- Related -->
              <v-col :cols="12" class="mt-1">
                <article-list-slim title="Related" :articles="article.related || []"></article-list-slim>
              </v-col>
            </v-row>
          </v-container>
        </v-col>

        <!-- Side bar -->
        <v-col :cols="12" :md="4" class="mt-n6 mt-md-0">
          <article-list-slim title="Trending" :articles="articles"></article-list-slim>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
import ArticleListSlim from '@/components/widgets/ArticleListSlim'
import ArticleComment from '@/components/widgets/ArticleComment'
import Sharer from '@/components/ui/Sharer'
import Liker from '@/components/ui/Liker'
import Bookmarker from '@/components/ui/Bookmarker'
import Cookies from 'js-cookie'
export default {
  components: { ArticleListSlim, ArticleComment, Sharer, Liker, Bookmarker },
  head () {
    return {
      title: this.article.meta.seo_title,
      meta: [
        { hid: 'description', name: 'description', content: this.article.meta.seo_description }
      ]
    }
  },
  async asyncData({route, store, params, error, app}) {
    store.commit('UPDATE_CONTENT_LOADING', true)
    try {
      const article = await app.$api.getArticle(params.id)
      const comments = await app.$api.getArticleComments(params.id)
      const articles = await app.$api.getPopularArticles()
      return {
        article: article.data.data,
        articles: articles.data.data,
        comments: comments.data.data,
        commentMeta: comments.data.meta,
        commentLinks: comments.data.links
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  mounted() {
    this.$store.commit('UPDATE_CONTENT_LOADING', false)

    window.addEventListener('focus', () => {
      this.windowBlur = false
    })
    window.addEventListener('blur', () => {
      this.windowBlur = true
    })

    clearInterval(this.$store.state.articleInterval);
    this.$store.commit('CLEAR_ARTICLE_INTERVAL')
    this.articleGo()
  },
  computed: {
    isSameUser() {
      let status
      if (this.$store.state.auth.user !== null) {
        if (this.article.meta.article_author.username === this.$store.state.auth.user.username) {
          status = true
        } else {
          status = false
        }
      } else {
        status = false
      }

      return status
    }
  },
  data() {
    return {
      followButtonLoading: false,
      windowBlur: false,
      read_time: 10
    }
  },
  methods: {
    followProccess() {
      this.followButtonLoading = true
      if (!this.$store.state.auth.loggedIn) {
        Cookies.set('auth.redirect', this.$route.path)
        this.$router.push('/login')
      } else {
        let proccessLink
        if (this.article.has_followed_this_author) {
          proccessLink = this.$api.processAuthorUnfollow(this.article.meta.article_author.username)
        } else {
           proccessLink = this.$api.processAuthorFollow(this.article.meta.article_author.username)
        }

        proccessLink.then(() => {
          this.article.has_followed_this_author = !this.article.has_followed_this_author
          this.followButtonLoading = false
        })
      }
    },
    articleGo() {
      setTimeout(() => {
        let time = (this.article.read_time * 1000)
        let delta = 1000
        let tid

        tid = setInterval(() => {
          if (this.windowBlur) {
            return;
          }

          time -= delta;
          // console.log(time / 1000);
          if (time <= 0) {
            clearInterval(this.$store.state.articleInterval);
            this.$store.commit('CLEAR_ARTICLE_INTERVAL')

            this.$api.go(this.article.view_form_data, '127.0.0.1')
              .then(() => {

              })
              .catch((err) => {
                console.log(err.response)
              })
          }
        }, delta)
        this.$store.commit('SET_ARTICLE_INTERVAL', tid)
      }, 500)
    }
  }
}
</script>

<style>
  article img {
    width: auto;
    max-width: 100% !important;
    height: auto;
  }

</style>
