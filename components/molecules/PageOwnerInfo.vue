<template>
<div class="is-clearfix">
  <div class="is-inline-block is-pulled-left">
    <image-icon-link :ownerId="owner.ID" :image="owner.Image" :isUser="isUser" :isCommunity="isCommunity"/>
  </div>
  <div class="is-inline-block is-pulled-left right-area">
    <span>{{owner.Name}}</span>
    <text-how-many-time-ago :date="page.CreatedAt"/>
  </div>
</div>
</template>
<script>
import ImageIconLink from '~/components/atoms/ImageIconLink.vue'
import TextHowManyTimeAgo from '~/components/atoms/TextHowManyTimeAgo.vue'
export default {
  components: {
		ImageIconLink,
		TextHowManyTimeAgo
  },
  props: {
    owner: {
      type: Object,
      required: true
    },
    page: {
      type: Object,
      required: true
    },
    isUser: {
      type: Boolean,
      default: false
    },
    isCommunity: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped>
.right-area {
  margin: 0 5px;
  font-size: 12px;
}
</style>
