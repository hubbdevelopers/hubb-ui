<template>
  <div class="is-clearfix">
    <div class="is-inline-block is-pulled-left">
      <image-icon-link
        :ownerId="ownerId"
        :image="owner.data.image"
        :isUser="isUser"
        :isCommunity="isCommunity"
      />
    </div>
    <div class="is-inline-block is-pulled-left right-area">
      <span>{{ owner.data.name }}</span>
      <text-how-many-time-ago :date="page.data.createdAt" />
    </div>
  </div>
</template>
<script lang="ts">
import ImageIconLink from '~/components/atoms/ImageIconLink.vue'
import TextHowManyTimeAgo from '~/components/atoms/TextHowManyTimeAgo.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Page } from '~/common/page'
import { User } from '~/common/user'

@Component({
  components: {
    ImageIconLink,
    TextHowManyTimeAgo
  }
})
export default class extends Vue {
  @Prop({ required: true }) readonly owner!: User
  @Prop({ required: true }) readonly page!: Page
  @Prop({ default: false }) readonly isUser!: boolean
  @Prop({ default: false }) readonly isCommunity!: boolean

  get ownerId() {
    return this.owner.id
  }
}
</script>
<style lang="scss" scoped>
.right-area {
  margin: 0 5px;
  font-size: 12px;
}
</style>
