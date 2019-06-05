<template>
  <div class="is-inline-block">
    <n-link :to="link">
      <figure class="image is-32x32 rounded">
        <img :src="imageSrc" class="is-rounded" alt="ユーザー画像" />
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
    userId: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    }
  },
  computed: {
    link() {
      if (this.isUser) {
        return `/${this.userId}`
      } else if (this.isCommunity) {
        return '/' // TODO
      } else {
        return this.$route.path
      }
    },
    imageSrc() {
      return this.image
        ? this.image
        : 'https://www.bsn.eu/wp-content/uploads/2016/12/user-icon-image-placeholder-300-grey.jpg'
    }
  }
}
</script>
