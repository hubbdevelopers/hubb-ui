<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Hello World
      </h1> 
      <p class="subtitle">
        My first website with <strong>Bulma</strong>!
      </p>

      <div class="columns">

        <div class="column is-one-quarter">
          <profile-box :accountId="accountId" v-if="isLogin && accountId" />
          <login-box v-else />
        </div>
        <div class="column box">
          <div class="columns is-multiline">
            <div v-for="page in timeline" :key="page.ID" class="column is-one-third">
              <page-box :pageId="page.ID.toString()" />
            </div>
          </div> 
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ProfileBox from '~/components/user/ProfileBox'
import LoginBox from '~/components/user/LoginBox'
import PageBox from '~/components/user/PageBox'

export default {
  components: {
    ProfileBox,
    LoginBox,
    PageBox
  },
  data(){
    return {
      email: "",
      password: "",
      config: ""
    }
  },
  methods: {
    
  },
  computed: {
    isLogin: function() {
      return this.$store.getters['user/isLogin']
    },
    accountId: function() {
      return this.$store.getters['user/getAccountId']
    },
    timeline: function() {
      return this.$store.getters['user/getTimeline']
    }
  }
}
</script>


