<template>
  <figure class="image container is-128x128">
    <img :src="image" alt="ページメイン画像" />
  </figure>
</template>
<script>
export default {
  props: {
    image: {
      type: String,
      required: true
    }
  }
}
</script>
