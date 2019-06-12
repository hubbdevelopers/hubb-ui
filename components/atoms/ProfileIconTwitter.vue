<template>
  <span class="icon has-text-success">
    <a :href="'https://twitter.com/' + twitterId" target="_blank">
      <i class="fab fa-twitter" style="color: #00a3ea;" />
    </a>
  </span>
</template>
<script>
export default {
  props: {
    twitterId: {
      type: String,
      required: true
    }
  }
}
</script>
