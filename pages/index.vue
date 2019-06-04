<template>
  <section class="section">
    <div class="container">
      <new-page-modal :showModal="showNewPageModal" @close="closeModal" />
      <template v-if="isLogin">
        <div class="columns">
          <div class="column is-one-third is-hidden-mobile">
            <user-profile
              :user="$store.getters['user/getUser']"
              v-if="isLogin && accountId"
            />
          </div>
          <div class="column">
            <div v-if="timeline.length > 0" class="columns is-multiline">
              <div
                v-for="page in timeline"
                :key="page.id"
                class="column is-three-fifths is-offset-one-fifth"
              >
                <page-box :page="page" :is-timeline="true" />
              </div>
            </div>
            <div v-else class="has-text-centered">
              <span
                >まだタイムラインがありません<br />新しいページを作成しましょう</span
              >
              <div class="new-page-button">
                <app-button @click="showModal" type="primary"
                  >新規作成</app-button
                >
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
              <div class="column box is-three-fifths is-offset-one-fifth">
                Hubb へようこそ!<br />Hubb は記事投稿サービスです。<br />まずは<n-link
                  to="i/signup"
                  >新規登録</n-link
                >へ!
              </div>
              <div
                v-for="page in notLoginTimeline"
                :key="page.id"
                class="column is-three-fifths is-offset-one-fifth"
              >
                <page-box :page="page" :is-timeline="true" />
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
import NewPageModal from '~/components/organisms/NewPageModal.vue'
import LoginBox from '~/components/organisms/LoginBox.vue'
import PageBox from '~/components/molecules/PageBox.vue'
import UserProfile from '~/components/organisms/UserProfile.vue'
import { Page, getNotLoginTimeline } from '~/common/page'
import AppButton from '~/components/atoms/AppButton.vue'

@Component({
  components: {
    UserProfile,
    LoginBox,
    PageBox,
    NewPageModal,
    AppButton
  }
})
export default class extends Vue {
  email: string = ''
  password: string = ''
  config: string = ''
  notLoginTimeline: Page[] = []
  showNav = false
  showNewPageModal = false

  async created() {
    console.log('created')
    if (this.isLogin) {
      return
    }
    this.notLoginTimeline = await getNotLoginTimeline()
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
  showModal() {
    this.showNewPageModal = true
  }
  closeModal() {
    this.showNewPageModal = false
  }
}
</script>
<style lang="scss" scoped>
.new-page-button {
  margin-top: 10px;
}
</style>
