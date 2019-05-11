<template>
  <div>
    <loading :is-loading="isLoading" />
    <page
      v-if="page"
      :canEdit="isOwner"
      :page="page"
      :owner="owner"
      :isDeleting="isDeleting"
      @deletePage="deletePage"
    />
  </div>
</template>
<script lang="ts">
import Page from '~/components/templates/Page.vue'
import { Vue, Component } from 'vue-property-decorator'
import { User, blankUser, getUser } from '~/common/user'
import { Page as PageType, blankPage, getPage } from '~/common/page'
import Loading from '~/components/atoms/Loading.vue'

@Component({
  components: {
    Page,
    Loading
  }
})
export default class extends Vue {
  page: PageType = blankPage
  owner: User = blankUser
  isDeleting: boolean = false
  isLoading: boolean = true

  get isOwner() {
    return (
      this.$store.getters['user/isMyId'](this.page.data.ownerId) &&
      this.page.data.ownerType === 'user'
    )
  }
  async created() {
    try {
      this.isLoading = true
      this.page = await getPage(this.$route.params.pageId)
      if (this.page.data.ownerType === 'user') {
        this.owner = await getUser(this.page.data.ownerId)
      } else if (this.page.data.ownerType === 'community') {
        // TODO
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoading = false
    }
  }
  deletePage() {
    if (!window.confirm('ページを削除します。よろしいですか？')) {
      return
    }
    this.isDeleting = true
    this.$store
      .dispatch('user/deletePage', this.$route.params.pageId)
      .then(() => {
        window.alert('ページを削除しました')
        this.$router.push(`/${this.$store.state.user.id}`)
      })
      .catch(err => {
        console.log(err)
        window.alert('削除に失敗しました')
      })
      .finally(() => {
        this.isDeleting = false
      })
  }
}
</script>
