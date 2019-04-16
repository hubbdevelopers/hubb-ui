<template>
  <div class="user-box">
    <div class="is-clearfix main">
      <div class="is-pulled-left image-icon">
        <image-icon-link
          :ownerId="user.ID"
          :image="user.Image"
          :isUser="true"
          :isCommunity="false"
        />
      </div>
      <div class="is-pulled-left name-area">
        <p class="is-size-6">{{ user.Name }}</p>
        <p class="is-size-7 has-text-weight-light">{{ user.AccountId }}</p>
      </div>
      <div v-if="!isOwner" class="is-pulled-right follow-button-area">
        <button
          v-if="isFollowingUser"
          @click="unFollow"
          class="button is-primary follow-button"
        >
          フォロー中
        </button>
        <button
          v-else
          @click="follow"
          class="button is-primary is-outlined follow-button"
        >
          フォローする
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import ImageIconLink from '~/components/atoms/ImageIconLink'
export default {
  components: {
    ImageIconLink
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    isFollowingUser: function() {
      return this.$store.getters['user/isFollowingUser'](this.user.ID)
    },
    isOwner: function() {
      return this.$store.getters['user/isMyId'](this.user.ID)
    }
  },
  async created() {
    if (!Object.keys(this.user).length) {
      this.user = (await this.$axios.$get(`/users/${this.user.ID}`)).data
    }
  },
  methods: {
    follow() {
      this.$store.dispatch('user/followUser', this.user.ID).catch(err => {
        console.log(err)
        window.alert('error')
      })
    },
    unFollow() {
      this.$store.dispatch('user/unFollowUser', this.user.ID).catch(err => {
        console.log(err)
        window.alert('error')
      })
    }
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
  box-shadow: 1px 1px 2px gray;
  padding: 5px 10px;
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
