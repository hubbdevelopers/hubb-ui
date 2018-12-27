<template>
<nav class="navbar is-transparent">
  <div class="navbar-brand">
    <nuxt-link class="navbar-item" to="/">
      <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
    </nuxt-link>
    <div class="navbar-burger burger" @click="showNav = !showNav" :class="{ 'is-active': showNav }" data-target="navbarExampleTransparentExample">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>


  <div id="navbarExampleTransparentExample" class="navbar-menu" :class="{ 'is-active': showNav }">
    <div class="navbar-start">
      <nuxt-link class="navbar-item" :to="'/' + $store.state.user.accountId" v-if="isLogin">マイページ</nuxt-link>
      <nuxt-link class="navbar-item" to="/i/notification" v-if="isLogin">通知</nuxt-link>
      <nuxt-link class="navbar-item" to="/i/user">ユーザー一覧</nuxt-link>
      <nuxt-link class="navbar-item" to="/i/community">コミュニティ一覧</nuxt-link>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="field is-grouped">
          <p class="control">
            <button v-if="isLogin" class="button is-danger" @click='logout'>
              <span class="icon">
                <i class="fas fa-sign-out-alt"></i>
              </span>
              <span>Logout</span>
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</nav>
</template>
<script>
export default {
  data() {
    return {
      showNav: false
    }
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('user/logout')
        this.$router.push('/')
      } catch(e) {
        window.alert("ログアウトエラー")
      }
    }
  },
  computed: {
    isLogin: function() {
      return this.$store.getters['user/isLogin']
    }
  }
}
</script>