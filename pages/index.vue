<template>
  <section class="section">
    <div class="container">

      <div class="columns">
        <div class="column is-one-third is-hidden-mobile">
          <user-profile :user="$store.state.user.user" v-if="isLogin && accountId" />
        </div>
        <div class="column">
          <div class="columns is-multiline">
            <div v-for="page in timeline" :key="page.ID" class="column is-three-fifths is-offset-one-fifth">
              <page-box :pageId="page.ID.toString()" />
            </div>
          </div> 
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import LoginBox from '~/components/user/LoginBox'
import PageBox from '~/components/organisms/PageBox'
import UserProfile from '~/components/organisms/UserProfile'

export default {
  components: {
    UserProfile,
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

