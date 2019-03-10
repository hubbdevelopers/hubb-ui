<template>
  <span class="icon has-text-success">
    <a :href="'https://facebook.com/' + facebookId" target="_blank"><i class="fab fa-facebook"></i></a>
  </span>
</template>
<script>
export default {
  props: {
    facebookId: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
.fa-facebook {
  color: #334F8D;
}
</style>
