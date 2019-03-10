<template>
  <span class="icon has-text-success">
    <a :href="'https://instagram.com/' + instagramId" target="_blank"><i class="fab fa-instagram"></i></a>
  </span>
</template>
<script>
export default {
  props: {
    instagramId: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
.fa-instagram {
  color: #C63F60;
}
</style>