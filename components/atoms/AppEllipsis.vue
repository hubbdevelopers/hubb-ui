<template>
  <i class="fas fa-ellipsis-h" @click="callback($event)"></i>
</template>
<script>
export default {
  methods: {
    callback(e) {
      this.$emit('click', e)
    }
  }
}
</script>