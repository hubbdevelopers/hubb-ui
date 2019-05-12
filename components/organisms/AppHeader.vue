<template>
  <nav class="navbar is-transparent">
    <div v-if="isLogin">
      <new-page-modal :showModal="showNewPageModal" @close="closeModal" />
    </div>
    <div class="navbar-brand">
      <n-link class="navbar-item" to="/">
        <img src="~/assets/images/logo.png" alt="Hubb logo" />
      </n-link>
      <div v-if="isLogin" class="navbar-item">
        <button
          @click="showModal"
          class="button is-primary is-outlined is-small"
        >
          <span class="icon">
            <i class="fas fa-pencil-alt" />
          </span>
          <span>新規ページ</span>
        </button>
      </div>
      <div
        @click="showNav = !showNav"
        :class="{ 'is-active': showNav }"
        class="navbar-burger burger"
        data-target="navbarExampleTransparentExample"
      >
        <span />
        <span />
        <span />
      </div>
    </div>

    <div
      :class="{ 'is-active': showNav }"
      id="navbarExampleTransparentExample"
      class="navbar-menu"
    >
      <div class="navbar-end">
        <n-link
          :to="`/${$store.state.user.id}`"
          v-if="isLogin"
          class="navbar-item"
        >
          <i class="fas fa-user" /> マイページ
        </n-link>
        <n-link
          :to="`/${$store.state.user.id}/settings`"
          v-if="isLogin"
          class="navbar-item"
        >
          <i class="fas fa-sliders-h" /> 設定
        </n-link>
        <a @click="logout" v-if="isLogin" class="navbar-item">
          <i class="fas fa-sign-out-alt" /> ログアウト
        </a>
        <div v-if="!isLogin" class="navbar-item">
          <div class="field is-grouped">
            <p class="control">
              <app-button @click="$router.push('/i/login')" type="primary"
                >ログイン</app-button
              >
              <app-button @click="$router.push('/i/signup')"
                >新規登録</app-button
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import ImageIconLink from '~/components/atoms/ImageIconLink.vue'
import NewPageModal from '~/components/organisms/NewPageModal.vue'
import AppButton from '~/components/atoms/AppButton.vue'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    NewPageModal,
    ImageIconLink,
    AppButton
  }
})
export default class extends Vue {
  showNav = false
  showNewPageModal = false

  get isLogin() {
    return this.$store.getters['user/isLogin']
  }
  get image() {
    return this.$store.getters['user/getImage']
  }

  async logout() {
    try {
      await this.$store.dispatch('user/logout')
      this.$router.push('/')
    } catch (e) {
      window.alert('ログアウトエラー')
    }
  }
  showModal() {
    this.showNewPageModal = true
  }
  closeModal() {
    this.showNewPageModal = false
  }
}
</script>
<style lang="scss" scoped></style>
