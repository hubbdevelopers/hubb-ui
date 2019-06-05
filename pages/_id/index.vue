<template>
  <div>
    <mypage :user="user" :pages="pages" :communities="communities" />
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import Mypage from '~/components/templates/MyPage.vue'
import { User, getUser, blankUser } from '~/common/user'
import { Page, getPages } from '~/common/page'

@Component({
  components: {
    Mypage
  },
  async asyncData({ params }) {
    const user = await getUser(params.id)
    return {
      user: user
    }
  },
  head() {
    return {
      title: `${(this as any).user.data.name} | Hubb`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: (this as any).user.data.description
        }
      ]
    }
  }
})
export default class extends Vue {
  user: User = blankUser
  pages: Page[] = []
  communities = []
  showNewPageModal: boolean = false
  showNewCommunityModal: boolean = false

  async created() {
    try {
      this.pages = await getPages(this.$route.params.id, 'user', this.isOwner)
    } catch (e) {
      console.log(e)
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
