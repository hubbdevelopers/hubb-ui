<template>
  <div>
    <loading :is-loading="isLoading" />
    <page>
      <template v-slot:main>
        <page-main
          :page="page"
          :owner="owner"
          :is-user="true"
          :is-community="false"
          :can-edit="isOwner"
          :is-login="isLogin"
          :is-liked="isLiked"
          @click-ellipsis="showConfigModal"
        />
      </template>
      <template v-slot:bottom>
        <page-comment
          :page="page"
          :is-login="isLogin"
          v-if="!page.data.isDraft"
        />
      </template>
    </page>
    <page-config-modal
      :is-active="isActiveConfigModal"
      @close="closeConfigModal"
      @delete-page="deletePage"
      v-if="isOwner"
    />
  </div>
</template>
<script lang="ts">
import Page from '~/components/templates/Page.vue'
import PageMain from '~/components/organisms/PageMain.vue'
import PageConfigModal from '~/components/organisms/PageConfigModal.vue'
import PageComment from '~/components/organisms/PageComment.vue'
import { Vue, Component } from 'vue-property-decorator'
import { User, blankUser, getUser } from '~/common/user'
import { Page as PageType, blankPage, getPage } from '~/common/page'
import Loading from '~/components/atoms/Loading.vue'

@Component({
  components: {
    Page,
    PageMain,
    PageConfigModal,
    PageComment,
    Loading
  },
  /* eslint-disable @typescript-eslint/no-explicit-any */
  head() {
    return {
      title:
        (this as any).page.data.name !== ''
          ? `${(this as any).page.data.name} | Hubb`
          : 'Hubb'
    }
  }
})
export default class extends Vue {
  page: PageType = blankPage
  owner: User = blankUser
  isDeleting: boolean = false
  isLoading: boolean = true
  isActiveConfigModal = false

  get isLiked() {
    return this.page.likedBy.includes(this.$store.state.user.id)
  }

  get isLogin() {
    return this.$store.getters['user/isLogin']
  }

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

  showConfigModal() {
    this.isActiveConfigModal = true
  }
  closeConfigModal() {
    this.isActiveConfigModal = false
  }
}
</script>
