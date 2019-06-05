<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-third">
          <user-profile v-if="user" :user="user" />
        </div>
        <div class="column">
          <h1 class="title">いいね</h1>
          <div class="columns is-multiline">
            <div
              v-for="page in pages"
              :key="page.id"
              class="column is-three-fifths is-offset-one-fifth"
            >
              <page-box :page="page" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import PageBox from '~/components/molecules/PageBox.vue'
import UserProfile from '~/components/organisms/UserProfile.vue'
import { Vue, Component } from 'vue-property-decorator'
import { User, getUser, blankUser } from '~/common/user'
import { Page, getPage } from '~/common/page'

@Component({
  components: {
    UserProfile,
    PageBox
  }
})
export default class extends Vue {
  user: User = blankUser
  pages: Page[] = []

  get isOwner() {
    return this.$store.getters['user/isMyId'](this.$route.params.id)
  }

  async created() {
    try {
      this.user = await getUser(this.$route.params.id)

      if (this.user.data.likes.length === 0) {
        return
      }

      this.user.data.likes.forEach(pageId => {
        getPage(pageId).then((page: Page) => {
          this.pages.push(page)
        })
      })
    } catch (e) {
      console.log(e)
    }
  }
}
</script>
