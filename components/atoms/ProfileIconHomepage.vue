<template>
  <span class="icon has-text-success">
    <a :href="url" target="_blank">
      <i class="fas fa-home" style="color: #2dc987;" />
    </a>
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
