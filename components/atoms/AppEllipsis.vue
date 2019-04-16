<template>
  <i @click="callback($event)" class="fas fa-ellipsis-h" />
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
