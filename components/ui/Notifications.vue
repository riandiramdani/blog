<template>
  <v-btn icon text v-if="notifications.length <= 0" class="mr-2">
    <v-icon medium>mdi-bell</v-icon>
  </v-btn>

  <v-menu
    offset-y
    origin="center center"
    transition="scale-transition"
    :nudge-right="140"
    :nudge-bottom="10"
    v-else
  >
    <template  v-slot:activator="{ on }">
      <v-btn icon v-on="on" text>
        <v-badge color="red" overlap class="mr-5" >
          <span slot="badge">{{ notifications.length }}</span>
          <v-icon medium>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-list dense>
      <v-list-item
        v-for="(item, index) in notifications"
        :key="index"
        @click="readNotifications(item)"
      >
        <!-- New Artilces -->
        <template v-if="item.data.type === 'new-article'">
          <v-list-item-avatar tile>
            <v-img :src="item.data.payload.article_main_image_thumbnail_url"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.data.payload.author_username }} mem-posting artikel baru</v-list-item-title>
            <v-list-item-subtitle>Artikel: {{ item.data.payload.article_title }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>

        <!-- Like Artilces -->
        <template v-if="item.data.type === 'like-article'">
          <v-list-item-avatar tile>
            <v-img :src="item.data.payload.liker_image"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.data.payload.liker_username }} menyukai artikel Anda.</v-list-item-title>
            <v-list-item-subtitle>Artikel: {{ item.data.payload.article_title }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>

        <!-- Follow Authors -->
        <template v-if="item.data.type === 'following-author'">
          <v-list-item-avatar tile>
            <v-img :src="item.data.payload.follower_image"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.data.payload.follower_username }} mulai mengikuti Anda.</v-list-item-title>
          </v-list-item-content>
        </template>

        <!-- Follow Authors -->
        <template v-if="item.data.type === 'new-referral'">
          <v-list-item-avatar tile>
            <v-img :src="item.data.payload.referral_image"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.data.payload.referral_username }} telah mendaftar berdasarkan rekomendasi Anda.</v-list-item-title>
          </v-list-item-content>
        </template>

        <!-- Comments -->
        <template v-if="item.data.type === 'new-comment'">
          <v-list-item-avatar tile>
            <v-img :src="item.data.payload.commenter_image"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.data.payload.commenter_username }} berkomentar pada artikel Anda.</v-list-item-title>
            <v-list-item-subtitle class="font-italic">Article: {{ item.data.payload.article_title }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>

        <!-- Comments Reply -->
        <template v-if="item.data.type === 'new-comment-reply'">
          <v-list-item-avatar tile>
            <v-img :src="item.data.payload.commenter_image"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.data.payload.commenter_username }} membalas komentar Anda.</v-list-item-title>
            <v-list-item-subtitle class="font-italic">Article: {{ item.data.payload.article_title }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>

      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      userId: this.$store.state.auth.user.id,
      notifications: [],
    }
  },
  mounted() {
    this.getUnreadNotification()
    this.$echo.private('App.Entities.User.'+this.userId)
      .notification((notification) => {
        // console.log(notification)
        let obj = new Object()
        obj.id = notification.id
        obj.data = {
          payload: notification.payload,
          type: notification.payload.type,
        }
        this.notifications.push(obj)
      });
  },
  methods: {
    getUnreadNotification() {
      this.$api.getUnreadNotifications(1)
        .then(res => {
          this.notifications = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    readNotifications(item) {
      this.$api.markNotificationAsRead(item.id)
        .then(res => {
          this.getUnreadNotification()

          if (item.data.type !== 'following-author' && item.data.type !== 'new-referral') {
            this.$router.replace('/article/'+item.data.payload.article_id+'/'+item.data.payload.article_slug)
          } else if (item.data.type === 'new-referral') {
            this.$router.replace('/member/referrals')
          }
        })
    }
  },
}
</script>
