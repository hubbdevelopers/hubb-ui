<template>
  <div class="box">
    <div class="columns is-mobile is-vcentered">
      <div class="column is-two-fifths">
        <profile-image :image="user.data.image" />
      </div>
      <div v-if="isOwner" class="column">
        <n-link
          :to="`/${user.id}/profile`"
          class="button is-primary is-outlined is-rounded"
          >プロフィール編集</n-link
        >
      </div>
    </div>

    <div v-if="user">
      <div>
        <div>
          <!-- <profile-name>{{ user.data.name }}</profile-name>
          <profile-account-id>{{ user.data.accountId }}</profile-account-id> -->
        </div>

        <profile-s-n-s
          :homepage-url="user.Homepage"
          :twitter-id="user.Twitter"
          :instagram-id="user.Instagram"
          :facebook-id="user.Facebook"
        />
        <profile-description>{{ user.Description }}</profile-description>

        <profile-birthday :birthday="user.Birthday" />

        <profile-followings-followers-likes
          :id="user.id"
          :following-count="followingCount"
          :follower-count="followerCount"
          :like-count="likeCount"
        />
      </div>

      <profile-follow-button
        v-if="!isOwner"
        :is-following-user="isFollowingUser"
      />
    </div>
  </div>
</template>
<script lang="ts">
import ProfileName from '~/components/atoms/ProfileName.vue'
import ProfileAccountId from '~/components/atoms/ProfileAccountId.vue'
import ProfileDescription from '~/components/atoms/ProfileDescription.vue'
import ProfileBirthday from '~/components/atoms/ProfileBirthday.vue'
import ProfileFollowingsFollowersLikes from '~/components/atoms/ProfileFollowingsFollowersLikes.vue'
import ProfileImage from '~/components/atoms/ProfileImage.vue'
import ProfileSNS from '~/components/molecules/ProfileSNS.vue'
import ProfileFollowButton from '~/components/atoms/ProfileFollowButton.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { User } from '~/common/user'
import { Page } from '~/common/page'

@Component({
  components: {
    ProfileName,
    ProfileAccountId,
    ProfileDescription,
    ProfileBirthday,
    ProfileFollowingsFollowersLikes,
    ProfileImage,
    ProfileSNS,
    ProfileFollowButton
  }
})
export default class extends Vue {
  @Prop({ required: true }) readonly user!: User
  followingCount: number = 0
  followerCount: number = 0
  likeCount: number = 0

  get isOwner() {
    return this.$store.getters['user/isMyId'](this.$route.params.id)
  }
  async created() {
    // this.$axios.$get(`/users/${this.user.ID}/followings`).then(res => {
    //   this.followingCount = res.data.length
    // })
    // this.$axios.$get(`/users/${this.user.ID}/followers`).then(res => {
    //   this.followerCount = res.data.length
    // })
    // this.$axios.$get(`/likes?userid=${this.user.ID}`).then(res => {
    //   this.likeCount = res.data.length
    // })
  }
  // follow() {
  //   this.$store.dispatch('user/followUser', this.user.ID).catch(err => {
  //     console.log(err)
  //     window.alert('error')
  //   })
  // }
  // unfollow() {
  //   this.$store.dispatch('user/unfollowUser', this.user.ID).catch(err => {
  //     console.log(err)
  //     window.alert('error')
  //   })
  // }
}
</script>
