<template>
  <figure class="image container is-96x96">
		<img class="is-rounded" :src="imageSrc">
	</figure>
</template>
<script>
export default {
  props: {
    image: {
      type: String
    }
  },
  computed: {
    imageSrc() {
      return this.image ? this.image : 'https://bulma.io/images/placeholders/128x128.png'
    }
  }
}
</script>
