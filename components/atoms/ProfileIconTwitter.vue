<template>
  <span class="icon has-text-success">
    <a :href="'https://twitter.com/' + twitterId" target="_blank"><i class="fab fa-twitter"></i></a>
  </span>
</template>
<script>
export default {
  props: {
    twitterId: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
.fa-twitter {
  color: #00A3EA;
}
</style>

