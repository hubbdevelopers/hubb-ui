<template>
  <div class="is-inline-block">
  <n-link :to="link">
    <figure class="image is-48x48 rounded">
      <img class="is-rounded" :src="imageSrc" alt="ユーザー画像">
    </figure>
  </n-link>
</div>
</template>
<script>
export default {
  props: {
    isUser: {
      type: Boolean,
      default: false
    },
    isCommunity: {
      type: Boolean,
      default: false
    },
    ownerId: {
      type: Number
    },
    image: {
      type: String
    }
  },
  computed: {
    link() {
      if (this.isUser) {
        return `/${this.ownerId}`
      } else if (this.isCommunity) {
        return '/' // TODO
      } else {
        return this.$route.path
      }
    },
    imageSrc() {
      return this.image ? this.image : 'https://www.bsn.eu/wp-content/uploads/2016/12/user-icon-image-placeholder-300-grey.jpg'
    }
  }
}
</script>
