<template>
  <section class="section">
    <div class="container">
      <template v-if="isLogin">
        <div class="columns">
          {{ $store.state.user.user }}
          <div class="column is-one-third is-hidden-mobile">
            <user-profile
              :user="$store.getters['user/getUser']"
              v-if="isLogin && accountId"
            />
          </div>
          <div class="column">
            <div class="columns is-multiline">
              <div
                v-for="page in timeline"
                :key="page.id"
                class="column is-three-fifths is-offset-one-fifth"
              >
                <page-box :page="page" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="columns">
          <div class="column is-one-third is-hidden-mobile">
            <login-box />
          </div>
          <div class="column">
            <div class="columns is-multiline">
              <div
                v-for="page in notLoginTimeline"
                :key="page.ID"
                class="column is-three-fifths is-offset-one-fifth"
              >
                <page-box :pageId="page.ID" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import LoginBox from '~/components/user/LoginBox.vue'
import PageBox from '~/components/molecules/PageBox.vue'
import UserProfile from '~/components/organisms/UserProfile.vue'
import { Page } from '~/common/page'

@Component({
  components: {
    UserProfile,
    LoginBox,
    PageBox
  }
})
export default class extends Vue {
  email: string = ''
  password: string = ''
  config: string = ''
  notLoginTimeline: Page[] = []

  async created() {
    if (this.isLogin) {
      return
    }
    // this.notLoginTimeline = (await this.$axios.get('/recentpages')).data.data
    console.log(this.notLoginTimeline)
  }

  get isLogin() {
    return this.$store.getters['user/isLogin']
  }
  get accountId() {
    return this.$store.getters['user/getAccountId']
  }
  get timeline() {
    return this.$store.getters['user/getTimeline']
  }
}
</script>
