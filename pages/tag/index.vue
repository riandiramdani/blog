<template>

</template>

<script>
  export default {
    mounted() {
      this.$nuxt.error({ statusCode: 404, message: 'Not Found' })
    }
  }
</script>
