<template>
  <nav class="navbar is-transparent">
    <div v-if="isLogin">
      <new-page-modal :showModal="showNewPageModal" @close="closeModal" />
    </div>
    <div class="navbar-brand">
      <n-link class="navbar-item" to="/">
        <img src="~/assets/images/Hubb.png" alt="Hubb logo" />
      </n-link>
      <div v-if="isLogin" class="navbar-item">
        <a
          @click="showModal"
          v-if="isLogin"
          class="navbar-item has-text-white has-text-weight-semibold"
        >
          <span class="icon"><i class="fas fa-pencil-alt"/></span
          ><span>新規ページ作成</span>
        </a>
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
          class="navbar-item has-text-white has-text-weight-semibold"
        >
          <span><i class="fas fa-user"/></span> マイページ
        </n-link>
        <n-link
          :to="`/${$store.state.user.id}/settings`"
          v-if="isLogin"
          class="navbar-item has-text-white has-text-weight-semibold"
        >
          <span class="icon"><i class="fas fa-sliders-h"/></span> 設定
        </n-link>
        <a
          @click="logout"
          v-if="isLogin"
          class="navbar-item has-text-white has-text-weight-semibold"
        >
          <span class="icon"><i class="fas fa-sign-out-alt"/></span> ログアウト
        </a>
        <n-link
          v-if="!isLogin"
          :to="`/i/login`"
          class="navbar-item has-text-white has-text-weight-semibold"
          ><span class="icon"><i class="fas fa-sign-in-alt"/></span>
          ログイン</n-link
        >
        <n-link
          v-if="!isLogin"
          :to="`/i/signup`"
          class="navbar-item has-text-white has-text-weight-semibold"
          ><span class="icon"><i class="fas fa-user-plus"/></span>
          新規登録</n-link
        >
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
<style lang="scss" scoped>
.navbar,
.navbar-menu {
  background-color: #fbac94;
}
</style>
