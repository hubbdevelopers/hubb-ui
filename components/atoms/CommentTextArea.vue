<template>
  <textarea v-model="internalValue" class="textarea" rows="3" />
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(newVal) {
        if (this.value !== newVal) this.$emit('input', newVal)
      }
    }
  }
}
</script>
