<template>
  <mypage
    v-if="!loading"
    :user="user"
    :pages="pages"
    :communities="communities"
  />
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Mypage from '~/components/templates/MyPage.vue'
import { User, getUser, blankUser } from '~/common/user'
import { Page, getPages } from '~/common/page'

@Component({
  components: {
    Mypage
  }
})
export default class extends Vue {
  user: User = blankUser
  pages: Page[] = []
  communities = []
  showNewPageModal: boolean = false
  showNewCommunityModal: boolean = false
  loading: boolean = true

  async created() {
    this.user = await getUser(this.$route.params.id)
    this.pages = await getPages(this.$route.params.id, 'user', this.isOwner)
    // this.communities = (await this.$axios.$get(
    //   `communities?userid=${this.user.ID}`
    // )).data
    this.loading = false
  }

  goConfigPage() {
    this.$router.push({ path: 'config', append: true })
  }

  get isOwner() {
    return this.$store.getters['user/isMyId'](this.$route.params.id)
  }
}
</script>
