<template>
<header class="modal-card-head">
  <p class="modal-card-title"><slot></slot></p>
  <button class="delete" aria-label="close" @click="close()"></button>
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
