<template>
  <nav class="navbar is-transparent">
    <div v-if="isLogin">
      <new-page-modal :showModal="showNewPageModal" @close="closeModal" />
    </div>
    <div class="navbar-brand">
      <n-link class="navbar-item" to="/">
        <img
          src="~/assets/images/logo.png"
          alt="Bulma: a modern CSS framework based on Flexbox"
        />
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
          :to="`/${$store.state.user.uid}`"
          v-if="isLogin"
          class="navbar-item"
        >
          <i class="fas fa-user" /> マイページ
        </n-link>
        <n-link
          :to="`/${$store.state.user.uid}/settings`"
          v-if="isLogin"
          class="navbar-item"
        >
          <i class="fas fa-sliders-h" /> 設定
        </n-link>
        <div class="navbar-item">
          <div class="field is-grouped">
            <p class="control">
              <n-link v-if="!isLogin" class="button is-primary" to="/i/signup"
                >新規登録</n-link
              >
              <n-link v-if="!isLogin" class="button is-light" to="/i/login"
                >ログイン</n-link
              >
              <button v-if="isLogin" @click="logout" class="button is-danger">
                ログアウト
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import ImageIconLink from '~/components/atoms/ImageIconLink.vue'
import NewPageModal from '~/components/organisms/NewPageModal'
export default {
  components: {
    NewPageModal,
    ImageIconLink
  },
  data() {
    return {
      showNav: false,
      showNewPageModal: false
    }
  },
  computed: {
    isLogin: function() {
      return this.$store.getters['user/isLogin']
    },
    image: function() {
      return this.$store.getters['user/getImage']
    }
  },

  methods: {
    async logout() {
      try {
        await this.$store.dispatch('user/logout')
        this.$router.push('/')
      } catch (e) {
        window.alert('ログアウトエラー')
      }
    },
    showModal() {
      this.showNewPageModal = true
    },
    closeModal() {
      this.showNewPageModal = false
    }
  }
}
</script>
