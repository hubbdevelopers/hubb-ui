<template>
<nav class="navbar is-transparent">
  <div class="navbar-brand">
    <n-link class="navbar-item" to="/">
      <img src="~/assets/images/logo.png" alt="Bulma: a modern CSS framework based on Flexbox">
    </n-link>      
    <div class="navbar-burger burger" @click="showNav = !showNav" :class="{ 'is-active': showNav }" data-target="navbarExampleTransparentExample">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>

  <div id="navbarExampleTransparentExample" class="navbar-menu" :class="{ 'is-active': showNav }">
    <div class="navbar-end">
      <n-link class="navbar-item" :to="'/' + $store.state.user.id" v-if="isLogin"><i class="fas fa-user"></i> マイページ</n-link>
      <n-link class="navbar-item" :to="`/${$store.state.user.id}/settings`" v-if="isLogin"><i class="fas fa-sliders-h"></i> 設定</n-link>
      <div class="navbar-item">
        <div class="field is-grouped">
          <p class="control">
            <n-link v-if="!isLogin" class="button is-primary" to="/i/signup">新規登録</n-link>
            <n-link v-if="!isLogin" class="button is-light" to="/i/login">ログイン</n-link>
            <button v-if="isLogin" class="button is-danger" @click='logout'>ログアウト</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</nav>
</template>
<script>
import ImageIconLink from '~/components/atoms/ImageIconLink.vue'
export default {
  components: {
    ImageIconLink
  },
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
    },
		image: function () {
			return this.$store.getters['user/getImage']
		}
  }
}
</script>