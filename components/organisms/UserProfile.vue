<template>
  <div class="box">
    <div class="columns is-mobile is-vcentered">
      <div class="column is-two-fifths">
        <n-link :to="`/${user.id}`">
          <profile-image :image="user.data.image" />
        </n-link>
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
          <profile-name>{{ user.data.name }}</profile-name>
          <profile-account-id>{{ user.data.accountId }}</profile-account-id>
        </div>

        <profile-s-n-s
          :homepage-url="user.data.homepage"
          :twitter-id="user.data.twitter"
          :instagram-id="user.data.instagram"
          :facebook-id="user.data.facebook"
        />
        <profile-description>{{ user.data.description }}</profile-description>

        <profile-birthday :birthday="user.data.birthday" />

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
        @follow="follow"
        @unfollow="unfollow"
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

  get followingCount() {
    return this.user.data.followingUsers.length
  }

  get followerCount() {
    return this.user.data.followers.length
  }

  get likeCount() {
    return this.user.data.likes.length
  }

  get isOwner() {
    return this.$store.getters['user/isMyId'](this.user.id)
  }

  get isFollowingUser() {
    return this.$store.getters['user/isFollowingUser'](this.user.id)
  }

  follow() {
    this.$store
      .dispatch('user/followUser', this.user.id)
      .then(() => {
        this.user.data.followers.push(this.user.id)
      })
      .catch(err => {
        console.log(err)
        window.alert('error')
      })
  }
  unfollow() {
    this.$store
      .dispatch('user/unfollowUser', this.user.id)
      .then(() => {
        this.user.data.followingUsers = this.user.data.followingUsers.filter(
          id => {
            return id !== this.user.id
          }
        )
      })
      .catch(err => {
        console.log(err)
        window.alert('error')
      })
  }
}
</script>
