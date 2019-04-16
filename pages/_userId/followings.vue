<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-third">
          <user-profile v-if="user" :user="user" />
        </div>
        <div class="column">
          <h1 class="title">フォロー中</h1>
          <div class="columns is-multiline">
            <div
              v-for="following in followingUsers"
              :key="following.ID"
              class="column"
            >
              <list-user-box :user="following" />
            </div>

            <div
              v-for="following in followingCommunities"
              :key="following.ID"
              class="column"
            >
              <list-community-box :communityId="following.FollowingId" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import ListUserBox from '~/components/molecules/ListUserBox'
import ListCommunityBox from '~/components/molecules/ListCommunityBox'
import UserProfile from '~/components/organisms/UserProfile'

export default {
  components: {
    ListUserBox,
    ListCommunityBox,
    UserProfile
  },
  data() {
    return {
      user: null,
      followings: [],
      followingUsers: [],
      followingCommunities: []
    }
  },
  computed: {
    isOwner: function() {
      return this.$store.getters['user/isMyId'](this.$route.params.userId)
    }
  },
  async created() {
    this.user = (await this.$axios.$get(
      `/users/${this.$route.params.userId}`
    )).data
    this.followings = (await this.$axios.$get(
      `/users/${this.user.ID}/followings`
    )).data

    this.followings.forEach(following => {
      if (following.FollowingType === 'user') {
        this.$axios.$get(`/users/${following.FollowingId}`).then(res => {
          this.followingUsers.push(res.data)
        })
      } else if (following.FollowingType === 'community') {
        this.$axios.$get(`/communities/${following.FollowingId}`).then(res => {
          this.followingCommunities.push(res.data)
        })
      }
    })
  }
}
</script>
