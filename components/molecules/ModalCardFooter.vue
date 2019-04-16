<template>
  <footer class="modal-card-foot">
    <button @click="submit" :disabled="!canSubmit" class="button is-success">
      <slot />
    </button>
    <button @click="close" class="button">閉じる</button>
  </footer>
</template>
<script>
export default {
  props: {
    canSubmit: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    submit() {
      this.$emit('submit')
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
