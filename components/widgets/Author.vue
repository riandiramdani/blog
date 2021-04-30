<template>
  <div>
    <v-skeleton-loader
      :loading="$store.getters.contentLoading"
      transition="scale-transition"
      height="150"
      type="list-item-avatar-three-line"
    >
      <v-card class="px-5 py-3 mb-3 mb-md-0" >
        <v-list-item class="pa-0 d-block">
          <div class="d-flex flex-no-wrap justify-end">
            <v-list-item-avatar color="grey" class="mr-2" size="45">
              <v-img :src="author.profile_image"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2">
                {{ author.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="caption">
                @{{ author.username }}
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
                  <span v-if="has_followed_this_author">Batal Ikuti</span>
                  <span v-else>Ikuti</span>
                </v-btn>
              </template>
            </v-list-item-action>
          </div>
          <div class="pl-12 mt-n1 ml-2 d-flex">
              <div class="elevation-2 pa-1 mr-2" style="border-radius: 4px;">
                <a :href="author.social_networks.facebook || '#'" target="_blank">
                  <v-img height="22" width="22" src="/facebook.png"></v-img>
                </a>
              </div>
              <div class="elevation-2 pa-1 mr-2" style="border-radius: 4px;">
                <a :href="author.social_networks.twitter || '#'" target="_blank">
                  <v-img height="22" width="22" src="/twitter.png"></v-img>
                </a>
              </div>
              <div class="elevation-2 pa-1 mr-2" style="border-radius: 4px;">
                <a :href="author.social_networks.instagram || '#'" target="_blank">
                  <v-img height="22" width="22" src="/instagram.png"></v-img>
                </a>
              </div>
          </div>
        </v-list-item>
      </v-card>

    </v-skeleton-loader>
  </div>
</template>

<script>
export default {
  name: 'widget-author',
  props: {
    author: {
      type: Object,
      required: true,
    }
  },
  computed: {
    isSameUser() {
      let status
      if (this.$store.state.auth.user !== null) {
        if (this.author.username === this.$store.state.auth.user.username) {
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
      has_followed_this_author: this.author.has_followed_this_author
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
        if (this.has_followed_this_author) {
          proccessLink = this.$api.processAuthorUnfollow(this.author.username)
        } else {
           proccessLink = this.$api.processAuthorFollow(this.author.username)
        }

        proccessLink.then(() => {
          this.has_followed_this_author = !this.has_followed_this_author
          this.followButtonLoading = false
        })
      }
    }
  }
}
</script>
