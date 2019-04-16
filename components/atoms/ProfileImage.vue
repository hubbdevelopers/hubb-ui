<template>
  <figure class="image container is-96x96">
    <img :src="imageSrc" class="is-rounded" />
  </figure>
</template>
<script>
export default {
  props: {
    image: {
      type: String,
      required: true
    }
  },
  computed: {
    imageSrc() {
      return this.image
        ? this.image
        : 'https://bulma.io/images/placeholders/128x128.png'
    }
  }
}
</script>
