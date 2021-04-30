<template>
  <div>

  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      username: '',
    }
  },
  mounted() {
    this.username = this.$route.params.username

    if (this.username !== null || this.username !== '') {
      let expDate = new Date(new Date().getTime() + ((30 * 24) * 60) * 60 * 1000);
      Cookies.set('ref', this.username, {
          expires: expDate,
      })
    }

    this.$router.push('/')
  }
}
</script>
