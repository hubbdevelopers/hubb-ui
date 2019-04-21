<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-third">
          <user-profile v-if="user" :user="user" />
        </div>
        <div class="column">
          <h1 class="title">フォロワー</h1>
          <div class="columns is-multiline">
            <div
              v-for="follower in followerUsers"
              :key="follower.ID"
              class="column"
            >
              <list-user-box :user="follower" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import ListUserBox from '~/components/molecules/ListUserBox'
import UserProfile from '~/components/organisms/UserProfile'

export default {
  components: {
    UserProfile,
    ListUserBox
  },
  data() {
    return {
      user: null,
      followers: [],
      followerUsers: []
    }
  },
  computed: {
    // isOwner: function() {
    //   return this.$store.getters['user/isMyId'](this.$route.params.uid)
    // }
  },
  async created() {
    // this.user = (await this.$axios.$get(
    //   `/users/${this.$route.params.uid}`
    // )).data
    // this.followers = (await this.$axios.$get(
    //   `/users/${this.user.ID}/followers`
    // )).data

    this.followers.forEach(follower => {
      console.log(follower)
      this.$axios.$get(`/users/${follower.UserId}`).then(res => {
        this.followerUsers.push(res.data)
      })
    })
  }
}
</script>
