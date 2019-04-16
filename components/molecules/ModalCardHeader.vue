<template>
  <header class="modal-card-head">
    <p class="modal-card-title">
      <slot />
    </p>
    <button @click="close()" class="delete" aria-label="close" />
  </header>
</template>
<script>
export default {
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
