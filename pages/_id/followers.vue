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
              :key="follower.id"
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
<script lang="ts">
import ListUserBox from '~/components/molecules/ListUserBox.vue'
import UserProfile from '~/components/organisms/UserProfile.vue'
import { Vue, Component } from 'vue-property-decorator'
import { User, getUser, blankUser } from '~/common/user'
import meta from '~/mixins/userMeta'

@Component({
  mixins: [meta],
  components: {
    ListUserBox,
    UserProfile
  }
})
export default class extends Vue {
  user: User = blankUser
  followerUsers: User[] = []

  get isOwner() {
    return this.$store.getters['user/isMyId'](this.$route.params.id)
  }

  async created() {
    try {
      this.user = await getUser(this.$route.params.id)

      if (this.user.data.followers.length === 0) {
        return
      }

      this.user.data.followers.forEach(followerId => {
        getUser(followerId).then((user: User) => {
          this.followerUsers.push(user)
        })
      })
    } catch (e) {
      console.log(e)
    }
  }
}
</script>
