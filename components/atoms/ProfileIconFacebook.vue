<template>
  <span class="icon has-text-success">
    <a :href="'https://facebook.com/' + facebookId" target="_blank">
      <i class="fab fa-facebook" style="color: #334f8d;" />
    </a>
  </span>
</template>
<script>
export default {
  props: {
    facebookId: {
      type: String,
      required: true
    }
  }
}
</script>
