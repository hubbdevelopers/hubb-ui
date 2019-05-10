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

            <!-- <div
              v-for="following in followingCommunities"
              :key="following.ID"
              class="column"
            >
              <list-community-box :communityId="following.FollowingId" />
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import ListUserBox from '~/components/molecules/ListUserBox.vue'
import ListCommunityBox from '~/components/molecules/ListCommunityBox.vue'
import UserProfile from '~/components/organisms/UserProfile.vue'
import { Vue, Component } from 'vue-property-decorator'
import { User, getUser, blankUser } from '~/common/user'

@Component({
  components: {
    ListUserBox,
    ListCommunityBox,
    UserProfile
  }
})
export default class extends Vue {
  user: User = blankUser
  followingUsers: User[] = []
  //followingCommunities: []

  get isOwner() {
    return this.$store.getters['user/isMyId'](this.$route.params.id)
  }

  async created() {
    this.user = await getUser(this.$route.params.id)

    if (this.user.data.followingUsers.length === 0) {
      return
    }

    this.user.data.followingUsers.forEach(followingId => {
      getUser(followingId).then((user: User) => {
        this.followingUsers.push(user)
      })
    })
  }
}
</script>
