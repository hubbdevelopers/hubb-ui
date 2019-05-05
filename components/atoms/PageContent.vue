<template>
  <div v-html="content" class="content" />
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  word-wrap: break-word;
}
</style>
