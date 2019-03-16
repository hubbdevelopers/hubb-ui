<template>
<footer class="modal-card-foot">
  <button class="button is-success" @click="submit" :disabled="!canSubmit"><slot /></button>
  <button class="button" @click="close">閉じる</button>
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

