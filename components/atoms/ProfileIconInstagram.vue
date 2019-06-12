<template>
  <span class="icon has-text-success">
    <a
      :href="'https://instagram.com/' + instagramId"
      target="_blank"
      style="color: #c63f60;"
    >
      <i class="fab fa-instagram" />
    </a>
  </span>
</template>
<script>
export default {
  props: {
    instagramId: {
      type: String,
      required: true
    }
  }
}
</script>
