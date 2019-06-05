<template>
  <div class="user-box">
    <div class="is-clearfix main">
      <div class="is-pulled-left image-icon">
        <image-icon-link
          :userId="user.id"
          :image="user.data.image"
          :isUser="true"
          :isCommunity="false"
        />
      </div>
      <div class="is-pulled-left name-area">
        <p class="is-size-6">{{ user.data.name }}</p>
        <p class="is-size-7 has-text-weight-light">{{ user.data.accountId }}</p>
      </div>
      <div v-if="!isOwner" class="is-pulled-right follow-button-area">
        <profile-follow-button
          v-if="!isOwner"
          :is-following-user="isFollowingUser"
          :is-owner="isOwner"
          @follow="follow"
          @unfollow="unfollow"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import ImageIconLink from '~/components/atoms/ImageIconLink.vue'
import ProfileFollowButton from '~/components/atoms/ProfileFollowButton.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { User } from '~/common/user'

@Component({
  components: {
    ImageIconLink,
    ProfileFollowButton
  }
})
export default class extends Vue {
  @Prop({ required: true }) readonly user!: User

  get isFollowingUser() {
    return this.$store.getters['user/isFollowingUser'](this.user.id)
  }

  get isOwner() {
    return this.$store.getters['user/isMyId'](this.user.id)
  }

  follow() {
    this.$store.dispatch('user/followUser', this.user.id).catch(err => {
      console.log(err)
      window.alert('error')
    })
  }

  unfollow() {
    this.$store.dispatch('user/unfollowUser', this.user.id).catch(err => {
      console.log(err)
      window.alert('error')
    })
  }
}
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
  color: gray;
}

a:hover {
  text-decoration: none;
  color: gray;
}

.user-box {
  box-shadow: 0 2px 3px rgba($black, 0.1), 0 0 0 1px rgba($black, 0.1);
  padding: 5px 10px;
  border-radius: 5px;
}

.image-icon {
  margin-top: 10px;
}

.name-area {
  margin: 5px 10px 0;
}

.follow-button-area {
  vertical-align: middle;
  display: table-cell;
  margin: 10px 0;
}
</style>
