<template>
<footer class="modal-card-foot">
  <button class="button is-success" @click="submit">Save changes</button>
  <button class="button" @click="close">閉じる</button>
</footer>
</template>
<script>
export default {
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

