<template>
  <div>
    <loading :is-loading="isLoading" />
    <mypage
      v-if="!isLoading"
      :user="user"
      :pages="pages"
      :communities="communities"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Mypage from '~/components/templates/MyPage.vue'
import { User, getUser, blankUser } from '~/common/user'
import { Page, getPages } from '~/common/page'
import Loading from '~/components/atoms/Loading.vue'

@Component({
  components: {
    Mypage,
    Loading
  }
})
export default class extends Vue {
  user: User = blankUser
  pages: Page[] = []
  communities = []
  showNewPageModal: boolean = false
  showNewCommunityModal: boolean = false
  isLoading: boolean = true

  async created() {
    try {
      this.isLoading = true
      this.user = await getUser(this.$route.params.id)
      this.pages = await getPages(this.$route.params.id, 'user', this.isOwner)
      // this.communities = (await this.$axios.$get(
      //   `communities?userid=${this.user.ID}`
      // )).data
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoading = false
    }
  }

  goConfigPage() {
    this.$router.push({ path: 'config', append: true })
  }

  get isOwner() {
    return this.$store.getters['user/isMyId'](this.$route.params.id)
  }
}
</script>
