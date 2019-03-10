<template>
  <span class="icon has-text-success">
    <a :href="url" target="_blank"><i class="fas fa-home"></i></a>
  </span>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
.fa-home {
  color: #2DC987;
}
</style>
