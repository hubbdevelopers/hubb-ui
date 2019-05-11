<template>
  <div>
    <div v-if="page.data.isDraft" class="draft">このページは下書きです</div>
    <div v-if="page.data.image" class="columns is-centered">
      <div class="column is-half">
        <page-main-image :image="page.data.image" />
      </div>
    </div>
    <page-title>{{ page.data.name }}</page-title>
    <div class="columns is-mobile is-vcentered">
      <div class="column is-three-quarters">
        <page-owner-info
          :owner="owner"
          :page="page"
          :is-user="isUser"
          :is-community="isCommunity"
        />
      </div>
      <div v-if="canEdit" class="column">
        <app-ellipsis @click="clickEllipsis()" />
      </div>
    </div>
    <page-content :content="page.data.content" class="content" />

    <div class="columns is-mobile is-vcentered">
      <div class="column is-three-quarters">
        <page-owner-info
          :owner="owner"
          :page="page"
          :is-user="isUser"
          :is-community="isCommunity"
        />
      </div>
      <div class="column">
        <page-like
          :is-liked="isLiked"
          :is-login="isLogin"
          :like-count="likeCount"
          @like-page="likePage"
          @unlike-page="unlikePage"
          v-if="!page.data.isDraft"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import PageOwnerInfo from '~/components/molecules/PageOwnerInfo.vue'
import PageMainImage from '~/components/atoms/PageMainImage.vue'
import PageContent from '~/components/atoms/PageContent.vue'
import PageLike from '~/components/atoms/PageLike.vue'
import PageTitle from '~/components/atoms/PageTitle.vue'
import AppEllipsis from '~/components/atoms/AppEllipsis.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Page } from '~/common/page'
import { User } from '~/common/user'

@Component({
  components: {
    PageOwnerInfo,
    PageMainImage,
    PageContent,
    PageLike,
    PageTitle,
    AppEllipsis
  }
})
export default class extends Vue {
  @Prop({ required: true }) readonly page!: Page
  @Prop({ required: true }) readonly owner!: User
  @Prop({ default: false }) readonly isUser!: boolean
  @Prop({ default: false }) readonly isCommunity!: boolean
  @Prop({ default: false }) readonly canEdit!: boolean
  @Prop({ default: false }) readonly isLiked!: boolean
  @Prop({ default: false }) readonly isLogin!: boolean

  get likeCount(): number {
    return this.page.likedBy ? this.page.likedBy.length : 0
  }

  likePage() {
    this.$store
      .dispatch('user/likePage', this.$route.params.pageId)
      .then(() => {
        this.page.likedBy.push(this.$store.state.user.id)
      })
      .catch(err => {
        console.log(err)
        window.alert('いいねに失敗しました')
      })
  }
  unlikePage() {
    this.$store
      .dispatch('user/unlikePage', this.$route.params.pageId)
      .then(() => {
        this.page.likedBy = this.page.likedBy.filter(
          n => n !== this.$store.state.user.id
        )
      })
      .catch(err => {
        console.log(err)
        window.alert('いいね取り消しに失敗しました')
      })
  }
  clickEllipsis() {
    this.$emit('click-ellipsis')
  }
}
</script>
<style lang="scss" scoped>
.content {
  margin-bottom: 40px;
}
.draft {
  background-color: yellow;
  margin-bottom: 15px;
}
</style>
